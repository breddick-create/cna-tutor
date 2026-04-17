import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { resolvePreferredLanguage } from "@/lib/ccma/i18n/languages";
import { createCcmaAdminClient, createCcmaClient } from "@/lib/ccma/supabase";

export type CcmaProfile = {
  id: string;
  role: "student" | "admin";
  product: "cna" | "ccma";
  full_name: string;
  email: string;
  cohort: string | null;
  preferred_language: string;
  study_goal_hours: number;
  last_login_at: string | null;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CcmaViewer = {
  user: User;
  profile: CcmaProfile;
};

function buildProfilePayload(user: User, overrides?: Partial<CcmaProfile>) {
  const fullName =
    typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : (user.email?.split("@")[0] ?? "Student");

  const cohort =
    typeof user.user_metadata?.cohort === "string" && user.user_metadata.cohort.trim()
      ? user.user_metadata.cohort.trim()
      : null;

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: fullName,
    cohort,
    role: user.user_metadata?.role === "admin" ? "admin" : "student",
    product: "ccma",
    preferred_language: resolvePreferredLanguage(user.user_metadata?.preferred_language),
    study_goal_hours: 40,
    ...overrides,
  };
}

export async function ensureCcmaProfileForUser(user: User, roleOverride?: "student" | "admin") {
  const admin = createCcmaAdminClient();
  const payload = buildProfilePayload(user, roleOverride ? { role: roleOverride } : undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    console.error("Failed to ensure CCMA profile", { userId: user.id, error });
    return null;
  }

  return data as CcmaProfile;
}

export const getCcmaViewer = cache(async (): Promise<CcmaViewer | null> => {
  const supabase = await createCcmaClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawProfile } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("product", "ccma")
    .single();

  const profile: CcmaProfile | null =
    rawProfile ?? (await ensureCcmaProfileForUser(user));

  if (!profile) {
    return null;
  }

  return {
    user,
    profile: profile as CcmaProfile,
  };
});

export async function requireCcmaViewer() {
  const viewer = await getCcmaViewer();

  if (!viewer) {
    redirect("/ccma/sign-in");
  }

  return viewer;
}

export async function requireCcmaAdmin() {
  const viewer = await requireCcmaViewer();

  if (viewer.profile.role !== "admin") {
    redirect("/ccma/dashboard");
  }

  return viewer;
}

