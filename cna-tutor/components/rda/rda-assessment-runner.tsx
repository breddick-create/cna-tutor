"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import type { RDAExamQuestion } from "@/content/rda/exam-bank";

function SubmitAssessmentButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button-primary w-full sm:w-auto" disabled={pending} type="submit">
      {pending ? "Scoring..." : "Submit pre-test"}
    </button>
  );
}

export function RdaAssessmentRunner({
  action,
  questions,
}: {
  action: (formData: FormData) => void | Promise<void>;
  questions: RDAExamQuestion[];
}) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answeredCount = Object.keys(answers).length;
  const progressPercent = useMemo(
    () => Math.round((answeredCount / Math.max(questions.length, 1)) * 100),
    [answeredCount, questions.length],
  );

  if (!started) {
    return (
      <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5">
        <p className="font-semibold">Ready to begin?</p>
        <p className="text-muted mt-2 max-w-2xl text-sm leading-6">
          Answer all {questions.length} questions in one sitting. Your domain results will unlock the RDA dashboard and rank your first study steps.
        </p>
        <button className="button-primary mt-4" type="button" onClick={() => setStarted(true)}>
          Start RDA pre-test
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="mt-6 space-y-5">
      <div className="sticky top-3 z-10 rounded-[1.5rem] border border-[var(--border)] bg-white/95 p-4 shadow-[0_14px_36px_rgba(24,39,75,0.1)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">
              Questions answered: {answeredCount}/{questions.length}
            </p>
            <p className="text-muted mt-1 text-xs leading-5">
              Submit only after every question has an answer.
            </p>
          </div>
          <SubmitAssessmentButton />
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(23,60,255,0.1)]">
          <div
            className="h-full rounded-full bg-[color:var(--brand-strong)] transition-[width]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {questions.map((question, index) => (
        <fieldset
          className="rounded-[1.5rem] border border-[var(--border)] bg-white/82 p-5"
          key={question.id}
        >
          <legend className="text-sm font-semibold text-[color:var(--brand-strong)]">
            Question {index + 1} · {question.domainTitle}
          </legend>
          <p className="mt-3 font-semibold leading-7">{question.prompt}</p>
          <div className="mt-4 grid gap-3">
            {question.choices.map((choice) => (
              <label
                className="flex cursor-pointer gap-3 rounded-[1.15rem] border border-[var(--border)] bg-white/88 p-4 text-sm leading-6 transition hover:border-[color:var(--brand-strong)]"
                key={choice.id}
              >
                <input
                  className="mt-1"
                  name={question.id}
                  onChange={() =>
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: choice.id,
                    }))
                  }
                  required
                  type="radio"
                  value={choice.id}
                />
                <span>{choice.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-[var(--border)] bg-white/90 p-5">
        <p className="text-sm font-semibold">
          Final check: {answeredCount}/{questions.length} answered
        </p>
        <SubmitAssessmentButton />
      </div>
    </form>
  );
}
