"use client";

export function PrintReportButton() {
  return (
    <button
      className="button-secondary"
      onClick={() => window.print()}
      type="button"
    >
      Print Report
    </button>
  );
}
