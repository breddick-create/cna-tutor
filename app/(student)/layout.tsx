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
      title="CCMA Tutor"
      subtitle="Your guided study workspace for the NHA CCMA exam."
      fullName={viewer.profile.full_name}
      username={viewer.profile.username}
    >
      {children}
    </AppShell>
  );
}
