import Link from "next/link";
import { redirect } from "next/navigation";

import { signUpAction } from "@/app/(auth)/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { getViewer } from "@/lib/auth/session";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await getViewer();

  if (viewer) {
    redirect(viewer.profile.role === "admin" ? "/admin" : "/dashboard");
  }

  const params = await searchParams;
  const message =
    typeof params.message === "string" ? decodeURIComponent(params.message) : null;

  return (
    <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
      <p className="eyebrow">Create Account</p>
      <h2 className="mt-4 text-3xl font-semibold">Start the CCMA tutoring workspace.</h2>
      <p className="text-muted mt-3 leading-7">
        Student accounts are self-contained by default. Admin access is assigned deliberately in
        the database.
      </p>

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
          <label className="mb-2 block text-sm font-medium" htmlFor="username">
            Username
          </label>
          <input
            className="input-base"
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="jmartinez"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="cohort">
            Cohort
          </label>
          <input
            className="input-base"
            id="cohort"
            name="cohort"
            type="text"
            placeholder="CCMA Cohort Spring 2026"
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
            autoComplete="new-password"
            placeholder="Choose a strong password"
            required
          />
        </div>

        {message ? (
          <div className="rounded-2xl border border-[rgba(29,42,38,0.14)] bg-white/65 px-4 py-3 text-sm">
            {message}
          </div>
        ) : null}

        <SubmitButton className="button-primary w-full" pendingText="Creating account...">
          Create account
        </SubmitButton>
      </form>

      <p className="text-muted mt-6 text-sm">
        Already have an account?{" "}
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/sign-in">
          Sign in
        </Link>
        .
      </p>
    </section>
  );
}
