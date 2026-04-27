import { getViewer } from "@/lib/auth/session";
import { getAdminDashboard } from "@/lib/dashboard/admin";

function escapeCsv(value: string | number) {
  const stringValue = String(value);

  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

export async function GET(request: Request) {
  const viewer = await getViewer();

  if (!viewer || viewer.profile.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const dashboard = await getAdminDashboard({
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    cohort: searchParams.get("cohort") ?? undefined,
    activity:
      (searchParams.get("activity") as "all" | "active" | "inactive" | "low_hours" | "low_scores" | null) ??
      undefined,
  });

  const headers = [
    "Name",
    "Username",
    "Cohort",
    "Total Hours",
    "Active Study Hours",
    "Lessons Completed",
    "Quizzes Taken",
    "Mock Exams Taken",
    "Average Score",
    "Mastery Level",
    "Last Login",
    "Last Activity",
    "Completion Percent",
  ];

  const rows = dashboard.participantRows.map((row) =>
    [
      row.name,
      row.username,
      row.cohort,
      row.totalHours,
      row.activeHours,
      row.lessonsCompleted,
      row.quizzesTaken,
      row.mockExamsTaken,
      `${row.averageScore}%`,
      row.masteryLevel,
      row.lastLogin,
      row.lastActivity,
      `${row.completionPercent}%`,
    ]
      .map(escapeCsv)
      .join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="participant-report.csv"',
    },
  });
}
