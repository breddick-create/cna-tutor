import { NextResponse } from "next/server";
import { z } from "zod";

import { getViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { buildInitialTutorTurnForMode } from "@/lib/tutor/orchestrator";
import { recordStudyInteraction } from "@/lib/tracking/activity";
import type { TutorMode } from "@/lib/tutor/types";

const createSessionSchema = z.object({
  lessonId: z.string().min(1),
  mode: z
    .enum([
      "learn",
      "quiz",
      "mock_exam",
      "weak_area_review",
      "study_plan",
      "rapid_review",
    ] as const)
    .optional(),
});

export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (viewer.profile.role !== "student") {
    return NextResponse.json({ error: "Only students can start tutor sessions." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createSessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: masteryRows } = await supabase
    .from("ccma_domain_mastery")
    .select("domain_id, mastery_score, weak_streak")
    .eq("user_id", viewer.user.id)
    .order("mastery_score", { ascending: true })
    .limit(3);

  const domainIds = (masteryRows ?? []).map((row) => row.domain_id);
  const { data: domains } = domainIds.length
    ? await supabase.from("ccma_domains").select("id, title").in("id", domainIds)
    : { data: [] };
  const titleMap = new Map((domains ?? []).map((domain) => [domain.id, domain.title]));
  const weakAreasSnapshot = (masteryRows ?? [])
    .filter((row) => row.mastery_score < 75 || row.weak_streak > 0)
    .map((row) => titleMap.get(row.domain_id))
    .filter((title): title is string => Boolean(title));

  const initialTurn = await buildInitialTutorTurnForMode({
    lessonId: parsed.data.lessonId,
    mode: parsed.data.mode as TutorMode | undefined,
    weakAreasSnapshot,
  });

  const { data: session, error: sessionError } = await supabase
    .from("ccma_tutor_sessions")
    .insert({
      user_id: viewer.user.id,
      mode: initialTurn.state.mode,
      status: "active",
      session_state_json: initialTurn.state,
    })
    .select("*")
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Unable to create session." }, { status: 500 });
  }

  const { error: turnError } = await supabase.from("ccma_tutor_turns").insert({
    session_id: session.id,
    actor: "tutor",
    turn_type: "lesson_intro",
    content: initialTurn.message,
  });

  if (turnError) {
    return NextResponse.json({ error: "Unable to save tutor turn." }, { status: 500 });
  }

  await recordStudyInteraction({
    supabase,
    session,
    eventType: "tutor_session_started",
    metadata: {
      lessonId: initialTurn.lesson.id,
      lessonTitle: initialTurn.lesson.title,
      mode: initialTurn.state.mode,
    },
  });

  return NextResponse.json({
    sessionId: session.id,
    lessonId: initialTurn.lesson.id,
  });
}
