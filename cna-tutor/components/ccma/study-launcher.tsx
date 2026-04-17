"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLanguage } from "@/components/ccma/language-context";
import { getTutorModeLabel } from "@/lib/ccma/tutor/mode-labels";
import type { TutorMode } from "@/lib/ccma/tutor/types";

type CreateSessionErrorResponse = {
  error?: string;
};

export function StudyLauncher({
  lessonId,
  supportedModes,
  defaultMode,
  initialMode,
  hideModeSelector = false,
  ctaLabel,
}: {
  lessonId: string;
  supportedModes: TutorMode[];
  defaultMode: TutorMode;
  initialMode?: TutorMode;
  hideModeSelector?: boolean;
  ctaLabel?: string;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<TutorMode>(
    initialMode && supportedModes.includes(initialMode) ? initialMode : defaultMode,
  );
  const modeDescriptions: Record<TutorMode, string> = {
    learn: t({
      en: "Tutor-led teaching with explanation, questions, and correction.",
      es: "Ensenanza guiada por el tutor con explicacion, preguntas y correccion.",
    }),
    quiz: t({
      en: "Short guided checkpoint inside the lesson. Use the separate topic quiz for the randomized 10-question assessment.",
      es: "Revision guiada corta dentro de la leccion. Usa el quiz separado del tema para la evaluacion aleatoria de 10 preguntas.",
    }),
    mock_exam: t({
      en: "Reserved for longer simulated testing flows.",
      es: "Reservado para simulaciones de examen mas largas.",
    }),
    weak_area_review: t({
      en: "Extra reteaching on concepts you have missed before.",
      es: "Repaso extra de conceptos que ya has fallado antes.",
    }),
    study_plan: t({
      en: "Reserved for guided planning and pacing support.",
      es: "Reservado para apoyo de planificacion y ritmo guiado.",
    }),
    rapid_review: t({
      en: "Fast, high-yield reminders and quick checks before you move on.",
      es: "Recordatorios rapidos de alto rendimiento y revisiones cortas antes de seguir.",
    }),
  };
  const buttonLabels: Record<TutorMode, string> = {
    learn: t({ en: "Start guided lesson", es: "Iniciar leccion guiada" }),
    quiz: t({ en: "Start guided check", es: "Iniciar revision guiada" }),
    mock_exam: t({ en: "Start guided lesson", es: "Iniciar leccion guiada" }),
    weak_area_review: t({ en: "Start weak-area review", es: "Iniciar repaso de area debil" }),
    study_plan: t({ en: "Start guided lesson", es: "Iniciar leccion guiada" }),
    rapid_review: t({ en: "Start rapid review", es: "Iniciar repaso rapido" }),
  };

  async function handleStart() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/ccma/tutor/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId, mode: selectedMode }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as CreateSessionErrorResponse | null;
        throw new Error(
          payload?.error ??
            t({
              en: "We couldn't start that lesson. Try again.",
              es: "No pudimos iniciar esa leccion. Intentalo de nuevo.",
            }),
        );
      }

      const data = (await response.json()) as { sessionId: string };
      router.push(`/ccma/study/${data.sessionId}`);
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : t({
              en: "We couldn't start that lesson. Try again.",
              es: "No pudimos iniciar esa leccion. Intentalo de nuevo.",
            }),
      );
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      {!hideModeSelector && supportedModes.length > 1 ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor={`mode-${lessonId}`}>
            {t({ en: "Lesson mode", es: "Modo de leccion" })}
          </label>
          <select
            className="input-base"
            id={`mode-${lessonId}`}
            onChange={(event) => setSelectedMode(event.target.value as TutorMode)}
            value={selectedMode}
          >
            {supportedModes.map((mode) => (
              <option key={mode} value={mode}>
                {getTutorModeLabel(mode)}
              </option>
            ))}
          </select>
          <p className="text-muted text-sm leading-6">{modeDescriptions[selectedMode]}</p>
        </div>
      ) : null}

      <button className="button-primary w-full" disabled={pending} onClick={handleStart} type="button">
        {pending
          ? t({ en: "Starting lesson...", es: "Iniciando leccion..." })
          : ctaLabel ?? buttonLabels[selectedMode]}
      </button>
      {error ? (
        <div className="rounded-[1.25rem] border border-[rgba(166,60,47,0.18)] bg-[rgba(166,60,47,0.08)] px-4 py-3">
          <p className="text-sm font-medium text-[color:var(--danger)]">{error}</p>
          <p className="mt-2 text-sm leading-6">
            {t({
              en: "Try again, or use support if the lesson still will not open.",
              es: "Intentalo de nuevo o usa soporte si la leccion todavia no abre.",
            })}
          </p>
        </div>
      ) : null}
    </div>
  );
}



