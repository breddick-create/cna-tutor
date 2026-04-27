import { cnaClinicalSkills, type CnaClinicalSkill } from "@/lib/cna/skills";
import { createClient } from "@/lib/supabase/server";

export type CnaSkillProgressSummary = {
  skill: CnaClinicalSkill;
  masteryScore: number;
  walkthroughCompletions: number;
  timedPracticeCompletions: number;
  lastPracticedAt: string | null;
};

export async function getCnaSkillsProgress(userId: string) {
  const supabase = await createClient();
  const emptyState = {
    readinessScore: 0,
    readinessLabel: "Not Ready",
    practicedCount: 0,
    timedPracticeCount: 0,
    totalSkills: cnaClinicalSkills.length,
    nextSkill: cnaClinicalSkills[0],
    skills: cnaClinicalSkills.map((skill) => ({
      skill,
      masteryScore: 0,
      walkthroughCompletions: 0,
      timedPracticeCompletions: 0,
      lastPracticedAt: null,
    })),
    summary:
      "Start with one clinical skill walkthrough so the dashboard can begin tracking skills readiness separately from written readiness.",
  } as const;

  const { data, error } = await supabase
    .from("cna_skill_progress")
    .select(
      "skill_slug, mastery_score, walkthrough_completions, timed_practice_completions, last_practiced_at",
    )
    .eq("user_id", userId);

  if (error) {
    return emptyState;
  }

  const progressBySlug = new Map(
    (data ?? []).map((row) => [
      row.skill_slug,
      {
        masteryScore: row.mastery_score,
        walkthroughCompletions: row.walkthrough_completions,
        timedPracticeCompletions: row.timed_practice_completions,
        lastPracticedAt: row.last_practiced_at,
      },
    ]),
  );

  const skills = cnaClinicalSkills.map((skill) => {
    const progress = progressBySlug.get(skill.slug);

    return {
      skill,
      masteryScore: progress?.masteryScore ?? 0,
      walkthroughCompletions: progress?.walkthroughCompletions ?? 0,
      timedPracticeCompletions: progress?.timedPracticeCompletions ?? 0,
      lastPracticedAt: progress?.lastPracticedAt ?? null,
    } satisfies CnaSkillProgressSummary;
  });

  const readinessScore = Math.round(
    skills.reduce((sum, skill) => sum + skill.masteryScore, 0) / Math.max(skills.length, 1),
  );
  const practicedCount = skills.filter(
    (skill) => skill.walkthroughCompletions > 0 || skill.timedPracticeCompletions > 0,
  ).length;
  const timedPracticeCount = skills.reduce(
    (sum, skill) => sum + skill.timedPracticeCompletions,
    0,
  );
  const nextSkill =
    skills
      .slice()
      .sort(
        (a, b) =>
          a.masteryScore - b.masteryScore ||
          a.skill.title.localeCompare(b.skill.title),
      )[0]?.skill ?? cnaClinicalSkills[0];

  const readinessLabel =
    readinessScore >= 85
      ? "Exam Ready"
      : readinessScore >= 70
        ? "Almost There"
        : readinessScore >= 45
          ? "Making Progress"
          : "Not Ready";

  return {
    readinessScore,
    readinessLabel,
    practicedCount,
    timedPracticeCount,
    totalSkills: cnaClinicalSkills.length,
    nextSkill,
    skills,
    summary:
      practicedCount === 0
        ? "Start with one clinical skill walkthrough so the dashboard can begin tracking skills readiness separately from written readiness."
        : `You have practiced ${practicedCount} of ${cnaClinicalSkills.length} clinical skills so far. Keep adding walkthroughs and timed runs so the skills section becomes a real readiness signal.`,
  };
}
