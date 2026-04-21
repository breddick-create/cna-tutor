import { NextResponse } from "next/server";

import { rdaDomains } from "@/content/rda/domains";
import { rdaExamBankStats } from "@/content/rda/exam-bank";

export async function GET() {
  return NextResponse.json({
    product: "rda",
    name: "RDA Tutor",
    philosophy: "readiness-first guided progression",
    domains: rdaDomains,
    examBank: rdaExamBankStats,
  });
}
