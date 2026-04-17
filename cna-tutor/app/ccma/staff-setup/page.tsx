import Link from "next/link";
import { redirect } from "next/navigation";

import { SubmitButton } from "@/components/auth/submit-button";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getCcmaViewer } from "@/lib/ccma/auth/session";
import { ccmaStaffSetupAction } from "@/app/ccma/actions";
import {
  isValidCcmaStaffAccessToken,
  resolveCcmaStaffAccessToken,
} from "@/lib/ccma/auth/staff-access";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CcmaStaffSetupPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await getCcmaViewer();

  if (viewer) {
    redirect(viewer.profile.role === "admin" ? "/ccma-admin" : "/ccma/dashboard");
  }

  const params = await searchParams;
  const inviteToken =
    typeof params.code === "string"
      ? resolveCcmaStaffAccessToken(params.code)
      : "";

  if (!isValidCcmaStaffAccessToken(inviteToken)) {
    redirect("/ccma/sign-in");
  }

  const message =
    typeof params.message === "string" ? decodeURIComponent(params.message) : null;

  return (
    <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
      <BrandLogo className="w-[220px]" priority width={220} />
      <p className="eyebrow mt-6">Staff Setup</p>
      <h1 className="mt-4 text-3xl font-semibold">Create your CCMA staff account.</h1>
      <p className="text-muted mt-3 leading-7">
        Your invite is valid. Finish setup to access the CCMA coordinator dashboard.
      </p>

      <form action={ccmaStaffSetupAction} className="mt-8 space-y-4">
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
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/support">
          Need help?
        </Link>
      </div>
    </section>
  );
}
