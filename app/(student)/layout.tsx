import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { requireViewer } from "@/lib/auth/session";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await requireViewer();

  if (viewer.profile.role === "admin") {
    redirect("/admin");
  }

  return (
    <AppShell
      roleLabel="Student"
      title="CNA Tutor"
      subtitle="Your guided study workspace for the Texas CNA written exam."
      fullName={viewer.profile.full_name}
      email={viewer.profile.email}
    >
      {children}
    </AppShell>
  );
}
