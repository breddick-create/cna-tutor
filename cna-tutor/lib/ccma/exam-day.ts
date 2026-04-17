import type { ProgressionSnapshot } from "@/lib/ccma/progression/readiness";

export const CCMA_EXAM_DAY_SOURCES = [
  {
    label: "NHA CCMA exam candidate handbook",
    href: "https://www.nhanow.com/certifications/clinical-medical-assistant",
  },
  {
    label: "NHA PSI exam scheduling and test-center guide",
    href: "https://candidate.psiexams.com/",
  },
  {
    label: "NHA CCMA exam blueprint and content outline",
    href: "https://www.nhanow.com/docs/default-source/exam-outlines/ccma-exam-outline.pdf",
  },
  {
    label: "NHA candidate resources and study tools",
    href: "https://www.nhanow.com/resources/candidates",
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
