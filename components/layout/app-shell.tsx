import Link from "next/link";

import { signOutAction } from "@/app/(auth)/actions";

export function AppShell({
  children,
  roleLabel,
  title,
  subtitle,
  fullName,
  email,
}: {
  children: React.ReactNode;
  roleLabel: string;
  title: string;
  subtitle: string;
  fullName: string;
  email: string;
}) {
  const navigation =
    roleLabel === "Admin"
      ? [{ href: "/admin", label: "Overview" }]
      : [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/study", label: "Study" },
          { href: "/study-plan", label: "Plan" },
          { href: "/quiz", label: "Quiz" },
          { href: "/mock-exam", label: "Mock Exam" },
        ];

  return (
    <div className="page-shell px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="panel-strong flex flex-col gap-5 rounded-[2rem] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[rgba(28,124,104,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                {roleLabel}
              </span>
              <p className="text-muted text-sm">{email}</p>
            </div>
            <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
            <p className="text-muted mt-2 max-w-2xl leading-7">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/65 p-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-[rgba(29,42,38,0.06)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <form action={signOutAction}>
              <button className="button-secondary" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.78fr_0.22fr]">
          <div>{children}</div>

          <aside className="space-y-4">
            <div className="panel rounded-[1.5rem] p-5">
              <p className="eyebrow">Signed In As</p>
              <p className="mt-3 text-xl font-semibold">{fullName}</p>
              <p className="text-muted mt-2 text-sm">{email}</p>
            </div>

            <div className="panel rounded-[1.5rem] p-5">
              <p className="eyebrow">Why This Foundation Matters</p>
              <ul className="mt-4 space-y-3 text-sm leading-6">
                <li>Secure roles keep student and admin data cleanly separated.</li>
                <li>Supabase SSR makes auth work in server components and route handlers.</li>
                <li>The schema now supports tutoring, scoring, tracking, and reporting.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
