import type { User } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getPretestDomainBreakdown,
  getPretestScore,
  hasCompletedPretest,
} from "@/lib/onboarding/pretest";
import { DEFAULT_PROGRESSION_CONFIG } from "@/lib/progression/config";
import { buildStudentProgressionSnapshot } from "@/lib/progression/readiness";
import { formatConfidenceScore } from "@/lib/confidence";
import { formatDateTime, formatHours } from "@/lib/utils";

type StudentProfile = {
  id: string;
  full_name: string;
  email: string;
  cohort: string | null;
  study_goal_hours: number;
  last_login_at: string | null;
  last_activity_at: string | null;
};

type DomainRow = {
  id: string;
  slug: string;
  title: string;
};

type StudentStatus = "pretest_incomplete" | "progressing" | "stalled" | "at_risk" | "exam_ready";

export type AdminDashboardFilters = {
  from?: string;
  to?: string;
  cohort?: string;
  activity?: "all" | "active" | "inactive" | "low_hours" | "low_scores";
};

type OversightStudentRow = {
  id: string;
  name: string;
  email: string;
  badges: Array<{
    slug: string;
    title: string;
    iconSlug: string;
  }>;
  cohort: string;
  pretestCompleted: boolean;
  status: StudentStatus;
  statusLabel: string;
  readinessScore: number | null;
  readinessLabel: string;
  topWeakAreas: string[];
  weakAreasPreview: string;
  nextAction: string;
  totalHours: string;
  activeHours: string;
  lessonsCompleted: number;
  quizzesTaken: number;
  mockExamsTaken: number;
  averageScore: number;
  lastLogin: string;
  lastActivity: string;
  lastActivityRaw: string | null;
  activeSecondsRaw: number;
  completionPercent: number;
  isInactive: boolean;
};

