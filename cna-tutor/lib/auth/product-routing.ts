import type { User } from "@supabase/supabase-js";

import { getStudentAuthRedirectPathForUser as getCcmaStudentAuthRedirectPathForUser } from "@/lib/ccma/progression/stage";
import { getStudentAuthRedirectPathForUser as getCnaStudentAuthRedirectPathForUser } from "@/lib/progression/stage";

export type ProductTrack = "cna" | "ccma";

export const PRODUCT_TRACK_OPTIONS: Array<{
  value: ProductTrack;
  label: string;
  shortLabel: string;
}> = [
  { value: "cna", label: "CNA Tutor", shortLabel: "CNA" },
  { value: "ccma", label: "CCMA Tutor", shortLabel: "CCMA" },
];

export function resolveProductTrack(value: unknown): ProductTrack {
  return value === "ccma" ? "ccma" : "cna";
}

export function isProductTrack(value: unknown): value is ProductTrack {
  return value === "cna" || value === "ccma";
}

export function getProductAdminPath(product: ProductTrack) {
  if (product === "ccma") return "/ccma-admin";
  return "/admin";
}

export function getProductDashboardPath(product: ProductTrack) {
  if (product === "ccma") return "/ccma/dashboard";
  return "/dashboard";
}

export function getProductPretestPath(product: ProductTrack) {
  if (product === "ccma") return "/ccma/pretest";
  return "/pretest";
}

export function getProductSignInPath(product: ProductTrack) {
  if (product === "ccma") return "/sign-in?product=ccma";
  return "/sign-in?product=cna";
}

export async function resolveEffectiveProductTrack(args: {
  userId: string;
  selectedProduct?: ProductTrack | null;
  profileProduct?: unknown;
}): Promise<ProductTrack> {
  if (args.selectedProduct) {
    return args.selectedProduct;
  }

  return isProductTrack(args.profileProduct) ? args.profileProduct : "cna";
}

export async function persistUserProductTrack(args: {
  user: User;
  product: ProductTrack;
}) {
  const { createAdminClient } = await import("@/lib/supabase/admin");
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
