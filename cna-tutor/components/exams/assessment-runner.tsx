"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import type { PublicExamQuestion } from "@/lib/exams/types";

type AssessmentResponse = {
  summary: {
    mode: "quiz" | "mock_exam";
    score: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    weakDomains: string[];
  };
  breakdown: Array<{
    domainSlug: string;
    domainTitle: string;
    correctCount: number;
    totalQuestions: number;
    percent: number;
  }>;
  questions: Array<{
    id: string;
    prompt: string;
    selectedChoiceId: string | null;
    selectedChoiceText: string | null;
    correctChoiceId: string;
    correctChoiceText: string;
    correct: boolean;
    rationale: string;
    memoryTip: string;
  }>;
};

export function AssessmentRunner({
  mode,
  title,
  description,
  domainSlug,
  questions,
}: {
  mode: "quiz" | "mock_exam";
  title: string;
  description: string;
  domainSlug?: string;
  questions: PublicExamQuestion[];
}) {
  const startTimeRef = useRef<number>(Date.now());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResponse | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending || result) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          domainSlug,
          answers,
          timeSpentSeconds: Math.max(
            60,
            Math.round((Date.now() - startTimeRef.current) / 1000),
          ),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to score this assessment.");
      }

      const data = (await response.json()) as AssessmentResponse;
      setResult(data);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to score this assessment.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">{mode === "quiz" ? "Quiz Mode" : "Mock Exam Mode"}</p>
        <h2 className="mt-3 text-3xl font-semibold">{title}</h2>
        <p className="text-muted mt-3 max-w-3xl leading-7">{description}</p>
      </div>

      {result ? (
        <section className="space-y-6">
          <div className="panel rounded-[1.75rem] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Assessment Result</p>
                <h3 className="mt-2 text-3xl font-semibold">
                  {result.summary.score}% ({result.summary.correctCount}/{result.summary.totalQuestions})
                </h3>
              </div>
              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                  result.summary.passed
                    ? "bg-[rgba(28,124,104,0.12)] text-[color:var(--brand-strong)]"
                    : "bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]"
                }`}
              >
                {result.summary.passed ? "On track" : "Needs review"}
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border)] bg-white/70 p-4">
                <p className="text-sm font-semibold">Weak domains to revisit</p>
                <p className="text-muted mt-2 text-sm leading-6">
                  {result.summary.weakDomains.length
                    ? result.summary.weakDomains.join(", ")
                    : "No weak domains flagged in this assessment."}
                </p>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-white/70 p-4">
                <p className="text-sm font-semibold">Next step</p>
                <p className="text-muted mt-2 text-sm leading-6">
                  {result.summary.passed
                    ? "Keep the momentum going with another lesson or a broader review."
                    : "Open Study and run weak-area review on the domains that missed the target."}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="button-primary" href="/study">
                Go to guided study
              </Link>
              <Link className="button-secondary" href="/dashboard">
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="panel rounded-[1.75rem] p-6">
            <p className="eyebrow">Domain Breakdown</p>
            <div className="mt-4 space-y-3">
              {result.breakdown.map((domain) => (
                <div
                  key={domain.domainSlug}
                  className="rounded-3xl border border-[var(--border)] bg-white/70 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">{domain.domainTitle}</p>
                    <span className="text-sm font-semibold">{domain.percent}%</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-[rgba(29,42,38,0.08)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent))]"
                      style={{ width: `${domain.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel rounded-[1.75rem] p-6">
            <p className="eyebrow">Answer Review</p>
            <div className="mt-4 space-y-4">
              {result.questions.map((question, index) => (
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
                          ? "bg-[rgba(28,124,104,0.12)] text-[color:var(--brand-strong)]"
                          : "bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]"
                      }`}
                    >
                      {question.correct ? "Correct" : "Review"}
                    </span>
                  </div>
                  <p className="text-muted mt-3 text-sm leading-6">{question.rationale}</p>
                  {!question.correct ? (
                    <div className="mt-2 space-y-2 text-sm leading-6">
                      <p>
                        <span className="font-semibold">Your answer:</span>{" "}
                        {question.selectedChoiceText ?? "No answer selected"}
                      </p>
                      <p>
                        <span className="font-semibold">Correct answer:</span>{" "}
                        {question.correctChoiceText}
                      </p>
                      <p>
                        <span className="font-semibold">Memory tip:</span> {question.memoryTip}
                      </p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="panel rounded-[1.75rem] p-6">
            <div className="space-y-5">
              {questions.map((question, index) => (
                <fieldset
                  key={question.id}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5"
                >
                  <legend className="font-semibold">
                    {index + 1}. {question.prompt}
                  </legend>
                  <div className="mt-4 space-y-3">
                    {question.choices.map((choice) => (
                      <label
                        key={choice.id}
                        className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3"
                      >
                        <input
                          checked={answers[question.id] === choice.id}
                          className="mt-1"
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
                        <span className="text-sm leading-6">
                          <span className="font-semibold">{choice.label}.</span> {choice.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted text-sm">
              Choose the best answer for each question, then submit for scoring and review.
            </p>
            <button className="button-primary" disabled={pending} type="submit">
              {pending ? "Scoring..." : "Submit assessment"}
            </button>
          </div>
          {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}
        </form>
      )}
    </div>
  );
}
