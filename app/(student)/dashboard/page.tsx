import { StatCard } from "@/components/dashboard/stat-card";
import { requireViewer } from "@/lib/auth/session";
import { getStudentDashboard } from "@/lib/dashboard/student";
import { formatHours } from "@/lib/utils";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const viewer = await requireViewer();
  const dashboard = await getStudentDashboard(
    viewer.user.id,
    viewer.profile.study_goal_hours,
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Study Hours"
          value={formatHours(dashboard.totalSeconds)}
          description="Combined logged study time"
        />
        <StatCard
          title="Active Study Hours"
          value={formatHours(dashboard.activeSeconds)}
          description="Excludes idle time"
        />
        <StatCard
          title="Lessons Completed"
          value={dashboard.lessonsCompleted.toString()}
          description="Published lessons finished"
        />
        <StatCard
          title="Average Score"
          value={`${dashboard.averageScore}%`}
          description="Across quizzes and mock exams"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Next Recommended Step</p>
          <h2 className="mt-3 text-2xl font-semibold">{dashboard.nextStep.title}</h2>
          <p className="text-muted mt-3 leading-7">{dashboard.nextStep.description}</p>
          <div className="mt-6 rounded-3xl border border-[var(--border)] bg-white/60 p-5">
            <p className="text-sm font-medium">Progress toward goal</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[rgba(29,42,38,0.08)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent))]"
                style={{ width: `${dashboard.goalProgress}%` }}
              />
            </div>
            <p className="text-muted mt-3 text-sm">
              {dashboard.goalProgress}% of your study-hour goal completed
            </p>
          </div>
          <div className="mt-6">
            <div className="flex flex-wrap gap-3">
              <Link className="button-primary" href="/study">
                Start a guided lesson
              </Link>
              <Link className="button-secondary" href="/study-plan">
                View study plan
              </Link>
              <Link className="button-secondary" href="/quiz">
                Take a quiz
              </Link>
              <Link className="button-secondary" href="/mock-exam">
                Run a mock exam
              </Link>
            </div>
          </div>
        </div>

        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Weak Areas</p>
          <div className="mt-4 space-y-3">
            {dashboard.weakAreas.length ? (
              dashboard.weakAreas.map((area) => (
                <div
                  key={area.domainId}
                  className="rounded-3xl border border-[var(--border)] bg-white/70 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">{area.title}</p>
                    <span className="rounded-full bg-[rgba(217,111,50,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                      revisit
                    </span>
                  </div>
                  <p className="text-muted mt-2 text-sm leading-6">
                    Mastery score {area.masteryScore}% with a weak streak of {area.weakStreak}.
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted rounded-3xl border border-[var(--border)] bg-white/70 p-4 text-sm">
                Weak areas will appear here after the first lesson or quiz cycle.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Recent Activity</p>
          <div className="mt-4 space-y-3">
            {dashboard.recentActivity.length ? (
              dashboard.recentActivity.map((event) => (
                <div
                  key={event.id}
                  className="rounded-3xl border border-[var(--border)] bg-white/70 p-4"
                >
                  <p className="font-semibold">{event.label}</p>
                  <p className="text-muted mt-1 text-sm">{event.occurredAt}</p>
                </div>
              ))
            ) : (
              <p className="text-muted rounded-3xl border border-[var(--border)] bg-white/70 p-4 text-sm">
                No activity yet. Once sessions begin, we will log study behavior here.
              </p>
            )}
          </div>
        </div>

        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Phase 2 Status</p>
          <h2 className="mt-3 text-2xl font-semibold">The guided tutor loop is now live, adaptive, and content-rich.</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7">
            <li>Students can start teacher-led lesson sessions from the new study workspace.</li>
            <li>The tutor teaches, asks, evaluates, reteaches, and advances based on each answer.</li>
            <li>Every interaction now updates session timing, weak-area mastery, and lesson progress.</li>
            <li>Students can launch lessons in learn, quiz, rapid review, or weak-area review mode.</li>
            <li>The CCMA bank now supports broader quizzes, a fuller mock exam, and deeper guided lessons across every domain.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
