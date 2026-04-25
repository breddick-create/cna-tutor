"use client";

import { useActionState, useState } from "react";

import {
  initialUpdateStudentPasswordState,
  updateStudentPasswordAction,
} from "@/app/admin/actions";

function buildGeneratedPassword() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    const seed = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    return `Tutor${seed}9`;
  }

  return `Tutor${Math.random().toString(36).slice(2, 10)}9`;
}

export function StudentPasswordForm({
  userId,
  studentName,
}: {
  userId: string;
  studentName: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateStudentPasswordAction,
    initialUpdateStudentPasswordState,
  );
  const [password, setPassword] = useState("");

  function handleGeneratePassword() {
    setPassword(buildGeneratedPassword());
  }

  return (
    <form action={formAction} className="mt-4 rounded-[1.25rem] border border-[var(--border)] bg-white/70 p-3">
      <input name="user_id" type="hidden" value={userId} />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
        Set student password
      </p>
      <p className="text-muted mt-2 text-xs leading-5">
        Update {studentName}&apos;s password here, then share it with the student directly.
      </p>
      <div className="mt-3 flex flex-col gap-3">
        <input
          className="input-base text-sm"
          name="new_password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter a temporary password"
          type="text"
          value={password}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <button className="button-secondary w-full sm:w-auto" onClick={handleGeneratePassword} type="button">
            Generate password
          </button>
          <button className="button-primary w-full sm:w-auto" disabled={pending} type="submit">
            {pending ? "Saving..." : "Save password"}
          </button>
        </div>
      </div>
      <p className="text-muted mt-2 text-xs leading-5">
        Passwords must be at least 8 characters and include a letter and a number.
      </p>
      {state.message ? (
        <p
          className={`mt-3 text-sm ${
            state.status === "error" ? "text-[color:var(--danger)]" : "text-[color:var(--brand-strong)]"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
