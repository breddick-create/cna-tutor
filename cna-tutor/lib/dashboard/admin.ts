import { createClient } from "@/lib/supabase/server";
import { formatDateTime, formatHours, formatShortDate } from "@/lib/utils";

type StudentProfile = {
  id: string;
  full_name: string;
  email: string;
  cohort: string | null;
  study_goal_hours: number;
  last_login_at: string | null;
  last_activity_at: string | null;
};

export type AdminDashboardFilters = {
  from?: string;
  to?: string;
  cohort?: string;
  activity?: "all" | "active" | "inactive" | "low_hours" | "low_scores";
};

function getThirtyDaysAgoIsoDate() {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function getSevenDaysAgoIso() {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

function getMasteryLevel(score: number) {
  if (score >= 85) {
    return "Strong";
  }

  if (score >= 70) {
    return "Developing";
  }

  return "Needs support";
}

function passesActivityFilter(args: {
  activity: NonNullable<AdminDashboardFilters["activity"]>;
  activeSeconds: number;
  averageScore: number;
  assessmentCount: number;
  lastActivityAt: string | null;
}) {
  if (args.activity === "all") {
    return true;
  }

  const activeThisWeek = Boolean(args.lastActivityAt && args.lastActivityAt >= getSevenDaysAgoIso());

  if (args.activity === "active") {
    return activeThisWeek;
  }

  if (args.activity === "inactive") {
    return !activeThisWeek;
  }

  if (args.activity === "low_hours") {
    return args.activeSeconds < 2 * 3600;
  }

  if (args.activity === "low_scores") {
    return args.assessmentCount > 0 && args.averageScore < 75;
  }

  return true;
}

export async function getAdminDashboard(filters: AdminDashboardFilters = {}) {
  const supabase = await createClient();
  const from = filters.from ?? getThirtyDaysAgoIsoDate();
  const to = filters.to ?? new Date().toISOString().slice(0, 10);
  const activity = filters.activity ?? "all";

  let profileQuery = supabase
    .from("profiles")
    .select("id, full_name, email, cohort, study_goal_hours, last_login_at, last_activity_at")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  if (filters.cohort) {
    profileQuery = profileQuery.eq("cohort", filters.cohort);
  }

  const { data: students } = await profileQuery;
  const typedStudents = (students ?? []) as StudentProfile[];
  const studentIds = typedStudents.map((student) => student.id);

  const [{ data: statsRows }, { data: masteryRows }] = await Promise.all(
    studentIds.length
      ? [
          supabase
            .from("daily_user_stats")
            .select("*")
            .in("user_id", studentIds)
            .gte("date", from)
            .lte("date", to)
            .order("date", { ascending: true }),
          supabase.from("domain_mastery").select("user_id, mastery_score").in("user_id", studentIds),
        ]
      : [{ data: [] }, { data: [] }],
  );
  const masteryByUser = new Map<string, number[]>();

  for (const row of masteryRows ?? []) {
    const current = masteryByUser.get(row.user_id) ?? [];
    current.push(row.mastery_score);
    masteryByUser.set(row.user_id, current);
  }

  const statsByUser = new Map<
    string,
    {
      totalSeconds: number;
      activeSeconds: number;
      lessonsCompleted: number;
      quizzesCompleted: number;
      mockExamsCompleted: number;
      scoreTotal: number;
      assessmentCount: number;
    }
  >();

  const hoursByDate = new Map<string, number>();
  const engagementByDate = new Map<string, Set<string>>();

  for (const row of statsRows ?? []) {
    const current = statsByUser.get(row.user_id) ?? {
      totalSeconds: 0,
      activeSeconds: 0,
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      mockExamsCompleted: 0,
      scoreTotal: 0,
      assessmentCount: 0,
    };

    current.totalSeconds += row.total_seconds;
    current.activeSeconds += row.active_seconds;
    current.lessonsCompleted += row.lessons_completed;
    current.quizzesCompleted += row.quizzes_completed;
    current.mockExamsCompleted += row.mock_exams_completed;

    const assessmentCount = row.quizzes_completed + row.mock_exams_completed;
    if (assessmentCount > 0) {
      current.scoreTotal += row.average_score * assessmentCount;
      current.assessmentCount += assessmentCount;
    }

    statsByUser.set(row.user_id, current);

    hoursByDate.set(row.date, (hoursByDate.get(row.date) ?? 0) + row.active_seconds);

    if (row.active_seconds > 0) {
      const engagedUsers = engagementByDate.get(row.date) ?? new Set<string>();
      engagedUsers.add(row.user_id);
      engagementByDate.set(row.date, engagedUsers);
    }
  }

  const reportRows = typedStudents
    .map((student) => {
      const stats = statsByUser.get(student.id);
      const masteryScores = masteryByUser.get(student.id) ?? [];
      const averageMastery = masteryScores.length
        ? Math.round(masteryScores.reduce((sum, score) => sum + score, 0) / masteryScores.length)
        : 0;
      const assessmentCount = stats?.assessmentCount ?? 0;
      const averageScore =
        assessmentCount > 0 ? Math.round((stats?.scoreTotal ?? 0) / assessmentCount) : 0;
      const activeSeconds = stats?.activeSeconds ?? 0;
      const completionPercent = Math.min(
        100,
        Math.round((activeSeconds / Math.max(1, student.study_goal_hours * 3600)) * 100),
      );

      const watchReasons = [
        activeSeconds < 2 * 3600 ? "Low hours" : null,
        assessmentCount > 0 && averageScore < 75 ? "Low scores" : null,
        !student.last_activity_at || student.last_activity_at < getSevenDaysAgoIso()
          ? "Inactive"
          : null,
      ].filter(Boolean) as string[];

      return {
        id: student.id,
        name: student.full_name,
        email: student.email,
        cohort: student.cohort ?? "Unassigned",
        totalSecondsRaw: stats?.totalSeconds ?? 0,
        activeSecondsRaw: activeSeconds,
        totalHours: formatHours(stats?.totalSeconds ?? 0),
        activeHours: formatHours(activeSeconds),
        lessonsCompleted: stats?.lessonsCompleted ?? 0,
        quizzesTaken: stats?.quizzesCompleted ?? 0,
        mockExamsTaken: stats?.mockExamsCompleted ?? 0,
        averageScore,
        masteryLevel: getMasteryLevel(averageMastery),
        masteryScore: averageMastery,
        lastLogin: formatDateTime(student.last_login_at),
        lastActivity: formatDateTime(student.last_activity_at),
        lastActivityRaw: student.last_activity_at,
        completionPercent,
        watchReasons,
      };
    })
    .filter((row) =>
      passesActivityFilter({
        activity,
        activeSeconds: row.activeSecondsRaw,
        averageScore: row.averageScore,
        assessmentCount: row.quizzesTaken + row.mockExamsTaken,
        lastActivityAt: row.lastActivityRaw,
      }),
    );

  const activeThisWeek = reportRows.filter(
    (row) => row.lastActivityRaw && row.lastActivityRaw >= getSevenDaysAgoIso(),
  ).length;

  const totalActiveSeconds = reportRows.reduce((sum, row) => sum + row.activeSecondsRaw, 0);
  const averageCompletion = reportRows.length
    ? Math.round(
        reportRows.reduce((sum, row) => sum + row.completionPercent, 0) / reportRows.length,
      )
    : 0;

  const studyHoursTrend = Array.from(hoursByDate.entries()).map(([date, seconds]) => ({
    label: formatShortDate(date),
    value: Math.round((seconds / 3600) * 10) / 10,
  }));

  const engagementTrend = Array.from(engagementByDate.entries()).map(([date, students]) => ({
    label: formatShortDate(date),
    value: students.size,
  }));

  const completionRates = Array.from(
    reportRows.reduce((map, row) => {
      const current = map.get(row.cohort) ?? { total: 0, count: 0 };
      current.total += row.completionPercent;
      current.count += 1;
      map.set(row.cohort, current);
      return map;
    }, new Map<string, { total: number; count: number }>()),
  ).map(([label, value]) => ({
    label,
    value: Math.round(value.total / Math.max(1, value.count)),
  }));

  return {
    filters: {
      from,
      to,
      cohort: filters.cohort ?? "",
      activity,
    },
    studentCount: reportRows.length,
    activeThisWeek,
    totalActiveHours: formatHours(totalActiveSeconds),
    averageCompletion,
    watchList: reportRows
      .filter((row) => row.watchReasons.length > 0)
      .slice(0, 8)
      .map((row) => ({
        id: row.id,
        fullName: row.name,
        email: row.email,
        reason: row.watchReasons.join(" - "),
      })),
    recentStudents: reportRows.slice(0, 8).map((row) => ({
      id: row.id,
      fullName: row.name,
      email: row.email,
      cohort: row.cohort,
      activeHours: row.activeHours,
      lastActivity: row.lastActivity,
    })),
    cohorts: Array.from(
      new Set(
        typedStudents
          .map((student) => student.cohort)
          .filter((cohort): cohort is string => Boolean(cohort)),
      ),
    ).sort(),
    participantRows: reportRows,
    charts: {
      studyHoursTrend,
      engagementTrend,
      completionRates,
    },
  };
}
