import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

export async function getStudentDashboard(userId: string, studyGoalHours: number) {
  const supabase = await createClient();

  const [{ data: statsRows }, { data: masteryRows }, { data: activityRows }] = await Promise.all([
    supabase.from("daily_user_stats").select("*").eq("user_id", userId),
    supabase
      .from("domain_mastery")
      .select("domain_id, mastery_score, weak_streak")
      .eq("user_id", userId)
      .order("mastery_score", { ascending: true })
      .limit(3),
    supabase
      .from("activity_events")
      .select("id, event_type, occurred_at")
      .eq("user_id", userId)
      .order("occurred_at", { ascending: false })
      .limit(5),
  ]);

  const totals = (statsRows ?? []).reduce(
    (acc, row) => {
      acc.totalSeconds += row.total_seconds;
      acc.activeSeconds += row.active_seconds;
      acc.lessonsCompleted += row.lessons_completed;
      acc.scoreCount += row.average_score > 0 ? 1 : 0;
      acc.scoreTotal += row.average_score;
      return acc;
    },
    {
      totalSeconds: 0,
      activeSeconds: 0,
      lessonsCompleted: 0,
      scoreCount: 0,
      scoreTotal: 0,
    },
  );

  const domainIds = (masteryRows ?? []).map((row) => row.domain_id);
  const { data: domains } = domainIds.length
    ? await supabase.from("domains").select("id, title").in("id", domainIds)
    : { data: [] };
  const domainTitles = new Map((domains ?? []).map((domain) => [domain.id, domain.title]));

  const goalProgress = Math.min(
    100,
    Math.round((totals.activeSeconds / (studyGoalHours * 3600)) * 100),
  );

  const weakestArea = (masteryRows ?? []).find(
    (row) => row.mastery_score < 75 || row.weak_streak > 0,
  );
  const weakestAreaTitle = weakestArea
    ? domainTitles.get(weakestArea.domain_id) ?? "your weakest domain"
    : null;

  const nextStep = weakestAreaTitle
    ? {
        title: `Return to ${weakestAreaTitle} with weak-area review.`,
        description:
          "Your teacher now tracks misses by domain. Open Study to get a guided reteach session with repeated checks for understanding.",
      }
    : totals.lessonsCompleted > 0
      ? {
          title: "Keep momentum with another guided lesson.",
          description:
            "The tutor can now lead lessons, quiz you, and adapt the next recommendation based on your performance in prior sessions.",
        }
      : {
          title: "Start your first teacher-led lesson.",
          description:
            "Open Study and begin with the recommended lesson. The tutor will teach in short steps, ask questions, correct mistakes, and track your progress automatically.",
        };

  return {
    totalSeconds: totals.totalSeconds,
    activeSeconds: totals.activeSeconds,
    lessonsCompleted: totals.lessonsCompleted,
    averageScore:
      totals.scoreCount > 0 ? Math.round(totals.scoreTotal / totals.scoreCount) : 0,
    goalProgress,
    nextStep,
    weakAreas: (masteryRows ?? []).map((row) => ({
      domainId: row.domain_id,
      masteryScore: row.mastery_score,
      weakStreak: row.weak_streak,
      title: domainTitles.get(row.domain_id) ?? "Unknown domain",
    })),
    recentActivity: (activityRows ?? []).map((row) => ({
      id: row.id,
      label: row.event_type.replaceAll("_", " "),
      occurredAt: formatDateTime(row.occurred_at),
    })),
  };
}
