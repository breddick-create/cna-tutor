import Link from "next/link";
import { redirect } from "next/navigation";

import { rdaTutorLessonLibrary } from "@/content/rda/lesson-library";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";

export default async function RdaStudyPlanPage() {
  const viewer = await requireRdaViewer();
  if (!(await hasCompletedRdaPretest(viewer.user))) redirect("/rda/pretest");

  return (
    <section className="panel-strong rounded-[1.75rem] p-6">
      <p className="eyebrow">Guided Study</p>
      <h1 className="mt-3 text-3xl font-semibold">Work weakest to strongest.</h1>
      <p className="text-muted mt-3 leading-7">
        Each RDA lesson uses a 10-step mastery path. You should not advance from a lesson
        until you can answer with the action and the safety, workflow, or scope reason.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {rdaTutorLessonLibrary.map((lesson, index) => (
          <article key={lesson.id} className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5">
            <p className="text-sm font-semibold text-[color:var(--brand-strong)]">Priority {index + 1}</p>
            <h2 className="mt-2 text-xl font-semibold">{lesson.title}</h2>
            <p className="text-muted mt-2 text-sm leading-6">{lesson.summary}</p>
            <div className="mt-4">
              <Link className="button-secondary" href={`/rda/study/${lesson.id}`}>
                Review lesson
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
