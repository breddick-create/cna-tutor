import { notFound } from "next/navigation";

import { StudySession } from "@/components/tutor/study-session";
import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getTutorLesson } from "@/lib/tutor/lessons";
import { parseTutorSessionState } from "@/lib/tutor/orchestrator";

type Params = Promise<{ sessionId: string }>;

export default async function StudySessionPage({
  params,
}: {
  params: Params;
}) {
  const viewer = await requireViewer();
  const { sessionId } = await params;
  const supabase = await createClient();

  const [{ data: session }, { data: turns }] = await Promise.all([
    supabase
      .from("ccma_tutor_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", viewer.user.id)
      .single(),
    supabase
      .from("ccma_tutor_turns")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true }),
  ]);

  if (!session) {
    notFound();
  }

  const state = parseTutorSessionState(session.session_state_json);

  if (!state) {
    notFound();
  }

  const lesson = getTutorLesson(state.lessonId);

  if (!lesson) {
    notFound();
  }

  return (
    <StudySession
      initialLesson={lesson}
      initialSession={{
        id: session.id,
        status: session.status,
        state,
        activeSeconds: session.active_seconds,
      }}
      initialTurns={(turns ?? []).map((turn) => ({
        id: turn.id,
        actor: turn.actor,
        content: turn.content,
        correctness: turn.correctness,
        turnType: turn.turn_type,
      }))}
    />
  );
}
