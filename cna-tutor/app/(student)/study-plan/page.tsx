import Link from "next/link";

import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getRecommendedLessonsFromMastery, getWeakAreaSummary } from "@/lib/tutor/recommendations";
import { listTutorLessons } from "@/lib/tutor/lessons";
import { formatHours } from "@/lib/utils";

export default async function StudyPlanPage() {
  const viewer = await requireViewer();
  const supabase = await createClient();
  const lessons = listTutorLessons();

  const [{ data: rawMasteryRows }, { data: statsRows }] = await Promise.all([
    supabase
      .from("domain_mastery")
      .select("domain_id, mastery_score, weak_streak")
      .eq("user_id", viewer.user.id)
      .order("mastery_score", { ascending: true })
      .limit(6),
    supabase.from("daily_user_stats").select("*").eq("user_id", viewer.user.id),
  ]);

  const domainIds = (rawMasteryRows ?? []).map((row) => row.domain_id);
  const { data: domains } = domainIds.length
    ? await supabase.from("domains").select("id, slug, title").in("id", domainIds)
    : { data: [] };
  const domainMap = new Map((domains ?? []).map((domain) => [domain.id, domain]));

  const masteryRows = (rawMasteryRows ?? []).map((row) => ({
    ...row,
    domainTitle: domainMap.get(row.domain_id)?.title,
    domainSlug: domainMap.get(row.domain_id)?.slug,
  }));

  const recommendedLessons = getRecommendedLessonsFromMastery(masteryRows);
  const weakAreas = getWeakAreaSummary(masteryRows);
  const activeSeconds = (statsRows ?? []).reduce((sum, row) => sum + row.active_seconds, 0);
  const remainingGoalHours = Math.max(
    0,
    viewer.profile.study_goal_hours - Math.round((activeSeconds / 3600) * 10) / 10,
  );
  const weeklyTargetHours = Math.max(3, Math.ceil(remainingGoalHours / 4));

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Study Plan</p>
        <h1 className="mt-3 text-3xl font-semibold">A simple weekly plan based on what needs work.</h1>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          This plan keeps the schedule realistic for a solo learner: shore up weak areas first,
          then cycle into quizzes and a mock exam.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Goal Pace</p>
          <p className="mt-3 text-3xl font-semibold">{weeklyTargetHours}h / week</p>
          <p className="text-muted mt-3 text-sm leading-6">
            You have logged {formatHours(activeSeconds)} so far. At this pace, focusing on{" "}
            {weeklyTargetHours} active hours per week keeps the target achievable.
          </p>
        </div>
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Priority Domains</p>
          <p className="mt-3 text-lg font-semibold">
            {weakAreas.length ? weakAreas.join(", ") : "Build breadth across all topics"}
          </p>
          <p className="text-muted mt-3 text-sm leading-6">
            These are the first domains to revisit in guided study this week.
          </p>
        </div>
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Assessment Rhythm</p>
          <p className="mt-3 text-lg font-semibold">2 quizzes + 1 mock exam each week</p>
          <p className="text-muted mt-3 text-sm leading-6">
            Use quizzes after each review block, then end the week with a broader mock exam.
          </p>
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Suggested Weekly Sequence</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5">
            <p className="text-sm font-semibold">1. Guided lesson block</p>
            <p className="text-muted mt-2 text-sm leading-6">
              Start with {recommendedLessons[0]?.title ?? lessons[0]?.title ?? "your weakest lesson"} in weak-area review or learn mode.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5">
            <p className="text-sm font-semibold">2. Quick quiz check</p>
            <p className="text-muted mt-2 text-sm leading-6">
              Run a targeted quiz right after the lesson to see what still needs correction.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5">
            <p className="text-sm font-semibold">3. Second guided review</p>
            <p className="text-muted mt-2 text-sm leading-6">
              Move to the next recommended lesson and keep the teacher-led repetition going.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5">
            <p className="text-sm font-semibold">4. Mock exam finish</p>
            <p className="text-muted mt-2 text-sm leading-6">
              End the week with a mock exam, then loop any weak domains back into study.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="button-primary" href="/study">
            Start guided study
          </Link>
          <Link className="button-secondary" href="/quiz">
            Take a quiz
          </Link>
          <Link className="button-secondary" href="/mock-exam">
            Run mock exam
          </Link>
        </div>
      </section>
    </div>
  );
}
