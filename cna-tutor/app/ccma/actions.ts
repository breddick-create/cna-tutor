"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { resolveAppUrl } from "@/lib/app-url";
import { resolvePreferredLanguage } from "@/lib/ccma/i18n/languages";
import {
  ensureCcmaProfileForUser,
  getCcmaViewer,
} from "@/lib/ccma/auth/session";
import {
  isValidCcmaStaffAccessToken,
} from "@/lib/ccma/auth/staff-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function buildRedirect(path: string, message: string) {
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}message=${encodeURIComponent(message)}`;
}

export async function ccmaSignInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(buildRedirect("/ccma/sign-in", "Enter your email and password."));
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !user) {
    redirect(
      buildRedirect(
        "/ccma/sign-in",
        "We couldn't sign you in. Check your email and password, then try again.",
      ),
    );
  }

  const profile = await ensureCcmaProfileForUser(user);

  if (!profile) {
    redirect(
      buildRedirect(
        "/ccma/sign-in",
        "We couldn't load your CCMA profile. Please try again.",
      ),
    );
  }

  const now = new Date().toISOString();
  await createAdminClient()
    .from("profiles")
    .update({
      product: "ccma",
      last_login_at: now,
      last_activity_at: now,
    })
    .eq("id", user.id);

  redirect(profile.role === "admin" ? "/ccma-admin" : "/ccma/dashboard");
}

export async function ccmaSignUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const cohort = String(formData.get("cohort") ?? "").trim();
  const preferredLanguage = resolvePreferredLanguage(
    formData.get("preferred_language"),
  );
  const appUrl = resolveAppUrl(await headers());

  if (!email || !password || !fullName) {
    redirect(
      buildRedirect(
        "/ccma/sign-up",
        "Enter your name, email, and password to create your account.",
      ),
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: {
        full_name: fullName,
        cohort,
        preferred_language: preferredLanguage,
        role: "student",
        product: "ccma",
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase().includes("already")
      ? "That email is already in use. Try signing in instead."
      : "We couldn't create your account. Check your information and try again.";
    redirect(buildRedirect("/ccma/sign-up", message));
  }

  if (data.user) {
    await ensureCcmaProfileForUser(data.user, "student");
    await createAdminClient()
      .from("profiles")
      .update({
        product: "ccma",
        cohort: cohort || null,
        preferred_language: preferredLanguage,
      })
      .eq("id", data.user.id);
  }

  if (data.session && data.user) {
    redirect("/ccma/pretest");
  }

  redirect(
    buildRedirect(
      "/ccma/sign-in",
      "Your account is ready. Sign in to start the pre-test.",
    ),
  );
}

export async function ccmaStaffSetupAction(formData: FormData) {
  const inviteToken = String(formData.get("invite_token") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const appUrl = resolveAppUrl(await headers());

  if (!isValidCcmaStaffAccessToken(inviteToken)) {
    redirect("/ccma/sign-in");
  }

  if (!email || !password || !fullName) {
    redirect(
      buildRedirect(
        `/ccma/staff-setup?code=${inviteToken}`,
        "Enter your name, email, and password to create the staff account.",
      ),
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: {
        full_name: fullName,
        role: "admin",
        product: "ccma",
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase().includes("already")
      ? "That email is already in use. Try signing in with the staff account instead."
      : "We couldn't create the staff account. Check the information and try again.";
    redirect(
      buildRedirect(`/ccma/staff-setup?code=${inviteToken}`, message),
    );
  }

  if (data.user) {
    await ensureCcmaProfileForUser(data.user, "admin");
    await createAdminClient()
      .from("profiles")
      .update({ product: "ccma", role: "admin" })
      .eq("id", data.user.id);
  }

  if (data.session) {
    redirect("/ccma-admin");
  }

  redirect(
    buildRedirect(
      "/ccma/sign-in",
      "Your staff account is ready. Sign in to continue.",
    ),
  );
}

export async function ccmaSignOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/ccma/sign-in");
}

export async function updateCcmaLanguagePreferenceAction(formData: FormData) {
  const viewer = await getCcmaViewer();

  if (!viewer) {
    redirect("/ccma/sign-in");
  }

  const preferredLanguage = resolvePreferredLanguage(
    formData.get("preferred_language"),
  );

  await createAdminClient()
    .from("profiles")
    .update({ preferred_language: preferredLanguage })
    .eq("id", viewer.user.id)
    .eq("product", "ccma");

  redirect(
    buildRedirect(
      "/ccma/dashboard",
      "Tutor language updated.",
    ),
  );
}
