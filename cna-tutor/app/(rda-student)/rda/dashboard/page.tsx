import Link from "next/link";
import { redirect } from "next/navigation";

import { getRdaStudentDashboard } from "@/lib/rda/dashboard/student";
import {
  getRdaPretestDomainBreakdown,
  hasCompletedRdaPretest,
} from "@/lib/rda/progression";
import type { RDADomainPerformance } from "@/lib/rda/readiness/engine";
import { requireRdaViewer } from "@/lib/rda/auth/session";

export default async function RdaDashboardPage() {
  const viewer = await requireRdaViewer();
  let pretestDone = false;
  try {
    pretestDone = await hasCompletedRdaPretest(viewer.user);
  } catch {
    pretestDone = false;
  }
  if (!pretestDone) redirect("/rda/pretest");

  let pretestBreakdown: RDADomainPerformance[];
  try {
    pretestBreakdown = await getRdaPretestDomainBreakdown(viewer.user);
  } catch {
    pretestBreakdown = [];
  }

  let dashboard;
  try {
    dashboard = await getRdaStudentDashboard({ userId: viewer.user.id, pretestBreakdown });
  } catch (err) {
    console.error("[RDA] getRdaStudentDashboard failed:", err);
    throw err;
  }

  const isAlmostThereAndCapped =
    dashboard.label === "Almost There" && dashboard.blockingReason !== null;
  const needsMock = dashboard.mockExamsCompleted === 0 && dashboard.label !== "Exam Ready";

  return (
    <div className="space-y-6">
      {/* Primary action — dominant above the fold */}
      <section className="panel-strong rounded-[1.75rem] p-6">
        <p className="eyebrow">Your Next Step</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto]">
          <div>
            <h1 className="text-3xl font-semibold leading-tight">
              {dashboard.nextBestTask.title}
            </h1>
            <p className="text-muted mt-3 text-base leading-7">
              {dashboard.nextBestTask.description}
            </p>
            <Link
              className="button-primary mt-6 inline-flex items-center gap-2 px-7 py-3 text-base font-semibold"
              href={dashboard.nextBestTask.href}
            >
              Start Now
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-[var(--border)] bg-white/80 px-8 py-5 text-center">
            <p className="text-sm font-semibold">Readiness</p>
            <p className="mt-1 text-6xl font-semibold leading-none">{dashboard.readinessScore}</p>
            <p className="mt-2 font-semibold text-[color:var(--brand-strong)]">{dashboard.label}</p>
          </div>
        </div>
      </section>

      {/* Blocking reason — shown when capped at Almost There */}
      {isAlmostThereAndCapped && (
        <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-800">Why you are stuck at Almost There</p>
          <p className="mt-2 text-sm leading-6 text-amber-700">{dashboard.blockingReason}</p>
        </section>
      )}

      {/* Mock exam callout */}
      {needsMock && (
        <section className="rounded-[1.5rem] border border-blue-200 bg-blue-50 p-5">
          <p className="font-semibold text-blue-900">Mock exam required to reach Exam Ready</p>
          <p className="mt-2 text-sm leading-6 text-blue-800">
            You must complete a full mock exam before reaching Exam Ready. Your study progress
            is building — now validate it with a timed exam.
          </p>
          <Link className="button-primary mt-4 inline-flex" href="/rda/mock-exam">
            Take Mock Exam
          </Link>
        </section>
      )}

      {/* Secondary data */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="panel rounded-[1.5rem] p-5 lg:col-span-2">
          <p className="eyebrow">Weak Areas</p>
          {dashboard.weakAreas.length === 0 ? (
            <p className="text-muted mt-4 text-sm">
              No weak areas detected — all domains are above the mastery gate.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {dashboard.weakAreas.slice(0, 4).map((area) => (
                <Link
                  key={area.domainSlug}
                  href={`/rda/study-plan?domain=${area.domainSlug}`}
                  className="block rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4 transition-colors hover:border-[color:var(--brand)]"
                >
                  <p className="font-semibold">{area.domainTitle}</p>
                  <p className="text-muted mt-2 text-sm">{area.percent}% current mastery</p>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">Recent Evidence</p>
          <div className="mt-4 space-y-2 text-sm leading-6">
            <p>
              <span className="font-semibold">Quiz avg: </span>
              {dashboard.recentQuizPerformance !== null
                ? `${dashboard.recentQuizPerformance}%`
                : "No quizzes yet"}
            </p>
            <p>
              <span className="font-semibold">Mock exams: </span>
              {dashboard.mockExamsCompleted}
            </p>
            <p>
              <span className="font-semibold">Last activity: </span>
              {dashboard.lastActivity
                ? new Date(dashboard.lastActivity).toLocaleDateString()
                : "No activity yet"}
            </p>
          </div>
        </div>
      </section>

      <details className="panel rounded-[1.5rem]">
        <summary className="cursor-pointer p-5 font-semibold">
          Study Checklist &amp; Recovery Trend
        </summary>
        <div className="grid gap-4 px-5 pb-5 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">Study Checklist</p>
            <div className="space-y-3">
              {dashboard.studyChecklist.map((item) => (
                <Link
                  key={item.id}
                  className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4"
                  href={item.href}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      item.met
                        ? "bg-[color:#145f50] text-white"
                        : "border border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {item.met ? "✓" : ""}
                  </span>
                  <span>
                    <span className="font-semibold">{item.met ? "Done: " : "Needed: "}</span>
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4">Recovery Trend</p>
            <div className="space-y-3">
              {dashboard.recoveryTrend.map((trend) => (
                <div
                  key={trend.domainSlug}
                  className="flex items-center justify-between rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4"
                >
                  <span className="font-semibold">{trend.domainTitle}</span>
                  <span
                    className={
                      trend.delta >= 0
                        ? "font-semibold text-[color:#145f50]"
                        : "font-semibold text-[color:var(--danger)]"
                    }
                  >
                    {trend.delta >= 0 ? "+" : ""}
                    {trend.delta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
