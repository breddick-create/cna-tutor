"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { pickLocalizedText, resolvePreferredLanguage } from "@/lib/i18n/languages";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function buildRedirect(path: string, message: string) {
  return `${path}?message=${encodeURIComponent(message)}`;
}

export async function updateLanguagePreferenceAction(formData: FormData) {
  const preferredLanguage = resolvePreferredLanguage(formData.get("preferred_language"));
  const supabase = await createClient();
  const admin = createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(
      buildRedirect(
        "/sign-in",
        pickLocalizedText(preferredLanguage, {
          en: "Please sign in again to update your tutor language.",
          es: "Vuelve a iniciar sesion para actualizar el idioma de tu tutor.",
        }),
      ),
    );
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      preferred_language: preferredLanguage,
    },
  });

  if (authError) {
    redirect(
      buildRedirect(
        "/dashboard",
        pickLocalizedText(preferredLanguage, {
          en: "We couldn't update your tutor language. Try again.",
          es: "No pudimos actualizar el idioma de tu tutor. Intentalo de nuevo.",
        }),
      ),
    );
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      preferred_language: preferredLanguage,
    })
    .eq("id", user.id);

  if (profileError) {
    const { error: adminProfileError } = await admin
      .from("profiles")
      .update({
        preferred_language: preferredLanguage,
      })
      .eq("id", user.id);

    if (adminProfileError) {
      redirect(
        buildRedirect(
          "/dashboard",
          pickLocalizedText(preferredLanguage, {
            en: "We couldn't save your tutor language. Try again.",
            es: "No pudimos guardar el idioma de tu tutor. Intentalo de nuevo.",
          }),
        ),
      );
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/study");
  revalidatePath("/study-plan");
  revalidatePath("/quiz");
  revalidatePath("/mock-exam");

  redirect(
    buildRedirect(
      "/dashboard",
      pickLocalizedText(preferredLanguage, {
        en: "Your tutor language was updated.",
        es: "Se actualizo el idioma de tu tutor.",
      }),
    ),
  );
}
