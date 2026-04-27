import { redirect } from "next/navigation";

import { requireViewer } from "@/lib/auth/session";
import { hasCompletedPretest } from "@/lib/onboarding/pretest";

export default async function WrittenHomePage() {
  const viewer = await requireViewer();

  if (!hasCompletedPretest(viewer.user)) {
    redirect("/written/pretest");
  }

  redirect("/written/study-plan");
}
