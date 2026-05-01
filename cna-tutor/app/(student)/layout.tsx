import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { SearchParamBadgeCelebration } from "@/components/badges/search-param-badge-celebration";
import { LanguageProvider } from "@/components/student/language-context";
import {
  getProductAdminPath,
  getStudentAuthRedirectPathForProduct,
  resolveEffectiveProductTrack,
} from "@/lib/auth/product-routing";
import { requireViewer, resolveProductFromMetadata, resolveProductFromProfile } from "@/lib/auth/session";
import {
  pickLocalizedText,
  resolvePreferredLanguage,
  type SupportedLanguage,
} from "@/lib/i18n/languages";
import {
  canAccessStudentPath,
  getStudentNavigation,
  getStudentStageForUser,
} from "@/lib/progression/stage";

function getStageLabel(language: SupportedLanguage, label: string) {
  const map: Record<string, { en: string; es: string }> = {
    Dashboard: { en: "Dashboard", es: "Panel" },
    "Written Exam": { en: "Written Exam", es: "Examen Escrito" },
    "Clinical Skills": { en: "Clinical Skills", es: "Habilidades Clinicas" },
    "Pre-Test": { en: "Pre-Test", es: "Preevaluacion" },
    "Study Plan": { en: "Study Plan", es: "Plan de estudio" },
    "Practice Exam": { en: "Practice Exam", es: "Examen de practica" },
    "Next Step": { en: "Next Step", es: "Siguiente paso" },
    "Exam Day": { en: "Exam Day", es: "Dia del examen" },
    "Exam Ready": { en: "Exam Ready", es: "Listo para el examen" },
  };

  return pickLocalizedText(language, map[label] ?? { en: label, es: label });
}

function getStageDescription(language: SupportedLanguage, stage: string) {
  const text = {
    pretest_required: {
      en: "Complete the pre-test first so the app can build the right study plan for you.",
      es: "Completa primero la preevaluacion para que la app pueda crear el plan de estudio correcto para ti.",
    },
    study_plan_required: {
      en: "Your pre-test is complete. Review your ranked study plan and begin with the weakest topic first.",
      es: "Tu preevaluacion ya esta completa. Revisa tu plan de estudio ordenado y comienza con el tema mas debil.",
    },
    guided_practice_required: {
      en: "Keep working from weakest to strongest through your study plan and short checkpoints.",
      es: "Sigue trabajando de lo mas debil a lo mas fuerte con tu plan de estudio y revisiones cortas.",
    },
    practice_exam_required: {
      en: "You have built enough foundation. Your next required step is a full practice exam.",
      es: "Ya construiste suficiente base. Tu siguiente paso requerido es un examen completo de practica.",
    },
    readiness_building: {
      en: "Keep following the next required step so your score and full-practice results keep moving in the right direction.",
      es: "Sigue el siguiente paso requerido para que tu puntaje y tus resultados de practica completa sigan avanzando en la direccion correcta.",
    },
    exam_ready: {
      en: "You are in the exam-ready range. Use the exam-day plan and dashboard to stay calm, prepared, and steady.",
      es: "Estas en el rango de listo para el examen. Usa el plan del dia del examen y el panel para mantenerte calmado, preparado y estable.",
    },
  } as const;

  return pickLocalizedText(
    language,
    text[stage as keyof typeof text] ?? {
      en: "Keep moving through your guided study plan.",
      es: "Sigue avanzando en tu plan de estudio guiado.",
    },
  );
}

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await requireViewer();
  const metadataProduct = resolveProductFromMetadata(viewer.user.user_metadata?.product);
  const product = await resolveEffectiveProductTrack({
    userId: viewer.user.id,
    // Trust metadata when it says a non-CNA track — catches CCMA users with stale profile.product
    selectedProduct: metadataProduct !== "cna" ? metadataProduct : null,
    profileProduct: resolveProductFromProfile(viewer.profile),
  });

  if (viewer.profile.role === "admin") {
    redirect(getProductAdminPath(product));
  }

  if (product !== "cna") {
    redirect(
      await getStudentAuthRedirectPathForProduct({
        product,
        user: viewer.user,
        userId: viewer.user.id,
      }),
    );
  }

  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname");
  const stage = await getStudentStageForUser({
    user: viewer.user,
    userId: viewer.user.id,
  });
  const preferredLanguage = resolvePreferredLanguage(viewer.profile.preferred_language);

  if (pathname && !canAccessStudentPath(pathname, stage)) {
    redirect(stage.nextRequiredPath);
  }

  const navigation = getStudentNavigation(stage).map((item) => ({
    ...item,
    label: getStageLabel(preferredLanguage, item.label),
  }));

  return (
    <LanguageProvider language={preferredLanguage}>
      <SearchParamBadgeCelebration />
      <AppShell
        email={viewer.profile.email}
        navigation={navigation}
        roleLabel={pickLocalizedText(preferredLanguage, {
          en: "Student",
          es: "Estudiante",
        })}
        signOutLabel={pickLocalizedText(preferredLanguage, {
          en: "Sign out",
          es: "Cerrar sesion",
        })}
        subtitle={getStageDescription(preferredLanguage, stage.stage)}
        title={pickLocalizedText(preferredLanguage, {
          en: "CNA Tutor",
          es: "CNA Tutor",
        })}
      >
        {children}
      </AppShell>
    </LanguageProvider>
  );
}
