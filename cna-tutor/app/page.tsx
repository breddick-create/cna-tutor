import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandLogo } from "@/components/brand/brand-logo";
import { getViewer } from "@/lib/auth/session";
import { getStudentNextRequiredPathForUser } from "@/lib/progression/stage";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type HowItWorksStep = {
  title: string;
  description: string;
};

type ValueProp = {
  title: string;
  description: string;
};

type ProgramBenefit = {
  title: string;
  description: string;
};

const heroValueProps = [
  "Start with a pre-test that shows what needs help first.",
  "Follow a study plan built around your weak areas.",
  "Keep moving with one clear next step at every stage.",
];

const howItWorksSteps: HowItWorksStep[] = [
  {
    title: "Create Account",
    description: "Get into the student flow in minutes.",
  },
  {
    title: "Take The Pre-Test",
    description: "See what needs work first.",
  },
  {
    title: "Review Results",
    description: "Turn weak areas into a clear starting point.",
  },
  {
    title: "Follow The Study Plan",
    description: "Complete guided study, quizzes, and practice.",
  },
  {
    title: "Reach Exam Ready",
    description: "Build readiness until your results say you are ready.",
  },
];

const valueProps: ValueProp[] = [
  {
    title: "Confidence",
    description: "Know what to study first instead of second-guessing every step.",
  },
  {
    title: "Structure",
    description: "Move through a clear path from pre-test to exam-ready.",
  },
  {
    title: "Focus",
    description: "Work on the topics that need help instead of repeating easy material.",
  },
  {
    title: "Clarity",
    description: "See what this screen is for, why it matters, and what to do next.",
  },
];

