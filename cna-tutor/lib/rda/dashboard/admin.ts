import { rdaDomains } from "@/content/rda/domains";
import { createRdaClient } from "@/lib/rda/supabase";
import type { Database } from "@/types/database";

type RdaReadinessSnapshotRow = Database["public"]["Tables"]["rda_readiness_snapshots"]["Row"];
type RdaMockExamAttemptRow = Database["public"]["Tables"]["rda_mock_exam_attempts"]["Row"];
type RdaAdminNoteRow = Database["public"]["Tables"]["rda_admin_notes"]["Row"];

export type RdaAdminFilters = {
  cohort?: string;
  activity?: "all" | "inactive" | "needs_check_in" | "mock_missing";
  selectedStudentId?: string;
};

export type RdaAdminStudentRow = {
  id: string;
  name: string;
  email: string;
  cohort: string;
  readinessScore: number | null;
  readinessLabel: string;
  weakAreas: unknown;
  inactiveDays: number | null;
  needsCheckIn: boolean;
  mockExamsCompleted: number;
  bestMockScore: number | null;
  adminNoteCount: number;
  lastActivity: string | null;
};

type RdaStudentProfileRow = {
  id: string;
  full_name: string;
  email: string;
  cohort: string | null;
  last_activity_at: string | null;
};

const INACTIVITY_THRESHOLD_DAYS = 7;

function daysSince(value: string | null) {
  if (!value) return null;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;
  return Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
}

function laterOf(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return new Date(a) >= new Date(b) ? a : b;
}

