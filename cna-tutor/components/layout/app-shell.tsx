import Link from "next/link";

import { signOutAction } from "@/app/(auth)/actions";
import { BrandLogo } from "@/components/brand/brand-logo";

export function AppShell({
  children,
  roleLabel,
  title,
  subtitle,
  email,
  navigation,
  signOutLabel = "Sign out",
}: {
  children: React.ReactNode;
  roleLabel: string;
  title: string;
  subtitle: string;
  email: string;
  navigation?: Array<{ href: string; label: string }>;
  signOutLabel?: string;
}) {
  const defaultNavigation =
    roleLabel === "Admin"
      ? [
          { href: "/admin", label: "Overview" },
          { href: "/admin/access", label: "Access" },
        ]
      : [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/study", label: "Study" },
          { href: "/study-plan", label: "Plan" },
          { href: "/quiz", label: "Quiz" },
          { href: "/mock-exam", label: "Mock Exam" },
        ];

  const navItems = navigation ?? defaultNavigation;

  return (
    <div className="page-shell px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header
          className="panel-strong flex flex-col gap-5 rounded-[2rem] px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
          data-app-shell-header
        >
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-[1.25rem] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(32,48,61,0.08)]">
                <BrandLogo className="w-[140px]" width={140} />
              </div>
              <span className="rounded-full bg-[rgba(23,60,255,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                {roleLabel}
              </span>
              <p className="text-muted text-sm">{email}</p>
            </div>
            <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
            <p className="text-muted mt-2 max-w-2xl leading-7">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/75 p-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-[rgba(23,60,255,0.07)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <form action={signOutAction}>
              <button className="button-secondary" type="submit">
                {signOutLabel}
              </button>
            </form>
          </div>
        </header>

        <section>{children}</section>
      </div>
    </div>
  );
}
