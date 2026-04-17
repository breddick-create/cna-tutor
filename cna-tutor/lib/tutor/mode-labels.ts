import type { TutorMode } from "@/lib/tutor/types";
import type { SupportedLanguage } from "@/lib/i18n/languages";

const tutorModeLabels: Record<TutorMode, { en: string; es: string }> = {
  learn: { en: "Learn mode", es: "Modo de aprendizaje" },
  quiz: { en: "Guided check", es: "Revision guiada" },
  mock_exam: { en: "Mock exam", es: "Examen de practica" },
  weak_area_review: { en: "Weak-area review", es: "Repaso de area debil" },
  study_plan: { en: "Study plan", es: "Plan de estudio" },
  rapid_review: { en: "Rapid review", es: "Repaso rapido" },
};

export function getTutorModeLabel(mode: TutorMode, language: SupportedLanguage = "en") {
  return tutorModeLabels[mode][language];
}
