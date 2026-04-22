import { NextResponse } from "next/server";
import { z } from "zod";

import { getRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";
import { createRdaClient } from "@/lib/rda/supabase";
import { buildInitialRdaTutorTurn } from "@/lib/rda/tutor/orchestrator";

const createSessionSchema = z.object({
  lessonId: z.string().min(1),
});

export async function POST(request: Request) {
  const viewer = await getRdaViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (viewer.profile.role !== "student") {
    return NextResponse.json({ error: "Only students can start tutor sessions." }, { status: 403 });
  }

  if (!(await hasCompletedRdaPretest(viewer.user))) {
    return NextResponse.json({ error: "Complete the RDA pre-test before starting a lesson." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createSessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let initialTurn;
  try {
    initialTurn = await buildInitialRdaTutorTurn(parsed.data.lessonId);
  } catch {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const supabase = (await createRdaClient()) as any;

  const { data: session, error: sessionError } = await supabase
    .from("rda_tutor_sessions")
    .insert({
      user_id: viewer.user.id,
      lesson_id: initialTurn.lesson.id,
      mode: initialTurn.state.mode,
      status: "active",
      session_state_json: initialTurn.state,
    })
    .select("*")
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "We couldn't start that lesson." }, { status: 500 });
  }

  const { error: turnError } = await supabase.from("rda_tutor_turns").insert({
    session_id: session.id,
    actor: "tutor",
    turn_type: "lesson_intro",
    content: initialTurn.message,
  });

  if (turnError) {
    return NextResponse.json({ error: "We couldn't load the first tutor step." }, { status: 500 });
  }

  return NextResponse.json({
    sessionId: session.id,
    lessonId: initialTurn.lesson.id,
  });
}
