import { NextResponse } from "next/server";
import { z } from "zod";

import { getViewer } from "@/lib/auth/session";
import { recordAssessmentAttempt } from "@/lib/exams/attempts";
import { scoreAssessment } from "@/lib/exams/bank";

const submitAssessmentSchema = z.object({
  mode: z.enum(["quiz", "mock_exam"]),
  domainSlug: z.string().trim().min(1).optional(),
  answers: z.record(z.string(), z.string()),
  timeSpentSeconds: z.number().int().min(0).max(60 * 60),
});

export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (viewer.profile.role !== "student") {
    return NextResponse.json({ error: "Only students can submit assessments." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = submitAssessmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = scoreAssessment({
    mode: parsed.data.mode,
    answers: parsed.data.answers,
    domainSlug: parsed.data.domainSlug,
  });

  if (result.totalQuestions === 0) {
    return NextResponse.json({ error: "No assessment questions were available." }, { status: 400 });
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
  });

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
  });
}
