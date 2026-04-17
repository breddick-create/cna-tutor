import { NextResponse } from "next/server";
import { z } from "zod";

import { getViewer } from "@/lib/auth/session";
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

  const body = await request.json();
  const parsed = respondSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = await createClient();
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
    return NextResponse.json({ error: "Unable to save learner response." }, { status: 500 });
  }

  const result = await processTutorReply({
    lessonId: lesson.id,
    state: currentState,
    studentMessage: parsed.data.message,
  });

  const endedAt = result.nextState.sessionComplete ? new Date().toISOString() : null;
  const nextStatus = result.nextState.sessionComplete ? "completed" : "active";

  const { error: updateSessionError } = await supabase
    .from("ccma_tutor_sessions")
    .update({
      session_state_json: result.nextState,
      status: nextStatus,
      ended_at: endedAt,
    })
    .eq("id", session.id);

  if (updateSessionError) {
    return NextResponse.json({ error: "Unable to update session." }, { status: 500 });
  }

  const { data: tutorTurn, error: tutorTurnError } = await supabase
    .from("ccma_tutor_turns")
    .insert({
      session_id: session.id,
      actor: "tutor",
      turn_type: result.nextState.step,
      content: result.message,
      correctness: result.evaluation.correct ? "correct" : "incorrect",
    })
    .select("*")
    .single();

  if (tutorTurnError || !tutorTurn) {
    return NextResponse.json({ error: "Unable to save tutor feedback." }, { status: 500 });
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

  await Promise.allSettled([
    updateDomainMastery({
      userId: viewer.user.id,
      lesson,
      evaluation: result.evaluation,
    }),
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
      tracking,
    },
  });
}