function getThirtyDaysAgoIsoDate() {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function getSevenDaysAgoIso() {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

function getFiveDaysAgoIso() {
  return new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
}

function isInactive(lastActivityAt: string | null) {
  return Boolean(lastActivityAt && lastActivityAt < getFiveDaysAgoIso());
}

async function listAuthUsersByIds(userIds: string[]) {
  const admin = createAdminClient();
  const targetIds = new Set(userIds);
  const usersById = new Map<string, User>();
  let page = 1;
  const perPage = 100;

  while (usersById.size < targetIds.size) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error || !data?.users.length) {
      break;
    }

    for (const user of data.users) {
      if (targetIds.has(user.id)) {
        usersById.set(user.id, user);
      }
    }

    if (data.users.length < perPage) {
      break;
    }

    page += 1;
  }

  return usersById;
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

function getStatusMeta(args: {
  pretestCompleted: boolean;
  readinessScore: number | null;
  readinessLabel: string | null;
  lastActivityAt: string | null;
  activeSeconds: number;
  weakAreaCount: number;
  examReady: boolean;
  topWeakArea: string | null;
  nextBestTaskDescription: string | null;
}) {
  if (!args.pretestCompleted) {
    return {
      status: "pretest_incomplete" as const,
      statusLabel: "Pre-test not completed",
      nextAction: "Have this student complete the diagnostic so the system can build a ranked study plan.",
    };
  }

  if (args.examReady) {
    return {
      status: "exam_ready" as const,
      statusLabel: "Exam ready",
      nextAction:
        "Keep confidence steady with one more full mock or a light review on the lowest-scoring category.",
    };
  }

  const recentlyActive = Boolean(args.lastActivityAt && args.lastActivityAt >= getSevenDaysAgoIso());
  const lowEngagement = !recentlyActive || args.activeSeconds < 3600;

  if (lowEngagement) {
    return {
      status: "stalled" as const,
      statusLabel: "Stalled",
      nextAction:
        args.topWeakArea
          ? `Re-engage this student and restart ${args.topWeakArea} before they drift further.`
          : "Re-engage this student and restart the next guided module.",
    };
  }

  if (
    (args.readinessScore ?? 0) < DEFAULT_PROGRESSION_CONFIG.thresholds.buildingReadinessScore ||
    args.weakAreaCount >= 3
  ) {
    return {
      status: "at_risk" as const,
      statusLabel: "At risk",
      nextAction:
        args.topWeakArea
          ? `Target ${args.topWeakArea} next and delay reliance on full-practice signals.`
          : "Target the weakest category next and use short checks before another full mock.",
    };
  }

  return {
    status: "progressing" as const,
    statusLabel: "Progressing",
    nextAction:
      args.nextBestTaskDescription ??
      "Keep this student working from weakest to strongest so readiness keeps climbing.",
  };
}

function getStatusTone(status: StudentStatus) {
  if (status === "exam_ready") {
    return "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]";
  }

  if (status === "progressing") {
    return "bg-[rgba(255,185,0,0.16)] text-[color:#7a5700]";
  }

  if (status === "pretest_incomplete") {
    return "bg-[rgba(123,144,158,0.14)] text-[color:var(--foreground)]";
  }

  return "bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]";
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
  const authUsersById = studentIds.length ? await listAuthUsersByIds(studentIds) : new Map<string, User>();

  const [
    { data: statsRows },
    { data: masteryRows },
    { data: quizRows },
    { data: mockRows },
    { data: confidenceEvents },
    { data: earnedBadges },
  ] = await Promise.all(
    studentIds.length
      ? [
          supabase
            .from("daily_user_stats")
            .select("*")
            .in("user_id", studentIds)
            .gte("date", from)
            .lte("date", to)
            .order("date", { ascending: true }),
          supabase
            .from("domain_mastery")
            .select("user_id, domain_id, mastery_score, weak_streak")
            .in("user_id", studentIds),
          supabase
            .from("quiz_attempts")
            .select("id, user_id, score, total_questions, completed_at, domain_id")
            .in("user_id", studentIds)
            .not("completed_at", "is", null),
          supabase
            .from("mock_exam_attempts")
            .select("id, user_id, percent, passed, completed_at")
            .in("user_id", studentIds)
            .not("completed_at", "is", null),
          supabase
            .from("activity_events")
            .select("user_id, metadata_json, occurred_at")
            .in("user_id", studentIds)
            .in("event_type", ["quiz_completed", "weak_area_drill_completed"]),
          supabase
            .from("student_achievements")
            .select("user_id, achievement_definitions!inner(slug, title, icon_slug)")
            .in("user_id", studentIds),
        ]
      : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }],
  );

  const domainIds = Array.from(
    new Set((masteryRows ?? []).map((row) => row.domain_id).filter(Boolean)),
  );
  const { data: domainRows } = domainIds.length
    ? await supabase.from("domains").select("id, slug, title").in("id", domainIds)
    : { data: [] };
  const domainsById = new Map((domainRows ?? []).map((domain) => [domain.id, domain as DomainRow]));

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
  }

  const masteryByUser = new Map<
    string,
    Array<{ domainSlug: string; domainTitle: string; masteryScore: number; weakStreak: number }>
  >();
  const weaknessTrendMap = new Map<
    string,
    { domainSlug: string; domainTitle: string; studentCount: number; masteryTotal: number }
  >();

  for (const row of masteryRows ?? []) {
    const domain = domainsById.get(row.domain_id);

    if (!domain) {
      continue;
    }

    const current = masteryByUser.get(row.user_id) ?? [];
    current.push({
      domainSlug: domain.slug,
      domainTitle: domain.title,
      masteryScore: row.mastery_score,
      weakStreak: row.weak_streak,
    });
    masteryByUser.set(row.user_id, current);

    if (row.mastery_score < DEFAULT_PROGRESSION_CONFIG.thresholds.practiceBuildScore) {
      const trend = weaknessTrendMap.get(domain.slug) ?? {
        domainSlug: domain.slug,
        domainTitle: domain.title,
        studentCount: 0,
        masteryTotal: 0,
      };
      trend.studentCount += 1;
      trend.masteryTotal += row.mastery_score;
      weaknessTrendMap.set(domain.slug, trend);
    }
  }

  const confidenceByUserAndOccurredAt = new Map<string, { confidenceScore: number | null }>();
  for (const event of confidenceEvents ?? []) {
    const metadata = event.metadata_json as { confidenceScore?: number } | null;
    confidenceByUserAndOccurredAt.set(`${event.user_id}:${event.occurred_at}`, {
      confidenceScore: typeof metadata?.confidenceScore === "number" ? metadata.confidenceScore : null,
    });
  }

  const quizzesByUser = new Map<
    string,
    Array<{
      id: string;
      score: number;
      confidenceScore: number | null;
      totalQuestions: number;
      completedAt: string | null;
      domainSlug: string | null;
      domainTitle: string | null;
    }>
  >();

  for (const row of quizRows ?? []) {
    const domain = row.domain_id ? domainsById.get(row.domain_id) : null;
    const current = quizzesByUser.get(row.user_id) ?? [];
    current.push({
      id: row.id,
      score: row.score,
      confidenceScore: row.completed_at
        ? (confidenceByUserAndOccurredAt.get(`${row.user_id}:${row.completed_at}`)?.confidenceScore ?? null)
        : null,
      totalQuestions: row.total_questions,
      completedAt: row.completed_at,
      domainSlug: domain?.slug ?? null,
      domainTitle: domain?.title ?? null,
    });
    quizzesByUser.set(row.user_id, current);
  }

  const badgesByUser = new Map<
    string,
    Array<{ slug: string; title: string; iconSlug: string }>
  >();

  for (const row of earnedBadges ?? []) {
    const definition = Array.isArray(row.achievement_definitions)
      ? row.achievement_definitions[0]
      : row.achievement_definitions;
    const current = badgesByUser.get(row.user_id) ?? [];
    current.push({
      slug: definition.slug,
      title: definition.title,
      iconSlug: definition.icon_slug,
    });
    badgesByUser.set(row.user_id, current);
  }

  const mocksByUser = new Map<
    string,
    Array<{ id: string; percent: number; passed: boolean; completedAt: string | null }>
  >();

  for (const row of mockRows ?? []) {
    const current = mocksByUser.get(row.user_id) ?? [];
    current.push({
      id: row.id,
      percent: row.percent,
      passed: row.passed,
      completedAt: row.completed_at,
    });
    mocksByUser.set(row.user_id, current);
  }

  const reportRows = typedStudents
    .map((student) => {
      const authUser = authUsersById.get(student.id);
      const stats = statsByUser.get(student.id);
      const pretestCompleted = authUser ? hasCompletedPretest(authUser) : false;
      const progression = pretestCompleted && authUser
        ? buildStudentProgressionSnapshot({
            pretestScore: getPretestScore(authUser),
            pretestDomainBreakdown: getPretestDomainBreakdown(authUser),
            masteryRows: masteryByUser.get(student.id) ?? [],
            lessonsCompleted: stats?.lessonsCompleted ?? 0,
            quizzesCompleted: stats?.quizzesCompleted ?? 0,
            mockExamsCompleted: stats?.mockExamsCompleted ?? 0,
            quizAttempts: quizzesByUser.get(student.id) ?? [],
            mockAttempts: mocksByUser.get(student.id) ?? [],
          })
        : null;

      const activeSeconds = stats?.activeSeconds ?? 0;
      const averageScore =
        (stats?.assessmentCount ?? 0) > 0
          ? Math.round((stats?.scoreTotal ?? 0) / Math.max(1, stats?.assessmentCount ?? 0))
          : 0;
      const completionPercent = Math.min(
        100,
        Math.round((activeSeconds / Math.max(1, student.study_goal_hours * 3600)) * 100),
      );
      const statusMeta = getStatusMeta({
        pretestCompleted,
        readinessScore: progression?.readinessScore ?? null,
        readinessLabel: progression?.readinessLabel ?? null,
        lastActivityAt: student.last_activity_at,
        activeSeconds,
        weakAreaCount: progression?.weakAreas.length ?? 0,
        examReady: progression?.examReady ?? false,
        topWeakArea: progression?.weakAreas[0]?.domainTitle ?? null,
        nextBestTaskDescription: progression?.nextBestTask.description ?? null,
      });
      const readinessLabel = !pretestCompleted
        ? "Pre-test needed"
        : progression?.readinessLabel ?? "Not enough data";
      const topWeakAreas = progression?.weakAreas.slice(0, 2).map((area) => area.domainTitle) ?? [];
      const inactive = isInactive(student.last_activity_at);

      return {
        id: student.id,
        name: student.full_name,
        email: student.email,
        badges: badgesByUser.get(student.id)?.slice(0, 4) ?? [],
        cohort: student.cohort ?? "Unassigned",
        pretestCompleted,
        status: statusMeta.status,
        statusLabel: statusMeta.statusLabel,
        readinessScore: progression?.readinessScore ?? null,
        readinessLabel,
        topWeakAreas,
        weakAreasPreview: topWeakAreas.length ? topWeakAreas.join(", ") : "No ranked weak areas yet",
        nextAction: statusMeta.nextAction,
        totalHours: formatHours(stats?.totalSeconds ?? 0),
        activeHours: formatHours(activeSeconds),
        lessonsCompleted: stats?.lessonsCompleted ?? 0,
        quizzesTaken: stats?.quizzesCompleted ?? 0,
        mockExamsTaken: stats?.mockExamsCompleted ?? 0,
        averageScore,
        lastLogin: formatDateTime(student.last_login_at),
        lastActivity: formatDateTime(student.last_activity_at),
        lastActivityRaw: student.last_activity_at,
        activeSecondsRaw: activeSeconds,
        completionPercent,
        isInactive: inactive,
      } satisfies OversightStudentRow;
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

  const statusCounts = {
    progressing: reportRows.filter((row) => row.status === "progressing").length,
    stalled: reportRows.filter((row) => row.status === "stalled").length,
    atRisk: reportRows.filter((row) => row.status === "at_risk").length,
    examReady: reportRows.filter((row) => row.status === "exam_ready").length,
    pretestIncomplete: reportRows.filter((row) => row.status === "pretest_incomplete").length,
  };

  const readinessDistribution = [
    { label: "Not started", count: 0, color: "bg-[rgba(123,144,158,0.35)]" },
    { label: "0–24", count: 0, color: "bg-[rgba(166,60,47,0.7)]" },
    { label: "25–49", count: 0, color: "bg-[rgba(217,111,50,0.7)]" },
    { label: "50–74", count: 0, color: "bg-[rgba(200,170,30,0.75)]" },
    { label: "75+", count: 0, color: "bg-[linear-gradient(135deg,var(--accent),var(--brand))]" },
  ];
  for (const row of reportRows) {
    if (row.readinessScore === null) readinessDistribution[0].count++;
    else if (row.readinessScore < 25) readinessDistribution[1].count++;
    else if (row.readinessScore < 50) readinessDistribution[2].count++;
    else if (row.readinessScore < 75) readinessDistribution[3].count++;
    else readinessDistribution[4].count++;
  }

  const weaknessTrends = Array.from(weaknessTrendMap.values())
    .map((trend) => ({
      domainSlug: trend.domainSlug,
      domainTitle: trend.domainTitle,
      studentCount: trend.studentCount,
      averageMastery: Math.round(trend.masteryTotal / Math.max(1, trend.studentCount)),
    }))
    .sort((a, b) => b.studentCount - a.studentCount || a.averageMastery - b.averageMastery)
    .slice(0, 6);

  const confidenceAttempts = (confidenceEvents ?? [])
    .map((event) => {
      const metadata = event.metadata_json as { confidenceScore?: number } | null;
      return {
        occurredAt: event.occurred_at,
        confidenceScore: typeof metadata?.confidenceScore === "number" ? metadata.confidenceScore : null,
      };
    })
    .filter((row) => typeof row.confidenceScore === "number")
    .sort((a, b) => {
      const left = new Date(a.occurredAt).getTime();
      const right = new Date(b.occurredAt).getTime();
      return right - left;
    });
  const cohortConfidenceAverage = confidenceAttempts.length
    ? Number(
        (
          confidenceAttempts.reduce((sum, row) => sum + (row.confidenceScore ?? 0), 0) /
          confidenceAttempts.length
        ).toFixed(1),
      )
    : null;
  const cohortConfidenceTrend = confidenceAttempts
    .slice(0, 8)
    .map((row) => row.confidenceScore ?? 0)
    .reverse();

  return {
    filters: {
      from,
      to,
      cohort: filters.cohort ?? "",
      activity,
    },
    studentCount: reportRows.length,
    statusCounts,
    summary:
      statusCounts.atRisk + statusCounts.stalled > 0
        ? `${statusCounts.atRisk + statusCounts.stalled} students need follow-up right now across readiness or engagement.`
        : "No urgent follow-up group is showing right now.",
    cohortConfidence: {
      average: cohortConfidenceAverage,
      label: formatConfidenceScore(cohortConfidenceAverage),
      trend: cohortConfidenceTrend,
      attemptCount: confidenceAttempts.length,
    },
    cohorts: Array.from(
      new Set(
        typedStudents
          .map((student) => student.cohort)
          .filter((cohort): cohort is string => Boolean(cohort)),
      ),
    ).sort(),
    studentsWithoutPretest: reportRows
      .filter((row) => row.status === "pretest_incomplete")
      .slice(0, 8),
    lowEngagementStudents: reportRows.filter((row) => row.status === "stalled").slice(0, 8),
    inactiveStudents: reportRows.filter((row) => row.isInactive).slice(0, 8),
    weakReadinessStudents: reportRows.filter((row) => row.status === "at_risk").slice(0, 8),
    examReadyStudents: reportRows.filter((row) => row.status === "exam_ready").slice(0, 8),
    participantRows: reportRows,
    weaknessTrends,
    readinessDistribution,
    statusTone: getStatusTone,
  };
}
