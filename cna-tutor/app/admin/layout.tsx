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
      title="HCCI Tutor Admin"
      subtitle="Monitor learner engagement, progress, and completion."
      email={viewer.profile.email}
    >
      {children}
    </AppShell>
  );
}

