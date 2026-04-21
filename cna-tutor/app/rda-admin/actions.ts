"use server";

import { revalidatePath } from "next/cache";

import { requireRdaAdmin } from "@/lib/rda/auth/session";
import { createRdaClient } from "@/lib/rda/supabase";

export async function createRdaAdminNote(formData: FormData) {
  const viewer = await requireRdaAdmin();
  const studentId = formData.get("studentId");
  const note = formData.get("note");
  const noteType = formData.get("noteType");

  if (typeof studentId !== "string" || !studentId) return;
  if (typeof note !== "string" || !note.trim()) return;

  const validTypes = ["general", "check_in", "risk", "encouragement", "academic"] as const;
  const resolvedType = validTypes.includes(noteType as (typeof validTypes)[number])
    ? (noteType as (typeof validTypes)[number])
    : "general";

  const supabase = await createRdaClient();
  await supabase.from("rda_admin_notes").insert({
    user_id: studentId,
    admin_user_id: viewer.user.id,
    note: note.trim(),
    note_type: resolvedType,
  });

  revalidatePath("/rda-admin");
}
