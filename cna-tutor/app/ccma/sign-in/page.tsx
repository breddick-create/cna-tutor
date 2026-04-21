import Link from "next/link";
import { redirect } from "next/navigation";

import { SubmitButton } from "@/components/auth/submit-button";
import { getCcmaViewer } from "@/lib/ccma/auth/session";
import { ccmaSignInAction } from "@/app/ccma/actions";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CcmaSignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await getCcmaViewer();

  if (viewer) {
    redirect(viewer.profile.role === "admin" ? "/ccma-admin" : "/ccma/dashboard");
  }

  const params = await searchParams;
  const message =
    typeof params.message === "string" ? decodeURIComponent(params.message) : null;

  return (
    <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
      <p className="eyebrow">Welcome Back</p>
      <h1 className="mt-4 text-3xl font-semibold">Sign in to continue your CCMA prep.</h1>

      <form action={ccmaSignInAction} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="input-base"
            id="email"
            name="email"
            placeholder="name@example.com"
            required
            type="email"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            autoComplete="current-password"
            className="input-base"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            type="password"
          />
        </div>

        {message ? (
          <div
            aria-live="polite"
            className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.9)] px-4 py-3 text-sm"
          >
            {message}
          </div>
        ) : null}

        <SubmitButton className="button-primary w-full" pendingText="Signing in...">
          Sign In
        </SubmitButton>
      </form>

      <div className="mt-8 border-t border-[var(--border)] pt-8">
        <p className="text-center text-sm font-medium">New to CCMA Tutor?</p>
        <div className="mt-4 flex justify-center">
          <Link className="button-secondary w-full sm:w-auto" href="/ccma/sign-up">
            Create your account
          </Link>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link
          className="text-sm font-medium text-[color:var(--brand-strong)]"
          href="https://hcci-tutor.vercel.app/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Back to HCCI Tutor
        </Link>
      </div>
    </section>
  );
}
