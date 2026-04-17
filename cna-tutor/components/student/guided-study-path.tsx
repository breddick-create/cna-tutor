"use client";

import type { GuidedStudyModule } from "@/lib/progression/study-path";
import { useLanguage } from "@/components/student/language-context";

function getBadgeClasses(state: GuidedStudyModule["state"]) {
  if (state === "completed") {
    return "bg-[rgba(28,124,104,0.14)] text-[color:var(--brand)]";
  }

  if (state === "current") {
    return "bg-[rgba(217,111,50,0.14)] text-[color:var(--accent)]";
  }

  return "bg-[rgba(29,42,38,0.08)] text-[color:var(--muted)]";
}

function getCardClasses(state: GuidedStudyModule["state"]) {
  if (state === "completed") {
    return "border-[rgba(28,124,104,0.2)] bg-[rgba(255,255,255,0.88)]";
  }

  if (state === "current") {
    return "border-[rgba(217,111,50,0.24)] bg-[rgba(255,247,241,0.92)]";
  }

  return "border-[rgba(29,42,38,0.1)] bg-[rgba(255,255,255,0.56)] opacity-75";
}

export function GuidedStudyPath({
  modules,
  currentModuleTitle,
}: {
  modules: GuidedStudyModule[];
  currentModuleTitle: string | null;
}) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {modules.map((module) => (
        <article
          key={module.domainSlug}
          className={`rounded-[1.5rem] border p-5 transition ${getCardClasses(module.state)}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">
                {module.order}. {module.domainTitle}
              </p>
              <p className="text-muted mt-2 text-sm leading-6">{module.description}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getBadgeClasses(module.state)}`}
            >
              {module.state === "completed"
                ? t({ en: "Completed", es: "Completado" })
                : module.state === "current"
                  ? t({ en: "Current", es: "Actual" })
                  : t({ en: "Locked", es: "Bloqueado" })}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm leading-6">
            <p>
              <span className="font-semibold">{t({ en: "Current score:", es: "Puntaje actual:" })}</span>{" "}
              {module.masteryScore}%
            </p>
            <p>
              <span className="font-semibold">
                {t({ en: "Pre-test baseline:", es: "Base de la preevaluacion:" })}
              </span>{" "}
              {module.baselineScore}%
            </p>
            <p>
              <span className="font-semibold">
                {t({ en: "Why this matters:", es: "Por que importa:" })}
              </span>{" "}
              {module.recommendation}
            </p>
          </div>

          <div className="mt-4 rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4 text-sm leading-6">
            {module.state === "completed" ? (
              <p>
                {t({
                  en: "This module is already behind you in the plan. Come back only if it becomes a weak area again.",
                  es: "Este modulo ya quedo atras en tu plan. Vuelve solo si otra vez se convierte en un area debil.",
                })}
              </p>
            ) : module.state === "current" ? (
              <p>
                {t({
                  en: "Finish this guided lesson first. After that, use the practice quiz and section mock to prove the topic is improving.",
                  es: "Termina primero esta leccion guiada. Despues usa el quiz de practica y el examen por seccion para comprobar que el tema esta mejorando.",
                })}
              </p>
            ) : (
              <p>
                {t({
                  en: `Locked until you finish ${currentModuleTitle ?? "the current module"}. Keep the order intact so your weakest topic gets attention first.`,
                  es: `Bloqueado hasta que termines ${currentModuleTitle ?? "el modulo actual"}. Mantener el orden ayuda a que tu tema mas debil reciba atencion primero.`,
                })}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
