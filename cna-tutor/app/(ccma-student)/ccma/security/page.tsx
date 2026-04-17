import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";

export default function SecurityPage() {
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
          <p className="eyebrow">Security</p>
          <h1 className="mt-4 text-4xl font-semibold">How CNA Tutor protects your account.</h1>
          <div className="text-muted mt-6 space-y-5 leading-8">
            <p>
              Sign-in is handled through a managed provider, with secure sessions used across the app.
            </p>
            <p>
              Student and admin views are separated so students see only their own records while
              authorized admins can access reporting and account management tools.
            </p>
            <p>
              Password recovery is available through a secure email reset flow, and admin access can
              be limited through controlled account setup and admin-only promotion tools.
            </p>
            <p>
              If you think someone accessed your account or student data the wrong way, contact your
              program administrator right away and reset your password.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

