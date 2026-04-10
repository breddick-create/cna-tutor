"use client";

import Link from "next/link";
import { useState } from "react";

import type { TutorLesson, TutorSessionState } from "@/lib/tutor/types";
import { formatHours } from "@/lib/utils";

type StudyTurn = {
  id: string;
  actor: "tutor" | "student" | "system";
  content: string;
  correctness: string | null;
  turnType: string;
};

type TutorResponse = {
  studentTurn: Omit<StudyTurn, "id" | "correctness">;
  tutorTurn: StudyTurn;
  evaluation: {
    correct: boolean;
    memoryTip: string;
  };
  session: {
    status: "active" | "completed" | "paused" | "abandoned";
    state: TutorSessionState;
    tracking: {
      activeSeconds: number;
    };
  };
};

export function StudySession({
  initialLesson,
  initialSession,
  initialTurns,
}: {
  initialLesson: TutorLesson;
  initialSession: {
    id: string;
    status: "active" | "completed" | "paused" | "abandoned";
    state: TutorSessionState;
    activeSeconds: number;
  };
  initialTurns: StudyTurn[];
}) {
  const [turns, setTurns] = useState(initialTurns);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState(initialSession.status);
  const [sessionState, setSessionState] = useState(initialSession.state);
  const [activeSeconds, setActiveSeconds] = useState(initialSession.activeSeconds);
  const modeLabel = sessionState.mode.replaceAll("_", " ");
  const weakAreasLabel = sessionState.weakAreasSnapshot.join(", ");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim() || pending || sessionStatus !== "active") {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/tutor/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: initialSession.id,
          message: draft,
        }),
      });

      if (!response.ok) {
        throw new Error("The tutor could not process your answer.");
      }

      const data = (await response.json()) as TutorResponse;
      const learnerTurn: StudyTurn = {
        id: `student-${Date.now()}`,
        actor: "student",
        content: data.studentTurn.content,
        correctness: null,
        turnType: data.studentTurn.turnType,
      };

      setTurns((currentTurns) => [...currentTurns, learnerTurn, data.tutorTurn]);
      setSessionStatus(data.session.status);
      setSessionState(data.session.state);
      setActiveSeconds(data.session.tracking.activeSeconds);
      setDraft("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The tutor could not process your answer.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_0.28fr]">
      <section className="space-y-6">
        <div className="panel rounded-[1.75rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">{initialLesson.domainTitle}</p>
            <span className="rounded-full bg-[rgba(28,124,104,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
              {modeLabel}
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-semibold">{initialLesson.title}</h2>
          <p className="text-muted mt-3 leading-7">{initialLesson.summary}</p>
          {weakAreasLabel ? (
            <p className="text-muted mt-3 text-sm leading-6">
              Tutor focus areas from recent performance: {weakAreasLabel}.
            </p>
          ) : null}
        </div>

        <div className="panel rounded-[1.75rem] p-6">
          <div className="space-y-4">
            {turns.map((turn) => (
              <article
                key={turn.id}
                className={`rounded-[1.5rem] border p-4 ${
                  turn.actor === "tutor"
                    ? "border-[rgba(28,124,104,0.15)] bg-[rgba(28,124,104,0.08)]"
                    : "border-[rgba(29,42,38,0.12)] bg-white/80"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                    {turn.actor === "tutor" ? "Instructor" : "Student"}
                  </p>
                  {turn.correctness ? (
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">
                      {turn.correctness}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 whitespace-pre-wrap leading-7">{turn.content}</p>
              </article>
            ))}
          </div>

          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium" htmlFor="student-response">
              Your answer
            </label>
            <textarea
              className="input-base min-h-32 resize-y"
              id="student-response"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Answer the teacher's question here..."
              value={draft}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted text-sm">
                The tutor expects a real response before moving on.
              </p>
              <button
                className="button-primary"
                disabled={pending || sessionStatus !== "active"}
                type="submit"
              >
                {pending ? "Checking answer..." : sessionStatus === "active" ? "Send answer" : "Lesson complete"}
              </button>
            </div>
            {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}
          </form>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">Session Status</p>
          <p className="mt-3 text-2xl font-semibold capitalize">{sessionStatus}</p>
          <p className="text-muted mt-3 text-sm leading-6">
            Mastery score: {sessionState.masteryScore}% across {sessionState.totalQuestions} guided
            checks.
          </p>
          <p className="text-muted mt-2 text-sm leading-6">
            Difficulty: {sessionState.difficultyTier} - Remediation level {sessionState.remediationLevel}
          </p>
        </div>

        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">Progress</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[rgba(29,42,38,0.08)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent))]"
              style={{
                width: `${Math.max(
                  12,
                  ((sessionState.currentSegmentIndex + (sessionStatus === "completed" ? 1 : 0)) /
                    sessionState.totalQuestions) *
                    100,
                )}%`,
              }}
            />
          </div>
          <p className="text-muted mt-3 text-sm">
            Active tracked time in this browser flow: {formatHours(activeSeconds)}
          </p>
        </div>

        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">Lesson Goal</p>
          <p className="mt-3 text-sm leading-7">{initialLesson.learningGoal}</p>
        </div>

        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">Next</p>
          <div className="mt-4 space-y-3">
            <Link className="button-secondary w-full" href="/study">
              Start another lesson
            </Link>
            <Link className="button-secondary w-full" href="/dashboard">
              Back to dashboard
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
