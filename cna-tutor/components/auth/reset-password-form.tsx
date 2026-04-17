"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    if (!password || !confirmPassword) {
      setError("Enter your new password twice.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Those passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }

    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("We couldn't update your password. Try again.");
      setPending(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/sign-in?message=Your%20password%20was%20updated.%20Sign%20in%20with%20your%20new%20password.");
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="new-password">
          New password
        </label>
        <input
          className="input-base"
          id="new-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Choose a new password"
          required
          type="password"
          value={password}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="confirm-password">
          Confirm new password
        </label>
        <input
          className="input-base"
          id="confirm-password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter your new password"
          required
          type="password"
          value={confirmPassword}
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.9)] px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <button className="button-primary w-full" disabled={pending} type="submit">
        {pending ? "Saving password..." : "Save new password"}
      </button>
    </form>
  );
}
