"use server";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function buildRedirect(path: string, message: string) {
  const encoded = encodeURIComponent(message);
  return `${path}?message=${encoded}`;
}

export async function signInAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    redirect(buildRedirect("/sign-in", "Enter your username and password."));
  }

  const adminClient = createAdminClient();

  // Resolve username to the stored auth email
  const { data: authEmail, error: lookupError } = await adminClient
  .rpc("get_email_by_username" as never, { p_username: username } as never);

  if (lookupError || !authEmail) {
    redirect(buildRedirect("/sign-in", "Invalid username or password."));
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({ email: authEmail as string, password });

  if (error) {
    redirect(buildRedirect("/sign-in", "Invalid username or password."));
  }

  if (user) {
    const now = new Date().toISOString();
    await adminClient
      .from("ccma_profiles")
      .update({
        last_login_at: now,
        last_activity_at: now,
      })
      .eq("id", user.id);
  }

  redirect("/");
}

export async function signUpAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const cohort = String(formData.get("cohort") ?? "").trim();

  if (!username || !password || !fullName) {
    redirect(buildRedirect("/sign-up", "Name, username, and password are required."));
  }

  if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
    redirect(
      buildRedirect(
        "/sign-up",
        "Username must be 3–30 characters and may only contain letters, numbers, dots, hyphens, and underscores.",
      ),
    );
  }

  const adminClient = createAdminClient();

  const { data: existing } = await adminClient
    .from("ccma_profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    redirect(buildRedirect("/sign-up", "That username is already taken."));
  }

  // Supabase Auth requires an email; use a synthetic one users never see
  const syntheticEmail = `${username}@ccma.internal`;

  const { error } = await adminClient.auth.admin.createUser({
    email: syntheticEmail,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      username,
      cohort,
      role: "student",
    },
  });

  if (error) {
    redirect(buildRedirect("/sign-up", error.message));
  }

  redirect(
    buildRedirect("/sign-in", "Account created! Sign in with your username and password."),
  );
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
