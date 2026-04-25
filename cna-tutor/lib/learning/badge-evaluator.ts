import type { SupabaseClient } from "@supabase/supabase-js";
import { listTutorLessons } from "@/lib/tutor/lessons";

export type BadgeEvalTrigger =
  | "session_complete"
  | "quiz_complete"
  | "mock_exam_complete"
  | "pretest_complete"
  | "login";

export type BadgeEvalContext = {
  userId: string;
  trigger: BadgeEvalTrigger;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>;
  // Session context (required for session_complete trigger)
  sessionId?: string;
  sessionMasteryScore?: number;   // 0–100
  sessionDurationSeconds?: number;
  sessionDomainSlug?: string;
  // Mock exam context
  mockExamPercent?: number;
  // User state
  readinessScore?: number;
  currentStreak?: number;
  pretestCompleted?: boolean;
  daysSinceLastStudy?: number;
  userProduct?: "cna" | "ccma";
};

export type EarnedBadge = {
  slug: string;
  title: string;
  description: string;
};

type DbDefinition = {
  id: string;
  slug: string;
  title: string;
  description: string;
  criteria_json: Record<string, unknown>;
  category: string;
  product: string | null;
  domain_slug: string | null;
};

// ─── Per-session turn analysis ────────────────────────────────────────────────

async function getSessionTurnCorrectness(
  sessionId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
): Promise<Array<"correct" | "incorrect" | null>> {
  const { data } = await supabase
    .from("tutor_turns")
    .select("correctness")
    .eq("session_id", sessionId)
    .eq("actor", "tutor")
    .not("correctness", "is", null)
    .order("created_at", { ascending: true });

  return (data ?? []).map((r: { correctness: string | null }) =>
    r.correctness === "correct" ? "correct" : r.correctness === "incorrect" ? "incorrect" : null,
  );
}

function hasConsecutiveCorrect(turns: Array<"correct" | "incorrect" | null>, needed: number): boolean {
  let streak = 0;
  for (const t of turns) {
    if (t === "correct") {
      streak++;
      if (streak >= needed) return true;
    } else {
      streak = 0;
    }
  }
  return false;
}

function hasBounceBack(turns: Array<"correct" | "incorrect" | null>, correctAfter: number): boolean {
  for (let i = 0; i < turns.length - correctAfter; i++) {
    if (turns[i] !== "incorrect") continue;
    const slice = turns.slice(i + 1, i + 1 + correctAfter);
    if (slice.length === correctAfter && slice.every((t) => t === "correct")) return true;
  }
  return false;
}

// ─── Domain / lesson completion checks ───────────────────────────────────────

async function getCompletedLessonIds(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
): Promise<string[]> {
  const { data } = await supabase
    .from("tutor_sessions")
    .select("session_state_json")
    .eq("user_id", userId)
    .eq("status", "completed");

  const ids: string[] = [];
  for (const row of data ?? []) {
    const state = row.session_state_json as Record<string, unknown>;
    if (typeof state?.lessonId === "string") ids.push(state.lessonId);
  }
  return [...new Set(ids)];
}

async function isDomainComplete(
  domainSlug: string,
  completedLessonIds: string[],
): Promise<boolean> {
  const lessons = listTutorLessons().filter((l) => l.domainSlug === domainSlug);
  if (lessons.length === 0) return false;
  return lessons.every((l) => completedLessonIds.includes(l.id));
}

async function isAllLessonsComplete(completedLessonIds: string[]): Promise<boolean> {
  const all = listTutorLessons();
  if (all.length === 0) return false;
  return all.every((l) => completedLessonIds.includes(l.id));
}

// ─── Domain mastery check ─────────────────────────────────────────────────────

async function getDomainMasteryScore(
  userId: string,
  domainSlug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
): Promise<number> {
  const { data: domain } = await supabase
    .from("domains")
    .select("id")
    .eq("slug", domainSlug)
    .maybeSingle();
  if (!domain) return 0;

  const { data: mastery } = await supabase
    .from("domain_mastery")
    .select("mastery_score")
    .eq("user_id", userId)
    .eq("domain_id", domain.id)
    .maybeSingle();

  return mastery?.mastery_score ?? 0;
}

// ─── Main evaluator ───────────────────────────────────────────────────────────

