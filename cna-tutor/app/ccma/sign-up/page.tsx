import Link from "next/link";
import { redirect } from "next/navigation";

import { SubmitButton } from "@/components/auth/submit-button";
import { LANGUAGE_OPTIONS } from "@/lib/ccma/i18n/languages";
import { getCcmaViewer } from "@/lib/ccma/auth/session";
import { ccmaSignUpAction } from "@/app/ccma/actions";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CcmaSignUpPage({
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
      <p className="eyebrow">Start Here</p>
      <h1 className="mt-4 text-3xl font-semibold">Create your CCMA Tutor account</h1>
      <p className="text-muted mt-3 leading-7">
        Start the NHA CCMA study flow with a required pre-test, a ranked study plan, and guided practice.
      </p>

      <form action={ccmaSignUpAction} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="full_name">
            Full name
          </label>
          <input
            autoComplete="name"
            className="input-base"
            id="full_name"
            name="full_name"
            placeholder="Jamie Martinez"
            required
            type="text"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="input-base"
            id="email"
            name="email"
            placeholder="jamie@example.com"
            required
            type="email"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="cohort">
            School or program (optional)
          </label>
          <input
            className="input-base"
            id="cohort"
            name="cohort"
            placeholder="City College MA Program"
            type="text"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="preferred_language">
            Language preference
          </label>
          <select
            className="input-base"
            defaultValue="en"
            id="preferred_language"
            name="preferred_language"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            autoComplete="new-password"
            className="input-base"
            id="password"
            name="password"
            placeholder="Choose a strong password"
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

        <SubmitButton className="button-primary w-full" pendingText="Creating account...">
          Create Account
        </SubmitButton>
        <p className="text-muted text-center text-sm leading-6">
          You&apos;ll start the pre-test immediately after.
        </p>
      </form>

      <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
        <p className="text-sm font-semibold">Already have an account?</p>
        <div className="mt-4">
          <Link className="button-secondary" href="/ccma/sign-in">
            Sign in instead
          </Link>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link
          className="text-sm font-medium text-[color:var(--brand-strong)]"
          href="https://cna-tutor.vercel.app/"
          rel="noopener noreferrer"
          target="_blank"
        >
          ← Back to CNA Tutor
        </Link>
      </div>
    </section>
  );
}
