import Link from "next/link";
import { redirect } from "next/navigation";

import { signInAction } from "@/app/(auth)/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { getViewer } from "@/lib/auth/session";
import { getStudentAuthRedirectPathForUser } from "@/lib/ccma/progression/stage";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const TRUST_BAR_STATS = {
  studentsHelped: "500+",
  avgReadinessGain: "38 points",
  passRate: "91%",
} as const;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await getViewer();

  if (viewer) {
    if (viewer.profile.role === "admin") {
      redirect("/ccma-admin");
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
      <p className="eyebrow">Welcome Back</p>
      <h1 className="mt-4 text-3xl font-semibold">Welcome back. Sign in to continue.</h1>

      <form action={signInAction} className="mt-8 space-y-4">
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
            placeholder="name@example.com"
            required
          />
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
            autoComplete="current-password"
            placeholder="Enter your password"
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

        <SubmitButton className="button-primary w-full" pendingText="Signing in...">
          Sign In and Continue
        </SubmitButton>
      </form>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/forgot-password">
          Forgot password?
        </Link>
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/ccma/support">
          Need help?
        </Link>
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/ccma/privacy">
          Privacy
        </Link>
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/ccma/security">
          Security
        </Link>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-8">
        <p className="text-center text-sm font-medium">New to CNA Tutor?</p>
        <div className="mt-4 flex justify-center">
          <Link className="button-secondary w-full sm:w-auto" href="/ccma/sign-up">
            Create your account
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-[1.25rem] border border-[var(--border)] bg-white/55 px-4 py-3">
        <div className="flex flex-col gap-3 text-xs text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="uppercase tracking-[0.18em]">Students helped</p>
            <p className="mt-1 font-semibold text-[color:var(--foreground)]">
              {TRUST_BAR_STATS.studentsHelped}
            </p>
          </div>
          <div>
            <p className="uppercase tracking-[0.18em]">Average readiness gain</p>
            <p className="mt-1 font-semibold text-[color:var(--foreground)]">
              {TRUST_BAR_STATS.avgReadinessGain}
            </p>
          </div>
          <div>
            <p className="uppercase tracking-[0.18em]">Pass rate</p>
            <p className="mt-1 font-semibold text-[color:var(--foreground)]">
              {TRUST_BAR_STATS.passRate}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}



