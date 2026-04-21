import { cache } from "react";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import { resolveProductTrack } from "@/lib/auth/product-routing";
import { resolvePreferredLanguage } from "@/lib/i18n/languages";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ServerSupabaseClient = SupabaseClient<Database>;
type ProfilePayload = ProfileInsert | Omit<ProfileInsert, "preferred_language">;

export type Viewer = {
  user: User;
  profile: Profile;
};

export function resolveProductFromMetadata(value: unknown): "cna" | "ccma" | "rda" {
  return resolveProductTrack(value);
}

export function resolveProductFromProfile(profile: Pick<Profile, "product"> | { product?: unknown }) {
  return resolveProductTrack(profile.product);
}

function buildProfilePayload(
  user: User,
  overrides?: Partial<ProfileInsert>,
): ProfileInsert {
  const fullName =
    typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : (user.email?.split("@")[0] ?? "Student");

  const cohort =
    typeof user.user_metadata?.cohort === "string" && user.user_metadata.cohort.trim()
      ? user.user_metadata.cohort.trim()
      : null;

  const role = user.user_metadata?.role === "admin" ? "admin" : "student";
  const preferredLanguage = resolvePreferredLanguage(user.user_metadata?.preferred_language);
  const product = resolveProductFromMetadata(user.user_metadata?.product);

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: fullName,
    cohort,
    role,
    product,
    preferred_language: preferredLanguage,
    ...overrides,
  };
}

async function upsertProfile(
  client: ServerSupabaseClient,
  payload: ProfilePayload,
): Promise<{ data: Profile | null; error: unknown }> {
  const result = await client
    .from("profiles")
    .upsert(payload as ProfileInsert, { onConflict: "id" })
    .select("*")
    .single();

  return result;
}

function isMissingPreferredLanguageColumn(error: unknown) {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "PGRST204" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.includes("preferred_language")
  );
}

function withoutPreferredLanguage(payload: ProfileInsert): ProfilePayload {
  const { preferred_language: _preferredLanguage, ...fallbackPayload } = payload;
  return fallbackPayload;
}

export async function ensureProfileForUser(
  user: User,
  client?: ServerSupabaseClient,
  overrides?: Partial<ProfileInsert>,
): Promise<Profile | null> {
  const payload = buildProfilePayload(user, overrides);
  const fallbackPayload = withoutPreferredLanguage(payload);

  if (client) {
    const { data, error } = await upsertProfile(client, payload);

    if (data) {
      return data;
    }

    if (isMissingPreferredLanguageColumn(error)) {
      const fallbackResult = await upsertProfile(client, fallbackPayload);
      if (fallbackResult.data) {
        return fallbackResult.data;
      }
    }

    console.error("Authenticated profile repair failed", { userId: user.id, error });
  }

  const admin = createAdminClient();
  let { data, error } = await upsertProfile(admin, payload);

  if (!data && isMissingPreferredLanguageColumn(error)) {
    const fallbackResult = await upsertProfile(admin, fallbackPayload);
    data = fallbackResult.data;
    error = fallbackResult.error;
  }

  if (error) {
    console.error("Failed to ensure profile for user", { userId: user.id, error });
    return null;
  }

  return data;
}

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) {
    return { user, profile };
  }

  const repairedProfile = await ensureProfileForUser(user, supabase);

  if (!repairedProfile) {
    return null;
  }

  return { user, profile: repairedProfile };
});

export async function requireViewer() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/sign-in");
  }

  return viewer;
}

export async function requireAdmin() {
  const viewer = await requireViewer();

  if (viewer.profile.role !== "admin") {
    redirect("/dashboard");
  }

  return viewer;
}
