"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { isValidStaffAccessToken } from "@/lib/auth/staff-access";
import {
  ensureProfileForUser,
  resolveProductFromMetadata,
} from "@/lib/auth/session";
import {
  getProductAdminPath,
  getStudentAuthRedirectPathForProduct,
  isProductTrack,
  resolveEffectiveProductTrack,
  resolveProductTrack,
  type ProductTrack,
} from "@/lib/auth/product-routing";
import { resolveAppUrl } from "@/lib/app-url";
import { env } from "@/lib/env";
import { resolvePreferredLanguage } from "@/lib/i18n/languages";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function buildRedirect(path: string, message: string) {
  const encoded = encodeURIComponent(message);
  return `${path}?message=${encoded}`;
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

function buildStaffSetupRedirect(message: string, inviteToken?: string) {
  const encoded = encodeURIComponent(message);
  const invite = inviteToken ? `&invite=${encodeURIComponent(inviteToken)}` : "";
  return `/staff-setup?message=${encoded}${invite}`;
}

function getFriendlySignInMessage() {
  return "We couldn't sign you in. Check your email and password, then try again.";
}

function getFriendlySignUpMessage(message: string) {
  if (message.toLowerCase().includes("already")) {
    return "That email is already in use. Try signing in instead.";
  }

  return "We couldn't create your account. Check your information and try again.";
}

function getFriendlyPasswordResetMessage() {
  return "We couldn't send the reset link right now. Try again in a moment.";
}

function getFriendlyStaffSetupMessage(message: string) {
  if (message.toLowerCase().includes("already")) {
    return "That email is already in use. Try signing in with the staff account instead.";
  }

  return "We couldn't create the staff account. Check the information and try again.";
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const productValue = formData.get("product");
  const selectedProduct = isProductTrack(productValue) ? productValue : null;

  if (!email || !password) {
    redirect(buildRedirect("/sign-in", "Enter your email and password."));
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(buildRedirect("/sign-in", getFriendlySignInMessage()));
  }

  if (user) {
    const admin = createAdminClient();
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("product")
      .eq("id", user.id)
      .maybeSingle();
    const effectiveProduct = await resolveEffectiveProductTrack({
      userId: user.id,
      selectedProduct,
      profileProduct: existingProfile?.product,
    });

    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        product: effectiveProduct,
      },
    });

    const profile = await ensureProfileForUser(user, supabase, { product: effectiveProduct });

    if (!profile) {
      redirect(buildRedirect("/sign-in", "We couldn't load your profile. Please try again."));
    }

    const now = new Date().toISOString();

    await admin
      .from("profiles")
      .update({
        product: effectiveProduct,
        last_login_at: now,
        last_activity_at: now,
      })
      .eq("id", user.id);

    if (profile.role === "admin") {
      redirect(getProductAdminPath(effectiveProduct));
    }

    const redirectPath = await getStudentAuthRedirectPathForProduct({
      product: effectiveProduct,
      user,
      userId: user.id,
    });

    redirect(redirectPath);
  }

  redirect("/");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const cohort = String(formData.get("cohort") ?? "").trim();
  const preferredLanguage = resolvePreferredLanguage(formData.get("preferred_language"));
  const productValue = formData.get("product");
  const product = resolveProductTrack(productValue);
  const headerStore = await headers();
  const appUrl = resolveAppUrl(headerStore);

  if (!email || !password || !fullName) {
    redirect(buildRedirect("/sign-up", "Enter your name, email, and password to create your account."));
  }

  const supabase = await createClient();
  const {
    data: signUpData,
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: {
        full_name: fullName,
        cohort,
        preferred_language: preferredLanguage,
        role: "student",
        product,
      },
    },
  });

  if (error) {
    redirect(buildRedirect("/sign-up", getFriendlySignUpMessage(error.message)));
  }

  if (signUpData.user) {
    await ensureProfileForUser(signUpData.user, supabase, { product });
    const admin = createAdminClient();
    const { error: profileUpdateError } = await admin
      .from("profiles")
      .update({
        product,
        cohort: cohort || null,
        preferred_language: preferredLanguage,
      })
      .eq("id", signUpData.user.id);

    if (isMissingPreferredLanguageColumn(profileUpdateError)) {
      await admin
        .from("profiles")
        .update({
          product,
          cohort: cohort || null,
        })
        .eq("id", signUpData.user.id);
    }

  }

  if (signUpData.session && signUpData.user) {
    redirect(
      await getStudentAuthRedirectPathForProduct({
        product: resolveProductFromMetadata(signUpData.user.user_metadata?.product),
        user: signUpData.user,
        userId: signUpData.user.id,
      }),
    );
  }

  redirect(
    buildRedirect(
      "/sign-in",
      "Your account is ready. Sign in to start your pre-test and study plan.",
    ),
  );
}

export async function staffSetupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const inviteToken = String(formData.get("invite_token") ?? "").trim();
  const headerStore = await headers();
  const appUrl = resolveAppUrl(headerStore);

  if (!isValidStaffAccessToken(inviteToken)) {
    redirect("/sign-in");
  }

  if (!email || !password || !fullName) {
    redirect(
      buildStaffSetupRedirect(
        "Enter your name, email, and password to create the staff account.",
        inviteToken,
      ),
    );
  }

  if (!env.adminSignUpCode) {
    redirect(
      buildStaffSetupRedirect(
        "Staff setup is not available right now. Ask your team for the current staff account process.",
        inviteToken,
      ),
    );
  }

  const supabase = await createClient();
  const {
    data: signUpData,
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: {
        full_name: fullName,
        role: "admin",
      },
    },
  });

  if (error) {
    redirect(buildStaffSetupRedirect(getFriendlyStaffSetupMessage(error.message), inviteToken));
  }

  if (signUpData.user) {
    await ensureProfileForUser(signUpData.user, supabase, { product: "cna" });
  }

  if (signUpData.session) {
    redirect("/admin");
  }

  redirect(buildRedirect("/sign-in", "Your staff account is ready. Sign in to continue."));
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const headerStore = await headers();
  const appUrl = resolveAppUrl(headerStore);

  if (!email) {
    redirect(buildRedirect("/forgot-password", "Enter the email address for your account."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect(buildRedirect("/forgot-password", getFriendlyPasswordResetMessage()));
  }

  redirect(
    buildRedirect(
      "/sign-in",
      "If that email is in the system, we sent a password reset link.",
    ),
  );
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