export async function getRdaAdminDashboard(filters: RdaAdminFilters = {}) {
  const supabase = await createRdaClient();
  let profileQuery = supabase
    .from("profiles")
    .select("id, full_name, email, cohort, last_activity_at")
    .eq("role", "student")
    .eq("product", "rda")
    .order("last_activity_at", { ascending: true });

  if (filters.cohort) profileQuery = profileQuery.eq("cohort", filters.cohort);

  const { data: profiles } = await profileQuery;
  const students: RdaStudentProfileRow[] = profiles ?? [];
  const studentIds = students.map((student) => student.id);

  const [
    { data: snapshots },
    { data: mocks },
    { data: notes },
    { data: quizActivity },
    { data: studySessions },
  ] = await Promise.all([
    studentIds.length
      ? supabase
          .from("rda_readiness_snapshots")
          .select("*")
          .in("user_id", studentIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    studentIds.length
      ? supabase.from("rda_mock_exam_attempts").select("*").in("user_id", studentIds)
      : Promise.resolve({ data: [] }),
    studentIds.length
      ? supabase.from("rda_admin_notes").select("*").in("user_id", studentIds).order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    studentIds.length
      ? supabase
          .from("rda_quiz_attempts")
          .select("user_id, completed_at")
          .in("user_id", studentIds)
          .order("completed_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    studentIds.length
      ? supabase
          .from("rda_study_sessions")
          .select("user_id, ended_at")
          .in("user_id", studentIds)
          .not("ended_at", "is", null)
          .order("ended_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  const snapshotsByUser = new Map<string, RdaReadinessSnapshotRow>();
  for (const row of (snapshots ?? []) as RdaReadinessSnapshotRow[]) {
    if (!snapshotsByUser.has(row.user_id)) {
      snapshotsByUser.set(row.user_id, row);
    }
  }

  const mocksByUser = new Map<string, RdaMockExamAttemptRow[]>();
  for (const row of mocks ?? []) {
    const current = mocksByUser.get(row.user_id) ?? [];
    current.push(row);
    mocksByUser.set(row.user_id, current);
  }

  const notesByUser = new Map<string, RdaAdminNoteRow[]>();
  for (const row of notes ?? []) {
    const current = notesByUser.get(row.user_id) ?? [];
    current.push(row);
    notesByUser.set(row.user_id, current);
  }

  // Latest study activity per user from quiz attempts and study sessions
  const latestQuizByUser = new Map<string, string>();
  for (const row of quizActivity ?? []) {
    if (!latestQuizByUser.has(row.user_id)) {
      latestQuizByUser.set(row.user_id, row.completed_at);
    }
  }

  const latestStudySessionByUser = new Map<string, string>();
  for (const row of studySessions ?? []) {
    if (!latestStudySessionByUser.has(row.user_id) && row.ended_at) {
      latestStudySessionByUser.set(row.user_id, row.ended_at);
    }
  }

  const rows: RdaAdminStudentRow[] = students.map((student) => {
    const snapshot = snapshotsByUser.get(student.id);
    const mockRows = mocksByUser.get(student.id) ?? [];
    const lastStudyActivity = laterOf(
      latestQuizByUser.get(student.id) ?? null,
      latestStudySessionByUser.get(student.id) ?? null,
    );
    const lastActivity = laterOf(lastStudyActivity, student.last_activity_at);
    const inactiveDays = daysSince(lastStudyActivity ?? student.last_activity_at);
    const readinessLabel = snapshot?.label ?? "Pre-test needed";
    const needsCheckIn =
      readinessLabel !== "Exam Ready" &&
      ((inactiveDays !== null && inactiveDays >= INACTIVITY_THRESHOLD_DAYS) ||
        (snapshot?.score ?? 0) < 55 ||
        mockRows.length === 0);

    return {
      id: student.id,
      name: student.full_name,
      email: student.email,
      cohort: student.cohort ?? "Unassigned",
      readinessScore: snapshot?.score ?? null,
      readinessLabel,
      weakAreas: snapshot?.weak_areas ?? [],
      inactiveDays,
      needsCheckIn,
      mockExamsCompleted: mockRows.length,
      bestMockScore: mockRows.length ? Math.max(...mockRows.map((row) => row.score)) : null,
      adminNoteCount: notesByUser.get(student.id)?.length ?? 0,
      lastActivity,
    };
  });

  // Flagged students appear first
  const sortedRows = [
    ...rows.filter((row) => row.needsCheckIn),
    ...rows.filter((row) => !row.needsCheckIn),
  ];

  const filteredRows = sortedRows.filter((row: RdaAdminStudentRow) => {
    if (!filters.activity || filters.activity === "all") return true;
    if (filters.activity === "inactive")
      return (row.inactiveDays ?? 0) >= INACTIVITY_THRESHOLD_DAYS;
    if (filters.activity === "needs_check_in") return row.needsCheckIn;
    if (filters.activity === "mock_missing") return row.mockExamsCompleted === 0;
    return true;
  });

  const readinessDistribution = {
    notReady: rows.filter((row) => row.readinessLabel === "Not Ready").length,
    makingProgress: rows.filter((row) => row.readinessLabel === "Making Progress").length,
    almostThere: rows.filter((row) => row.readinessLabel === "Almost There").length,
    examReady: rows.filter((row) => row.readinessLabel === "Exam Ready").length,
  };

  const weakAreaAnalysis = rdaDomains
    .map((domain) => ({
      domainSlug: domain.slug,
      domainTitle: domain.title,
      count: rows.filter((row) =>
        Array.isArray(row.weakAreas)
          ? row.weakAreas.some((weak) => {
              if (typeof weak === "string") return weak === domain.title || weak === domain.slug;
              if (!weak || typeof weak !== "object" || Array.isArray(weak)) return false;
              return "domainSlug" in weak && (weak as { domainSlug?: unknown }).domainSlug === domain.slug;
            })
          : false,
      ).length,
    }))
    .sort((a, b) => b.count - a.count);

  const selectedStudentNotes = filters.selectedStudentId
    ? (notesByUser.get(filters.selectedStudentId) ?? [])
    : [];

  return {
    filters: {
      cohort: filters.cohort ?? "",
      activity: filters.activity ?? "all",
    },
    studentCount: rows.length,
    readinessDistribution,
    weakAreaAnalysis,
    inactiveStudents: rows.filter((row) => (row.inactiveDays ?? 0) >= INACTIVITY_THRESHOLD_DAYS),
    needsCheckIn: rows.filter((row) => row.needsCheckIn),
    mockExamCompletion: {
      completed: rows.filter((row) => row.mockExamsCompleted > 0).length,
      missing: rows.filter((row) => row.mockExamsCompleted === 0).length,
    },
    exportRows: filteredRows,
    selectedStudentNotes,
  };
}
