import { createAdminClient } from "@/lib/supabase/admin";
import { ensureDomainRecord } from "@/lib/tutor/progress";
import type { Database } from "@/types/database";

type AssessmentSummary = {
  mode: "quiz" | "mock_exam";
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
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

async function updateDailyAssessmentStats(args: {
  admin: ReturnType<typeof createAdminClient>;
  userId: string;
  score: number;
  mode: "quiz" | "mock_exam";
  timeSpentSeconds: number;
}) {
  const statDate = new Date().toISOString().slice(0, 10);
  const { data: existingDailyStat } = await args.admin
    .from("ccma_daily_user_stats")
    .select("*")
    .eq("user_id", args.userId)
    .eq("date", statDate)
    .maybeSingle();

  const quizIncrement = args.mode === "quiz" ? 1 : 0;
  const mockIncrement = args.mode === "mock_exam" ? 1 : 0;
  const completedAssessments =
    (existingDailyStat?.quizzes_completed ?? 0) +
    (existingDailyStat?.mock_exams_completed ?? 0) +
    quizIncrement +
    mockIncrement;
  const previousAssessments = Math.max(0, completedAssessments - 1);
  const previousScoreTotal = previousAssessments > 0 ? (existingDailyStat?.average_score ?? 0) * previousAssessments : 0;
  const averageScore = Math.round(
    (previousScoreTotal + args.score) / Math.max(1, completedAssessments),
  );

  if (existingDailyStat) {
    await args.admin
      .from("ccma_daily_user_stats")
      .update({
        total_seconds: existingDailyStat.total_seconds + args.timeSpentSeconds,
        active_seconds: existingDailyStat.active_seconds + args.timeSpentSeconds,
        quizzes_completed: existingDailyStat.quizzes_completed + quizIncrement,
        mock_exams_completed: existingDailyStat.mock_exams_completed + mockIncrement,
        average_score: averageScore,
      })
      .eq("user_id", args.userId)
      .eq("date", statDate);

    return;
  }

  await args.admin.from("ccma_daily_user_stats").insert({
    user_id: args.userId,
    date: statDate,
    total_seconds: args.timeSpentSeconds,
    active_seconds: args.timeSpentSeconds,
    quizzes_completed: quizIncrement,
    mock_exams_completed: mockIncrement,
    average_score: averageScore,
  });
}

async function updateDomainBreakdownMastery(args: {
  admin: ReturnType<typeof createAdminClient>;
  userId: string;
  domainBreakdown: AssessmentSummary["domainBreakdown"];
}) {
  for (const domain of args.domainBreakdown) {
    const domainId = await ensureDomainRecord(domain.domainSlug, domain.domainTitle);

    if (!domainId) {
      continue;
    }

    const { data: existing } = await args.admin
      .from("ccma_domain_mastery")
      .select("*")
      .eq("user_id", args.userId)
      .eq("domain_id", domainId)
      .maybeSingle();

    const baseline = existing?.mastery_score ?? 50;
    const scoreShift = domain.percent >= 80
      ? Math.max(6, Math.round(domain.percent / 14))
      : -Math.max(5, Math.round((100 - domain.percent) / 15));

    const masteryScore = clamp(baseline + scoreShift, 0, 100);
    const weakStreak = domain.percent >= 80 ? 0 : (existing?.weak_streak ?? 0) + 1;
    const now = new Date().toISOString();

    if (existing) {
      await args.admin
        .from("ccma_domain_mastery")
        .update({
          mastery_score: masteryScore,
          weak_streak: weakStreak,
          last_seen_at: now,
        })
        .eq("id", existing.id);
    } else {
      await args.admin.from("ccma_domain_mastery").insert({
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

  if (summary.mode === "quiz") {
    const primaryDomain = summary.domainBreakdown[0];
    const domainId = primaryDomain
      ? await ensureDomainRecord(primaryDomain.domainSlug, primaryDomain.domainTitle)
      : null;

    await admin.from("ccma_quiz_attempts").insert({
      user_id: summary.userId,
      domain_id: domainId,
      score: summary.score,
      total_questions: summary.totalQuestions,
      started_at: now,
      completed_at: now,
    });
  } else {
    await admin.from("ccma_mock_exam_attempts").insert({
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
    timeSpentSeconds: creditedSeconds,
  });

  await updateDomainBreakdownMastery({
    admin,
    userId: summary.userId,
    domainBreakdown: summary.domainBreakdown,
  });

  await admin.from("ccma_profiles").update({
    last_activity_at: now,
  }).eq("id", summary.userId);

  await admin.from("ccma_activity_events").insert({
    user_id: summary.userId,
    event_type: summary.mode === "quiz" ? "quiz_completed" : "mock_exam_completed",
    metadata_json: {
      score: summary.score,
      totalQuestions: summary.totalQuestions,
      passed: summary.passed,
      domainSlug: summary.domainSlug ?? null,
      timeSpentSeconds: creditedSeconds,
    } satisfies Database["public"]["Tables"]["ccma_activity_events"]["Insert"]["metadata_json"],
    occurred_at: now,
  });
}
