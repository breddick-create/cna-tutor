import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "cna-tutor",
    timestamp: new Date().toISOString(),
  });
}

