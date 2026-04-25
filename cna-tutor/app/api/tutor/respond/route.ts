import { NextResponse } from "next/server";
import { z } from "zod";

import { getViewer } from "@/lib/auth/session";
import { evaluateBadges } from "@/lib/learning/badge-evaluator";
import { upsertConceptMastery } from "@/lib/learning/concept-mastery";
import { updateStudyStreak } from "@/lib/learning/streaks";
import {
  getPretestDomainBreakdown,
  getPretestScore,
  hasCompletedPretest,
  PRETEST_REQUIRED_MESSAGE,
} from "@/lib/onboarding/pretest";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";
import { createClient } from "@/lib/supabase/server";
import { getTutorLesson } from "@/lib/tutor/lessons";
import { parseTutorSessionState, processTutorReply } from "@/lib/tutor/orchestrator";
import { updateDomainMastery } from "@/lib/tutor/progress";
import { recordStudyInteraction } from "@/lib/tracking/activity";

const respondSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().trim().min(1).max(1000),
});

export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (viewer.profile.role !== "student") {
    return NextResponse.json({ error: "Only students can respond to tutor sessions." }, { status: 403 });
  }

  if (!hasCompletedPretest(viewer.user)) {
    return NextResponse.json({ error: PRETEST_REQUIRED_MESSAGE }, { status: 403 });
  }

  const body = await request.json();
  const parsed = respondSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase
    .from("tutor_sessions")
    .select("*")
    .eq("id", parsed.data.sessionId)
    .eq("user_id", viewer.user.id)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  if (session.status !== "active") {
    return NextResponse.json({ error: "This session is no longer active." }, { status: 400 });
  }

  const currentState = parseTutorSessionState(
    session.session_state_json,
    undefined,
    session.mode,
  );

  if (!currentState) {
    return NextResponse.json({ error: "Session state is invalid." }, { status: 500 });
  }

  const lesson = getTutorLesson(currentState.lessonId);

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const { error: studentTurnError } = await supabase.from("tutor_turns").insert({
    session_id: session.id,
    actor: "student",
    turn_type: "student_response",
    content: parsed.data.message,
  });

  if (studentTurnError) {
    return NextResponse.json({ error: "We couldn't save your answer." }, { status: 500 });
  }

  const result = await processTutorReply({
    lessonId: lesson.id,
    state: currentState,
    studentMessage: parsed.data.message,
  });

  const endedAt = result.nextState.sessionComplete ? new Date().toISOString() : null;
  const nextStatus = result.nextState.sessionComplete ? "completed" : "active";

  const { error: updateSessionError } = await supabase
    .from("tutor_sessions")
    .update({
      session_state_json: result.nextState,
      status: nextStatus,
      ended_at: endedAt,
    })
    .eq("id", session.id);

  if (updateSessionError) {
    return NextResponse.json({ error: "We couldn't update this lesson." }, { status: 500 });
  }

  const conceptMasteryResult = await upsertConceptMastery(
    {
      userId: viewer.user.id,
      conceptId: result.segmentId,
      lessonId: lesson.id,
      rawScore: result.evaluation.score,
      bloomLevel: result.bloomLevel,
    },
    supabase,
  ).catch(() => ({ masteryDelta: 0 }));

  const { data: tutorTurn, error: tutorTurnError } = await supabase
    .from("tutor_turns")
    .insert({
      session_id: session.id,
      actor: "tutor",
      turn_type: result.nextState.step,
      content: result.message,
      correctness: result.evaluation.correct ? "correct" : "incorrect",
      bloom_level: result.bloomLevel,
      segment_id: result.segmentId,
      mastery_delta: conceptMasteryResult.masteryDelta,
    })
    .select("*")
    .single();

  if (tutorTurnError || !tutorTurn) {
    return NextResponse.json({ error: "We couldn't save the tutor response." }, { status: 500 });
  }

  const tracking = await recordStudyInteraction({
    supabase,
    session,
    eventType: result.nextState.sessionComplete ? "lesson_completed" : "tutor_response_recorded",
    metadata: {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      correct: result.evaluation.correct,
      masteryScore: result.nextState.masteryScore,
    },
    markLessonCompleted: result.nextState.sessionComplete,
  });

  const daysSinceLastStudy = viewer.profile.last_activity_at
    ? Math.floor((Date.now() - new Date(viewer.profile.last_activity_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  await updateDomainMastery({
    userId: viewer.user.id,
    lesson,
    evaluation: result.evaluation,
  }).catch(() => undefined);

  let newAchievements: Array<{ slug: string; title: string; description: string }> = [];

  if (result.nextState.sessionComplete) {
    const streak = await updateStudyStreak(viewer.user.id, supabase).catch(() => null);
    const progression = await getStudentProgressionSnapshot({
      userId: viewer.user.id,
      pretestScore: getPretestScore(viewer.user),
      pretestDomainBreakdown: getPretestDomainBreakdown(viewer.user),
    }).catch(() => null);

    newAchievements = await evaluateBadges({
      userId: viewer.user.id,
      trigger: "session_complete",
      supabase,
      sessionId: session.id,
      sessionMasteryScore: result.nextState.masteryScore,
      sessionDurationSeconds: tracking.activeSeconds,
      sessionDomainSlug: lesson.domainSlug,
      readinessScore: progression?.readinessScore,
      currentStreak: streak?.currentStreak,
      pretestCompleted: hasCompletedPretest(viewer.user),
      daysSinceLastStudy: daysSinceLastStudy ?? undefined,
      userProduct: viewer.profile.product,
    }).catch(() => []);
  }

  return NextResponse.json({
    newAchievements,
    studentTurn: {
      actor: "student",
      content: parsed.data.message,
      turnType: "student_response",
    },
    tutorTurn: {
      id: tutorTurn.id,
      actor: tutorTurn.actor,
      content: tutorTurn.content,
      correctness: tutorTurn.correctness,
      turnType: tutorTurn.turn_type,
    },
    evaluation: result.evaluation,
    session: {
      id: session.id,
      status: nextStatus,
      state: result.nextState,
      lesson: {
        id: lesson.id,
        title: lesson.title,
      },
      tracking,
    },
  });
}

