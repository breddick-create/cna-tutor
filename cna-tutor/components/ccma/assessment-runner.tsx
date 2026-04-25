"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { BadgeCelebration } from "@/components/badges/badge-celebration";
import { useLanguage } from "@/components/ccma/language-context";
import {
  AssessmentAnswerReviewPanel,
  AssessmentBreakdownPanel,
} from "@/components/exams/assessment-result-sections";
import { appendEarnedBadgesParam } from "@/lib/learning/badge-query";
import {
  MOCK_EXAM_RESULT_STORAGE_KEY,
  createStoredMockExamResult,
  formatCountdown,
} from "@/lib/ccma/exams/mock-flow";
import type {
  AssessmentErrorPayload,
  AssessmentResultPayload,
  PublicExamQuestion,
  QuizConfidenceLevel,
} from "@/lib/ccma/exams/types";

type InlineResultContent = {
  primaryAction: {
    href: string;
    label: string;
  };
  secondaryAction: {
    href: string;
    label: string;
  };
  nextStep: string;
  statusLabel: string;
};

function getInlineResultContent(args: {
  mode: "quiz" | "mock_exam" | "pretest" | "weak_area_drill";
  result: AssessmentResultPayload;
  domainSlug?: string;
  t: (text: { en: string; es: string }) => string;
}): InlineResultContent {
  const { mode, result, domainSlug, t } = args;

  if (mode === "pretest") {
    return {
      primaryAction: {
        href: "/ccma/study-plan",
        label: t({ en: "Open study plan", es: "Abrir plan de estudio" }),
      },
      secondaryAction: {
        href: "/ccma/dashboard",
        label: t({ en: "Check your progress", es: "Revisar tu progreso" }),
      },
      nextStep: t({
        en: "Your study plan is now built from these results. Start with the lowest-scoring topics first.",
        es: "Tu plan de estudio ya se construyo con estos resultados. Comienza con los temas de puntaje mas bajo.",
      }),
      statusLabel: result.summary.passed
        ? t({ en: "Ready for the next step", es: "Listo para el siguiente paso" })
        : t({ en: "More review needed", es: "Hace falta mas repaso" }),
    };
  }

  if (mode === "quiz") {
    const studyHref = domainSlug ? `/ccma/study-plan?topics=${domainSlug}` : "/ccma/study-plan";
    const sectionMockHref = domainSlug ? `/ccma/mock-exam?domain=${domainSlug}` : "/ccma/mock-exam";

    return result.summary.passed
      ? {
          primaryAction: {
            href: studyHref,
            label: t({ en: "Continue study plan", es: "Continuar plan de estudio" }),
          },
          secondaryAction: {
            href: sectionMockHref,
            label: t({ en: "Take section practice exam", es: "Tomar examen de practica por seccion" }),
          },
          nextStep: t({
            en: "This topic check shows the main ideas are holding. Go back to your study plan, or use a section practice exam if you want a deeper check before moving on.",
            es: "Esta revision del tema muestra que las ideas principales se estan manteniendo. Vuelve a tu plan de estudio o usa un examen por seccion si quieres una revision mas profunda antes de seguir.",
          }),
          statusLabel: t({ en: "This topic is getting stronger", es: "Este tema se esta fortaleciendo" }),
        }
      : {
          primaryAction: {
            href: studyHref,
            label: t({ en: "Return to this topic", es: "Volver a este tema" }),
          },
          secondaryAction: {
            href: "/ccma/dashboard",
            label: t({ en: "Check your progress", es: "Revisar tu progreso" }),
          },
          nextStep: t({
            en: "Go back to guided study for this topic, then use another short quiz to see whether the weak points improved.",
            es: "Vuelve al estudio guiado de este tema y luego usa otro quiz corto para ver si mejoraron los puntos debiles.",
          }),
          statusLabel: t({ en: "Slow down and review this topic", es: "Baja el ritmo y repasa este tema" }),
        };
  }

  if (mode === "weak_area_drill") {
    return result.summary.passed
      ? {
          primaryAction: {
            href: "/ccma/quiz?mode=drill",
            label: t({ en: "Drill again", es: "Practicar otra vez" }),
          },
          secondaryAction: {
            href: "/ccma/dashboard",
            label: t({ en: "Back to dashboard", es: "Volver al panel" }),
          },
          nextStep: t({
            en: "You pushed your weak-area drill into a stronger range. Drill again if you want more reps, or go back to the dashboard and keep the main plan moving.",
            es: "Llevaste tu practica de areas debiles a un rango mas fuerte. Practica otra vez si quieres mas repeticiones o vuelve al panel y sigue avanzando con el plan principal.",
          }),
          statusLabel: t({ en: "Weak areas getting stronger", es: "Las areas debiles se estan fortaleciendo" }),
        }
      : {
          primaryAction: {
            href: "/ccma/quiz?mode=drill",
            label: t({ en: "Drill again", es: "Practicar otra vez" }),
          },
          secondaryAction: {
            href: "/ccma/study-plan",
            label: t({ en: "Review weak modules", es: "Revisar modulos debiles" }),
          },
          nextStep: t({
            en: "Use the comparison below to see which weak areas are still trailing your goal. Drill again for more repetition, or return to the matching guided modules first.",
            es: "Usa la comparacion de abajo para ver que areas debiles todavia estan por debajo de tu meta. Practica otra vez para tener mas repeticiones o vuelve primero a los modulos guiados correspondientes.",
          }),
          statusLabel: t({ en: "Keep drilling weak areas", es: "Sigue practicando las areas debiles" }),
        };
  }

  return {
    primaryAction: {
      href: "/ccma/study-plan",
      label: t({ en: "Continue study plan", es: "Continuar plan de estudio" }),
    },
    secondaryAction: {
      href: "/ccma/dashboard",
      label: t({ en: "Check your progress", es: "Revisar tu progreso" }),
    },
    nextStep: result.summary.passed
      ? t({
          en: "Keep going with another lesson or a broader review.",
          es: "Sigue con otra leccion o con un repaso mas amplio.",
        })
      : t({
          en: "Go back to guided study and focus on the topics that missed the target.",
          es: "Vuelve al estudio guiado y enfocate en los temas que no alcanzaron la meta.",
        }),
    statusLabel: result.summary.passed
      ? t({ en: "Ready for the next step", es: "Listo para el siguiente paso" })
      : t({ en: "More review needed", es: "Hace falta mas repaso" }),
  };
}

