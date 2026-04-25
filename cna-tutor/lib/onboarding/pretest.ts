import type { User } from "@supabase/supabase-js";

export const PRETEST_REQUIRED_MESSAGE =
  "Complete the pre-test before opening lessons, quizzes, or the mock exam.";

export type PretestDomainBreakdown = {
  domainSlug: string;
  domainTitle: string;
  correctCount: number;
  totalQuestions: number;
  percent: number;
};

export function hasCompletedPretest(user: User) {
  if (typeof user.user_metadata?.pretest_completed_at === "string") {
    return true;
  }

  if (typeof user.user_metadata?.pretest_score === "number") {
    return true;
  }

  return getPretestDomainBreakdown(user).length > 0;
}

export function getPretestScore(user: User) {
  const raw = user.user_metadata?.pretest_score;
  return typeof raw === "number" ? raw : null;
}

export function getPretestDomainBreakdown(user: User): PretestDomainBreakdown[] {
  const raw = user.user_metadata?.pretest_domain_breakdown;

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return null;
      }

      const domainSlug =
        typeof entry.domainSlug === "string" && entry.domainSlug.trim()
          ? entry.domainSlug.trim()
          : null;
      const domainTitle =
        typeof entry.domainTitle === "string" && entry.domainTitle.trim()
          ? entry.domainTitle.trim()
          : null;
      const correctCount = typeof entry.correctCount === "number" ? entry.correctCount : null;
      const totalQuestions = typeof entry.totalQuestions === "number" ? entry.totalQuestions : null;
      const percent = typeof entry.percent === "number" ? entry.percent : null;

      if (!domainSlug || !domainTitle || correctCount === null || totalQuestions === null || percent === null) {
        return null;
      }

      return {
        domainSlug,
        domainTitle,
        correctCount,
        totalQuestions,
        percent,
      } satisfies PretestDomainBreakdown;
    })
    .filter((entry): entry is PretestDomainBreakdown => Boolean(entry))
    .sort((a, b) => a.percent - b.percent || a.domainTitle.localeCompare(b.domainTitle));
}
