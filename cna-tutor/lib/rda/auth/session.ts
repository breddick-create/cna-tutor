import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import {
  ensureProfileForUser,
  resolveProductFromMetadata,
  resolveProductFromProfile,
} from "@/lib/auth/session";
import { resolveEffectiveProductTrack } from "@/lib/auth/product-routing";
import { resolvePreferredLanguage } from "@/lib/i18n/languages";
import { createRdaAdminClient, createRdaClient } from "@/lib/rda/supabase";
import type { Database } from "@/types/database";

export type RdaProfile = Database["public"]["Tables"]["profiles"]["Row"] & {
  product: "rda";
};

export type RdaViewer = {
  user: User;
  profile: RdaProfile;
};

function buildProfilePayload(user: User, roleOverride?: "student" | "admin") {
  return {
    role: roleOverride ?? (user.user_metadata?.role === "admin" ? "admin" : "student"),
    product: "rda",
    preferred_language: resolvePreferredLanguage(user.user_metadata?.preferred_language),
  } as const;
}

export async function ensureRdaProfileForUser(user: User, roleOverride?: "student" | "admin") {
  const profile = await ensureProfileForUser(user, undefined, buildProfilePayload(user, roleOverride));

  if (!profile) {
    console.error("Failed to ensure RDA profile", { userId: user.id });
    return null;
  }

  const admin = createRdaAdminClient();
  await admin
    .from("rda_profiles")
    .upsert(
      {
        user_id: user.id,
        full_name: profile.full_name,
        language_preference: resolvePreferredLanguage(profile.preferred_language),
        school_or_program: profile.cohort,
      },
      { onConflict: "user_id" },
    );

  return profile as RdaProfile;
}

export const getRdaViewer = cache(async (): Promise<RdaViewer | null> => {
  const supabase = await createRdaClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: rawProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const metadataProduct = resolveProductFromMetadata(user.user_metadata?.product);
  const effectiveProduct = await resolveEffectiveProductTrack({
    userId: user.id,
    // Trust metadata when it says rda — handles new users whose profile hasn't been updated yet
    selectedProduct: metadataProduct !== "cna" ? metadataProduct : null,
    profileProduct: rawProfile?.product ?? metadataProduct,
  });

  const profile =
    effectiveProduct !== "rda"
      ? null
      : rawProfile && resolveProductFromProfile(rawProfile) === "rda"
        ? rawProfile
        : await ensureRdaProfileForUser(user);
  if (!profile) return null;

  return { user, profile: profile as RdaProfile };
});

export async function requireRdaViewer() {
  const viewer = await getRdaViewer();
  if (!viewer) redirect("/sign-in?product=rda");
  return viewer;
}

export async function requireRdaAdmin() {
  const viewer = await requireRdaViewer();
  if (viewer.profile.role !== "admin") redirect("/rda/dashboard");
  return viewer;
}
