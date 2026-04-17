import { NextResponse } from "next/server";
import { z } from "zod";

import { getViewer } from "@/lib/auth/session";
import {
  getPretestDomainBreakdown,
  getPretestScore,
  hasCompletedPretest,
  PRETEST_REQUIRED_MESSAGE,
  type PretestDomainBreakdown,
} from "@/lib/ccma/onboarding/pretest";
import { getStudentProgressionSnapshot } from "@/lib/ccma/progression/student";
import { createAdminClient } from "@/lib/supabase/admin";
import { recordAssessmentAttempt } from "@/lib/ccma/exams/attempts";
import { scoreAssessment } from "@/lib/ccma/exams/bank";
import type { QuizConfidenceLevel } from "@/lib/ccma/exams/types";

const confidenceScoreMap: Record<QuizConfidenceLevel, number> = {
  not_confident: 1,
  somewhat_confident: 2,
  very_confident: 3,
};

const submitAssessmentSchema = z.object({
  mode: z.enum(["quiz", "mock_exam", "pretest", "weak_area_drill"]),
  domainSlug: z.string().trim().min(1).optional(),
  domainSlugs: z.array(z.string().trim().min(1)).max(3).optional(),
  questionIds: z.array(z.string().trim().min(1)).min(1).optional(),
  answers: z.record(z.string(), z.string()),
  timeSpentSeconds: z.number().int().min(0).max(60 * 60 * 2),
  confidenceLevel: z.enum(["not_confident", "somewhat_confident", "very_confident"]).optional(),
});

export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  if (viewer.profile.role !== "student") {
    return NextResponse.json({ error: "Only student accounts can do that." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = submitAssessmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Something was missing from that request. Try again." }, { status: 400 });
  }

  if (parsed.data.mode !== "pretest" && !hasCompletedPretest(viewer.user)) {
    return NextResponse.json({ error: PRETEST_REQUIRED_MESSAGE }, { status: 403 });
  }

  if (parsed.data.mode === "mock_exam" && !parsed.data.domainSlug) {
    // Business rule: the full-test mock is a later-stage readiness check.
    // Students should build some guided-study and quiz evidence before the whole-test signal unlocks.
    const progression = await getStudentProgressionSnapshot({
      userId: viewer.user.id,
      pretestScore: getPretestScore(viewer.user),
      pretestDomainBreakdown: getPretestDomainBreakdown(viewer.user),
    });

    if (!progression.practiceExamUnlocked) {
      return NextResponse.json({ error: progression.practiceExamGateReason }, { status: 403 });
    }
  }

  if (
    (parsed.data.mode === "quiz" || parsed.data.mode === "weak_area_drill") &&
    !parsed.data.confidenceLevel
  ) {
    return NextResponse.json({ error: "Please choose how confident you feel before starting." }, { status: 400 });
  }

  const result = scoreAssessment({
    mode: parsed.data.mode,
    answers: parsed.data.answers,
    domainSlug: parsed.data.domainSlug,
    domainSlugs: parsed.data.domainSlugs,
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

  if (parsed.data.mode === "pretest") {
    const admin = createAdminClient();
    const pretestDomainBreakdown: PretestDomainBreakdown[] = result.domainBreakdown
      .map((domain) => ({
        domainSlug: domain.domainSlug,
        domainTitle: domain.domainTitle,
        correctCount: domain.correctCount,
        totalQuestions: domain.totalQuestions,
        percent: domain.percent,
      }))
      .sort((a, b) => a.percent - b.percent || a.domainTitle.localeCompare(b.domainTitle));

    await admin.auth.admin.updateUserById(viewer.user.id, {
      user_metadata: {
        ...viewer.user.user_metadata,
        pretest_completed_at: new Date().toISOString(),
        pretest_score: result.percent,
        pretest_domain_breakdown: pretestDomainBreakdown,
      },
    });
  }

  return NextResponse.json({
    summary: {
      mode: parsed.data.mode,
      score: result.percent,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      passed: result.passed,
      weakDomains: result.domainBreakdown
        .filter((domain) => domain.percent < 80)
        .map((domain) => domain.domainTitle),
    },
    breakdown: result.domainBreakdown,
    questions: result.results,
    drillComparisons:
      parsed.data.mode === "weak_area_drill"
        ? result.domainBreakdown.map((domain) => {
            const baseline =
              getPretestDomainBreakdown(viewer.user).find(
                (entry) => entry.domainSlug === domain.domainSlug,
              )?.percent ?? null;

            return {
              domainSlug: domain.domainSlug,
              domainTitle: domain.domainTitle,
              drillScore: domain.percent,
              pretestBaseline: baseline,
              deltaFromBaseline: baseline === null ? null : domain.percent - baseline,
            };
          })
        : undefined,
  });
}

