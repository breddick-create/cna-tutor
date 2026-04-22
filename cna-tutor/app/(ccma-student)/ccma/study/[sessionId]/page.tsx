import { notFound, redirect } from "next/navigation";

import { StudySession } from "@/components/ccma/study-session";
import { getSupplementaryVideos } from "@/content/ccma/video-library";
import { requireCcmaViewer } from "@/lib/ccma/auth/session";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/ccma/onboarding/pretest";
import {
  getCompletedLessonIdsFromSessions,
  isLessonUnlockedForStudyPath,
} from "@/lib/ccma/progression/study-path";
import { getStudentProgressionSnapshot } from "@/lib/ccma/progression/student";
import { createClient } from "@/lib/supabase/server";
import { getTutorLesson } from "@/lib/ccma/tutor/lessons";
import { parseTutorSessionState } from "@/lib/ccma/tutor/orchestrator";

type Params = Promise<{ sessionId: string }>;

export default async function StudySessionPage({
  params,
}: {
  params: Params;
}) {
  const viewer = await requireCcmaViewer();
  const { sessionId } = await params;
  const supabase = (await createClient()) as any;

  const [progression, { data: session }, { data: turns }, { data: studySessions }] = await Promise.all([
    getStudentProgressionSnapshot({
      userId: viewer.user.id,
      pretestScore: getPretestScore(viewer.user),
      pretestDomainBreakdown: getPretestDomainBreakdown(viewer.user),
    }),
    supabase.from("ccma_tutor_sessions").select("*").eq("id", sessionId).eq("user_id", viewer.user.id).single(),
    supabase
      .from("ccma_tutor_turns")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true }),
    supabase
      .from("ccma_tutor_sessions")
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
    redirect("/ccma/study-plan");
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
      initialTurns={(turns ?? []).map((turn: any) => ({
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


