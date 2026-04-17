import Link from "next/link";
import { redirect } from "next/navigation";

import { signUpAction } from "@/app/(auth)/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { getViewer } from "@/lib/auth/session";
import { LANGUAGE_OPTIONS } from "@/lib/i18n/languages";
import { getStudentAuthRedirectPathForUser } from "@/lib/progression/stage";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await getViewer();

  if (viewer) {
    if (viewer.profile.role === "admin") {
      redirect("/admin");
    }

    redirect(
      await getStudentAuthRedirectPathForUser({
        user: viewer.user,
        userId: viewer.user.id,
      }),
    );
  }

  const params = await searchParams;
  const message =
    typeof params.message === "string" ? decodeURIComponent(params.message) : null;

  return (
    <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
      <p className="eyebrow">Start Here</p>
      <h1 className="mt-4 text-3xl font-semibold">Create your account</h1>
      <p className="text-muted mt-3 leading-7">
        You&apos;re minutes away from your personalized study plan.
      </p>
      <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
        <p className="text-sm font-semibold">What happens right after you sign up</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/85 px-4 py-3">
            <p className="text-sm leading-6">1. You start with the pre-test</p>
          </div>
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/85 px-4 py-3">
            <p className="text-sm leading-6">2. Your results identify weak areas</p>
          </div>
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/85 px-4 py-3">
            <p className="text-sm leading-6">3. Your personalized study plan is created right away</p>
          </div>
        </div>
      </div>

      <form action={signUpAction} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="full_name">
            Full name
          </label>
          <input
            className="input-base"
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            placeholder="Jamie Martinez"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="input-base"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jamie@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="cohort">
            Program or class (optional)
          </label>
          <input
            className="input-base"
            id="cohort"
            name="cohort"
            type="text"
            placeholder="Houston Spring 2026"
          />
          <p className="text-muted mt-2 text-xs leading-6">
            If you&apos;re enrolled in an ACAM workforce program or CNA training class, you can
            enter it here. Your coordinator may have given you a name or code to use.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="preferred_language">
            Preferred language
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
          <p className="text-muted mt-2 text-xs leading-6">
            Guided lessons will use this language when that support is available.
          </p>
        </div>

      <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            className="input-base"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Choose a strong password"
            required
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
        <p className="text-muted mt-2 text-sm leading-6">
          Sign in to return to your study plan and pick up where you left off.
        </p>
        <div className="mt-4">
          <Link className="button-secondary" href="/sign-in">
            Sign in instead
          </Link>
        </div>
      </div>
    </section>
  );
}
