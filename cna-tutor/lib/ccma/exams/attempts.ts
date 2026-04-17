import { createAdminClient } from "@/lib/supabase/admin";
import { ensureDomainRecord } from "@/lib/ccma/tutor/progress";
import type { QuizConfidenceLevel } from "@/lib/ccma/exams/types";

type AssessmentSummary = {
  mode: "quiz" | "mock_exam" | "pretest" | "weak_area_drill";
  userId: string;
  domainSlug?: string;
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

async function updateDailyAssessmentStats(args: {
  admin: ReturnType<typeof createAdminClient>;
  userId: string;
  score: number;
  mode: AssessmentSummary["mode"];
  countsAsFullMockExam: boolean;
  timeSpentSeconds: number;
}) {
  const statDate = new Date().toISOString().slice(0, 10);
  const { data: existingDailyStat } = await args.admin
    .from("daily_user_stats")
    .select("*")
    .eq("user_id", args.userId)
    .eq("date", statDate)
    .maybeSingle();

  const quizIncrement = args.mode === "quiz" ? 1 : 0;
  const drillIncrement = args.mode === "weak_area_drill" ? 1 : 0;
  const mockIncrement = args.mode === "mock_exam" && args.countsAsFullMockExam ? 1 : 0;
  const completedAssessments =
    (existingDailyStat?.quizzes_completed ?? 0) +
    (existingDailyStat?.mock_exams_completed ?? 0) +
    quizIncrement +
    drillIncrement +
    mockIncrement;
  const previousAssessments = Math.max(0, completedAssessments - 1);
  const previousScoreTotal =
    previousAssessments > 0 ? (existingDailyStat?.average_score ?? 0) * previousAssessments : 0;
  const denominator = completedAssessments > 0 ? completedAssessments : 1;
  const averageScore = Math.round((previousScoreTotal + args.score) / denominator);

  if (existingDailyStat) {
    await args.admin
      .from("daily_user_stats")
      .update({
        total_seconds: existingDailyStat.total_seconds + args.timeSpentSeconds,
        active_seconds: existingDailyStat.active_seconds + args.timeSpentSeconds,
        quizzes_completed: existingDailyStat.quizzes_completed + quizIncrement + drillIncrement,
        mock_exams_completed: existingDailyStat.mock_exams_completed + mockIncrement,
        average_score: averageScore,
      })
      .eq("user_id", args.userId)
      .eq("date", statDate);

    return;
  }

  await args.admin.from("daily_user_stats").insert({
    user_id: args.userId,
    date: statDate,
    total_seconds: args.timeSpentSeconds,
    active_seconds: args.timeSpentSeconds,
    quizzes_completed: quizIncrement + drillIncrement,
    mock_exams_completed: mockIncrement,
    average_score: averageScore,
  });
}

async function updateDomainBreakdownMastery(args: {
  admin: ReturnType<typeof createAdminClient>;
  userId: string;
  domainBreakdown: AssessmentSummary["domainBreakdown"];
  mode: AssessmentSummary["mode"];
}) {
  for (const domain of args.domainBreakdown) {
    const domainId = await ensureDomainRecord(domain.domainSlug, domain.domainTitle);

    if (!domainId) {
      continue;
    }

    const { data: existing } = await args.admin
      .from("domain_mastery")
      .select("*")
      .eq("user_id", args.userId)
      .eq("domain_id", domainId)
      .maybeSingle();

    const baseline = existing?.mastery_score ?? (args.mode === "pretest" ? domain.percent : 50);
    const scoreShift =
      args.mode === "pretest"
        ? 0
        : domain.percent >= 80
          ? Math.max(6, Math.round(domain.percent / 14))
          : -Math.max(5, Math.round((100 - domain.percent) / 15));

    const masteryScore = clamp(baseline + scoreShift, 0, 100);
    const weakStreak = domain.percent >= 80 ? 0 : (existing?.weak_streak ?? 0) + 1;
    const now = new Date().toISOString();

    if (existing) {
      await args.admin
        .from("domain_mastery")
        .update({
          mastery_score: masteryScore,
          weak_streak: weakStreak,
          last_seen_at: now,
        })
        .eq("id", existing.id);
    } else {
      await args.admin.from("domain_mastery").insert({
        user_id: args.userId,
        domain_id: domainId,
        mastery_score: masteryScore,
        weak_streak: weakStreak,
        last_seen_at: now,
      });
    }
  }
}

export async function recordAssessmentAttempt(summary: AssessmentSummary) {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const creditedSeconds = Math.min(summary.timeSpentSeconds, summary.totalQuestions * 120);
  const countsAsFullMockExam = summary.mode === "mock_exam" && !summary.domainSlug;

  if (summary.mode === "quiz" || summary.mode === "weak_area_drill") {
    const primaryDomain = summary.domainBreakdown[0];
    const domainId = primaryDomain
      ? await ensureDomainRecord(primaryDomain.domainSlug, primaryDomain.domainTitle)
      : null;

    await admin.from("quiz_attempts").insert({
      user_id: summary.userId,
      domain_id: domainId,
      score: summary.score,
      total_questions: summary.totalQuestions,
      started_at: now,
      completed_at: now,
    });
  } else if (countsAsFullMockExam) {
    // Business rule: only the full practice exam counts as a major readiness signal.
    // Section mocks still update mastery but don't masquerade as full-test readiness.
    await admin.from("mock_exam_attempts").insert({
      user_id: summary.userId,
      score: summary.score,
      percent: summary.score,
      passed: summary.passed,
      started_at: now,
      completed_at: now,
    });
  }

  await updateDailyAssessmentStats({
    admin,
    userId: summary.userId,
    score: summary.score,
    mode: summary.mode,
    countsAsFullMockExam,
    timeSpentSeconds: creditedSeconds,
  });

  await updateDomainBreakdownMastery({
    admin,
    userId: summary.userId,
    domainBreakdown: summary.domainBreakdown,
    mode: summary.mode,
  });

  await admin
    .from("profiles")
    .update({ last_activity_at: now })
    .eq("id", summary.userId);

  await admin.from("activity_events").insert({
    user_id: summary.userId,
    event_type:
      summary.mode === "quiz"
        ? "quiz_completed"
        : summary.mode === "weak_area_drill"
          ? "weak_area_drill_completed"
          : summary.mode === "mock_exam"
            ? "mock_exam_completed"
            : "pretest_completed",
    metadata_json: {
      score: summary.score,
      totalQuestions: summary.totalQuestions,
      passed: summary.passed,
      domainSlug: summary.domainSlug ?? null,
      confidenceLevel: summary.confidenceLevel ?? null,
      confidenceScore: summary.confidenceScore ?? null,
      timeSpentSeconds: creditedSeconds,
    },
    occurred_at: now,
  });
}
