import { NextResponse } from "next/server";
import { z } from "zod";

import { getViewer } from "@/lib/auth/session";
import { evaluateBadges } from "@/lib/learning/badge-evaluator";
import { recordAssessmentAttempt } from "@/lib/exams/attempts";
import { scoreWrittenPretest } from "@/lib/exams/written-bank";
import type { PretestDomainBreakdown } from "@/lib/onboarding/pretest";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const submitSchema = z.object({
  questionIds: z.array(z.string().trim().min(1)).min(1).optional(),
  answers: z.record(z.string()),
  timeSpentSeconds: z.coerce.number().int().min(0).max(60 * 60 * 2),
});

function normalizePayload(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return input;
  }

  const raw = input as Record<string, unknown>;
  const answers =
    raw.answers && typeof raw.answers === "object" && !Array.isArray(raw.answers)
      ? Object.fromEntries(
          Object.entries(raw.answers as Record<string, unknown>)
            .filter(
              ([questionId, choiceId]) =>
                typeof questionId === "string" &&
                questionId.trim().length > 0 &&
                typeof choiceId === "string" &&
                choiceId.trim().length > 0,
            )
            .map(([questionId, choiceId]) => [questionId, choiceId]),
        )
      : raw.answers;

  const questionIds = Array.isArray(raw.questionIds)
    ? raw.questionIds.filter(
        (id): id is string => typeof id === "string" && id.trim().length > 0,
      )
    : raw.questionIds;

  return { ...raw, answers, questionIds };
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

  const result = scoreWrittenPretest({
    answers: parsed.data.answers,
    questionIds: parsed.data.questionIds,
  });

  if (result.totalQuestions === 0) {
    return NextResponse.json({ error: "We couldn't load the questions for this assessment." }, { status: 400 });
  }

  await recordAssessmentAttempt({
    mode: "pretest",
    userId: viewer.user.id,
    timeSpentSeconds: parsed.data.timeSpentSeconds,
    domainBreakdown: result.domainBreakdown,
    score: result.percent,
    totalQuestions: result.totalQuestions,
    passed: result.passed,
  });

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
      written_pretest_completed_at: new Date().toISOString(),
      written_pretest_score: result.percent,
      written_pretest_domain_breakdown: pretestDomainBreakdown,
    },
  });

  const badgeSupabase = await createClient();
  const newAchievements = await evaluateBadges({
    userId: viewer.user.id,
    trigger: "pretest_complete",
    supabase: badgeSupabase,
    pretestCompleted: true,
    userProduct: viewer.profile.product,
  }).catch(() => []);

  return NextResponse.json({
    summary: {
      mode: "pretest" as const,
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
