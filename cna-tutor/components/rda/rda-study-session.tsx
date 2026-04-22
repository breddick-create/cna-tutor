"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useEffect, useMemo, useRef, useState } from "react";

import type { TutorLesson, TutorSessionState } from "@/lib/rda/tutor/types";

type StudyTurn = {
  id: string;
  actor: "tutor" | "student";
  content: string;
  correctness: string | null;
  turnType: string;
};

type TutorResponse = {
  studentTurn: Omit<StudyTurn, "id" | "correctness">;
  tutorTurn: StudyTurn;
  evaluation: { correct: boolean; memoryTip: string };
  session: {
    status: "active" | "completed" | "paused" | "abandoned";
    state: TutorSessionState;
  };
};

const AMERICAN_FEMALE_VOICE_HINTS = [
  "ava", "jenny", "aria", "allison", "samantha", "zira", "joanna",
  "kendra", "kimberly", "ivy", "salli", "michelle", "emma", "ruth", "nancy",
];

function pickVoice(voices: SpeechSynthesisVoice[]) {
  const byName = voices.find((v) => {
    const n = `${v.name} ${v.voiceURI}`.toLowerCase();
    return v.lang.startsWith("en") && AMERICAN_FEMALE_VOICE_HINTS.some((h) => n.includes(h));
  });
  if (byName) return byName;
  return voices.find((v) => v.lang.startsWith("en-US")) ?? voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}

