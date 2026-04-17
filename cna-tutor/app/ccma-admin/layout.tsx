import { AppShell } from "@/components/layout/app-shell";
import { requireCcmaAdmin } from "@/lib/ccma/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await requireCcmaAdmin();

  return (
    <AppShell
      roleLabel="Admin"
      title="CCMA Tutor Admin"
      subtitle="Monitor CCMA learner engagement, progress, and readiness."
      email={viewer.profile.email}
    >
      {children}
    </AppShell>
  );
}

