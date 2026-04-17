import { createAdminClient } from "@/lib/supabase/admin";
import { ccmaDomains } from "@/content/ccma/domains";
import type { TutorEvaluation, TutorLesson } from "@/lib/tutor/types";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export async function ensureDomainRecord(domainSlug: string, domainTitle: string) {
  const admin = createAdminClient();
  const localDomain =
    ccmaDomains.find((domain) => domain.slug === domainSlug) ?? null;

  const { data: existing } = await admin
    .from("ccma_domains")
    .select("id")
    .eq("slug", domainSlug)
    .maybeSingle();

  if (existing) {
    return existing.id;
  }

  const { data: inserted } = await admin
    .from("ccma_domains")
    .insert({
      slug: domainSlug,
      title: domainTitle,
      description: localDomain?.description ?? null,
    })
    .select("id")
    .single();

  return inserted?.id ?? null;
}

export async function updateDomainMastery(args: {
  userId: string;
  lesson: TutorLesson;
  evaluation: TutorEvaluation;
}) {
  const admin = createAdminClient();
  const domainId = await ensureDomainRecord(args.lesson.domainSlug, args.lesson.domainTitle);

  if (!domainId) {
    return null;
  }

  const { data: existing } = await admin
    .from("ccma_domain_mastery")
    .select("*")
    .eq("user_id", args.userId)
    .eq("domain_id", domainId)
    .maybeSingle();

  const now = new Date().toISOString();
  const baseline = existing?.mastery_score ?? 50;
  const scoreShift = args.evaluation.correct
    ? Math.max(5, Math.round(args.evaluation.score / 12))
    : -Math.max(4, Math.round((100 - args.evaluation.score) / 18));

  const masteryScore = clamp(baseline + scoreShift, 0, 100);
  const weakStreak = args.evaluation.correct ? 0 : (existing?.weak_streak ?? 0) + 1;

  const payload = {
    user_id: args.userId,
    domain_id: domainId,
    mastery_score: masteryScore,
    weak_streak: weakStreak,
    last_seen_at: now,
  };

  if (existing) {
    const { data } = await admin
      .from("ccma_domain_mastery")
      .update(payload)
      .eq("id", existing.id)
      .select("*")
      .single();

    return data;
  }

  const { data } = await admin
    .from("ccma_domain_mastery")
    .insert(payload)
    .select("*")
    .single();
  return data;
}
