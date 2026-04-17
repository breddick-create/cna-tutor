import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { env } from "@/lib/env";

export default function PrivacyPage() {
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
              <Link className="button-primary" href="/ccma/sign-in">
                Sign in
              </Link>
            </div>
          </div>
        </header>

        <section className="panel rounded-[2rem] p-8">
          <p className="eyebrow">Privacy</p>
          <h1 className="mt-4 text-4xl font-semibold">How CCMA Tutor handles student data.</h1>
          <div className="text-muted mt-6 space-y-5 leading-8">
            <p>
              CCMA Tutor stores account details, study activity, assessment results, and progress
              information so students can get the right support and authorized staff can track progress.
            </p>
            <p>
              Students see only their own study progress. Admin views are for authorized program
              staff who need reporting, engagement visibility, and student follow-up.
            </p>
            <p>
              Passwords are handled through the secure sign-in provider and are not shown to staff
              inside the app. Sensitive keys stay on the server.
            </p>
            <p>
              If your program needs a data-use statement, contact{" "}
              {env.supportEmail ? (
                <a className="font-semibold text-[color:var(--brand-strong)]" href={`mailto:${env.supportEmail}`}>
                  {env.supportEmail}
                </a>
              ) : (
                "your program administrator"
              )}{" "}
              for the current privacy and retention guidance.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

