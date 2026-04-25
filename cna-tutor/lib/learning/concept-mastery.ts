import type { SupabaseClient } from "@supabase/supabase-js";

export type Sm2State = {
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReviewAt: string;
  masteryScore: number;
  lastScore: number;
  bloomLevel: number;
  lastSeenAt: string | null;
};

// Recency decay: mastery degrades ~10% per day without review
const DECAY_LAMBDA = 0.1;

export function computeDecayedMastery(rawScore: number, daysSince: number): number {
  return parseFloat((rawScore * Math.exp(-DECAY_LAMBDA * daysSince)).toFixed(4));
}

// Map 0–100 raw score to SM-2 quality rating 0–5
function toSm2Quality(rawScore: number): number {
  return Math.round((rawScore / 100) * 5);
}

export function sm2Update(current: Sm2State, rawScore: number, bloomLevel: number): Sm2State {
  const q = toSm2Quality(rawScore);
  const now = new Date();
  let { interval, easeFactor, repetitions } = current;

  if (q >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    easeFactor = parseFloat(Math.max(1.3, easeFactor).toFixed(2));
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  const nextReviewAt = new Date(now.getTime() + interval * 86_400_000).toISOString();

  const daysSince = current.lastSeenAt
    ? (now.getTime() - new Date(current.lastSeenAt).getTime()) / 86_400_000
    : 0;

  const masteryScore = computeDecayedMastery(rawScore / 100, daysSince);

  return {
    interval,
    easeFactor,
    repetitions,
    nextReviewAt,
    masteryScore,
    lastScore: rawScore,
    bloomLevel,
    lastSeenAt: now.toISOString(),
  };
}

export async function upsertConceptMastery(
  params: {
    userId: string;
    conceptId: string;
    lessonId: string;
    rawScore: number;
    bloomLevel: number;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
): Promise<{ masteryDelta: number }> {
  const { userId, conceptId, lessonId, rawScore, bloomLevel } = params;

  const { data: existing } = await supabase
    .from("concept_mastery")
    .select("interval,ease_factor,repetitions,next_review_at,mastery_score,last_score,bloom_level,last_seen_at")
    .eq("user_id", userId)
    .eq("concept_id", conceptId)
    .maybeSingle();

  const current: Sm2State = existing
    ? {
        interval: existing.interval,
        easeFactor: parseFloat(existing.ease_factor),
        repetitions: existing.repetitions,
        nextReviewAt: existing.next_review_at,
        masteryScore: parseFloat(existing.mastery_score),
        lastScore: existing.last_score,
        bloomLevel: existing.bloom_level,
        lastSeenAt: existing.last_seen_at,
      }
    : {
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewAt: new Date().toISOString(),
        masteryScore: 0,
        lastScore: 0,
        bloomLevel: 1,
        lastSeenAt: null,
      };

  const updated = sm2Update(current, rawScore, bloomLevel);
  const masteryDelta = parseFloat((updated.masteryScore - current.masteryScore).toFixed(4));

  await supabase.from("concept_mastery").upsert(
    {
      user_id: userId,
      concept_id: conceptId,
      lesson_id: lessonId,
      interval: updated.interval,
      ease_factor: updated.easeFactor,
      repetitions: updated.repetitions,
      next_review_at: updated.nextReviewAt,
      mastery_score: updated.masteryScore,
      last_score: updated.lastScore,
      bloom_level: updated.bloomLevel,
      last_seen_at: updated.lastSeenAt,
    },
    { onConflict: "user_id,concept_id" },
  );

  return { masteryDelta };
}
