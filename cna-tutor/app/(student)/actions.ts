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
  revalidatePath("/written");
  revalidatePath("/skills");

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

export async function recordCnaSkillPracticeAction(formData: FormData) {
  const skillSlug = String(formData.get("skill_slug") ?? "").trim();
  const mode = String(formData.get("mode") ?? "").trim();
  const returnPath = String(formData.get("return_path") ?? "/skills").trim() || "/skills";

  if (!skillSlug || (mode !== "walkthrough" && mode !== "timed")) {
    redirect(buildRedirect(returnPath, "We couldn't save that skill practice update. Try again."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(buildRedirect("/sign-in", "Please sign in again to keep tracking your skills progress."));
  }

  const { data: existing } = await supabase
    .from("cna_skill_progress")
    .select(
      "id, mastery_score, walkthrough_completions, timed_practice_completions",
    )
    .eq("user_id", user.id)
    .eq("skill_slug", skillSlug)
    .maybeSingle();

  const walkthroughCompletions =
    (existing?.walkthrough_completions ?? 0) + (mode === "walkthrough" ? 1 : 0);
  const timedPracticeCompletions =
    (existing?.timed_practice_completions ?? 0) + (mode === "timed" ? 1 : 0);
  const targetMastery =
    mode === "timed"
      ? Math.min(100, 72 + timedPracticeCompletions * 8 + walkthroughCompletions * 3)
      : Math.min(100, 48 + walkthroughCompletions * 7 + timedPracticeCompletions * 4);
  const masteryScore = Math.max(existing?.mastery_score ?? 0, targetMastery);

  const { error } = await supabase
    .from("cna_skill_progress")
    .upsert(
      {
        id: existing?.id,
        user_id: user.id,
        skill_slug: skillSlug,
        mastery_score: masteryScore,
        walkthrough_completions: walkthroughCompletions,
        timed_practice_completions: timedPracticeCompletions,
        last_practiced_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,skill_slug",
      },
    );

  if (error) {
    redirect(buildRedirect(returnPath, "We couldn't save your skills progress. Try again."));
  }

  await supabase.from("activity_events").insert({
    user_id: user.id,
    event_type: "cna_skill_practice_completed",
    metadata_json: {
      skillSlug,
      mode,
      masteryScore,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/skills");
  revalidatePath(returnPath);

  redirect(
    buildRedirect(
      returnPath,
      mode === "timed"
        ? "Timed practice saved. Your skills readiness just updated."
        : "Walkthrough practice saved. Keep going with the next skill step.",
    ),
  );
}
