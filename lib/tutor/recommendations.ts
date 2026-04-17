import { getLessonByDomain, listTutorLessons } from "@/lib/tutor/lessons";
import type { Database } from "@/types/database";

type MasteryRow = Pick<
  Database["public"]["Tables"]["ccma_domain_mastery"]["Row"],
  "domain_id" | "mastery_score" | "weak_streak"
> & {
  domainTitle?: string;
  domainSlug?: string;
};

export function getRecommendedLessonsFromMastery(masteryRows: MasteryRow[]) {
  const allLessons = listTutorLessons();

  const weakDomainLessons = masteryRows
    .sort((a, b) => {
      if (a.mastery_score !== b.mastery_score) {
        return a.mastery_score - b.mastery_score;
      }

      return b.weak_streak - a.weak_streak;
    })
    .flatMap((row) => (row.domainSlug ? getLessonByDomain(row.domainSlug) : []));

  const recommendations = [...weakDomainLessons, ...allLessons].filter(
    (lesson, index, array) => array.findIndex((item) => item.id === lesson.id) === index,
  );

  return recommendations.slice(0, 3);
}

export function getWeakAreaSummary(masteryRows: MasteryRow[]) {
  return masteryRows
    .filter((row) => row.mastery_score < 75 || row.weak_streak > 0)
    .sort((a, b) => a.mastery_score - b.mastery_score)
    .slice(0, 3)
    .map((row) => row.domainTitle ?? "Unknown domain");
}
