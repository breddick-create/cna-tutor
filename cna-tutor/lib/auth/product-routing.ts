import type { User } from "@supabase/supabase-js";

import { getStudentAuthRedirectPathForUser as getCcmaStudentAuthRedirectPathForUser } from "@/lib/ccma/progression/stage";
import { getStudentAuthRedirectPathForUser as getCnaStudentAuthRedirectPathForUser } from "@/lib/progression/stage";
import { getRdaStudentAuthRedirectPathForUser } from "@/lib/rda/progression";
import { createAdminClient } from "@/lib/supabase/admin";

export type ProductTrack = "cna" | "ccma" | "rda";

export const PRODUCT_TRACK_OPTIONS: Array<{
  value: ProductTrack;
  label: string;
  shortLabel: string;
}> = [
  { value: "cna", label: "CNA Tutor", shortLabel: "CNA" },
  { value: "ccma", label: "CCMA Tutor", shortLabel: "CCMA" },
  { value: "rda", label: "RDA Tutor", shortLabel: "RDA" },
];

export function resolveProductTrack(value: unknown): ProductTrack {
  return value === "ccma" || value === "rda" ? value : "cna";
}

export function isProductTrack(value: unknown): value is ProductTrack {
  return value === "cna" || value === "ccma" || value === "rda";
}

export function getProductAdminPath(product: ProductTrack) {
  if (product === "ccma") return "/ccma-admin";
  if (product === "rda") return "/rda-admin";
  return "/admin";
}

export function getProductDashboardPath(product: ProductTrack) {
  if (product === "ccma") return "/ccma/dashboard";
  if (product === "rda") return "/rda/dashboard";
  return "/dashboard";
}

export function getProductPretestPath(product: ProductTrack) {
  if (product === "ccma") return "/ccma/pretest";
  if (product === "rda") return "/rda/pretest";
  return "/pretest";
}

export function getProductSignInPath(product: ProductTrack) {
  if (product === "rda") return "/sign-in?product=rda";
  if (product === "ccma") return "/sign-in?product=ccma";
  return "/sign-in?product=cna";
}

export async function hasRdaProductEvidence(userId: string) {
  const admin = createAdminClient();
  const [{ data: rdaProfile }, { data: rdaPretest }] = await Promise.all([
    admin
      .from("rda_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle(),
    admin
      .from("rda_pretest_results")
      .select("user_id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle(),
  ]);

  return Boolean(rdaProfile || rdaPretest);
}

export async function resolveEffectiveProductTrack(args: {
  userId: string;
  selectedProduct?: ProductTrack | null;
  profileProduct?: unknown;
}): Promise<ProductTrack> {
  if (args.selectedProduct) {
    return args.selectedProduct;
  }

  const savedProduct = isProductTrack(args.profileProduct) ? args.profileProduct : "cna";

  if (savedProduct === "cna" && (await hasRdaProductEvidence(args.userId))) {
    return "rda";
  }

  return savedProduct;
}

export async function persistUserProductTrack(args: {
  user: User;
  product: ProductTrack;
}) {
  const admin = createAdminClient();
  const now = new Date().toISOString();

  await admin.auth.admin.updateUserById(args.user.id, {
    user_metadata: {
      ...args.user.user_metadata,
      product: args.product,
    },
  });

  await admin
    .from("profiles")
    .update({
      product: args.product,
      last_activity_at: now,
    })
    .eq("id", args.user.id);
}

export async function getStudentAuthRedirectPathForProduct(args: {
  product: ProductTrack;
  user: User;
  userId: string;
}) {
  if (args.product === "rda") {
    return getRdaStudentAuthRedirectPathForUser({ user: args.user });
  }

  if (args.product === "ccma") {
    return getCcmaStudentAuthRedirectPathForUser({
      user: args.user,
      userId: args.userId,
    });
  }

  return getCnaStudentAuthRedirectPathForUser({
    user: args.user,
    userId: args.userId,
  });
}
