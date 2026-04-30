import { redirect } from "next/navigation";

import { requireViewer } from "@/lib/auth/session";
import { hasCompletedWrittenPretest } from "@/lib/onboarding/written-pretest";

export default async function WrittenHomePage() {
  const viewer = await requireViewer();

  if (!hasCompletedWrittenPretest(viewer.user)) {
    redirect("/written/pretest");
  }

  redirect("/written/study-plan");
}
