import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { env } from "@/lib/env";

const supportOptions = [
  "Forgot your password? Use the reset link flow from the sign-in screen.",
  "Need help getting into the right account? Contact your program administrator or support contact first.",
  "Need staff access? A current admin can promote your account from the admin access page.",
];

export default function SupportPage() {
  return (
    <main className="page-shell px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="panel-strong rounded-[2rem] px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="rounded-[1.25rem] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(32,48,61,0.08)]">
              <BrandLogo className="w-[160px]" priority width={160} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="button-secondary" href="/">
                Home
              </Link>
              <Link className="button-primary" href="/sign-in">
                Sign in
              </Link>
            </div>
          </div>
        </header>

        <section className="panel rounded-[2rem] p-8">
          <p className="eyebrow">Support</p>
          <h1 className="mt-4 text-4xl font-semibold">Get help and get back into your study plan.</h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            If you are stuck on sign-in, password reset, or account access, start here. The goal is
            to get you back to studying as quickly as possible.
          </p>
          <div className="mt-6 space-y-4">
            {supportOptions.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4"
              >
                <p className="text-sm leading-7">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
            <p className="text-sm font-semibold">Contact</p>
            <p className="text-muted mt-2 text-sm leading-7">
              {env.supportEmail ? (
                <>
                  For sign-in, account, or program support, email{" "}
                  <a className="font-semibold text-[color:var(--brand-strong)]" href={`mailto:${env.supportEmail}`}>
                    {env.supportEmail}
                  </a>
                  .
                </>
              ) : (
                "For sign-in, account, or program support, contact your ACAM program administrator or designated help contact."
              )}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
