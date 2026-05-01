"use client";

import { useEffect, useRef, useState } from "react";

import { recordCnaSkillPracticeAction } from "@/app/(student)/actions";

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SkillTimedPractice({
  skillSlug,
  returnPath,
  timingBand,
}: {
  skillSlug: string;
  returnPath: string;
  timingBand: string;
}) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    setElapsed(0);
    setPhase("running");
  }

  function stop() {
    setPhase("done");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function reset() {
    setPhase("idle");
    setElapsed(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    if (phase === "running") {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [phase]);

  return (
    <div>
      <div className="mt-4 rounded-[1.5rem] border border-[rgba(217,111,50,0.18)] bg-[rgba(255,249,243,0.92)] p-4">
        <p className="text-sm font-semibold text-[color:#9a4f17]">Timing bands</p>
        <p className="mt-2 text-sm leading-6 text-[color:#5f3a1a]">
          Short: 3–5 min · Moderate: 5–8 min · Long: 8–12 min · Extended: 12–15 min.
          This skill is in the{" "}
          <span className="font-semibold capitalize">{timingBand}</span> band. Start
          the timer, perform the skill from memory, then stop when finished.
        </p>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">
              {phase === "idle"
                ? "Ready to start"
                : phase === "running"
                  ? "Timer running"
                  : "Run complete"}
            </p>
            <p
              className={`mt-2 font-mono text-4xl font-semibold tabular-nums ${
                phase === "running" ? "text-[color:var(--brand-strong)]" : ""
              }`}
            >
              {formatElapsed(elapsed)}
            </p>
          </div>

          {phase === "idle" ? (
            <button className="button-primary w-full sm:w-auto" onClick={start} type="button">
              Start timer
            </button>
          ) : phase === "running" ? (
            <button
              className="rounded-[1.25rem] border border-[rgba(166,60,47,0.28)] bg-[rgba(166,60,47,0.1)] px-5 py-3 text-sm font-semibold text-[color:var(--danger)] transition hover:bg-[rgba(166,60,47,0.16)]"
              onClick={stop}
              type="button"
            >
              Stop timer
            </button>
          ) : null}
        </div>

        {phase === "running" ? (
          <p className="text-muted mt-3 text-sm leading-6">
            Perform the skill from memory. Hit stop when you finish.
          </p>
        ) : null}
      </div>

      {phase === "done" ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-[1.5rem] border border-[rgba(28,124,104,0.28)] bg-[rgba(231,248,243,0.92)] p-4">
            <p className="text-sm font-semibold text-[color:#145f50]">
              Run logged — {formatElapsed(elapsed)}
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:#1e4a40]">
              Submit below to save this timed run and update your skills readiness.
            </p>
          </div>

          <form action={recordCnaSkillPracticeAction}>
            <input name="skill_slug" type="hidden" value={skillSlug} />
            <input name="mode" type="hidden" value="timed" />
            <input name="return_path" type="hidden" value={returnPath} />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button className="button-primary w-full sm:w-auto" type="submit">
                Mark timed run complete
              </button>
              <button
                className="button-secondary w-full sm:w-auto"
                onClick={reset}
                type="button"
              >
                Run again
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
