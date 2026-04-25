"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export type UpdateStudentPasswordState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const initialUpdateStudentPasswordState: UpdateStudentPasswordState = {
  status: "idle",
  message: null,
};

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Use at least 8 characters.";
  }

  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Include at least one letter and one number.";
  }

  return null;
}

export async function updateStudentPasswordAction(
  _previousState: UpdateStudentPasswordState,
  formData: FormData,
): Promise<UpdateStudentPasswordState> {
  await requireAdmin();

  const userId = String(formData.get("user_id") ?? "").trim();
  const newPassword = String(formData.get("new_password") ?? "").trim();

  if (!userId || !newPassword) {
    return {
      status: "error",
      message: "Enter a new password before saving.",
    };
  }

  const passwordError = validatePassword(newPassword);

  if (passwordError) {
    return {
      status: "error",
      message: passwordError,
    };
  }

  const admin = createAdminClient();
  const { data: studentProfile, error: profileError } = await admin
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", userId)
    .single();

  if (profileError || !studentProfile || studentProfile.role !== "student") {
    return {
      status: "error",
      message: "We couldn't find that student account.",
    };
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (updateError) {
    return {
      status: "error",
      message: "We couldn't update that password right now. Try again.",
    };
  }

  revalidatePath("/admin");

  return {
    status: "success",
    message: `${studentProfile.full_name}'s password was updated. Share it with the student securely.`,
  };
}
