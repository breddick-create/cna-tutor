import { NextResponse } from "next/server";
import { z } from "zod";

import { getViewer } from "@/lib/auth/session";
import { evaluateBadges } from "@/lib/learning/badge-evaluator";
import { getWrittenPretestScore, getWrittenPretestDomainBreakdown } from "@/lib/onboarding/written-pretest";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";
import { createClient } from "@/lib/supabase/server";
import { recordAssessmentAttempt } from "@/lib/exams/attempts";
import { scoreWrittenAssessment } from "@/lib/exams/written-bank";
import { writtenExamDomains } from "@/content/texas-cna/written-domains";

const submitSchema = z.object({
  mode: z.enum(["quiz", "mock_exam"]),
  domainSlug: z.string().trim().min(1).optional(),
  questionIds: z.array(z.string().trim().min(1)).min(1).optional(),
  answers: z.record(z.string()),
  timeSpentSeconds: z.coerce.number().int().min(0).max(60 * 60 * 2),
  confidenceLevel: z.enum(["not_confident", "somewhat_confident", "very_confident"]).optional(),
});

const confidenceScoreMap = {
  not_confident: 1,
  somewhat_confident: 2,
  very_confident: 3,
} as const;

function normalizePayload(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return input;
  const raw = input as Record<string, unknown>;

  const answers =
    raw.answers && typeof raw.answers === "object" && !Array.isArray(raw.answers)
      ? Object.fromEntries(
          Object.entries(raw.answers).filter(
            ([qId, cId]) =>
              typeof qId === "string" && qId.trim().length > 0 &&
              typeof cId === "string" && cId.trim().length > 0,
          ),
        )
      : raw.answers;

  const questionIds = Array.isArray(raw.questionIds)
    ? raw.questionIds.filter((id): id is string => typeof id === "string" && id.trim().length > 0)
    : raw.questionIds;

  return {
    ...raw,
    domainSlug:
      typeof raw.domainSlug === "string" && raw.domainSlug.trim().length > 0
        ? raw.domainSlug
        : undefined,
    questionIds,
    answers,
    timeSpentSeconds:
      typeof raw.timeSpentSeconds === "number" || typeof raw.timeSpentSeconds === "string"
        ? raw.timeSpentSeconds
        : undefined,
    confidenceLevel: typeof raw.confidenceLevel === "string" ? raw.confidenceLevel : undefined,
  };
}

export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  if (viewer.profile.role !== "student") {
    return NextResponse.json({ error: "Only student accounts can do that." }, { status: 403 });
  }

  const body = normalizePayload(await request.json());
  const parsed = submitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Something was missing from that request. Try again." }, { status: 400 });
  }

  if (parsed.data.mode === "quiz" && !parsed.data.confidenceLevel) {
    return NextResponse.json({ error: "Please choose how confident you feel before submitting." }, { status: 400 });
  }

  const result = scoreWrittenAssessment({
    mode: parsed.data.mode,
    answers: parsed.data.answers,
    domainSlug: parsed.data.domainSlug,
    questionIds: parsed.data.questionIds,
  });

  if (result.totalQuestions === 0) {
    return NextResponse.json({ error: "We couldn't load the questions for this assessment." }, { status: 400 });
  }

  await recordAssessmentAttempt({
    mode: parsed.data.mode,
    userId: viewer.user.id,
    domainSlug: parsed.data.domainSlug,
    timeSpentSeconds: parsed.data.timeSpentSeconds,
    domainBreakdown: result.domainBreakdown,
    score: result.percent,
    totalQuestions: result.totalQuestions,
    passed: result.passed,
    confidenceLevel: parsed.data.confidenceLevel,
    confidenceScore: parsed.data.confidenceLevel
      ? confidenceScoreMap[parsed.data.confidenceLevel]
      : undefined,
  });

  const progression = await getStudentProgressionSnapshot({
    userId: viewer.user.id,
    pretestScore: getWrittenPretestScore(viewer.user),
    pretestDomainBreakdown: getWrittenPretestDomainBreakdown(viewer.user),
    domains: writtenExamDomains,
  });

  const badgeSupabase = await createClient();
  const newAchievements = await evaluateBadges({
    userId: viewer.user.id,
    trigger: parsed.data.mode === "mock_exam" ? "mock_exam_complete" : "quiz_complete",
    supabase: badgeSupabase,
    mockExamPercent: parsed.data.mode === "mock_exam" ? result.percent : undefined,
    readinessScore: progression.readinessScore,
    pretestCompleted: true,
    userProduct: viewer.profile.product,
  }).catch(() => []);

  return NextResponse.json({
    summary: {
      mode: parsed.data.mode,
      score: result.percent,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      passed: result.passed,
      weakDomains: result.domainBreakdown
        .filter((d) => d.percent < 80)
        .map((d) => d.domainTitle),
    },
    breakdown: result.domainBreakdown,
    questions: result.results,
    newAchievements,
  });
}
