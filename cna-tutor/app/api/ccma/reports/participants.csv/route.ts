import { getCcmaViewer } from "@/lib/ccma/auth/session";
import { getCcmaAdminDashboard } from "@/lib/ccma/dashboard/admin";

function escapeCsv(value: string | number) {
  const stringValue = String(value);

  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

export async function GET(request: Request) {
  const viewer = await getCcmaViewer();

  if (!viewer || viewer.profile.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const dashboard = await getCcmaAdminDashboard({
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    cohort: searchParams.get("cohort") ?? undefined,
    activity:
      (searchParams.get("activity") as "all" | "active" | "inactive" | "low_hours" | "low_scores" | null) ??
      undefined,
  });

  const headers = [
    "Name",
    "Cohort",
    "Readiness Label",
    "Weak Area 1",
    "Weak Area 2",
    "Last Activity",
    "Mock Exams Completed",
    "Email",
    "Status",
    "Readiness Score",
  ];

  const rows = dashboard.participantRows.map((row: any) =>
    [
      row.name,
      row.cohort,
      row.readinessLabel,
      row.topWeakAreas[0] ?? "",
      row.topWeakAreas[1] ?? "",
      row.lastActivity,
      row.mockExamsTaken,
      row.email,
      row.statusLabel,
      row.readinessScore !== null ? `${row.readinessScore}%` : "",
    ]
      .map(escapeCsv)
      .join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cohort-progress-report.csv"',
    },
  });
}


