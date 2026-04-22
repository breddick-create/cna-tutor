"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StartLessonButton({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/rda/tutor/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Could not start the lesson. Try again.");
      }

      router.push(`/rda/study/session/${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the lesson. Try again.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        className="button-primary"
        disabled={pending}
        onClick={handleClick}
        type="button"
      >
        {pending ? "Starting lesson..." : "Start interactive lesson"}
      </button>
      {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}
    </div>
  );
}
