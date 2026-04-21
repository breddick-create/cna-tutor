import { isRdaDomainId } from "@/content/rda/domains";
import { buildRdaReadinessSnapshot, type RDADomainPerformance } from "@/lib/rda/readiness/engine";
import { createRdaClient } from "@/lib/rda/supabase";

export async function getRdaStudentDashboard(args: {
  userId: string;
  pretestBreakdown: RDADomainPerformance[];
}) {
  const supabase = await createRdaClient();
  const [{ data: quizRows }, { data: mockRows }, { data: lessonRows }] = await Promise.all([
    supabase
      .from("rda_quiz_attempts")
      .select("domain_id, score, completed_at")
      .eq("user_id", args.userId)
      .order("completed_at", { ascending: false })
      .limit(12),
    supabase
      .from("rda_mock_exam_attempts")
      .select("score, completed_at")
      .eq("user_id", args.userId)
      .order("completed_at", { ascending: false })
      .limit(5),
    supabase
      .from("rda_lesson_progress")
      .select("domain_id, mastery_score, status, completed_at, updated_at")
      .eq("user_id", args.userId)
      .order("updated_at", { ascending: false }),
  ]);

  return buildRdaReadinessSnapshot({
    pretestBreakdown: args.pretestBreakdown,
    quizAttempts: (quizRows ?? []).flatMap((row) => {
      if (!isRdaDomainId(row.domain_id)) return [];

      return {
        domainSlug: row.domain_id,
        score: Number(row.score),
        completedAt: row.completed_at,
      };
    }),
    mockAttempts: (mockRows ?? []).map((row) => ({
      score: Number(row.score),
      passed: Number(row.score) >= 80,
      completedAt: row.completed_at,
    })),
    lessonProgress: (lessonRows ?? []).flatMap((row) => {
      if (!isRdaDomainId(row.domain_id)) return [];

      return {
        domainSlug: row.domain_id,
        masteryScore: Number(row.mastery_score ?? 0),
        completed: row.status === "mastered",
        completedAt: row.completed_at,
      };
    }),
    lastActivity:
      (quizRows ?? [])[0]?.completed_at ??
      (mockRows ?? [])[0]?.completed_at ??
      (lessonRows ?? [])[0]?.completed_at ??
      (lessonRows ?? [])[0]?.updated_at ??
      null,
  });
}
