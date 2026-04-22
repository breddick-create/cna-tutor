import { NextResponse } from "next/server";
import { z } from "zod";

import { getRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";
import { createRdaClient } from "@/lib/rda/supabase";
import { parseRdaTutorSessionState, buildRdaTutorResponse } from "@/lib/rda/tutor/orchestrator";

const respondSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().trim().min(1).max(1000),
});

export async function POST(request: Request) {
  const viewer = await getRdaViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (viewer.profile.role !== "student") {
    return NextResponse.json({ error: "Only students can respond to tutor sessions." }, { status: 403 });
  }

  if (!(await hasCompletedRdaPretest(viewer.user))) {
    return NextResponse.json({ error: "Complete the RDA pre-test before starting a lesson." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = respondSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = (await createRdaClient()) as any;

  const { data: session, error: sessionError } = await supabase
    .from("rda_tutor_sessions")
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

  const currentState = parseRdaTutorSessionState(session.session_state_json);

  if (!currentState) {
    return NextResponse.json({ error: "Session state is invalid." }, { status: 500 });
  }

  const { error: studentTurnError } = await supabase.from("rda_tutor_turns").insert({
    session_id: session.id,
    actor: "student",
    turn_type: "student_response",
    content: parsed.data.message,
  });

  if (studentTurnError) {
    return NextResponse.json({ error: "We couldn't save your answer." }, { status: 500 });
  }

  const result = await buildRdaTutorResponse({
    state: currentState,
    studentMessage: parsed.data.message,
    userId: viewer.user.id,
  });

  const now = new Date().toISOString();
  const nextStatus = result.state.sessionComplete ? "completed" : "active";
  const endedAt = result.state.sessionComplete ? now : null;

  const { error: updateSessionError } = await supabase
    .from("rda_tutor_sessions")
    .update({
      session_state_json: result.state,
      status: nextStatus,
      ended_at: endedAt,
      last_activity_at: now,
    })
    .eq("id", session.id);

  if (updateSessionError) {
    return NextResponse.json({ error: "We couldn't update this lesson." }, { status: 500 });
  }

  const { data: tutorTurn, error: tutorTurnError } = await supabase
    .from("rda_tutor_turns")
    .insert({
      session_id: session.id,
      actor: "tutor",
      turn_type: result.state.step,
      content: result.message,
      correctness: result.evaluation.correct ? "correct" : "incorrect",
    })
    .select("*")
    .single();

  if (tutorTurnError || !tutorTurn) {
    return NextResponse.json({ error: "We couldn't save the tutor response." }, { status: 500 });
  }

  await supabase
    .from("rda_study_sessions")
    .insert({
      user_id: viewer.user.id,
      session_type: "tutor",
      completed: result.state.sessionComplete,
      score: result.state.masteryScore,
      metadata: {
        lessonId: result.lesson.id,
        lessonTitle: result.lesson.title,
        domainSlug: result.lesson.domainSlug,
      },
    })
    .then(() => null)
    .catch(() => null);

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
      state: result.state,
      lesson: {
        id: result.lesson.id,
        title: result.lesson.title,
      },
    },
  });
}
