import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandLogo } from "@/components/brand/brand-logo";
import { getCcmaViewer } from "@/lib/ccma/auth/session";

const steps = [
  {
    title: "Create your account",
    description: "Sign up in a minute and choose English or Spanish before you begin.",
  },
  {
    title: "Take the required pre-test",
    description: "Start with a diagnostic that shows your strongest and weakest CCMA domains.",
  },
  {
    title: "Get a ranked study plan",
    description: "Your next steps are ordered from weakest to strongest so you always know what matters now.",
  },
  {
    title: "Use guided practice",
    description: "Work through tutor sessions, quizzes, drills, and section mocks without guessing what to do next.",
  },
  {
    title: "Check readiness before exam day",
    description: "Use readiness scoring and full mock exams to decide when you are truly exam ready.",
  },
] as const;

export default async function CcmaHomePage() {
  const viewer = await getCcmaViewer();

  if (viewer) {
    redirect(viewer.profile.role === "admin" ? "/ccma-admin" : "/ccma/dashboard");
  }

  return (
    <main className="page-shell px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="panel-strong rounded-[2rem] px-6 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex rounded-[1.25rem] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(32,48,61,0.08)]">
                <BrandLogo className="w-[160px]" priority width={160} />
              </div>
              <p className="eyebrow mt-4">CCMA Tutor</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link className="font-semibold text-[color:var(--brand-strong)]" href="https://hcci-tutor.vercel.app/" target="_blank" rel="noopener noreferrer">
                HCCI Tutor
              </Link>
              <Link className="font-semibold text-[color:var(--brand-strong)]" href="/support">
                Need help?
              </Link>
              <Link className="button-secondary" href="/ccma/sign-in">
                Sign In
              </Link>
              <Link className="button-primary" href="/ccma/sign-up">
                Create Account
              </Link>
            </div>
          </div>
        </header>

        <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow">NHA CCMA Exam Prep</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
                Pass the NHA CCMA exam with a clear plan, guided practice, and readiness checks.
              </h1>
              <p className="text-muted mt-5 max-w-3xl text-lg leading-8">
                CCMA Tutor is a structured study system built to help medical assistant students get
                ready for the NHA CCMA exam. It is open to any CCMA student and any program team
                supporting them.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="button-primary" href="/ccma/sign-up">
                  Create Account
                </Link>
                <Link className="button-secondary" href="/ccma/sign-in">
                  Sign In
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
                <p className="text-sm font-semibold leading-6">Mandatory pre-test and ranked next steps</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
                <p className="text-sm font-semibold leading-6">Weakest-first guided study path</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
                <p className="text-sm font-semibold leading-6">Quizzes, drills, and mock exams</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
                <p className="text-sm font-semibold leading-6">Readiness tracking for students and programs</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel rounded-[2rem] p-8 sm:p-10">
          <p className="eyebrow">How It Works</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5"
              >
                <span className="inline-flex rounded-full bg-[rgba(23,60,255,0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                  Step {index + 1}
                </span>
                <p className="mt-4 text-lg font-semibold">{step.title}</p>
                <p className="text-muted mt-2 text-sm leading-6">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel rounded-[2rem] p-8 sm:p-10">
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-6">
              <p className="text-sm font-semibold">For students</p>
              <h2 className="mt-3 text-2xl font-semibold">Start the pre-test and get your study plan.</h2>
              <p className="text-muted mt-3 leading-7">
                Build from diagnostic results into guided study, quizzes, and full readiness checks
                instead of guessing what to review next.
              </p>
              <div className="mt-5">
                <Link className="button-primary" href="/ccma/sign-up">
                  Create Account
                </Link>
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-6">
              <p className="text-sm font-semibold">For program coordinators</p>
              <h2 className="mt-3 text-2xl font-semibold">Track who is progressing, stuck, or exam ready.</h2>
              <p className="text-muted mt-3 leading-7">
                Give your students a structured readiness-first path and use the CCMA admin view to
                monitor engagement, weak areas, and follow-up needs.
              </p>
              <div className="mt-5">
                <Link className="button-secondary" href="/ccma/sign-in">
                  Sign In
                </Link>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
