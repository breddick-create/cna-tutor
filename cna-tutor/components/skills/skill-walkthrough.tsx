"use client";

import { useState } from "react";

import { recordCnaSkillPracticeAction } from "@/app/(student)/actions";

export function SkillWalkthrough({
  skillSlug,
  returnPath,
  steps,
}: {
  skillSlug: string;
  returnPath: string;
  steps: string[];
}) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const allChecked = checked.size === steps.length;

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div>
      <div className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <button
            key={index}
            className={`w-full cursor-pointer rounded-[1.5rem] border p-4 text-left transition active:scale-[0.99] ${
              checked.has(index)
                ? "border-[rgba(28,124,104,0.28)] bg-[rgba(231,248,243,0.92)]"
                : "border-[var(--border)] bg-white/78 hover:bg-white/90"
            }`}
            onClick={() => toggle(index)}
            type="button"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  checked.has(index)
                    ? "bg-[rgba(28,124,104,0.18)] text-[color:#145f50]"
                    : "bg-[rgba(123,144,158,0.14)] text-[color:var(--foreground)]"
                }`}
              >
                {checked.has(index) ? "✓" : index + 1}
              </span>
              <p className="text-sm leading-6">{step}</p>
            </div>
          </button>
        ))}
      </div>

      <form action={recordCnaSkillPracticeAction} className="mt-5">
        <input name="skill_slug" type="hidden" value={skillSlug} />
        <input name="mode" type="hidden" value="walkthrough" />
        <input name="return_path" type="hidden" value={returnPath} />
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            className="button-primary w-full sm:w-auto"
            disabled={!allChecked}
            type="submit"
          >
            {allChecked
              ? "Mark walkthrough complete"
              : `${checked.size} / ${steps.length} steps checked`}
          </button>
          {!allChecked ? (
            <p className="text-muted text-sm">
              Tap each step as you complete it, then submit.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
