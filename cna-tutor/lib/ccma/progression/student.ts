import { listTutorLessons } from "@/lib/ccma/tutor/lessons";
import { createClient } from "@/lib/supabase/server";
import type { PretestDomainBreakdown } from "@/lib/ccma/onboarding/pretest";
import {
  buildStudentProgressionSnapshot,
  type ProgressionMockAttempt,
  type ProgressionQuizAttempt,
} from "@/lib/ccma/progression/readiness";

export async function getStudentProgressionSnapshot(args: {
  userId: string;
  pretestScore: number | null;
  pretestDomainBreakdown: PretestDomainBreakdown[];
}) {
  const supabase = (await createClient()) as any;
  const totalModules = listTutorLessons().length;

  const [
    { data: rawProgressRows },
    { data: rawQuizAttempts },
    { data: rawAssessmentAttempts },
    { data: profileRow },
  ] = await Promise.all([
    supabase
      .from("ccma_student_progress")
      .select("domain_slug, domain_title, mastery_score, weak_streak, lessons_completed")
      .eq("user_id", args.userId),
    supabase
      .from("ccma_quiz_attempts")
      .select("id, domain_slug, score, total_questions, completed_at, domain_breakdown")
      .eq("user_id", args.userId)
      .order("completed_at", { ascending: false })
      .limit(6),
    supabase
      .from("ccma_assessments")
      .select("id, mode, score, passed, completed_at")
      .eq("user_id", args.userId)
      .eq("mode", "mock_exam")
      .order("completed_at", { ascending: false })
      .limit(6),
    supabase
      .from("profiles")
      .select("last_activity_at")
      .eq("id", args.userId)
      .eq("product", "ccma")
      .single(),
  ]);

  const daysSinceActivity = profileRow?.last_activity_at
    ? Math.floor(
        (Date.now() - new Date(profileRow.last_activity_at).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const progressRows = rawProgressRows ?? [];
  const lessonsCompleted = progressRows.reduce(
    (sum: number, row: any) => sum + (row.lessons_completed ?? 0),
    0,
  );

  const masteryRows = progressRows.map((row: any) => ({
    domainSlug: row.domain_slug,
    domainTitle: row.domain_title,
    masteryScore: row.mastery_score,
    weakStreak: row.weak_streak,
  }));

  const quizAttempts: ProgressionQuizAttempt[] = (rawQuizAttempts ?? []).map(
    (attempt: any) => ({
      id: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.total_questions,
      completedAt: attempt.completed_at,
      domainSlug: attempt.domain_slug ?? null,
      domainTitle:
        attempt.domain_breakdown?.[0]?.domainTitle ?? attempt.domain_slug ?? null,
    }),
  );

  const mockAttempts: ProgressionMockAttempt[] = (
    rawAssessmentAttempts ?? []
  ).map((attempt: any) => ({
    id: attempt.id,
    percent: attempt.score,
    passed: attempt.passed,
    completedAt: attempt.completed_at,
  }));

  return buildStudentProgressionSnapshot({
    pretestScore: args.pretestScore,
    pretestDomainBreakdown: args.pretestDomainBreakdown,
    masteryRows,
    lessonsCompleted,
    quizzesCompleted: quizAttempts.length,
    mockExamsCompleted: mockAttempts.length,
    quizAttempts,
    mockAttempts,
    totalModules,
    daysSinceActivity: Number.isNaN(daysSinceActivity ?? NaN)
      ? null
      : daysSinceActivity,
  });
}
