import { NextResponse } from "next/server";
import { z } from "zod";

import { getViewer } from "@/lib/auth/session";
import {
  getPretestDomainBreakdown,
  getPretestScore,
  hasCompletedPretest,
  PRETEST_REQUIRED_MESSAGE,
} from "@/lib/onboarding/pretest";
import {
  buildGuidedStudyPath,
  getCompletedLessonIdsFromSessions,
} from "@/lib/progression/study-path";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";
import { createClient } from "@/lib/supabase/server";
import { buildInitialTutorTurnForMode } from "@/lib/tutor/orchestrator";
import { recordStudyInteraction } from "@/lib/tracking/activity";
import { getTutorLesson, listTutorLessons } from "@/lib/tutor/lessons";
import { getWeakConceptsForReview } from "@/lib/learning/spaced-review";
import type { TutorMode } from "@/lib/tutor/types";
import { resolvePreferredLanguage } from "@/lib/i18n/languages";

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

  if (!hasCompletedPretest(viewer.user)) {
    return NextResponse.json({ error: PRETEST_REQUIRED_MESSAGE }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createSessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = await createClient();
  const [progression, { data: masteryRows }, { data: studySessions }] = await Promise.all([
    getStudentProgressionSnapshot({
      userId: viewer.user.id,
      pretestScore: getPretestScore(viewer.user),
      pretestDomainBreakdown: getPretestDomainBreakdown(viewer.user),
    }),
    supabase
      .from("domain_mastery")
      .select("domain_id, mastery_score, weak_streak")
      .eq("user_id", viewer.user.id)
      .order("mastery_score", { ascending: true })
      .limit(3),
    supabase
      .from("tutor_sessions")
      .select("status, session_state_json")
      .eq("user_id", viewer.user.id),
  ]);

  const domainIds = (masteryRows ?? []).map((row) => row.domain_id);
  const { data: domains } = domainIds.length
    ? await supabase.from("domains").select("id, title").in("id", domainIds)
    : { data: [] };
  const titleMap = new Map((domains ?? []).map((domain) => [domain.id, domain.title]));
  const weakAreasSnapshot = (masteryRows ?? [])
    .filter((row) => row.mastery_score < 75 || row.weak_streak > 0)
    .map((row) => titleMap.get(row.domain_id))
    .filter((title): title is string => Boolean(title));

  const studyPath = buildGuidedStudyPath({
    progression,
    completedLessonIds: getCompletedLessonIdsFromSessions(studySessions ?? []),
  });
  const nextLessonId = studyPath.nextModule?.lesson?.id ?? null;

  if (!nextLessonId || parsed.data.lessonId !== nextLessonId) {
    return NextResponse.json(
      {
        error: studyPath.nextModule
          ? `Finish ${studyPath.nextModule.domainTitle} before moving to another topic.`
          : "Finish your current study step before starting another lesson.",
      },
      { status: 403 },
    );
  }

  // Find the most recently completed session's lesson for "where you left off" recap
  const lastCompleted = (studySessions ?? [])
    .filter((s) => s.status === "completed")
    .at(-1);
  const priorLessonId = (lastCompleted?.session_state_json as Record<string, unknown> | null)?.lessonId as string | null ?? null;
  const priorLessonTitle = priorLessonId ? (getTutorLesson(priorLessonId)?.title ?? null) : null;

  // Fetch the 2 weakest concepts from prior sessions for the opening retrieval warm-up
  const openReviewConcepts = await getWeakConceptsForReview({
    userId: viewer.user.id,
    excludeLessonId: parsed.data.lessonId,
    lessons: listTutorLessons(),
    supabase,
    limit: 2,
  }).catch(() => []);

  const initialTurn = await buildInitialTutorTurnForMode({
    lessonId: parsed.data.lessonId,
    mode: parsed.data.mode as TutorMode | undefined,
    weakAreasSnapshot,
    preferredLanguage: resolvePreferredLanguage(viewer.profile.preferred_language),
    priorLessonTitle,
    openReviewConcepts,
  });

  const { data: session, error: sessionError } = await supabase
    .from("tutor_sessions")
    .insert({
      user_id: viewer.user.id,
      mode: initialTurn.state.mode,
      status: "active",
      session_state_json: initialTurn.state,
    })
    .select("*")
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "We couldn't start that lesson." }, { status: 500 });
  }

  const { error: turnError } = await supabase.from("tutor_turns").insert({
    session_id: session.id,
    actor: "tutor",
    turn_type: "lesson_intro",
    content: initialTurn.message,
  });

  if (turnError) {
    return NextResponse.json({ error: "We couldn't load the first tutor step." }, { status: 500 });
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


