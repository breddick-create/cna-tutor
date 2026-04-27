import Link from "next/link";

import { requireViewer } from "@/lib/auth/session";
import { getCnaSkillsProgress } from "@/lib/cna/skills-progress";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SkillsHomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireViewer();
  const dashboard = await getCnaSkillsProgress(viewer.user.id);
  const params = await searchParams;
  const message = typeof params.message === "string" ? decodeURIComponent(params.message) : null;

  return (
    <div className="space-y-6">
      {message ? (
        <section className="rounded-2xl border border-[var(--border)] bg-white/85 px-5 py-4 text-sm shadow-sm">
          {message}
        </section>
      ) : null}

      <section className="panel-strong rounded-[1.75rem] p-6">
        <p className="eyebrow">Clinical Skills Prep</p>
        <h1 className="mt-3 text-3xl font-semibold">Practice the Prometric skills one at a time.</h1>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          This section is separate from your written study path. Use it to rehearse one clinical skill at a time with walkthrough practice and timed runs.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4">
            <p className="text-sm font-semibold">Skills readiness</p>
            <p className="mt-2 text-3xl font-semibold">{dashboard.readinessScore}%</p>
            <p className="text-muted mt-2 text-sm leading-6">{dashboard.readinessLabel}</p>
          </article>
          <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4">
            <p className="text-sm font-semibold">Skills practiced</p>
            <p className="mt-2 text-3xl font-semibold">
              {dashboard.practicedCount}/{dashboard.totalSkills}
            </p>
            <p className="text-muted mt-2 text-sm leading-6">Walkthrough or timed practice completed.</p>
          </article>
          <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4">
            <p className="text-sm font-semibold">Timed runs logged</p>
            <p className="mt-2 text-3xl font-semibold">{dashboard.timedPracticeCount}</p>
            <p className="text-muted mt-2 text-sm leading-6">Use timed practice to raise this section faster.</p>
          </article>
        </div>

        <div className="mt-6">
          <Link className="button-primary w-full sm:w-auto" href={`/skills/${dashboard.nextSkill.slug}`}>
            Practice {dashboard.nextSkill.title}
          </Link>
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Skill Selector</p>
        <h2 className="mt-2 text-2xl font-semibold">Choose a specific skill to rehearse.</h2>
        <p className="text-muted mt-3 max-w-3xl text-sm leading-6">{dashboard.summary}</p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {dashboard.skills.map((entry) => (
            <article
              key={entry.skill.slug}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">{entry.skill.title}</p>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {entry.skill.focus}
                  </p>
                </div>
                <span className="rounded-full bg-[rgba(23,60,255,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
                  {entry.masteryScore}%
                </span>
              </div>
              <p className="text-muted mt-3 text-sm leading-6">
                Timing band: {entry.skill.timingBand}. Walkthroughs: {entry.walkthroughCompletions}. Timed runs: {entry.timedPracticeCompletions}.
              </p>
              <div className="mt-4">
                <Link className="button-secondary w-full sm:w-auto" href={`/skills/${entry.skill.slug}`}>
                  Open skill
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
