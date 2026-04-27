import { AppShell } from "@/components/layout/app-shell";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await requireAdmin();

  return (
    <AppShell
      roleLabel="Admin"
      title="CCMA Tutor Admin"
      subtitle="Monitor learner engagement, progress, and completion."
      fullName={viewer.profile.full_name}
      username={viewer.profile.username}
    >
      {children}
    </AppShell>
  );
}
