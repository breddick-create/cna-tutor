"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/student/language-context";
import {
  AssessmentAnswerReviewPanel,
  AssessmentBreakdownPanel,
} from "@/components/exams/assessment-result-sections";
import { StudentEmptyState } from "@/components/student/student-empty-state";
import {
  MOCK_EXAM_RESULT_STORAGE_KEY,
  getMockExamResultGuidance,
  parseStoredMockExamResult,
  type StoredMockExamResult,
} from "@/lib/exams/mock-flow";
import { getLanguageLocale } from "@/lib/i18n/languages";
import type { ProgressionSnapshot } from "@/lib/progression/readiness";

export function MockExamResultsView({
  domainSlug,
  progression,
  examTitle,
}: {
  domainSlug?: string;
  progression: ProgressionSnapshot;
  examTitle: string;
}) {
  const { language, t } = useLanguage();
  const [storedResult, setStoredResult] = useState<StoredMockExamResult | null>(null);

  useEffect(() => {
    setStoredResult(parseStoredMockExamResult(window.sessionStorage.getItem(MOCK_EXAM_RESULT_STORAGE_KEY)));
  }, []);

  const resultMatchesRoute =
    storedResult && (storedResult.domainSlug ?? null) === (domainSlug ?? null);

  const guidance = useMemo(() => {
    if (!storedResult || !resultMatchesRoute) {
      return null;
    }

    return getMockExamResultGuidance({
      result: storedResult.result,
      progression,
      domainSlug,
    });
  }, [domainSlug, progression, resultMatchesRoute, storedResult]);

  if (!storedResult) {
    return (
      <StudentEmptyState
        description={t({
          en: "This page opens right after you finish a practice exam. Once you submit, you will see your score, the topic breakdown, and what to do next.",
          es: "Esta pagina se abre justo despues de terminar un examen de practica. Cuando lo envies, veras tu puntaje, el desglose por temas y lo que debes hacer despues.",
        })}
        eyebrow={t({ en: "Practice Exam Results", es: "Resultados del examen de practica" })}
        primaryAction={{
          href: domainSlug ? `/mock-exam?domain=${domainSlug}` : "/mock-exam",
          label: t({ en: "Go to practice exam", es: "Ir al examen de practica" }),
        }}
        secondaryAction={{
          href: "/dashboard",
          label: t({ en: "Go to dashboard", es: "Ir al panel" }),
        }}
        title={t({
          en: "You haven't finished a practice exam here yet.",
          es: "Todavia no has terminado un examen de practica aqui.",
        })}
      />
    );
  }

  if (!resultMatchesRoute || !guidance) {
    return (
      <StudentEmptyState
        description={t({
          en: "The saved result belongs to a different practice exam than the one this page is trying to show. Open the saved result, or go back and run this exam again.",
          es: "El resultado guardado pertenece a un examen de practica diferente al que esta pagina intenta mostrar. Abre el resultado guardado o vuelve y realiza este examen otra vez.",
        })}
        eyebrow={t({ en: "Results Mismatch", es: "Resultados no coinciden" })}
        primaryAction={{
          href: storedResult.domainSlug
            ? `/mock-exam/results?domain=${storedResult.domainSlug}`
            : "/mock-exam/results",
          label: t({ en: "Open saved result", es: "Abrir resultado guardado" }),
        }}
        secondaryAction={{
          href: domainSlug ? `/mock-exam?domain=${domainSlug}` : "/mock-exam",
          label: t({ en: "Back to practice exam", es: "Volver al examen de practica" }),
        }}
        title={t({
          en: "This page is not showing the matching result.",
          es: "Esta pagina no muestra el resultado correspondiente.",
        })}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">{t({ en: "Practice Exam Result", es: "Resultado del examen de practica" })}</p>
            <h1 className="mt-3 text-3xl font-semibold">{examTitle}</h1>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
              {t({ en: "Completed", es: "Completado" })}{" "}
              {new Date(storedResult.completedAt).toLocaleString(getLanguageLocale(language))}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
              storedResult.result.summary.passed
                ? "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]"
                : "bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]"
            }`}
          >
            {guidance.statusLabel}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">{t({ en: "Overall score", es: "Puntaje general" })}</p>
            <p className="mt-2 text-3xl font-semibold">{storedResult.result.summary.score}%</p>
            <p className="text-muted mt-2 text-sm leading-6">
              {storedResult.result.summary.correctCount}/{storedResult.result.summary.totalQuestions}{" "}
              {t({ en: "correct", es: "correctas" })}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">{t({ en: "Readiness status", es: "Estado de preparacion" })}</p>
            <p className="mt-2 text-2xl font-semibold">{progression.readinessLabel}</p>
            <p className="text-muted mt-2 text-sm leading-6">{guidance.summary}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">{t({ en: "What happens next", es: "Que sigue" })}</p>
            <p className="mt-2 text-sm leading-6">{guidance.nextStep}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
          <p className="text-sm font-semibold">{guidance.headline}</p>
          <p className="text-muted mt-2 text-sm leading-6">{guidance.summary}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="button-primary" href={guidance.primaryAction.href}>
            {guidance.primaryAction.label}
          </Link>
          <Link className="button-secondary" href={guidance.secondaryAction.href}>
            {guidance.secondaryAction.label}
          </Link>
        </div>
      </section>

      <AssessmentBreakdownPanel
        breakdown={storedResult.result.breakdown}
        title={t({
          en: "Use this breakdown to decide what to review next.",
          es: "Usa este desglose para decidir que revisar despues.",
        })}
      />
      <AssessmentAnswerReviewPanel questions={storedResult.result.questions} />
    </div>
  );
}
