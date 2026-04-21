import Link from "next/link";

import { signOutAction } from "@/app/(auth)/actions";
import { requireViewer } from "@/lib/auth/session";

const expectationCards = [
  {
    title: "Why this matters",
    description:
      "The pre-test decides where your study plan starts, so you can focus on the areas that need the most help first.",
  },
  {
    title: "How long it takes",
    description: "Plan for about 10 to 15 minutes from start to finish.",
  },
  {
    title: "How to approach it",
    description:
      "Answer honestly. There is no penalty for a lower score, and honest answers lead to a better study plan.",
  },
];

const nextSteps = [
  "Your results will show which Texas CNA topics already look stronger and which ones need more help.",
  "The app will build your personalized study plan automatically.",
  "You will know which lesson, quiz, or review step to do first.",
];

export default async function PretestIntroPage() {
  await requireViewer();

  return (
    <div className="space-y-8">
      <section className="panel-strong rounded-[1.75rem] p-6 sm:p-8">
        <p className="eyebrow">Required Pre-Test</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl">
          Start with a short pre-test so the app can build the right study plan for you.
        </h1>
        <p className="text-muted mt-4 max-w-3xl leading-7">
          This first step is here to help, not to judge. The pre-test is designed to identify your
          strengths and weak areas so HCCI Tutor can guide you with more structure and confidence.
        </p>
        <p className="text-muted mt-3 max-w-3xl text-sm leading-7">
          You will see what to study first as soon as this is done. If you need to stop, you can
          come back later and pick up from here.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {expectationCards.map((card) => (
          <article
            key={card.title}
            className="panel rounded-[1.5rem] p-5"
          >
            <p className="text-sm font-semibold">{card.title}</p>
            <p className="text-muted mt-3 text-sm leading-6">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">What Happens After This</p>
          <div className="mt-4 space-y-3">
            {nextSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4"
              >
                <p className="text-sm font-semibold">{index + 1}. Next</p>
                <p className="text-muted mt-2 text-sm leading-6">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Next Step</p>
          <h2 className="mt-3 text-3xl font-semibold">Start the pre-test now.</h2>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Finish this first check so the app can show your weak areas and build the study plan
            you should follow next.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary flex-1" href="/pretest/start">
              Start Pre-Test Now
            </Link>
            <form action={signOutAction} className="sm:flex-1">
              <button className="button-secondary w-full" type="submit">
                Save and Return Later
              </button>
            </form>
          </div>

          <div className="mt-6 border-t border-[var(--border)] pt-6">
            <p className="eyebrow">Before You Start</p>
          </div>
          <div className="mt-4 space-y-4">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4">
              <p className="text-sm font-semibold">Estimated time</p>
              <p className="text-muted mt-2 text-sm leading-6">About 10 to 15 minutes.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4">
              <p className="text-sm font-semibold">Best way to answer</p>
              <p className="text-muted mt-2 text-sm leading-6">
                Choose the answer you truly believe is best. Honest answers create a better study
                plan than guessing your way to a higher score.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4">
              <p className="text-sm font-semibold">No penalty for weak areas</p>
              <p className="text-muted mt-2 text-sm leading-6">
                Lower-scoring areas simply show the app where to focus first.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4">
              <p className="text-sm font-semibold">Need help?</p>
              <p className="text-muted mt-2 text-sm leading-6">
                If you have trouble signing in or getting back later, use support or password help.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link className="button-secondary" href="/support">
                  Get help
                </Link>
                <Link className="button-secondary" href="/forgot-password">
                  Forgot password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
