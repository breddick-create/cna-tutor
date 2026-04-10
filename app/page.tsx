import { redirect } from "next/navigation";

import { getViewer } from "@/lib/auth/session";

export default async function HomePage() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/sign-in");
  }

  redirect(viewer.profile.role === "admin" ? "/admin" : "/dashboard");
}
