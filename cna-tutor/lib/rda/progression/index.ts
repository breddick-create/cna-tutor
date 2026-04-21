import type { User } from "@supabase/supabase-js";

import { rdaDomains } from "@/content/rda/domains";
import type { RDADomainPerformance } from "@/lib/rda/readiness/engine";
import { createRdaAdminClient } from "@/lib/rda/supabase";

export type RdaPretestStatus = {
  completed: boolean;
  domainBreakdown: RDADomainPerformance[];
};

function emptyRdaPretestBreakdown(): RDADomainPerformance[] {
  return rdaDomains.map((domain) => ({
    domainSlug: domain.slug,
    domainTitle: domain.title,
    correctCount: 0,
    totalQuestions: 0,
    percent: 0,
  }));
}

export function getRdaPretestScore(user: User) {
  const raw = user.user_metadata?.rda_pretest_score;
  return typeof raw === "number" ? raw : null;
}

function parseRdaPretestDomainBreakdown(raw: unknown): RDADomainPerformance[] {
  if (!Array.isArray(raw)) {
    return emptyRdaPretestBreakdown();
  }

  const parsed = raw
    .map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
      const domainSlug = typeof entry.domainSlug === "string" ? entry.domainSlug : "";
      const domain = rdaDomains.find((item) => item.slug === domainSlug);
      if (!domain) return null;
      return {
        domainSlug: domain.slug,
        domainTitle: domain.title,
        correctCount: typeof entry.correctCount === "number" ? entry.correctCount : 0,
        totalQuestions: typeof entry.totalQuestions === "number" ? entry.totalQuestions : 0,
        percent: typeof entry.percent === "number" ? entry.percent : 0,
      };
    })
    .filter((entry): entry is RDADomainPerformance => Boolean(entry));

  return parsed.length ? parsed : emptyRdaPretestBreakdown();
}

export async function getRdaPretestStatus(user: User): Promise<RdaPretestStatus> {
  const metadataCompleted = typeof user.user_metadata?.rda_pretest_completed_at === "string";

  if (metadataCompleted) {
    return {
      completed: true,
      domainBreakdown: parseRdaPretestDomainBreakdown(user.user_metadata?.rda_pretest_domain_breakdown),
    };
  }

  const admin = createRdaAdminClient();
  const { data } = await admin
    .from("rda_pretest_results")
    .select("domain_scores")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    completed: Boolean(data),
    domainBreakdown: parseRdaPretestDomainBreakdown(data?.domain_scores),
  };
}

export async function hasCompletedRdaPretest(user: User) {
  const status = await getRdaPretestStatus(user);
  return status.completed;
}

export async function getRdaPretestDomainBreakdown(user: User): Promise<RDADomainPerformance[]> {
  const status = await getRdaPretestStatus(user);
  return status.domainBreakdown;
}

export async function getRdaStudentAuthRedirectPathForUser(args: { user: User }) {
  if (!(await hasCompletedRdaPretest(args.user))) {
    return "/rda/pretest";
  }

  return "/rda/dashboard";
}
