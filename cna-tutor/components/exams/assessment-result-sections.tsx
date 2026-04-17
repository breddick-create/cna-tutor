"use client";

import type {
  AssessmentResultBreakdown,
  ExamResultQuestion,
} from "@/lib/exams/types";
import { StudentEmptyState } from "@/components/student/student-empty-state";
import { useLanguage } from "@/components/student/language-context";

export function AssessmentBreakdownPanel({
  breakdown,
  eyebrow = "Topic Breakdown",
  title = "See how each topic scored.",
  emptyMessage = "Your topic breakdown will show here after the assessment is scored.",
}: {
  breakdown: AssessmentResultBreakdown[];
  eyebrow?: string;
  title?: string;
  emptyMessage?: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="panel rounded-[1.75rem] p-6">
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
      <div className="mt-4 space-y-3">
        {breakdown.length ? (
          breakdown.map((domain) => (
            <div
              key={domain.domainSlug}
              className="rounded-3xl border border-[var(--border)] bg-white/70 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold">{domain.domainTitle}</p>
                <span className="text-sm font-semibold">{domain.percent}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[rgba(123,144,158,0.14)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent))]"
                  style={{ width: `${domain.percent}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <StudentEmptyState
            compact
            description={emptyMessage}
            eyebrow={eyebrow}
            title={t({
              en: "Your topic breakdown is not ready yet.",
              es: "Tu desglose por temas todavia no esta listo.",
            })}
          />
        )}
      </div>
    </div>
  );
}

export function AssessmentAnswerReviewPanel({
  questions,
}: {
  questions: ExamResultQuestion[];
}) {
  const { t } = useLanguage();

  return (
    <div className="panel rounded-[1.75rem] p-6">
      <p className="eyebrow">{t({ en: "Answer Review", es: "Revision de respuestas" })}</p>
      <div className="mt-4 space-y-4">
        {questions.length ? (
          questions.map((question, index) => (
            <article
              key={question.id}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-semibold">
                  {index + 1}. {question.prompt}
                </h4>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                    question.correct
                      ? "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]"
                      : "bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]"
                  }`}
                >
                  {question.correct
                    ? t({ en: "Correct", es: "Correcto" })
                    : t({ en: "Review", es: "Revisar" })}
                </span>
              </div>
              <p className="text-muted mt-3 text-sm leading-6">{question.rationale}</p>
              {!question.correct ? (
                <div className="mt-2 space-y-2 text-sm leading-6">
                  <p>
                    <span className="font-semibold">
                      {t({ en: "Your answer:", es: "Tu respuesta:" })}
                    </span>{" "}
                    {question.selectedChoiceText ??
                      t({ en: "No answer selected", es: "No se selecciono respuesta" })}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t({ en: "Correct answer:", es: "Respuesta correcta:" })}
                    </span>{" "}
                    {question.correctChoiceText}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t({ en: "Memory tip:", es: "Consejo de memoria:" })}
                    </span>{" "}
                    {question.memoryTip}
                  </p>
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <StudentEmptyState
            compact
            description={t({
              en: "When an assessment is scored, this section shows each question, the right answer, and what to remember next time.",
              es: "Cuando se califique una evaluacion, esta seccion mostrara cada pregunta, la respuesta correcta y lo que debes recordar la proxima vez.",
            })}
            eyebrow={t({ en: "Answer Review", es: "Revision de respuestas" })}
            title={t({
              en: "Your answer review is not ready yet.",
              es: "Tu revision de respuestas todavia no esta lista.",
            })}
          />
        )}
      </div>
    </div>
  );
}
