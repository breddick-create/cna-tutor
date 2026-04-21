import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-shell flex items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] border border-white/40 bg-[linear-gradient(140deg,rgba(255,27,27,0.96),rgba(93,120,138,0.94)_52%,rgba(23,60,255,0.96))] p-10 text-white shadow-2xl lg:block">
          <div className="inline-flex rounded-[1.5rem] bg-white px-5 py-4 shadow-[0_18px_40px_rgba(15,34,60,0.22)]">
            <BrandLogo className="w-[280px]" priority width={280} />
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-white/74">CNA, CCMA, and Texas RDA Exam Prep</p>
          <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight">
            A calm, clear place to sign in and keep moving through your exam prep.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/84">
            Returning students can jump back into the next step the app recommends. New students
            can create an account from the homepage and start the guided path there.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/76">
            If you need help signing in or resetting your password, support links are always
            available below the form.
          </p>
        </section>
        <div className="space-y-4">
          {children}
          <section className="panel rounded-[1.5rem] px-5 py-4">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link className="font-semibold text-[color:var(--brand-strong)]" href="/privacy">
                Privacy
              </Link>
              <Link className="font-semibold text-[color:var(--brand-strong)]" href="/security">
                Security
              </Link>
              <Link className="font-semibold text-[color:var(--brand-strong)]" href="/support">
                Get help
              </Link>
              <Link className="font-semibold text-[color:var(--brand-strong)]" href="/forgot-password">
                Forgot password?
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

