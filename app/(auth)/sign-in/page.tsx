import Link from "next/link";
import { redirect } from "next/navigation";

import { signInAction } from "@/app/(auth)/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { getViewer } from "@/lib/auth/session";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignInPage({
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
      <p className="eyebrow">Welcome Back</p>
      <h2 className="mt-4 text-3xl font-semibold">Sign in to continue teaching and learning.</h2>
      <p className="text-muted mt-3 leading-7">
        Students see only their own study progress. Admins get program-wide visibility.
      </p>

      <form action={signInAction} className="mt-8 space-y-4">
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
            placeholder="Enter your username"
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
          <div className="rounded-2xl border border-[rgba(29,42,38,0.14)] bg-white/65 px-4 py-3 text-sm">
            {message}
          </div>
        ) : null}

        <SubmitButton className="button-primary w-full" pendingText="Signing in...">
          Sign in
        </SubmitButton>
      </form>

      <p className="text-muted mt-6 text-sm">
        Need an account?{" "}
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/sign-up">
          Create one here
        </Link>
        .
      </p>
    </section>
  );
}