export async function evaluateBadges(ctx: BadgeEvalContext): Promise<EarnedBadge[]> {
  const { userId, supabase } = ctx;

  const [{ data: definitions }, { data: earned }] = await Promise.all([
    supabase
      .from("achievement_definitions")
      .select("id,slug,title,description,criteria_json,category,product,domain_slug"),
    supabase
      .from("student_achievements")
      .select("achievement_id")
      .eq("user_id", userId),
  ]);

  if (!definitions) return [];

  const earnedIds = new Set((earned ?? []).map((r: { achievement_id: string }) => r.achievement_id));

  // Lazy-load data only when needed
  let sessionTurns: Array<"correct" | "incorrect" | null> | null = null;
  let completedLessonIds: string[] | null = null;

  const toUnlock: EarnedBadge[] = [];

  for (const def of definitions as DbDefinition[]) {
    if (earnedIds.has(def.id)) continue;

    // Product gate: skip badge if it's for a different product
    if (def.product && ctx.userProduct && def.product !== ctx.userProduct) continue;

    const c = def.criteria_json as Record<string, unknown>;
    let qualifies = false;

    switch (c.type) {
      case "pretest_complete":
        qualifies = ctx.trigger === "pretest_complete" || ctx.pretestCompleted === true;
        break;

      case "streak":
        qualifies = typeof ctx.currentStreak === "number" && ctx.currentStreak >= (c.threshold as number);
        break;

      case "readiness":
        qualifies = typeof ctx.readinessScore === "number" && ctx.readinessScore >= (c.threshold as number);
        break;

      case "session_mastery":
        qualifies =
          ctx.trigger === "session_complete" &&
          typeof ctx.sessionMasteryScore === "number" &&
          ctx.sessionMasteryScore >= (c.threshold as number);
        break;

      case "mock_exam_score":
        qualifies =
          ctx.trigger === "mock_exam_complete" &&
          typeof ctx.mockExamPercent === "number" &&
          ctx.mockExamPercent >= (c.threshold as number);
        break;

      case "comeback":
        qualifies =
          ctx.trigger === "session_complete" &&
          typeof ctx.daysSinceLastStudy === "number" &&
          ctx.daysSinceLastStudy >= (c.days_away as number);
        break;

      case "speed_learner":
        qualifies =
          ctx.trigger === "session_complete" &&
          typeof ctx.sessionDurationSeconds === "number" &&
          ctx.sessionDurationSeconds <= (c.max_seconds as number) &&
          typeof ctx.sessionMasteryScore === "number" &&
          ctx.sessionMasteryScore >= (c.min_score as number);
        break;

      case "domain_mastery": {
        if (!def.domain_slug) break;
        const score = await getDomainMasteryScore(userId, def.domain_slug, supabase);
        qualifies = score >= (c.threshold as number);
        break;
      }

      case "consecutive_correct": {
        if (ctx.trigger !== "session_complete" || !ctx.sessionId) break;
        if (!sessionTurns) sessionTurns = await getSessionTurnCorrectness(ctx.sessionId, supabase);
        qualifies = hasConsecutiveCorrect(sessionTurns, c.threshold as number);
        break;
      }

      case "bounce_back": {
        if (ctx.trigger !== "session_complete" || !ctx.sessionId) break;
        if (!sessionTurns) sessionTurns = await getSessionTurnCorrectness(ctx.sessionId, supabase);
        qualifies = hasBounceBack(sessionTurns, c.correct_streak as number);
        break;
      }

      case "domain_complete": {
        if (ctx.trigger !== "session_complete" || !ctx.sessionDomainSlug) break;
        if (!completedLessonIds) completedLessonIds = await getCompletedLessonIds(userId, supabase);
        qualifies = await isDomainComplete(ctx.sessionDomainSlug, completedLessonIds);
        break;
      }

      case "all_lessons_complete": {
        if (ctx.trigger !== "session_complete") break;
        if (!completedLessonIds) completedLessonIds = await getCompletedLessonIds(userId, supabase);
        qualifies = await isAllLessonsComplete(completedLessonIds);
        break;
      }
    }

    if (qualifies) {
      toUnlock.push({ slug: def.slug, title: def.title, description: def.description });
    }
  }

  if (toUnlock.length) {
    const defMap = new Map((definitions as DbDefinition[]).map((d) => [d.slug, d.id]));
    const rows = toUnlock
      .filter((a) => defMap.has(a.slug))
      .map((a) => ({ user_id: userId, achievement_id: defMap.get(a.slug)! }));
    if (rows.length) {
      await supabase
        .from("student_achievements")
        .upsert(rows, { onConflict: "user_id,achievement_id" });
    }
  }

  return toUnlock;
}
