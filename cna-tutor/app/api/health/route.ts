import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "hcci-tutor",
    timestamp: new Date().toISOString(),
  });
}

