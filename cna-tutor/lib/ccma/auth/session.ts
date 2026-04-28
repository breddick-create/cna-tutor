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
  const payload = buildProfilePayload(user, roleOverride ? { role: roleOverride } : undefined);

  // Try authenticated user client first (satisfies RLS auth.uid() = id policies)
  const userClient = await createCcmaClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userData } = await (userClient as any)
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (userData) return userData as CcmaProfile;

  // Fall back to admin client (service_role bypasses RLS)
  const admin = createCcmaAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    console.error("Failed to ensure CCMA profile", { userId: user.id, error });

    // Last-resort: the upsert can return an error while the row still exists
    // (e.g. a DB trigger created it between our read and write).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (admin as any)
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (existing) return existing as CcmaProfile;

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
    .maybeSingle();

  const profile: CcmaProfile | null =
    rawProfile?.product === "ccma"
      ? rawProfile
      : user.user_metadata?.product === "ccma"
        ? await ensureCcmaProfileForUser(user)
        : null;

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
