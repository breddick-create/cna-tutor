import { notFound, redirect } from "next/navigation";

import { RdaStudySession } from "@/components/rda/rda-study-session";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";
import { createRdaClient } from "@/lib/rda/supabase";
import { getRdaTutorLesson } from "@/lib/rda/tutor/lessons";
import { parseRdaTutorSessionState } from "@/lib/rda/tutor/orchestrator";

type Params = Promise<{ sessionId: string }>;

export default async function RdaStudySessionPage({ params }: { params: Params }) {
  const viewer = await requireRdaViewer();
  if (!(await hasCompletedRdaPretest(viewer.user))) redirect("/rda/pretest");

  const { sessionId } = await params;
  const supabase = (await createRdaClient()) as any;

  const [{ data: session }, { data: turns }] = await Promise.all([
    supabase
      .from("rda_tutor_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", viewer.user.id)
      .single(),
    supabase
      .from("rda_tutor_turns")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true }),
  ]);

  if (!session) notFound();

  const state = parseRdaTutorSessionState(session.session_state_json);
  if (!state) notFound();

  const lesson = getRdaTutorLesson(state.lessonId);
  if (!lesson) notFound();

  return (
    <RdaStudySession
      initialLesson={lesson}
      initialSession={{
        id: session.id,
        status: session.status,
        state,
        activeSeconds: session.active_seconds ?? 0,
      }}
      initialTurns={(turns ?? []).map((turn: any) => ({
        id: turn.id,
        actor: turn.actor,
        content: turn.content,
        correctness: turn.correctness,
        turnType: turn.turn_type,
      }))}
    />
  );
}
