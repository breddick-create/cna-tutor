import Link from "next/link";
import { redirect } from "next/navigation";

import {
  TEXAS_CNA_EXAM_DAY_SOURCES,
  getMostImprovedDomains,
  getStrongestDomains,
} from "@/lib/exam-day";
import { requireViewer } from "@/lib/auth/session";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";
import { getPretestDomainBreakdown, getPretestScore, hasCompletedPretest } from "@/lib/onboarding/pretest";

function ExamDayCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 text-sm leading-7">{children}</div>
    </article>
  );
}

export default async function ExamDayPage() {
  const viewer = await requireViewer();

  if (!hasCompletedPretest(viewer.user)) {
    redirect("/pretest");
  }

  const progression = await getStudentProgressionSnapshot({
    userId: viewer.user.id,
    pretestScore: getPretestScore(viewer.user),
    pretestDomainBreakdown: getPretestDomainBreakdown(viewer.user),
  });

  if (!progression.examReady) {
    redirect("/dashboard");
  }

  const strongestDomains = getStrongestDomains(progression);
  const mostImprovedDomains = getMostImprovedDomains(progression);

  return (
    <div className="space-y-8">
      <section className="panel-strong rounded-[1.75rem] p-6">
        <p className="eyebrow">Exam Day</p>
        <h1 className="mt-3 text-3xl font-semibold">Walk into the Texas CNA exam with a calm plan.</h1>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          This page opens only after you reach Exam Ready. It turns your readiness score into a practical test-day plan based on official Texas HHSC guidance and Pearson VUE test-center rules.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link className="button-primary w-full sm:w-auto" href="/dashboard">
            Back to dashboard
          </Link>
          <Link className="button-secondary w-full sm:w-auto" href="/mock-exam">
            Keep confidence steady
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Texas Checklist</p>
          <h2 className="mt-3 text-2xl font-semibold">What to expect and what to bring.</h2>
          <div className="mt-5 space-y-4">
            <ExamDayCard title="What to bring">
              <p>
                Bring the ID required by your test appointment and make sure the name matches your registration exactly. Keep your confirmation details handy, and review your test-center instructions before you leave home.
              </p>
            </ExamDayCard>
            <ExamDayCard title="Arrival timing">
              <p>
                Plan to arrive at least 30 minutes early so check-in does not turn a prepared day into a rushed one. Give yourself extra buffer for traffic, parking, and finding the right entrance.
              </p>
            </ExamDayCard>
            <ExamDayCard title="What the written portion looks like">
              <p>
                Texas nurse aide testing includes a written-or-oral knowledge exam plus a separate skills exam. Go in expecting a structured knowledge check first and a hands-on skills check that still rewards calm pacing, careful reading, and attention to steps.
              </p>
            </ExamDayCard>
            <ExamDayCard title="If you do not pass">
              <p>
                A miss on exam day is not the end of the path. Texas HHSC provides retest and retraining-and-retesting workflows through TULIP, and the exam result tells you which part to rebuild before your next attempt.
              </p>
            </ExamDayCard>
          </div>
        </section>

        <section className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">You&apos;re Ready</p>
          <h2 className="mt-3 text-2xl font-semibold">Final readiness summary</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-4">
              <p className="text-sm font-semibold">Final readiness</p>
              <p className="mt-2 text-3xl font-semibold">{progression.readinessScore}%</p>
              <p className="text-muted mt-2 text-sm leading-6">{progression.readinessLabel}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-4">
              <p className="text-sm font-semibold">Best full mock</p>
              <p className="mt-2 text-3xl font-semibold">
                {progression.signals.bestMockScore !== null ? `${progression.signals.bestMockScore}%` : "In range"}
              </p>
              <p className="text-muted mt-2 text-sm leading-6">Your strongest long-form checkpoint.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-4">
              <p className="text-sm font-semibold">Lessons completed</p>
              <p className="mt-2 text-3xl font-semibold">{progression.signals.lessonsCompleted}</p>
              <p className="text-muted mt-2 text-sm leading-6">Foundation work that got you here.</p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[rgba(28,124,104,0.22)] bg-[rgba(240,251,247,0.92)] p-5">
            <p className="text-sm font-semibold text-[color:#145f50]">ACAM confidence message</p>
            <p className="mt-2 text-sm leading-7 text-[color:#1d2a26]">
              ACAM believes you earned this moment. You have done the hard work, proved it with real readiness signals, and built a stronger plan around your weaker areas. Walk in steady, trust your preparation, and focus on one question and one skill at a time.
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            <ExamDayCard title="Strongest domains">
              <div className="space-y-3">
                {strongestDomains.map((domain) => (
                  <div key={domain.domainSlug} className="flex items-center justify-between gap-4">
                    <p className="font-semibold">{domain.domainTitle}</p>
                    <span className="rounded-full bg-[rgba(23,60,255,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
                      {domain.masteryScore}%
                    </span>
                  </div>
                ))}
              </div>
            </ExamDayCard>

            <ExamDayCard title="Most-improved areas">
              <div className="space-y-3">
                {mostImprovedDomains.length ? (
                  mostImprovedDomains.map((domain) => (
                    <div key={domain.domainSlug} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{domain.domainTitle}</p>
                        <p className="text-muted mt-1 text-sm leading-6">
                          From {domain.baselineScore}% to {domain.masteryScore}%.
                        </p>
                      </div>
                      <span className="rounded-full bg-[rgba(28,124,104,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:#145f50]">
                        +{domain.improvement}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">
                    Your strongest signal is steady overall readiness. Keep protecting the weak spots that needed the most rebuilding.
                  </p>
                )}
              </div>
            </ExamDayCard>
          </div>
        </section>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Official Sources</p>
        <h2 className="mt-3 text-2xl font-semibold">Review the source guidance directly.</h2>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          Exam programs change details over time, so use these official pages to confirm logistics before your actual appointment.
        </p>
        <div className="mt-5 grid gap-3">
          {TEXAS_CNA_EXAM_DAY_SOURCES.map((source) => (
            <Link
              key={source.href}
              className="button-secondary w-full justify-between"
              href={source.href}
              target="_blank"
            >
              <span>{source.label}</span>
              <span>Open</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
