import Link from "next/link";
import { redirect } from "next/navigation";

import { getRdaViewer } from "@/lib/rda/auth/session";

const steps = [
  "Take the required 30-question diagnostic.",
  "Follow the weakest-first study sequence.",
  "Prove each weak area with quizzes.",
  "Use full 75-question mock exams as readiness gates.",
];

export default async function RdaHomePage() {
  const viewer = await getRdaViewer();
  if (viewer) redirect(viewer.profile.role === "admin" ? "/rda-admin" : "/rda/dashboard");

  return (
    <main className="page-shell px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
          <p className="eyebrow">RDA Tutor</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
            Texas Registered Dental Assistant exam prep with one clear next step.
          </h1>
          <p className="text-muted mt-5 max-w-3xl text-lg leading-8">
            RDA Tutor is a readiness-first study path for dental assisting students. It starts
            with a required pre-test, sequences weak areas first, and treats full mock exams as
            meaningful gates before Exam Ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="button-primary" href="/sign-up?product=rda">
              Create Account
            </Link>
            <Link className="button-secondary" href="/sign-in?product=rda">
              Sign In
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step} className="panel rounded-[1.5rem] p-5">
              <span className="text-sm font-semibold text-[color:var(--brand-strong)]">
                Step {index + 1}
              </span>
              <p className="mt-3 font-semibold leading-6">{step}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
