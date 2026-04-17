import { createAdminClient } from "@/lib/supabase/admin";
import type { QuizConfidenceLevel } from "@/lib/ccma/exams/types";

type AssessmentSummary = {
  mode: "quiz" | "mock_exam" | "pretest" | "weak_area_drill";
  userId: string;
  domainSlug?: string;
  domainSlugs?: string[];
  timeSpentSeconds: number;
  domainBreakdown: Array<{
    domainSlug: string;
    domainTitle: string;
    correctCount: number;
    totalQuestions: number;
    percent: number;
  }>;
  score: number;
  totalQuestions: number;
  passed: boolean;
  confidenceLevel?: QuizConfidenceLevel;
  confidenceScore?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export async function recordAssessmentAttempt(summary: AssessmentSummary) {
  const admin = createAdminClient() as any;
  const now = new Date().toISOString();

  await admin.from("ccma_assessments").insert({
    user_id: summary.userId,
    mode: summary.mode,
    domain_slug: summary.domainSlug ?? null,
    domain_slugs: summary.domainSlugs ?? null,
    time_spent_seconds: summary.timeSpentSeconds,
    score: summary.score,
    total_questions: summary.totalQuestions,
    passed: summary.passed,
    domain_breakdown: summary.domainBreakdown,
    confidence_level: summary.confidenceLevel ?? null,
    confidence_score: summary.confidenceScore ?? null,
    completed_at: now,
  });

  if (summary.mode === "quiz" || summary.mode === "weak_area_drill") {
    await admin.from("ccma_quiz_attempts").insert({
      user_id: summary.userId,
      mode: summary.mode,
      domain_slug: summary.domainSlug ?? null,
      domain_slugs: summary.domainSlugs ?? null,
      score: summary.score,
      total_questions: summary.totalQuestions,
      passed: summary.passed,
      confidence_level: summary.confidenceLevel ?? null,
      confidence_score: summary.confidenceScore ?? null,
      domain_breakdown: summary.domainBreakdown,
      completed_at: now,
    });
  }

  for (const domain of summary.domainBreakdown) {
    const { data: existing } = await admin
      .from("ccma_student_progress")
      .select("id, mastery_score, weak_streak, lessons_completed")
      .eq("user_id", summary.userId)
      .eq("domain_slug", domain.domainSlug)
      .maybeSingle();

    const baseline = existing?.mastery_score ?? (summary.mode === "pretest" ? domain.percent : 50);
    const scoreShift =
      summary.mode === "pretest"
        ? 0
        : domain.percent >= 80
          ? Math.max(6, Math.round(domain.percent / 14))
          : -Math.max(5, Math.round((100 - domain.percent) / 15));
    const masteryScore = clamp(baseline + scoreShift, 0, 100);
    const weakStreak = domain.percent >= 80 ? 0 : (existing?.weak_streak ?? 0) + 1;

    if (existing?.id) {
      await admin
        .from("ccma_student_progress")
        .update({
          domain_title: domain.domainTitle,
          mastery_score: masteryScore,
          weak_streak: weakStreak,
          last_seen_at: now,
        })
        .eq("id", existing.id);
    } else {
      await admin.from("ccma_student_progress").insert({
        user_id: summary.userId,
        domain_slug: domain.domainSlug,
        domain_title: domain.domainTitle,
        mastery_score: masteryScore,
        weak_streak: weakStreak,
        lessons_completed: 0,
        last_seen_at: now,
      });
    }
  }

  await admin
    .from("profiles")
    .update({ last_activity_at: now, product: "ccma" })
    .eq("id", summary.userId);
}

export const saveAssessmentAttempt = recordAssessmentAttempt;
