import { texasCnaDomains } from "@/content/texas-cna/domains";
import type { PretestDomainBreakdown } from "@/lib/onboarding/pretest";
import type { ProgressionDomainMeta, ProgressionSnapshot } from "@/lib/progression/readiness";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";
import { listTutorLessons } from "@/lib/tutor/lessons";

export type AdaptiveStudyPlanSection = {
  slug: string;
  title: string;
  description: string;
  score: number;
  baselineScore: number;
  weakStreak: number;
  priorityLabel: "Start first" | "Build next" | "Maintain";
  lessonId: string | null;
  lessonTitle: string | null;
  lessonSummary: string | null;
  estimatedMinutes: number | null;
  lessonDefaultMode: "learn" | "quiz" | "mock_exam" | "weak_area_review" | "study_plan" | "rapid_review" | null;
  lessonSupportedModes: Array<"learn" | "quiz" | "mock_exam" | "weak_area_review" | "study_plan" | "rapid_review">;
  recommendation: string;
};

export type AdaptiveStudyPlan = {
  progression: ProgressionSnapshot;
  rankedCategories: AdaptiveStudyPlanSection[];
  priorityCategories: AdaptiveStudyPlanSection[];
  recommendedModules: AdaptiveStudyPlanSection[];
  nextStep: {
    title: string;
    description: string;
    href: string;
  };
  notes: {
    firstFocus: string[];
    sequencing: string;
    practiceExam: string;
  };
};

export async function getAdaptiveStudyPlan(args: {
  userId: string;
  pretestScore: number | null;
  pretestDomainBreakdown: PretestDomainBreakdown[];
  domains?: ReadonlyArray<ProgressionDomainMeta>;
}) {
  const progression = await getStudentProgressionSnapshot({
    userId: args.userId,
    pretestScore: args.pretestScore,
    pretestDomainBreakdown: args.pretestDomainBreakdown,
    domains: args.domains,
  });
  const lessons = listTutorLessons();
  const domainMeta = new Map<string, { description: string }>(texasCnaDomains.map((domain) => [domain.slug, domain]));

  // Business rule: the study plan must be deterministic and weakest-first.
  // We do not reshuffle or personalize with hidden heuristics. The same inputs should
  // always produce the same priority order so staff and students can understand the plan.
  const rankedSections = progression.rankedDomains.map((domain) => {
    const lesson = lessons.find((item) => item.domainSlug === domain.domainSlug) ?? null;
    const meta = domainMeta.get(domain.domainSlug);

    return {
      slug: domain.domainSlug,
      title: domain.domainTitle,
      description: meta?.description ?? domain.description,
      score: domain.masteryScore,
      baselineScore: domain.baselineScore,
      weakStreak: domain.weakStreak,
      priorityLabel: domain.priorityLabel,
      lessonId: lesson?.id ?? null,
      lessonTitle: lesson?.title ?? null,
      lessonSummary: lesson?.summary ?? null,
      estimatedMinutes: lesson?.estimatedMinutes ?? null,
      lessonDefaultMode: lesson?.defaultMode ?? null,
      lessonSupportedModes: lesson?.supportedModes ?? [],
      recommendation: domain.recommendation,
    } satisfies AdaptiveStudyPlanSection;
  });

  const visibleSections = rankedSections;
  const recommendedModules = visibleSections.filter((section) => section.lessonId).slice(0, 3);
  const firstFocus = visibleSections.slice(0, 3).map((section) => section.title);
  const topWeakSection = visibleSections[0] ?? rankedSections[0] ?? null;

  return {
    progression,
    rankedCategories: rankedSections,
    priorityCategories: visibleSections,
    recommendedModules,
    nextStep: {
      title: progression.nextBestTask.title,
      description: progression.nextBestTask.description,
      href: progression.nextBestTask.href,
    },
    notes: {
      firstFocus,
      sequencing: topWeakSection
        ? `Start with ${topWeakSection.title}, then move to the next weakest section only after you finish its guided lesson, 10-question quiz, and section mock.`
        : "Start with the first ranked section and move down the list in order.",
      practiceExam: progression.practiceExamUnlocked
        ? "The full practice exam is unlocked, but it should still come after you give the weakest sections attention first."
        : progression.practiceExamGateReason,
    },
  } satisfies AdaptiveStudyPlan;
}
