import Link from "next/link";
import { redirect } from "next/navigation";

import { PretestDomainSection } from "@/components/ccma/pretest-domain-section";
import { requireCcmaViewer } from "@/lib/ccma/auth/session";
import {
  getPretestDomainBreakdown,
  getPretestScore,
  hasCompletedPretest,
} from "@/lib/ccma/onboarding/pretest";
import { buildPretestResultsViewModel } from "@/lib/ccma/onboarding/pretest-results";

const readinessToneStyles = {
  low: "bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]",
  mid: "bg-[rgba(255,185,0,0.16)] text-[color:#7a5700]",
  high: "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]",
} as const;

export default async function PretestResultsPage() {
  const viewer = await requireCcmaViewer();

  if (!hasCompletedPretest(viewer.user)) {
    redirect("/ccma/pretest");
  }

  const score = getPretestScore(viewer.user);
  const breakdown = getPretestDomainBreakdown(viewer.user);

  if (score === null || breakdown.length === 0) {
    redirect("/ccma/pretest");
  }

  const results = buildPretestResultsViewModel({
    score,
    breakdown,
  });

  return (
    <div className="space-y-8">
      <section className="panel-strong rounded-[1.75rem] p-6 sm:p-8">
        <p className="eyebrow">Pre-Test Results</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl">
          Your pre-test is complete. Now you have a clear plan for what to study next.
        </h1>
        <p className="text-muted mt-4 max-w-3xl leading-7">
          This score is a starting point, not a final judgment. It shows where you are
          strongest, where you need the most support, and what to work on first.
        </p>
        <p className="text-muted mt-3 max-w-3xl text-sm leading-7">
          Your next move is simple: open the study plan and start with the first topic in the
          priority order below.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Overall Score</p>
          <p className="mt-3 text-5xl font-semibold">{results.score}%</p>
          <p className="text-muted mt-3 text-sm leading-6">
            Based on your first pre-test across the NHA CCMA exam domains.
          </p>
        </div>

        <div className="panel rounded-[1.75rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Next Step</p>
              <h2 className="mt-3 text-3xl font-semibold">Open your study plan and start with the first topic.</h2>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${readinessToneStyles[results.readiness.tone]}`}
            >
              {results.readiness.label}
            </span>
          </div>
          <p className="mt-4 text-sm font-medium leading-6">
            {results.readiness.summary}
          </p>
          <p className="text-muted mt-3 text-sm leading-6">
            {results.readiness.encouragement}
          </p>
          <div className="mt-6">
            <Link className="button-primary" href="/ccma/study-plan">
              Start your study plan
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <PretestDomainSection
          emptyMessage="No standout strength areas were detected yet. That is okay. The study plan below will help you build them."
          eyebrow="Strength Areas"
          items={results.strengths}
          title="What already looks stronger"
        />
        <PretestDomainSection
          emptyMessage="No urgent weak areas were flagged in the diagnostic."
          eyebrow="Weak Areas"
          items={results.weakAreas}
          title="What needs the most attention first"
        />
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Priority Order For Study</p>
        <h2 className="mt-3 text-2xl font-semibold">Follow this order to make steady progress.</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {results.priorityOrder.map((domain, index) => (
            <article
              key={domain.domainSlug}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold">
                  {index + 1}. {domain.domainTitle}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                    domain.priorityLabel === "Start first"
                      ? "bg-[rgba(255,27,27,0.14)] text-[color:var(--accent)]"
                      : domain.priorityLabel === "Build next"
                        ? "bg-[rgba(255,185,0,0.16)] text-[color:#7a5700]"
                        : "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]"
                  }`}
                >
                  {domain.priorityLabel}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6">
                <span className="font-semibold">Score:</span> {domain.percent}%
              </p>
              <p className="text-muted mt-2 text-sm leading-6">{domain.recommendation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Study Plan Preview</p>
            <h2 className="mt-3 text-2xl font-semibold">Here is how your personalized plan begins.</h2>
            <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
              Your next move is to start with step 1 below, not the strongest topic.
            </p>
          </div>
          <Link className="button-primary" href="/ccma/study-plan">
            Start your study plan
          </Link>
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {results.studyPlanPreview.map((item, index) => (
            <article
              key={item.domainSlug}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5"
            >
              <p className="text-sm font-semibold">
                Step {index + 1}: {item.domainTitle}
              </p>
              <p className="mt-3 text-sm leading-6">
                <span className="font-semibold">Recommended module:</span> {item.lessonTitle}
              </p>
              {item.estimatedMinutes ? (
                <p className="mt-2 text-sm leading-6">
                  <span className="font-semibold">Estimated time:</span> {item.estimatedMinutes} minutes
                </p>
              ) : null}
              <p className="text-muted mt-3 text-sm leading-6">{item.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}