export function AssessmentRunner({
  mode,
  title,
  description,
  domainSlug,
  domainSlugs,
  questions,
  timeLimitSeconds,
  resultsHref,
  confidencePrompt,
}: {
  mode: "quiz" | "mock_exam" | "pretest" | "weak_area_drill";
  title: string;
  description: string;
  domainSlug?: string;
  domainSlugs?: string[];
  questions: PublicExamQuestion[];
  timeLimitSeconds?: number;
  resultsHref?: string;
  confidencePrompt?: {
    topicLabel: string;
  };
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const startTimeRef = useRef<number>(Date.now());
  const timeoutSubmitStartedRef = useRef(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResultPayload | null>(null);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(timeLimitSeconds ?? 0);
  const [confidenceLevel, setConfidenceLevel] = useState<QuizConfidenceLevel | null>(null);
  const [quizStarted, setQuizStarted] = useState(!confidencePrompt);
  const [newBadges, setNewBadges] = useState<
    Array<{ slug: string; title: string; description: string }>
  >([]);

  const modeLabel =
    mode === "pretest"
      ? t({ en: "Pre-Test", es: "Preevaluacion" })
      : mode === "mock_exam"
        ? t({ en: "Practice Exam", es: "Examen de practica" })
        : mode === "weak_area_drill"
          ? t({ en: "Drill Weak Areas", es: "Practicar areas debiles" })
        : t({ en: "Quiz", es: "Quiz" });
  const answeredCount = Object.keys(answers).length;
  const answeredSummary = `${answeredCount}/${questions.length}`;
  const inlineResultContent = result
      ? getInlineResultContent({
          mode,
          result,
          domainSlug,
          t,
        })
      : null;

  const submitAssessment = useCallback(
    async ({ allowPartial = false }: { allowPartial?: boolean } = {}) => {
      if (pending || result) {
        return;
      }

      if (!allowPartial && answeredCount < questions.length) {
        setError(
          t({
            en: "Please answer every question before you submit.",
            es: "Responde cada pregunta antes de enviar.",
          }),
        );
        return;
      }

      setPending(true);
      setError(null);

      try {
        const response = await fetch("/api/ccma/assessments/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode,
            domainSlug,
            domainSlugs,
            questionIds: questions.map((question) => question.id),
            answers,
            timeSpentSeconds: Math.max(60, Math.round((Date.now() - startTimeRef.current) / 1000)),
            confidenceLevel,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as AssessmentErrorPayload | null;
          throw new Error(
            payload?.error ??
              t({
                en: "We couldn't score this yet.",
                es: "Todavia no pudimos calificar esto.",
              }),
          );
        }

        const data = (await response.json()) as AssessmentResultPayload;

        if (mode === "pretest") {
          router.push(
            appendEarnedBadgesParam(
              "/ccma/pretest/results",
              (data.newAchievements ?? []).map((badge) => ({ slug: badge.slug })),
            ),
          );
          return;
        }

        if (mode === "mock_exam" && resultsHref) {
          window.sessionStorage.setItem(
            MOCK_EXAM_RESULT_STORAGE_KEY,
            JSON.stringify(
              createStoredMockExamResult({
                result: data,
                domainSlug,
              }),
            ),
          );
          router.push(
            appendEarnedBadgesParam(
              resultsHref,
              (data.newAchievements ?? []).map((badge) => ({ slug: badge.slug })),
            ),
          );
          return;
        }

        setNewBadges(data.newAchievements ?? []);
        setResult(data);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : t({
                en: "We couldn't score this yet.",
                es: "Todavia no pudimos calificar esto.",
              }),
        );
        timeoutSubmitStartedRef.current = false;
      } finally {
        setPending(false);
      }
    },
    [answeredCount, answers, confidenceLevel, domainSlug, domainSlugs, mode, pending, questions, result, resultsHref, router, t],
  );

  useEffect(() => {
    if (!timeLimitSeconds || pending || result || !quizStarted) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);

          if (!timeoutSubmitStartedRef.current) {
            timeoutSubmitStartedRef.current = true;
            setError(
              t({
                en: "Time is up. We're submitting the answers you finished.",
                es: "Se acabo el tiempo. Vamos a enviar las respuestas que alcanzaste a terminar.",
              }),
            );
            void submitAssessment({ allowPartial: true });
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [pending, quizStarted, result, submitAssessment, timeLimitSeconds]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitAssessment();
  }

  function handleStartQuiz() {
    if (confidencePrompt && !confidenceLevel) {
      setError(
        t({
          en: "Choose how confident you feel before starting the quiz.",
          es: "Elige que tan seguro te sientes antes de comenzar el quiz.",
        }),
      );
      return;
    }

    setError(null);
    startTimeRef.current = Date.now();
    setTimeRemainingSeconds(timeLimitSeconds ?? 0);
    setQuizStarted(true);
  }

  return (
    <div className="space-y-6 pb-28 md:pb-0">
      <BadgeCelebration badges={newBadges} storageKey={`ccma-assessment-badges-${mode}-${domainSlug ?? "all"}`} />
      <div className="panel rounded-[1.75rem] p-5 sm:p-6">
        <p className="eyebrow">{modeLabel}</p>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{title}</h2>
        <p className="text-muted mt-3 max-w-3xl leading-7">{description}</p>
        <div className={`mt-5 grid gap-4 ${timeLimitSeconds ? "sm:grid-cols-2" : ""}`}>
          {timeLimitSeconds ? (
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
              <p className="text-sm font-semibold">
                {t({ en: "Time remaining", es: "Tiempo restante" })}
              </p>
              <p className="mt-2 text-2xl font-semibold">{formatCountdown(timeRemainingSeconds)}</p>
              <p className="text-muted mt-2 text-sm leading-6">
                {t({
                  en: "This timed practice is meant to feel closer to a real exam check.",
                  es: "Esta practica con tiempo busca sentirse mas cercana a una revision real de examen.",
                })}
              </p>
            </div>
          ) : null}
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">
              {t({ en: "Questions answered", es: "Preguntas respondidas" })}
            </p>
            <p className="mt-2 text-2xl font-semibold">{answeredSummary}</p>
            <p className="text-muted mt-2 text-sm leading-6">
              {timeLimitSeconds
                ? t({
                    en: "Answer every question if you can. If time runs out, we'll score what you finished.",
                    es: "Responde cada pregunta si puedes. Si se acaba el tiempo, calificaremos lo que hayas terminado.",
                  })
                : t({
                    en: "Your progress stays visible here so you can keep moving with one hand.",
                    es: "Tu progreso permanece visible aqui para que puedas seguir avanzando con una sola mano.",
                  })}
            </p>
          </div>
        </div>
      </div>

      {result ? (
        <section className="space-y-6">
          <div className="panel rounded-[1.75rem] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow">{t({ en: "Results", es: "Resultados" })}</p>
                <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  {result.summary.score}% ({result.summary.correctCount}/{result.summary.totalQuestions})
                </h3>
              </div>
              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                  result.summary.passed
                    ? "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]"
                    : "bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]"
                }`}
              >
                {inlineResultContent?.statusLabel}
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border)] bg-white/70 p-4">
                <p className="text-sm font-semibold">
                  {t({ en: "Topics to review", es: "Temas para revisar" })}
                </p>
                <p className="text-muted mt-2 text-sm leading-6">
                  {result.summary.weakDomains.length
                    ? result.summary.weakDomains.join(", ")
                    : t({
                        en: "No weak topics were flagged in this set.",
                        es: "No se marcaron temas debiles en este conjunto.",
                      })}
                </p>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-white/70 p-4">
                <p className="text-sm font-semibold">{t({ en: "Next step", es: "Siguiente paso" })}</p>
                <p className="text-muted mt-2 text-sm leading-6">
                  {inlineResultContent?.nextStep}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className="button-primary w-full sm:w-auto" href={inlineResultContent?.primaryAction.href ?? "/ccma/study-plan"}>
                {inlineResultContent?.primaryAction.label ?? t({ en: "Continue", es: "Continuar" })}
              </Link>
              <Link className="button-secondary w-full sm:w-auto" href={inlineResultContent?.secondaryAction.href ?? "/ccma/dashboard"}>
                {inlineResultContent?.secondaryAction.label ??
                  t({ en: "Check your progress", es: "Revisar tu progreso" })}
              </Link>
            </div>

            {mode === "weak_area_drill" && result.drillComparisons?.length ? (
              <div className="mt-5 rounded-3xl border border-[var(--border)] bg-white/70 p-4">
                <p className="text-sm font-semibold">
                  {t({
                    en: "Before and after by weak area",
                    es: "Antes y despues por area debil",
                  })}
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {result.drillComparisons.map((comparison) => (
                    <article
                      key={comparison.domainSlug}
                      className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4"
                    >
                      <p className="font-semibold">{comparison.domainTitle}</p>
                      <p className="mt-3 text-sm leading-6">
                        <span className="font-semibold">
                          {t({ en: "Drill score:", es: "Puntaje del ejercicio:" })}
                        </span>{" "}
                        {comparison.drillScore}%
                      </p>
                      <p className="mt-2 text-sm leading-6">
                        <span className="font-semibold">
                          {t({ en: "Pre-test baseline:", es: "Base de la preevaluacion:" })}
                        </span>{" "}
                        {comparison.pretestBaseline !== null
                          ? `${comparison.pretestBaseline}%`
                          : t({ en: "Not available", es: "No disponible" })}
                      </p>
                      <p className="mt-2 text-sm leading-6">
                        <span className="font-semibold">
                          {t({ en: "Change:", es: "Cambio:" })}
                        </span>{" "}
                        {comparison.deltaFromBaseline === null
                          ? t({ en: "No baseline yet", es: "Todavia no hay base" })
                          : comparison.deltaFromBaseline > 0
                            ? t({
                                en: `Up ${comparison.deltaFromBaseline} points`,
                                es: `Subio ${comparison.deltaFromBaseline} puntos`,
                              })
                            : comparison.deltaFromBaseline < 0
                              ? t({
                                  en: `${Math.abs(comparison.deltaFromBaseline)} points below baseline`,
                                  es: `${Math.abs(comparison.deltaFromBaseline)} puntos por debajo de la base`,
                                })
                              : t({ en: "Even with baseline", es: "Igual que la base" })}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <AssessmentBreakdownPanel breakdown={result.breakdown} />
          <AssessmentAnswerReviewPanel questions={result.questions} />
        </section>
      ) : !quizStarted ? (
        <section className="panel rounded-[1.75rem] p-5 sm:p-6">
          <p className="eyebrow">{t({ en: "Confidence Check-In", es: "Chequeo de confianza" })}</p>
          <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
            {t({
              en: `How confident do you feel about ${confidencePrompt?.topicLabel ?? "this topic"} right now?`,
              es: `Que tan seguro te sientes sobre ${confidencePrompt?.topicLabel ?? "este tema"} ahora mismo?`,
            })}
          </h3>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            {t({
              en: "This quick check helps you see whether your confidence is growing alongside your scores.",
              es: "Esta revision rapida te ayuda a ver si tu confianza esta creciendo junto con tus puntajes.",
            })}
          </p>
          <div className="mt-5 grid gap-3">
            {([
              ["not_confident", t({ en: "Not confident", es: "No me siento seguro" })],
              ["somewhat_confident", t({ en: "Somewhat confident", es: "Algo seguro" })],
              ["very_confident", t({ en: "Very confident", es: "Muy seguro" })],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                className={`min-h-14 rounded-[1.5rem] border px-4 py-4 text-left text-base font-semibold transition ${
                  confidenceLevel === value
                    ? "border-[color:var(--brand)] bg-[rgba(23,60,255,0.08)] text-[color:var(--brand-strong)]"
                    : "border-[var(--border)] bg-white/80"
                }`}
                onClick={() => setConfidenceLevel(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          {error ? <p className="mt-4 text-sm font-medium text-[color:var(--danger)]">{error}</p> : null}
          <div className="mt-5">
            <button className="button-primary w-full sm:w-auto" onClick={handleStartQuiz} type="button">
              {t({ en: "Start quiz", es: "Comenzar quiz" })}
            </button>
          </div>
        </section>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="panel rounded-[1.75rem] p-5 sm:p-6">
            <div className="space-y-5">
              {questions.map((question, index) => (
                <fieldset
                  key={question.id}
                  className="scroll-mt-24 rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4 sm:p-5"
                >
                  <legend className="max-w-full pr-2 text-base font-semibold leading-7 sm:text-lg">
                    {index + 1}. {question.prompt}
                  </legend>
                  <div className="mt-4 space-y-3">
                    {question.choices.map((choice) => (
                      <label
                        key={choice.id}
                        className="flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 text-base transition active:scale-[0.99]"
                      >
                        <input
                          checked={answers[question.id] === choice.id}
                          className="mt-1 size-5 shrink-0 accent-[var(--brand)]"
                          name={question.id}
                          onChange={() =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: choice.id,
                            }))
                          }
                          type="radio"
                          value={choice.id}
                        />
                        <span className="min-w-0 flex-1 break-words text-base leading-6">
                          <span className="font-semibold">{choice.label}.</span> {choice.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>

          <div className="hidden flex-wrap items-center justify-between gap-3 md:flex">
            <p className="text-muted text-sm">
              {timeLimitSeconds
                ? t({
                    en: "Answer every question if you can. If the timer runs out, we'll submit what you finished.",
                    es: "Responde cada pregunta si puedes. Si se acaba el tiempo, enviaremos lo que hayas terminado.",
                  })
                : t({
                    en: "Answer every question, then submit to score it and update your next step.",
                    es: "Responde cada pregunta y luego envia para calificarla y actualizar tu siguiente paso.",
                  })}
            </p>
            <button className="button-primary w-full md:w-auto" disabled={pending} type="submit">
              {pending
                ? t({ en: "Scoring...", es: "Calificando..." })
                : mode === "pretest"
                  ? t({ en: "Finish pre-test", es: "Terminar preevaluacion" })
                  : mode === "weak_area_drill"
                    ? t({ en: "Finish drill and see comparison", es: "Terminar practica y ver comparacion" })
                  : mode === "quiz"
                    ? t({ en: "Finish quiz and see results", es: "Terminar quiz y ver resultados" })
                    : t({ en: "Finish practice exam", es: "Terminar examen de practica" })}
            </button>
          </div>
          {error ? (
            <div className="rounded-[1.25rem] border border-[rgba(166,60,47,0.18)] bg-[rgba(166,60,47,0.08)] px-4 py-3">
              <p className="text-sm font-medium text-[color:var(--danger)]">{error}</p>
              <p className="mt-2 text-sm leading-6">
                {t({
                  en: "Try again, or go back to your study plan if you need another pass before this check.",
                  es: "Intentalo de nuevo, o vuelve a tu plan de estudio si necesitas otra revision antes de esta evaluacion.",
                })}
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link className="button-secondary w-full sm:w-auto" href="/ccma/study-plan">
                  {t({ en: "Back to study plan", es: "Volver al plan de estudio" })}
                </Link>
                <Link className="button-secondary w-full sm:w-auto" href="/ccma/support">
                  {t({ en: "Get help", es: "Obtener ayuda" })}
                </Link>
              </div>
            </div>
          ) : null}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[rgba(247,249,252,0.96)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(32,48,61,0.12)] backdrop-blur md:hidden">
            <div className="mx-auto flex max-w-3xl flex-col gap-3">
              <div className="flex items-center justify-between gap-4 text-sm">
                <p className="font-semibold">
                  {t({ en: "Answered", es: "Respondidas" })} {answeredSummary}
                </p>
                {timeLimitSeconds ? (
                  <p className="font-semibold">{formatCountdown(timeRemainingSeconds)}</p>
                ) : (
                  <p className="text-muted">
                    {t({ en: "Ready when you are", es: "Listo cuando tu lo estes" })}
                  </p>
                )}
              </div>
              <button className="button-primary w-full" disabled={pending} type="submit">
                {pending
                  ? t({ en: "Scoring...", es: "Calificando..." })
                  : mode === "pretest"
                    ? t({ en: "Finish pre-test", es: "Terminar preevaluacion" })
                    : mode === "weak_area_drill"
                      ? t({ en: "Finish drill and see comparison", es: "Terminar practica y ver comparacion" })
                    : mode === "quiz"
                      ? t({ en: "Finish quiz and see results", es: "Terminar quiz y ver resultados" })
                      : t({ en: "Finish practice exam", es: "Terminar examen de practica" })}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

