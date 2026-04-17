"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function buildRedirect(path: string, message: string) {
  const encoded = encodeURIComponent(message);
  return `${path}?message=${encoded}`;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(buildRedirect("/sign-in", "Enter your email and password."));
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(buildRedirect("/sign-in", error.message));
  }

  if (user) {
    const now = new Date().toISOString();
    await createAdminClient()
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
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const cohort = String(formData.get("cohort") ?? "").trim();
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  if (!email || !password || !fullName) {
    redirect(buildRedirect("/sign-up", "Name, email, and password are required."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
      data: {
        full_name: fullName,
        cohort,
        role: "student",
      },
    },
  });

  if (error) {
    redirect(buildRedirect("/sign-up", error.message));
  }

  redirect(
    buildRedirect(
      "/sign-in",
      "Account created. Check your email to confirm your account, then sign in.",
    ),
  );
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
