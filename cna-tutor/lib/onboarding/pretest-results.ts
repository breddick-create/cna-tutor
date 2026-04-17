import { texasCnaDomains } from "@/content/texas-cna/domains";
import { getLessonByDomain } from "@/lib/tutor/lessons";

import type { PretestDomainBreakdown } from "@/lib/onboarding/pretest";

const STRENGTH_THRESHOLD = 75;
const PRIORITY_THRESHOLD = 80;

export type PretestResultsDomain = {
  domainSlug: string;
  domainTitle: string;
  description: string;
  correctCount: number;
  totalQuestions: number;
  percent: number;
  lessonTitle: string | null;
  estimatedMinutes: number | null;
  priorityLabel: "Start first" | "Build next" | "Maintain";
  recommendation: string;
};

export type PretestResultsViewModel = {
  score: number;
  readiness: {
    label: string;
    tone: "low" | "mid" | "high";
    summary: string;
    encouragement: string;
  };
  strengths: PretestResultsDomain[];
  weakAreas: PretestResultsDomain[];
  priorityOrder: PretestResultsDomain[];
  studyPlanPreview: Array<{
    domainSlug: string;
    domainTitle: string;
    lessonTitle: string;
    estimatedMinutes: number | null;
    note: string;
  }>;
};

function getReadinessStatus(score: number): PretestResultsViewModel["readiness"] {
  // Business rule: the pre-test should set direction, not shame the student.
  // Even a strong starting score is framed as a starting point rather than a final pass signal.
  if (score < 60) {
    return {
      label: "Not ready yet",
      tone: "low",
      summary: "You’re not ready for the exam yet, but now you know where to start.",
      encouragement:
        "Start with the weakest areas first. Your study plan will help you build confidence one section at a time.",
    };
  }

  if (score < 80) {
    return {
      label: "Making progress",
      tone: "mid",
      summary: "You already have a foundation, and a few sections need more work.",
      encouragement:
        "Use the ranked study plan below to tighten the weakest sections before you move into full practice.",
    };
  }

  return {
      label: "Strong start",
      tone: "high",
      summary: "You’re starting from a stronger place, but the plan still matters.",
      encouragement:
        "Keep working through the lowest-scoring areas first so your strongest topics stay steady on test day.",
    };
  }

export function buildPretestResultsViewModel(args: {
  score: number;
  breakdown: PretestDomainBreakdown[];
}): PretestResultsViewModel {
  const mappedDomains = args.breakdown
    .map((domain) => {
      const domainMeta = texasCnaDomains.find((item) => item.slug === domain.domainSlug);
      const lesson = getLessonByDomain(domain.domainSlug)[0] ?? null;
      const priorityLabel =
        domain.percent < 60 ? "Start first" : domain.percent < PRIORITY_THRESHOLD ? "Build next" : "Maintain";

      return {
        domainSlug: domain.domainSlug,
        domainTitle: domain.domainTitle,
        description: domainMeta?.description ?? "Use guided study and practice to strengthen this section.",
        correctCount: domain.correctCount,
        totalQuestions: domain.totalQuestions,
        percent: domain.percent,
        lessonTitle: lesson?.title ?? null,
        estimatedMinutes: lesson?.estimatedMinutes ?? null,
        priorityLabel,
        recommendation: lesson
          ? `Start with ${lesson.title}, then take the 10-question quiz and the section mock.`
          : `Open this section in Study first, then take the 10-question quiz and the section mock.`,
      } satisfies PretestResultsDomain;
    })
    .sort((a, b) => a.percent - b.percent || a.domainTitle.localeCompare(b.domainTitle));

  const strengths = mappedDomains.filter((domain) => domain.percent >= STRENGTH_THRESHOLD);
  const weakAreas = mappedDomains.filter((domain) => domain.percent < PRIORITY_THRESHOLD);
  const topStrengths = (strengths.length ? strengths : [...mappedDomains].reverse()).slice(0, 3);
  const topWeakAreas = (weakAreas.length ? weakAreas : mappedDomains.slice(0, 3)).slice(0, 4);
  const priorityOrder = mappedDomains.slice(0, 4);

  return {
    score: args.score,
    readiness: getReadinessStatus(args.score),
    strengths: topStrengths,
    weakAreas: topWeakAreas,
    priorityOrder,
    studyPlanPreview: priorityOrder.slice(0, 3).map((domain) => ({
      domainSlug: domain.domainSlug,
      domainTitle: domain.domainTitle,
      lessonTitle: domain.lessonTitle ?? `${domain.domainTitle} guided lesson`,
      estimatedMinutes: domain.estimatedMinutes,
      note: domain.recommendation,
    })),
  };
}
