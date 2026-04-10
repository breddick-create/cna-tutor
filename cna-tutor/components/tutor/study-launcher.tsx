"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { TutorMode } from "@/lib/tutor/types";

const modeLabels: Record<TutorMode, string> = {
  learn: "Learn mode",
  quiz: "Quiz mode",
  mock_exam: "Mock exam",
  weak_area_review: "Weak-area review",
  study_plan: "Study plan",
  rapid_review: "Rapid review",
};

const modeDescriptions: Record<TutorMode, string> = {
  learn: "Teacher-led teaching with explanation, questions, and correction.",
  quiz: "Shorter coaching with direct exam-style checking.",
  mock_exam: "Reserved for longer simulated testing flows.",
  weak_area_review: "Extra reteaching on concepts you have missed before.",
  study_plan: "Reserved for guided planning and pacing support.",
  rapid_review: "Fast, high-yield reminders and quick checks.",
};

function getButtonLabel(mode: TutorMode) {
  if (mode === "quiz") {
    return "Start quiz check";
  }

  if (mode === "rapid_review") {
    return "Start rapid review";
  }

  if (mode === "weak_area_review") {
    return "Start weak-area review";
  }

  return "Start teacher-led lesson";
}

export function StudyLauncher({
  lessonId,
  supportedModes,
  defaultMode,
  initialMode,
}: {
  lessonId: string;
  supportedModes: TutorMode[];
  defaultMode: TutorMode;
  initialMode?: TutorMode;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<TutorMode>(
    initialMode && supportedModes.includes(initialMode) ? initialMode : defaultMode,
  );

  async function handleStart() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/tutor/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId, mode: selectedMode }),
      });

      if (!response.ok) {
        throw new Error("Unable to start the lesson.");
      }

      const data = (await response.json()) as { sessionId: string };
      router.push(`/study/${data.sessionId}`);
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : "Unable to start the lesson.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      {supportedModes.length > 1 ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor={`mode-${lessonId}`}>
            Session mode
          </label>
          <select
            className="input-base"
            id={`mode-${lessonId}`}
            onChange={(event) => setSelectedMode(event.target.value as TutorMode)}
            value={selectedMode}
          >
            {supportedModes.map((mode) => (
              <option key={mode} value={mode}>
                {modeLabels[mode]}
              </option>
            ))}
          </select>
          <p className="text-muted text-sm leading-6">{modeDescriptions[selectedMode]}</p>
        </div>
      ) : null}

      <button className="button-primary w-full" disabled={pending} onClick={handleStart} type="button">
        {pending ? "Starting lesson..." : getButtonLabel(selectedMode)}
      </button>
      {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}
    </div>
  );
}
