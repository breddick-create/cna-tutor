import { NextResponse } from "next/server";

import { requireRdaAdmin } from "@/lib/rda/auth/session";
import { getRdaAdminDashboard } from "@/lib/rda/dashboard/admin";

function escapeCell(value: string | number | null | undefined): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowToCsv(cells: (string | number | null | undefined)[]): string {
  return cells.map(escapeCell).join(",");
}

export async function GET() {
  await requireRdaAdmin();

  const dashboard = await getRdaAdminDashboard();
  const rows = dashboard.exportRows;

  const headers = [
    "Student Name",
    "Email",
    "Cohort",
    "Readiness Label",
    "Readiness Score",
    "Weak Areas",
    "Mock Exams Completed",
    "Best Mock Score",
    "Last Activity",
    "Admin Note Count",
    "Needs Check-In",
  ];

  const csvLines = [
    rowToCsv(headers),
    ...rows.map((row) =>
      rowToCsv([
        row.name,
        row.email,
        row.cohort,
        row.readinessLabel,
        row.readinessScore,
        Array.isArray(row.weakAreas)
          ? row.weakAreas
              .map((w) => {
                if (typeof w === "string") return w;
                if (w && typeof w === "object" && "domainTitle" in w) return String((w as { domainTitle?: unknown }).domainTitle ?? "");
                return "";
              })
              .filter(Boolean)
              .join("; ")
          : "",
        row.mockExamsCompleted,
        row.bestMockScore,
        row.lastActivity ? new Date(row.lastActivity).toLocaleDateString() : "",
        row.adminNoteCount,
        row.needsCheckIn ? "Yes" : "No",
      ]),
    ),
  ];

  const csv = csvLines.join("\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rda-students-${date}.csv"`,
    },
  });
}