export function RdaStudySession({
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
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceReady, setVoiceReady] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const lastSpokenTurnIdRef = useRef<string | null>(null);
  const pendingAutoplayIdRef = useRef<string | null>(null);
  const turnsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      setVoiceReady(v.length > 0);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const selectedVoice = useMemo(() => pickVoice(voices), [voices]);

  useEffect(() => {
    if (!voiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [voiceEnabled]);

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  const getLastTutorTurn = () => [...turns].reverse().find((t) => t.actor === "tutor") ?? null;

  function speakTurn(turn: StudyTurn) {
    speak(turn.content);
    lastSpokenTurnIdRef.current = turn.id;
    pendingAutoplayIdRef.current = null;
  }

  useEffect(() => {
    const last = getLastTutorTurn();
    if (!voiceEnabled || !last || lastSpokenTurnIdRef.current === last.id) return;
    pendingAutoplayIdRef.current = last.id;
    if (voiceReady || selectedVoice) speakTurn(last);
  }, [turns, voiceEnabled, voiceReady, selectedVoice]);

  useEffect(() => {
    if (!voiceEnabled || !pendingAutoplayIdRef.current || typeof window === "undefined") return;
    const trySpeak = () => {
      const last = getLastTutorTurn();
      if (!last || last.id !== pendingAutoplayIdRef.current) return;
      speakTurn(last);
    };
    window.addEventListener("pointerdown", trySpeak, { once: true });
    window.addEventListener("keydown", trySpeak, { once: true });
    const t = window.setTimeout(trySpeak, 150);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointerdown", trySpeak);
      window.removeEventListener("keydown", trySpeak);
    };
  }, [turns, voiceEnabled, voiceReady, selectedVoice]);

  useEffect(() => {
    turnsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || pending || sessionStatus !== "active") return;

    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/rda/tutor/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: initialSession.id, message: draft }),
      });

      if (!res.ok) throw new Error("Your answer didn't go through. Try again.");

      const data = (await res.json()) as TutorResponse;
      const studentEntry: StudyTurn = {
        id: `student-${Date.now()}`,
        actor: "student",
        content: data.studentTurn.content,
        correctness: null,
        turnType: data.studentTurn.turnType,
      };

      setTurns((prev) => [...prev, studentEntry, data.tutorTurn]);
      setSessionStatus(data.session.status);
      setSessionState(data.session.state);
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your answer didn't go through. Try again.");
    } finally {
      setPending(false);
    }
  }

  const renderMarkdown = (content: string) => content.replace(/\n/g, "  \n");
  const lastTutorTurn = getLastTutorTurn();
  const progressPercent = Math.max(
    8,
    ((sessionState.currentSegmentIndex + (sessionStatus === "completed" ? 1 : 0)) /
      sessionState.totalQuestions) *
      100,
  );

  return (
    <div className="grid gap-6 pb-28 xl:grid-cols-[0.72fr_0.28fr] xl:pb-0">
      <section className="space-y-6">
        {/* Lesson header */}
        <div className="panel rounded-[1.75rem] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">{initialLesson.domainTitle}</p>
            <div className="hidden items-center gap-2 md:flex">
              <button
                className="button-secondary"
                onClick={() => setVoiceEnabled((v) => !v)}
                type="button"
              >
                {voiceEnabled ? "Voice on" : "Voice off"}
              </button>
              <button
                className="button-secondary"
                disabled={!lastTutorTurn || !voiceReady}
                onClick={() => lastTutorTurn && speakTurn(lastTutorTurn)}
                type="button"
              >
                Replay voice
              </button>
            </div>
          </div>
          <h2 className="mt-3 text-3xl font-semibold">{initialLesson.title}</h2>
          <p className="text-muted mt-3 leading-7">{initialLesson.summary}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:hidden">
            <button
              className="button-secondary w-full"
              onClick={() => setVoiceEnabled((v) => !v)}
              type="button"
            >
              {voiceEnabled ? "Voice on" : "Voice off"}
            </button>
            <button
              className="button-secondary w-full"
              disabled={!lastTutorTurn || !voiceReady}
              onClick={() => lastTutorTurn && speakTurn(lastTutorTurn)}
              type="button"
            >
              Replay voice
            </button>
          </div>
        </div>

        {/* Conversation */}
        <div className="panel rounded-[1.75rem] p-5 sm:p-6">
          <div className="space-y-4">
            {turns.map((turn) => (
              <article
                key={turn.id}
                className={`rounded-[1.5rem] border p-4 ${
                  turn.actor === "tutor"
                    ? "border-[rgba(23,60,255,0.18)] bg-[rgba(23,60,255,0.08)]"
                    : "border-[var(--border)] bg-white/80"
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
                {turn.actor === "tutor" ? (
                  <div className="mt-3 leading-7">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mt-3 first:mt-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="mt-3 list-disc space-y-2 pl-6 first:mt-0">{children}</ul>,
                        ol: ({ children }) => <ol className="mt-3 list-decimal space-y-2 pl-6 first:mt-0">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                      }}
                    >
                      {renderMarkdown(turn.content)}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="mt-3 whitespace-pre-wrap leading-7">{turn.content}</p>
                )}
              </article>
            ))}
            <div ref={turnsEndRef} />
          </div>

          <form className="mt-6 space-y-3" id="rda-study-form" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium" htmlFor="rda-response">
              Your answer
            </label>
            <textarea
              className="input-base min-h-32 resize-y text-base"
              id="rda-response"
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your answer here. Name the RDA action and the safety, workflow, or scope reason."
              value={draft}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted text-sm">Give your best answer before moving on.</p>
              <button
                className="button-primary"
                disabled={pending || sessionStatus !== "active"}
                type="submit"
              >
                {pending
                  ? "Checking answer..."
                  : sessionStatus === "active"
                    ? "Send answer"
                    : "Lesson complete"}
              </button>
            </div>
            {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}
          </form>
        </div>
      </section>

      {/* Sidebar */}
      <aside className="space-y-4">
        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">Session Status</p>
          <p className="mt-3 text-2xl font-semibold capitalize">{sessionStatus}</p>
          <p className="text-muted mt-3 text-sm leading-6">
            Mastery: {sessionState.masteryScore}% across {sessionState.totalQuestions} guided checks.
          </p>
          <p className="text-muted mt-2 text-sm leading-6">
            Difficulty: {sessionState.difficultyTier}
          </p>
        </div>

        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">Progress</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[rgba(123,144,158,0.14)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent))] transition-[width]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-muted mt-3 text-sm">
            Step {Math.min(sessionState.currentSegmentIndex + 1, sessionState.totalQuestions)} of {sessionState.totalQuestions}
          </p>
        </div>

        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">Learning Goal</p>
          <p className="mt-3 text-sm leading-7">{initialLesson.learningGoal}</p>
        </div>

        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">Next</p>
          <div className="mt-4 space-y-3">
            <Link className="button-secondary w-full" href="/rda/study-plan">
              Back to study plan
            </Link>
            <Link className="button-secondary w-full" href="/rda/quiz">
              Take a domain quiz
            </Link>
            <Link className="button-secondary w-full" href="/rda/dashboard">
              Dashboard
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile sticky submit */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[rgba(247,249,252,0.96)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(32,48,61,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              className="button-secondary w-full"
              onClick={() => setVoiceEnabled((v) => !v)}
              type="button"
            >
              {voiceEnabled ? "Voice on" : "Voice off"}
            </button>
            <button
              className="button-secondary w-full"
              disabled={!lastTutorTurn || !voiceReady}
              onClick={() => lastTutorTurn && speakTurn(lastTutorTurn)}
              type="button"
            >
              Replay voice
            </button>
          </div>
          <button
            className="button-primary w-full"
            disabled={pending || sessionStatus !== "active"}
            form="rda-study-form"
            type="submit"
          >
            {pending
              ? "Checking answer..."
              : sessionStatus === "active"
                ? "Send answer"
                : "Lesson complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
