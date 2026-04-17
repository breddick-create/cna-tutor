import Link from "next/link";
import { redirect } from "next/navigation";

import { staffSetupAction } from "@/app/(auth)/actions";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SubmitButton } from "@/components/auth/submit-button";
import { resolveStaffAccessToken } from "@/lib/auth/staff-access";
import { getViewer } from "@/lib/auth/session";
import { getStudentAuthRedirectPathForUser } from "@/lib/ccma/progression/stage";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function StaffSetupPage({
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
  const inviteToken = resolveStaffAccessToken(params);

  if (!inviteToken) {
    redirect("/ccma/sign-in");
  }

  const message =
    typeof params.message === "string" ? decodeURIComponent(params.message) : null;

  return (
    <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
      <BrandLogo className="w-[220px]" priority width={220} />
      <p className="eyebrow mt-6">Staff Setup</p>
      <h1 className="mt-4 text-3xl font-semibold">Create your staff account.</h1>
      <p className="text-muted mt-3 leading-7">
        Your staff invite has been confirmed. Finish your account setup to go straight to the
        admin dashboard.
      </p>
      <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
        <p className="text-sm font-semibold">What happens next</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/85 px-4 py-3">
            <p className="text-sm leading-6">1. Create your staff account</p>
          </div>
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/85 px-4 py-3">
            <p className="text-sm leading-6">2. Confirm your email if needed</p>
          </div>
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/85 px-4 py-3">
            <p className="text-sm leading-6">3. Go straight to the admin dashboard</p>
          </div>
        </div>
      </div>

      <form action={staffSetupAction} className="mt-8 space-y-4">
        <input name="invite_token" type="hidden" value={inviteToken} />

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="full_name">
            Full name
          </label>
          <input
            autoComplete="name"
            className="input-base"
            id="full_name"
            name="full_name"
            placeholder="Jordan Lee"
            required
            type="text"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Work email
          </label>
          <input
            autoComplete="email"
            className="input-base"
            id="email"
            name="email"
            placeholder="jordan@example.org"
            required
            type="email"
          />
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

        <SubmitButton className="button-primary w-full" pendingText="Creating staff account...">
          Create Staff Account
        </SubmitButton>
      </form>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/ccma/sign-in">
          Back to sign in
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
    </section>
  );
}