const programBenefits: ProgramBenefit[] = [
  {
    title: "Progress Visibility",
    description: "See who is moving, stalled, or improving.",
  },
  {
    title: "At-Risk Detection",
    description: "Spot readiness gaps before students fall behind.",
  },
  {
    title: "Readiness Oversight",
    description: "See who is close to exam day with clearer readiness signals.",
  },
];

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MockScreenshot() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="absolute inset-x-10 top-6 -z-10 h-48 rounded-full bg-[radial-gradient(circle,rgba(23,60,255,0.12),transparent_72%)] blur-2xl" />

      <div className="relative rounded-[2rem] border border-[rgba(29,42,38,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.94))] p-4 shadow-[0_24px_80px_rgba(24,39,75,0.12)]">
        <div className="flex items-center gap-2 border-b border-[rgba(29,42,38,0.08)] pb-3">
          <span className="h-3 w-3 rounded-full bg-[rgba(217,111,50,0.55)]" />
          <span className="h-3 w-3 rounded-full bg-[rgba(232,179,44,0.65)]" />
          <span className="h-3 w-3 rounded-full bg-[rgba(28,124,104,0.55)]" />
          <div className="ml-3 rounded-full border border-[rgba(29,42,38,0.08)] bg-white/90 px-4 py-1 text-[11px] text-[color:var(--text-muted)] shadow-sm">
            cna-tutor.app/dashboard
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-[rgba(29,42,38,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(242,246,250,0.92))] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                  Student Dashboard
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
                  Readiness Score
                </h3>
              </div>

              <div className="rounded-[1.5rem] bg-[linear-gradient(145deg,rgba(23,60,255,0.96),rgba(93,120,138,0.92))] px-5 py-4 text-white shadow-[0_16px_40px_rgba(24,39,75,0.18)]">
                <p className="text-xs uppercase tracking-[0.2em] text-white/72">Readiness</p>
                <p className="mt-2 text-4xl font-semibold">72/100</p>
                <p className="mt-2 text-sm font-medium text-white/84">Making Progress</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/88 p-4">
                <p className="text-sm font-semibold">Next step</p>
                <p className="text-muted mt-2 text-sm leading-6">
                  Continue the next guided module, then take a focused quiz.
                </p>
                <div className="mt-4 inline-flex items-center rounded-full bg-[color:var(--brand-strong)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(23,60,255,0.18)]">
                  Continue to Patient Care Module
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/88 p-4">
                <p className="text-sm font-semibold">Top weak areas</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[rgba(166,60,47,0.16)] bg-[rgba(166,60,47,0.08)] px-3 py-2 text-xs font-semibold text-[color:var(--danger)]">
                    Patient Care
                  </span>
                  <span className="rounded-full border border-[rgba(217,111,50,0.2)] bg-[rgba(217,111,50,0.12)] px-3 py-2 text-xs font-semibold text-[color:var(--accent)]">
                    Infection Control
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[280px] lg:max-w-none">
            <div className="mx-auto rounded-[2.2rem] border border-[rgba(29,42,38,0.08)] bg-[linear-gradient(180deg,rgba(22,27,38,1),rgba(43,51,68,1))] p-3 shadow-[0_22px_48px_rgba(24,39,75,0.18)]">
              <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
              <div className="rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(249,250,252,1),rgba(241,245,249,1))] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                  Today&apos;s focus
                </p>
                <div className="mt-3 rounded-[1.4rem] bg-[linear-gradient(145deg,rgba(23,60,255,0.96),rgba(93,120,138,0.92))] px-4 py-4 text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/72">Readiness</p>
                  <p className="mt-2 text-3xl font-semibold">72</p>
                  <p className="mt-1 text-sm text-white/84">Making Progress</p>
                </div>
                <div className="mt-4 rounded-[1.25rem] border border-[var(--border)] bg-white/92 p-3">
                  <p className="text-sm font-semibold">Next step</p>
                  <p className="text-muted mt-2 text-xs leading-5">
                    Review Infection Control, then continue your next module.
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <span className="block rounded-full bg-[rgba(166,60,47,0.08)] px-3 py-2 text-center text-xs font-semibold text-[color:var(--danger)]">
                    Patient Care
                  </span>
                  <span className="block rounded-full bg-[rgba(217,111,50,0.12)] px-3 py-2 text-center text-xs font-semibold text-[color:var(--accent)]">
                    Infection Control
                  </span>
                </div>
                <div className="mt-4 rounded-full bg-[color:var(--brand-strong)] px-4 py-2 text-center text-sm font-semibold text-white">
                  Continue
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await getViewer();
  const params = await searchParams;
  const authErrorDescription = readParam(params, "error_description");
  const authErrorCode = readParam(params, "error_code");

  if (authErrorDescription) {
    const message =
      authErrorCode === "otp_expired"
        ? "That confirmation link is invalid or has expired. Request a new email confirmation and try again."
        : authErrorDescription.replaceAll("+", " ");

    redirect(`/sign-in?message=${encodeURIComponent(message)}`);
  }

  if (viewer) {
    if (viewer.profile.role === "admin") {
      redirect("/admin");
    }

    const nextRequiredPath = await getStudentNextRequiredPathForUser({
      user: viewer.user,
      userId: viewer.user.id,
    });

    redirect(nextRequiredPath);
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
              <p className="eyebrow mt-4">Texas CNA Exam Prep</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link className="font-semibold text-[color:var(--brand-strong)]" href="/support">
                Need help?
              </Link>
              <Link className="button-secondary" href="/sign-in">
                Sign In
              </Link>
              <Link className="button-primary" href="/sign-up">
                Create Account
              </Link>
            </div>
          </div>
        </header>

        <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div>
              <p className="eyebrow">Texas CNA Exam Prep</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
                Pass the Texas CNA exam with a clear plan built around your weak areas.
              </h1>
              <p className="text-muted mt-5 max-w-3xl text-lg leading-8">
                Start with a pre-test, get a focused study plan, and keep moving until you&apos;re
                exam-ready.
              </p>

              <div className="mt-6 space-y-3">
                {heroValueProps.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--border)] bg-white/78 px-4 py-3"
                  >
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]">
                      <CheckIcon />
                    </span>
                    <p className="text-sm leading-6">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="button-primary" href="/sign-up">
                  Get Started &mdash; It&apos;s Free
                </Link>
                <Link className="button-secondary" href="/sign-in">
                  Sign In
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
                <p className="text-sm font-semibold leading-6">Pre-test driven study plans</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
                <p className="text-sm font-semibold leading-6">Readiness-first dashboard</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
                <p className="text-sm font-semibold leading-6">Guided study and practice exams</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5">
                <p className="text-sm font-semibold leading-6">Built for ACAM students and staff</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel rounded-[2rem] p-8 sm:p-10">
          <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:items-center">
            <div>
              <p className="eyebrow">Preview</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                See what students see after sign-up.
              </h2>
              <p className="text-muted mt-4 max-w-2xl leading-7">
                The dashboard puts readiness, weak areas, and the next step in one place.
              </p>
            </div>

            <MockScreenshot />
          </div>
        </section>

        <section className="panel rounded-[2rem] p-8 sm:p-10">
          <p className="eyebrow">How It Works</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {howItWorksSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5"
              >
                <span className="inline-flex rounded-full bg-[rgba(23,60,255,0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                  Step {index + 1}
                </span>
                <p className="mt-4 text-lg font-semibold">{step.title}</p>
                <p className="text-muted mt-2 text-sm leading-6">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel rounded-[2rem] p-8 sm:p-10">
          <p className="eyebrow">Value Props</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {valueProps.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5"
              >
                <p className="text-lg font-semibold">{item.title}</p>
                <p className="text-muted mt-2 text-sm leading-6">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel rounded-[2rem] p-8 sm:p-10">
          <p className="eyebrow">Program Benefits</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {programBenefits.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5"
              >
                <p className="text-lg font-semibold">{item.title}</p>
                <p className="text-muted mt-2 text-sm leading-6">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel-strong rounded-[2rem] p-8 text-center sm:p-10">
          <p className="eyebrow">Ready To Begin</p>
          <h2 className="mt-4 text-3xl font-semibold">
            Create your account and get your study plan started.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5 text-left">
              <p className="text-sm font-semibold">I&apos;m a student</p>
              <p className="text-muted mt-2 text-sm leading-6">
                Create your account and start the pre-test.
              </p>
              <div className="mt-4">
                <Link className="button-primary w-full md:w-auto" href="/sign-up">
                  Create Account
                </Link>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5 text-left">
              <p className="text-sm font-semibold">I&apos;m a program coordinator</p>
              <p className="text-muted mt-2 text-sm leading-6">
                Get in touch about using CNA Tutor with your program.
              </p>
              <div className="mt-4">
                <Link className="button-secondary w-full md:w-auto" href="/support">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
          <p className="text-muted mt-5 text-sm leading-6">
            No payment required. Your study plan is ready as soon as you finish the pre-test.
          </p>
          <div className="mt-4">
            <Link className="font-semibold text-[color:var(--brand-strong)]" href="/sign-in">
              Already have an account? Sign in
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
