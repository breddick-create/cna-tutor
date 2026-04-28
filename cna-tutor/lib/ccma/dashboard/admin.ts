import type { User } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getPretestDomainBreakdown,
  getPretestScore,
  hasCompletedPretest,
} from "@/lib/ccma/onboarding/pretest";
import { buildStudentProgressionSnapshot } from "@/lib/ccma/progression/readiness";
import { formatConfidenceScore } from "@/lib/ccma/confidence";
import { formatDateTime } from "@/lib/utils";

export type CcmaAdminDashboardFilters = {
  cohort?: string;
  activity?: "all" | "active" | "inactive" | "low_hours" | "low_scores";
  from?: string;
  to?: string;
};

type StudentStatus = "pretest_incomplete" | "progressing" | "stalled" | "at_risk" | "exam_ready";

function getThirtyDaysAgoIsoDate() {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
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
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
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

export async function getAdminDashboard(filters: CcmaAdminDashboardFilters = {}) {
  return getCcmaAdminDashboard(filters);
}

export async function getCcmaAdminDashboard(filters: CcmaAdminDashboardFilters = {}) {
  const supabase = (await createClient()) as any;
  const from = filters.from ?? getThirtyDaysAgoIsoDate();
  const to = filters.to ?? new Date().toISOString().slice(0, 10);
  const activity = filters.activity ?? "all";

  let profileQuery = supabase
    .from("profiles")
    .select("id, full_name, email, cohort, last_login_at, last_activity_at")
    .eq("role", "student")
    .eq("product", "ccma")
    .order("created_at", { ascending: false });

  if (filters.cohort) {
    profileQuery = profileQuery.eq("cohort", filters.cohort);
  }

  const { data: students } = await profileQuery;
  const studentRows = (students ?? []) as any[];
  const studentIds = studentRows.map((student: any) => student.id);
  const authUsersById = studentIds.length ? await listAuthUsersByIds(studentIds) : new Map<string, User>();

  const [
    { data: progressRows },
    { data: quizRows },
    { data: assessmentRows },
    { data: earnedBadges },
  ] = await Promise.all([
    studentIds.length
      ? supabase.from("ccma_student_progress").select("*").in("user_id", studentIds)
      : Promise.resolve({ data: [] as any[] }),
    studentIds.length
      ? supabase.from("ccma_quiz_attempts").select("*").in("user_id", studentIds).gte("completed_at", from).lte("completed_at", to + "T23:59:59Z")
      : Promise.resolve({ data: [] as any[] }),
    studentIds.length
      ? supabase.from("ccma_assessments").select("*").in("user_id", studentIds).gte("completed_at", from).lte("completed_at", to + "T23:59:59Z")
      : Promise.resolve({ data: [] as any[] }),
    studentIds.length
      ? supabase
          .from("student_achievements")
          .select("user_id, achievement_definitions!inner(slug, title, icon_slug)")
          .in("user_id", studentIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const progressByUser = new Map<string, any[]>();
  for (const row of progressRows.data ?? []) {
    const current = progressByUser.get(row.user_id) ?? [];
    current.push(row);
    progressByUser.set(row.user_id, current);
  }

  const quizzesByUser = new Map<string, any[]>();
  for (const row of quizRows.data ?? []) {
    const current = quizzesByUser.get(row.user_id) ?? [];
    current.push(row);
    quizzesByUser.set(row.user_id, current);
  }

  const assessmentsByUser = new Map<string, any[]>();
  for (const row of assessmentRows.data ?? []) {
    const current = assessmentsByUser.get(row.user_id) ?? [];
    current.push(row);
    assessmentsByUser.set(row.user_id, current);
  }

  const badgesByUser = new Map<string, Array<{ slug: string; title: string; iconSlug: string }>>();
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

  const reportRows = studentRows.map((student: any) => {
    const authUser = authUsersById.get(student.id);
    const pretestCompleted = authUser ? hasCompletedPretest(authUser) : false;
    const progressForUser = progressByUser.get(student.id) ?? [];
    const quizForUser = quizzesByUser.get(student.id) ?? [];
    const assessmentsForUser = assessmentsByUser.get(student.id) ?? [];
    const mockAttempts = assessmentsForUser
      .filter((attempt) => attempt.mode === "mock_exam")
      .map((attempt) => ({
        id: attempt.id,
        percent: attempt.score,
        passed: attempt.passed,
        completedAt: attempt.completed_at,
      }));
    const quizAttempts = quizForUser.map((attempt) => ({
      id: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.total_questions,
      completedAt: attempt.completed_at,
      domainSlug: attempt.domain_slug,
      domainTitle:
        attempt.domain_breakdown?.[0]?.domainTitle ?? attempt.domain_slug ?? null,
    }));

    const progression =
      pretestCompleted && authUser
        ? buildStudentProgressionSnapshot({
            pretestScore: getPretestScore(authUser),
            pretestDomainBreakdown: getPretestDomainBreakdown(authUser),
            masteryRows: progressForUser.map((row) => ({
              domainSlug: row.domain_slug,
              domainTitle: row.domain_title,
              masteryScore: row.mastery_score,
              weakStreak: row.weak_streak,
            })),
            lessonsCompleted: progressForUser.reduce(
              (sum, row) => sum + (row.lessons_completed ?? 0),
              0,
            ),
            quizzesCompleted: quizAttempts.length,
            mockExamsCompleted: mockAttempts.length,
            quizAttempts,
            mockAttempts,
            totalModules: 7,
            daysSinceActivity: student.last_activity_at
              ? Math.floor((Date.now() - new Date(student.last_activity_at).getTime()) / (1000 * 60 * 60 * 24))
              : null,
          })
        : null;

    const inactive = isInactive(student.last_activity_at);
    const averageScore = quizAttempts.length
      ? Math.round(
          quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
            quizAttempts.length,
        )
      : 0;
    let status: StudentStatus = "progressing";
    let statusLabel = "Progressing";

    if (!pretestCompleted) {
      status = "pretest_incomplete";
      statusLabel = "Pre-test not completed";
    } else if (progression?.examReady) {
      status = "exam_ready";
      statusLabel = "Exam ready";
    } else if (inactive) {
      status = "stalled";
      statusLabel = "Needs Check-In";
    } else if ((progression?.readinessScore ?? 0) < 55) {
      status = "at_risk";
      statusLabel = "At risk";
    }

    return {
      id: student.id,
      name: student.full_name,
      email: student.email,
      badges: badgesByUser.get(student.id)?.slice(0, 4) ?? [],
      cohort: student.cohort ?? "Unassigned",
      pretestCompleted,
      status,
      statusLabel,
      readinessScore: progression?.readinessScore ?? null,
      readinessLabel:
        progression?.readinessLabel ?? (pretestCompleted ? "Not enough data" : "Pre-test needed"),
      topWeakAreas: progression?.weakAreas.slice(0, 2).map((area) => area.domainTitle) ?? [],
      weakAreasPreview:
        progression?.weakAreas.slice(0, 2).map((area) => area.domainTitle).join(", ") ||
        "No ranked weak areas yet",
      nextAction:
        progression?.nextBestTask.description ??
        "Guide the student back to the next required step.",
      totalHours: "0h",
      activeHours: "0h",
      lessonsCompleted: progressForUser.reduce((sum, row) => sum + (row.lessons_completed ?? 0), 0),
      quizzesTaken: quizAttempts.length,
      mockExamsTaken: mockAttempts.length,
      averageScore,
      lastLogin: formatDateTime(student.last_login_at),
      lastActivity: formatDateTime(student.last_activity_at),
      lastActivityRaw: student.last_activity_at,
      activeSecondsRaw: 0,
      completionPercent: progression?.signals.moduleCompletionPercent ?? 0,
      isInactive: inactive,
    };
  }).filter((row) => {
    if (activity === "all") {
      return true;
    }
    if (activity === "inactive") {
      return row.isInactive;
    }
    if (activity === "active") {
      return !row.isInactive;
    }
    if (activity === "low_scores") {
      return row.quizzesTaken + row.mockExamsTaken > 0 && row.averageScore < 75;
    }
    if (activity === "low_hours") {
      return row.quizzesTaken + row.mockExamsTaken < 3;
    }
    return true;
  });

  const confidenceAttempts = (quizRows.data ?? [])
      .map((row: any) => row.confidence_score)
    .filter((value: unknown): value is number => typeof value === "number");

  return {
    filters: {
      from,
      to,
      cohort: filters.cohort ?? "",
      activity,
    },
    studentCount: reportRows.length,
    statusCounts: {
      progressing: reportRows.filter((row) => row.status === "progressing").length,
      stalled: reportRows.filter((row) => row.status === "stalled").length,
      atRisk: reportRows.filter((row) => row.status === "at_risk").length,
      examReady: reportRows.filter((row) => row.status === "exam_ready").length,
      pretestIncomplete: reportRows.filter((row) => row.status === "pretest_incomplete").length,
    },
    summary:
      reportRows.filter((row) => row.status === "stalled" || row.status === "at_risk").length > 0
        ? `${reportRows.filter((row) => row.status === "stalled" || row.status === "at_risk").length} students need follow-up right now across readiness or engagement.`
        : "No urgent follow-up group is showing right now.",
    cohortConfidence: {
      average: confidenceAttempts.length
        ? Number((confidenceAttempts.reduce((sum: number, value: number) => sum + value, 0) / confidenceAttempts.length).toFixed(1))
        : null,
      label: formatConfidenceScore(
        confidenceAttempts.length
          ? Number((confidenceAttempts.reduce((sum: number, value: number) => sum + value, 0) / confidenceAttempts.length).toFixed(1))
          : null,
      ),
      trend: confidenceAttempts.slice(-8),
      attemptCount: confidenceAttempts.length,
    },
    cohorts: Array.from(
      new Set(
        (students ?? [])
          .map((student: any) => student.cohort)
          .filter((cohort: any): cohort is string => Boolean(cohort)),
      ),
    ).sort(),
    studentsWithoutPretest: reportRows.filter((row) => row.status === "pretest_incomplete").slice(0, 8),
    lowEngagementStudents: reportRows.filter((row) => row.status === "stalled").slice(0, 8),
    inactiveStudents: reportRows.filter((row) => row.isInactive).slice(0, 8),
    weakReadinessStudents: reportRows.filter((row) => row.status === "at_risk").slice(0, 8),
    examReadyStudents: reportRows.filter((row) => row.status === "exam_ready").slice(0, 8),
    participantRows: reportRows,
    weaknessTrends: Array.from(
      new Map(
        (progressRows.data ?? [])
          .filter((row: any) => row.mastery_score < 80)
          .map((row: any) => [row.domain_slug, row]),
      ).values(),
    ).map((row: any) => ({
      domainSlug: row.domain_slug,
      domainTitle: row.domain_title,
      studentCount: (progressRows.data ?? []).filter((item: any) => item.domain_slug === row.domain_slug).length,
      averageMastery: row.mastery_score,
    })),
    statusTone: getStatusTone,
  };
}
