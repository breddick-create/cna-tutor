import Link from "next/link";
import { notFound } from "next/navigation";

import { SkillTimedPractice } from "@/components/skills/skill-timed-practice";
import { SkillWalkthrough } from "@/components/skills/skill-walkthrough";
import { requireViewer } from "@/lib/auth/session";
import { getCnaClinicalSkill } from "@/lib/cna/skills";
import { getCnaSkillsProgress } from "@/lib/cna/skills-progress";
import { getCnaSkillSearchUrl, SKILLS_PLAYLIST_EMBED_URL, SKILLS_PLAYLIST_URL } from "@/lib/resources/cna-skill-videos";

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
  const videoSearchUrl = getCnaSkillSearchUrl(skill.slug);

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
        <p className="eyebrow">Video Demonstration</p>
        <h2 className="mt-2 text-2xl font-semibold">Watch before you practice.</h2>
        <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
          Watch a full Prometric-style demonstration of this skill before running the checklist. Seeing the correct sequence once is worth more than reading steps five times.
        </p>

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white/75 shadow-sm">
          <div className="aspect-video w-full">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
              referrerPolicy="strict-origin-when-cross-origin"
              src={SKILLS_PLAYLIST_EMBED_URL}
              title={`CNA clinical skills demonstration playlist`}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            className="button-primary w-full sm:w-auto"
            href={videoSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Search YouTube: {skill.title}
          </a>
          <a
            className="button-secondary w-full sm:w-auto"
            href={SKILLS_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Full CNA skills playlist
          </a>
        </div>
        <p className="text-muted mt-3 text-sm leading-6">
          The search button opens YouTube results for <strong>{skill.title}</strong> so you can find the exact Prometric demonstration.
        </p>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Walkthrough Mode</p>
        <h2 className="mt-2 text-2xl font-semibold">Use the checklist in sequence.</h2>
        <SkillWalkthrough
          skillSlug={skill.slug}
          returnPath={`/skills/${skill.slug}`}
          steps={skill.walkthroughChecklist}
        />
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Timed Practice</p>
        <h2 className="mt-2 text-2xl font-semibold">Run it under exam pressure.</h2>
        <SkillTimedPractice
          skillSlug={skill.slug}
          returnPath={`/skills/${skill.slug}`}
          timingBand={skill.timingBand}
        />
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
