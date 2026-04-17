"use server";

import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

function buildRedirect(message: string) {
  return `/admin/access?message=${encodeURIComponent(message)}`;
}

export async function promoteUserToAdminAction(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    redirect(buildRedirect("Enter the email address for the account you want to promote."));
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    redirect(buildRedirect("We couldn't load user accounts right now. Please try again."));
  }

  const authUser = data.users.find((user) => user.email?.toLowerCase() === email);

  if (!authUser) {
    redirect(buildRedirect("No account with that email was found yet."));
  }

  const updateResult = await admin.auth.admin.updateUserById(authUser.id, {
    user_metadata: {
      ...authUser.user_metadata,
      role: "admin",
    },
  });

  if (updateResult.error) {
    redirect(buildRedirect("We couldn't promote that account to admin. Please try again."));
  }

  const now = new Date().toISOString();
  const { error: profileError } = await admin
    .from("profiles")
    .update({
      role: "admin",
      updated_at: now,
    })
    .eq("id", authUser.id);

  if (profileError) {
    redirect(buildRedirect("The auth role updated, but the profile role did not. Please try again."));
  }

  redirect(buildRedirect(`${authUser.email ?? email} is now an admin.`));
}
