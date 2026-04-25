import { NextResponse } from "next/server";
import { z } from "zod";

import { getCcmaViewer } from "@/lib/ccma/auth/session";
import { hasCompletedPretest, PRETEST_REQUIRED_MESSAGE } from "@/lib/ccma/onboarding/pretest";
import { upsertConceptMastery } from "@/lib/learning/concept-mastery";
import { updateStudyStreak } from "@/lib/learning/streaks";
import { createClient } from "@/lib/supabase/server";
import { getTutorLesson } from "@/lib/ccma/tutor/lessons";
import { parseTutorSessionState, processTutorReply } from "@/lib/ccma/tutor/orchestrator";
import { updateDomainMastery } from "@/lib/ccma/tutor/progress";

const respondSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().trim().min(1).max(1000),
});

export async function POST(request: Request) {
  const viewer = await getCcmaViewer();

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

  const supabase = (await createClient()) as any;

  const { data: session, error: sessionError } = await supabase
    .from("ccma_tutor_sessions")
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

  const { error: studentTurnError } = await supabase.from("ccma_tutor_turns").insert({
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

  const now = new Date().toISOString();
  const endedAt = result.nextState.sessionComplete ? now : null;
  const nextStatus = result.nextState.sessionComplete ? "completed" : "active";

  const { error: updateSessionError } = await supabase
    .from("ccma_tutor_sessions")
    .update({
      session_state_json: result.nextState,
      status: nextStatus,
      phase: result.nextState.sessionPhase,
      phase_started_at: now,
      ended_at: endedAt,
      last_activity_at: now,
    })
    .eq("id", session.id);

  if (updateSessionError) {
    return NextResponse.json({ error: "We couldn't update this lesson." }, { status: 500 });
  }

  const conceptMasteryResult = result.isSynthesisTurn
    ? { masteryDelta: 0 }
    : await upsertConceptMastery(
        {
          userId: viewer.user.id,
          conceptId: `ccma:${result.segmentId}`,
          lessonId: `ccma:${lesson.id}`,
          rawScore: result.evaluation.score,
          bloomLevel: result.bloomLevel,
        },
        supabase,
      ).catch(() => ({ masteryDelta: 0 }));

  const { data: tutorTurn, error: tutorTurnError } = await supabase
    .from("ccma_tutor_turns")
    .insert({
      session_id: session.id,
      actor: "tutor",
      turn_type: result.nextState.step,
      content: result.message,
      correctness: result.isSynthesisTurn ? null : (result.evaluation.correct ? "correct" : "incorrect"),
      bloom_level: result.isSynthesisTurn ? null : result.bloomLevel,
      segment_id: result.isSynthesisTurn ? null : result.segmentId,
      mastery_delta: result.isSynthesisTurn ? null : conceptMasteryResult.masteryDelta,
    })
    .select("*")
    .single();

  if (tutorTurnError || !tutorTurn) {
    return NextResponse.json({ error: "We couldn't save the tutor response." }, { status: 500 });
  }

  await Promise.allSettled([
    result.isSynthesisTurn
      ? Promise.resolve()
      : updateDomainMastery({
          userId: viewer.user.id,
          lesson,
          evaluation: result.evaluation,
        }),
    result.nextState.sessionComplete
      ? updateStudyStreak(viewer.user.id, supabase)
      : Promise.resolve(),
    supabase
      .from("profiles")
      .update({ last_activity_at: now })
      .eq("id", viewer.user.id),
  ]);

  return NextResponse.json({
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
      tracking: { now, totalSeconds: 0, activeSeconds: 0, idleSeconds: 0 },
    },
  });
}
