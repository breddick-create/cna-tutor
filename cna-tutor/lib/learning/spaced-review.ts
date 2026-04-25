import type { SupabaseClient } from "@supabase/supabase-js";

import { computeDecayedMastery } from "@/lib/learning/concept-mastery";

export type SpacedReviewConcept = {
  title: string;
  concept: string;
  tip: string;
};

type LessonLike = {
  segments: Array<{ id: string; title: string; concept: string; memoryTip: string }>;
};

export async function getWeakConceptsForReview(args: {
  userId: string;
  excludeLessonId: string;
  lessons: LessonLike[];
  supabase: SupabaseClient<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  conceptIdPrefix?: string; // e.g. "ccma:" for CCMA concepts
  limit?: number;
}): Promise<SpacedReviewConcept[]> {
  const { userId, excludeLessonId, lessons, supabase, conceptIdPrefix = "", limit = 2 } = args;

  let query = supabase
    .from("concept_mastery")
    .select("concept_id, lesson_id, raw_score, last_seen_at")
    .eq("user_id", userId)
    .neq("lesson_id", excludeLessonId)
    .order("raw_score", { ascending: true })
    .limit(10);

  // Filter to only the right product's concepts
  if (conceptIdPrefix) {
    query = query.like("concept_id", `${conceptIdPrefix}%`);
  } else {
    query = query.not("concept_id", "like", "ccma:%");
  }

  const { data: rows } = await query;
  if (!rows?.length) return [];

  const now = Date.now();
  const ranked = rows
    .map((row: { concept_id: string; raw_score: number; last_seen_at: string | null }) => {
      const daysSince = row.last_seen_at
        ? (now - new Date(row.last_seen_at).getTime()) / 86_400_000
        : 0;
      return {
        conceptId: row.concept_id,
        decayedScore: computeDecayedMastery(row.raw_score / 100, daysSince),
      };
    })
    .sort((a, b) => a.decayedScore - b.decayedScore)
    .slice(0, limit);

  const results: SpacedReviewConcept[] = [];
  for (const { conceptId } of ranked) {
    const bareId = conceptIdPrefix ? conceptId.replace(conceptIdPrefix, "") : conceptId;
    for (const lesson of lessons) {
      const segment = lesson.segments.find((s) => s.id === bareId);
      if (segment) {
        results.push({ title: segment.title, concept: segment.concept, tip: segment.memoryTip });
        break;
      }
    }
    if (results.length >= limit) break;
  }

  return results;
}
