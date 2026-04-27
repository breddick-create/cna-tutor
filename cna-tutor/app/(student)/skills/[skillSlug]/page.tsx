import Link from "next/link";
import { notFound } from "next/navigation";

import { recordCnaSkillPracticeAction } from "@/app/(student)/actions";
import { requireViewer } from "@/lib/auth/session";
import { getCnaClinicalSkill } from "@/lib/cna/skills";
import { getCnaSkillsProgress } from "@/lib/cna/skills-progress";

type SkillPageProps = {
  params: Promise<{ skillSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SkillPracticePage({
  params,
  searchParams,
}: SkillPageProps) {
  const viewer = await requireViewer();
  const [{ skillSlug }, query] = await Promise.all([params, searchParams]);
  const skill = getCnaClinicalSkill(skillSlug);

  if (!skill) {
    notFound();
  }

  const progress = await getCnaSkillsProgress(viewer.user.id);
  const current = progress.skills.find((entry) => entry.skill.slug === skill.slug);
  const message = typeof query.message === "string" ? decodeURIComponent(query.message) : null;

  return (
    <div className="space-y-6">
      {message ? (
        <section className="rounded-2xl border border-[var(--border)] bg-white/85 px-5 py-4 text-sm shadow-sm">
          {message}
        </section>
      ) : null}

      <section className="panel-strong rounded-[1.75rem] p-6">
        <p className="eyebrow">Clinical Skills Prep</p>
        <h1 className="mt-3 text-3xl font-semibold">{skill.title}</h1>
        <p className="text-muted mt-3 max-w-3xl leading-7">{skill.focus}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4">
            <p className="text-sm font-semibold">Mastery</p>
            <p className="mt-2 text-3xl font-semibold">{current?.masteryScore ?? 0}%</p>
          </article>
          <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4">
            <p className="text-sm font-semibold">Walkthroughs</p>
            <p className="mt-2 text-3xl font-semibold">{current?.walkthroughCompletions ?? 0}</p>
          </article>
          <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4">
            <p className="text-sm font-semibold">Timed runs</p>
            <p className="mt-2 text-3xl font-semibold">{current?.timedPracticeCompletions ?? 0}</p>
          </article>
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Walkthrough Mode</p>
        <h2 className="mt-2 text-2xl font-semibold">Use the checklist in sequence.</h2>
        <div className="mt-5 space-y-3">
          {skill.walkthroughChecklist.map((step, index) => (
            <article
              key={`${skill.slug}-${index}`}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/78 p-4"
            >
              <p className="text-sm font-semibold">Step {index + 1}</p>
              <p className="mt-2 text-sm leading-6">{step}</p>
            </article>
          ))}
        </div>

        <form action={recordCnaSkillPracticeAction} className="mt-5">
          <input name="skill_slug" type="hidden" value={skill.slug} />
          <input name="mode" type="hidden" value="walkthrough" />
          <input name="return_path" type="hidden" value={`/skills/${skill.slug}`} />
          <button className="button-primary w-full sm:w-auto" type="submit">
            Mark walkthrough complete
          </button>
        </form>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Timed Practice</p>
        <h2 className="mt-2 text-2xl font-semibold">Run it under exam pressure.</h2>
        <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
          This skill sits in the <span className="font-semibold">{skill.timingBand}</span> timing band. Use a countdown that matches the Prometric timing window for this skill group, then log the run here when you finish.
        </p>

        <form action={recordCnaSkillPracticeAction} className="mt-5">
          <input name="skill_slug" type="hidden" value={skill.slug} />
          <input name="mode" type="hidden" value="timed" />
          <input name="return_path" type="hidden" value={`/skills/${skill.slug}`} />
          <button className="button-secondary w-full sm:w-auto" type="submit">
            Mark timed run complete
          </button>
        </form>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link className="button-secondary w-full sm:w-auto" href="/skills">
          Back to skills selector
        </Link>
        <Link className="button-secondary w-full sm:w-auto" href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
