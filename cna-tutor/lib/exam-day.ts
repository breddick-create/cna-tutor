import type { ProgressionSnapshot } from "@/lib/progression/readiness";

export const TEXAS_CNA_EXAM_DAY_SOURCES = [
  {
    label: "Texas HHSC TULIP nurse aide examination application guide",
    href: "https://apps.hhs.texas.gov/training/cbt/CNA/TULIP/TULIP_NA6.html",
  },
  {
    label: "Pearson VUE exam resources and test-day guidance",
    href: "https://www.pearsonvue.com/us/en/test-takers/resources.html",
  },
  {
    label: "Texas HHSC renewal, retraining, and retesting workflow",
    href: "https://www.hhs.texas.gov/sites/default/files/documents/cna-renewal-retraining-retesting.pdf",
  },
  {
    label: "Credentia retest guidance for written/oral and skills exams",
    href: "https://help.credentia.com/en/article/retest-1",
  },
] as const;

export function getMostImprovedDomains(progression: ProgressionSnapshot) {
  return progression.rankedDomains
    .map((domain) => ({
      domainSlug: domain.domainSlug,
      domainTitle: domain.domainTitle,
      baselineScore: domain.baselineScore,
      masteryScore: domain.masteryScore,
      improvement: domain.masteryScore - domain.baselineScore,
    }))
    .filter((domain) => domain.improvement > 0)
    .sort((a, b) => b.improvement - a.improvement || b.masteryScore - a.masteryScore)
    .slice(0, 3);
}

export function getStrongestDomains(progression: ProgressionSnapshot) {
  return [...progression.rankedDomains]
    .sort((a, b) => b.masteryScore - a.masteryScore || a.domainTitle.localeCompare(b.domainTitle))
    .slice(0, 3);
}

