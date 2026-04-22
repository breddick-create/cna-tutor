import { notFound, redirect } from "next/navigation";

import { StudySession } from "@/components/tutor/study-session";
import { getSupplementaryVideos } from "@/content/texas-cna/video-library";
import { requireViewer } from "@/lib/auth/session";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/onboarding/pretest";
import {
  getCompletedLessonIdsFromSessions,
  isLessonUnlockedForStudyPath,
} from "@/lib/progression/study-path";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";
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

  const [progression, { data: session }, { data: turns }, { data: studySessions }] = await Promise.all([
    getStudentProgressionSnapshot({
      userId: viewer.user.id,
      pretestScore: getPretestScore(viewer.user),
      pretestDomainBreakdown: getPretestDomainBreakdown(viewer.user),
    }),
    supabase.from("tutor_sessions").select("*").eq("id", sessionId).eq("user_id", viewer.user.id).single(),
    supabase
      .from("tutor_turns")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true }),
    supabase
      .from("tutor_sessions")
      .select("status, session_state_json")
      .eq("user_id", viewer.user.id),
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

  if (
    !isLessonUnlockedForStudyPath({
      lessonId: lesson.id,
      progression,
      completedLessonIds: getCompletedLessonIdsFromSessions(studySessions ?? []),
    })
  ) {
    redirect("/study-plan");
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
      supplementaryVideos={getSupplementaryVideos(lesson.domainSlug)}
    />
  );
}
