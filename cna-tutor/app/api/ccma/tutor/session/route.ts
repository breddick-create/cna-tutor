import { NextResponse } from "next/server";
import { z } from "zod";

import { getCcmaViewer } from "@/lib/ccma/auth/session";
import {
  getPretestDomainBreakdown,
  getPretestScore,
  hasCompletedPretest,
  PRETEST_REQUIRED_MESSAGE,
} from "@/lib/ccma/onboarding/pretest";
import {
  buildGuidedStudyPath,
  getCompletedLessonIdsFromSessions,
} from "@/lib/ccma/progression/study-path";
import { getStudentProgressionSnapshot } from "@/lib/ccma/progression/student";
import { createClient } from "@/lib/supabase/server";
import { buildInitialTutorTurnForMode } from "@/lib/ccma/tutor/orchestrator";
import type { TutorMode } from "@/lib/ccma/tutor/types";
import { resolvePreferredLanguage } from "@/lib/ccma/i18n/languages";

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
  const viewer = await getCcmaViewer();

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

  const supabase = (await createClient()) as any;

  const [progression, { data: studySessions }] = await Promise.all([
    getStudentProgressionSnapshot({
      userId: viewer.user.id,
      pretestScore: getPretestScore(viewer.user),
      pretestDomainBreakdown: getPretestDomainBreakdown(viewer.user),
    }),
    supabase
      .from("ccma_tutor_sessions")
      .select("status, session_state_json")
      .eq("user_id", viewer.user.id),
  ]);

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

  const initialTurn = await buildInitialTutorTurnForMode({
    lessonId: parsed.data.lessonId,
    mode: parsed.data.mode as TutorMode | undefined,
    weakAreasSnapshot: [],
    preferredLanguage: resolvePreferredLanguage(viewer.profile.preferred_language),
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
    return NextResponse.json({ error: "We couldn't start that lesson." }, { status: 500 });
  }

  const { error: turnError } = await supabase.from("ccma_tutor_turns").insert({
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
