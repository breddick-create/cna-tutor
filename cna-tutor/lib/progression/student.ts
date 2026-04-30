import { listTutorLessons } from "@/lib/tutor/lessons";
import { createClient } from "@/lib/supabase/server";
import type { PretestDomainBreakdown } from "@/lib/onboarding/pretest";
import {
  buildStudentProgressionSnapshot,
  type ProgressionDomainMeta,
  type ProgressionMockAttempt,
  type ProgressionQuizAttempt,
} from "@/lib/progression/readiness";

export async function getStudentProgressionSnapshot(args: {
  userId: string;
  pretestScore: number | null;
  pretestDomainBreakdown: PretestDomainBreakdown[];
  domains?: ReadonlyArray<ProgressionDomainMeta>;
}) {
  const supabase = await createClient();
  const totalModules = listTutorLessons().length;

  const [
    { data: statsRows },
    { data: rawMasteryRows },
    { data: rawQuizAttempts },
    { data: rawMockAttempts },
    { data: profileRow },
  ] = await Promise.all([
    supabase.from("daily_user_stats").select("*").eq("user_id", args.userId),
    supabase
      .from("domain_mastery")
      .select("domain_id, mastery_score, weak_streak")
      .eq("user_id", args.userId),
    supabase
      .from("quiz_attempts")
      .select("id, domain_id, score, total_questions, completed_at")
      .eq("user_id", args.userId)
      .eq("section", "written")
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(6),
    supabase
      .from("mock_exam_attempts")
      .select("id, percent, passed, completed_at")
      .eq("user_id", args.userId)
      .eq("section", "written")
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(6),
    supabase
      .from("profiles")
      .select("last_activity_at")
      .eq("id", args.userId)
      .single(),
  ]);

  const daysSinceActivity = profileRow?.last_activity_at
    ? Math.floor((Date.now() - new Date(profileRow.last_activity_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const totals = (statsRows ?? []).reduce(
    (acc, row) => {
      acc.lessonsCompleted += row.lessons_completed;
      acc.quizzesCompleted += row.quizzes_completed;
      acc.mockExamsCompleted += row.mock_exams_completed;
      return acc;
    },
    {
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      mockExamsCompleted: 0,
    },
  );

  const domainIds = Array.from(
    new Set([
      ...(rawMasteryRows ?? []).map((row) => row.domain_id),
      ...(rawQuizAttempts ?? [])
        .map((attempt) => attempt.domain_id)
        .filter((value): value is string => Boolean(value)),
    ]),
  );
  const { data: storedDomains } = domainIds.length
    ? await supabase.from("domains").select("id, slug, title").in("id", domainIds)
    : { data: [] };
  const domainMap = new Map((storedDomains ?? []).map((domain) => [domain.id, domain]));

  const masteryRows = (rawMasteryRows ?? [])
    .map((row) => {
      const domain = domainMap.get(row.domain_id);

      if (!domain) {
        return null;
      }

      return {
        domainSlug: domain.slug,
        domainTitle: domain.title,
        masteryScore: row.mastery_score,
        weakStreak: row.weak_streak,
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const quizAttempts: ProgressionQuizAttempt[] = (rawQuizAttempts ?? []).map((attempt) => {
    const domain = attempt.domain_id ? domainMap.get(attempt.domain_id) : null;

    return {
      id: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.total_questions,
      completedAt: attempt.completed_at,
      domainSlug: domain?.slug ?? null,
      domainTitle: domain?.title ?? null,
    };
  });

  const mockAttempts: ProgressionMockAttempt[] = (rawMockAttempts ?? []).map((attempt) => ({
    id: attempt.id,
    percent: attempt.percent,
    passed: attempt.passed,
    completedAt: attempt.completed_at,
  }));

  return buildStudentProgressionSnapshot({
    pretestScore: args.pretestScore,
    pretestDomainBreakdown: args.pretestDomainBreakdown,
    masteryRows,
    lessonsCompleted: totals.lessonsCompleted,
    quizzesCompleted: totals.quizzesCompleted,
    mockExamsCompleted: totals.mockExamsCompleted,
    quizAttempts,
    mockAttempts,
    totalModules,
    daysSinceActivity: Number.isNaN(daysSinceActivity ?? NaN) ? null : daysSinceActivity,
    domains: args.domains,
  });
}
