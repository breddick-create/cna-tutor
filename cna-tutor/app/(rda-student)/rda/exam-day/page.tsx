import { redirect } from "next/navigation";

import { rdaExamDayGuide } from "@/content/rda/exam-day";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";

function GuideBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function RdaExamDayPage() {
  const viewer = await requireRdaViewer();
  if (!(await hasCompletedRdaPretest(viewer.user))) redirect("/rda/pretest");

  return (
    <div className="space-y-6">
      <section className="panel-strong rounded-[1.75rem] p-6">
        <p className="eyebrow">Final Prep</p>
        <h1 className="mt-3 text-3xl font-semibold">{rdaExamDayGuide.title}</h1>
        <p className="text-muted mt-3 leading-7">
          Keep the last review practical: safety, scope, radiography logic, charting language,
          and the common mistakes that cost easy points.
        </p>
        <p className="mt-4 rounded-2xl border border-[var(--border)] bg-white/70 p-4 text-sm leading-6 text-[var(--muted)]">
          {rdaExamDayGuide.disclaimer}
        </p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <GuideBlock title="What to bring" items={rdaExamDayGuide.whatToBring} />
        <GuideBlock title="How to prepare" items={rdaExamDayGuide.howToPrepare} />
        <GuideBlock title="How to manage time" items={rdaExamDayGuide.timeManagement} />
        <GuideBlock title="Common mistakes" items={rdaExamDayGuide.commonMistakes} />
        <GuideBlock title="Confidence reminders" items={rdaExamDayGuide.confidenceReminders} />
        <GuideBlock title="Final checklist" items={rdaExamDayGuide.finalChecklist} />
      </section>
    </div>
  );
}
