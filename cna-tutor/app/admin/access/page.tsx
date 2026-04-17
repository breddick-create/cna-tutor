import { promoteUserToAdminAction } from "@/app/admin/access/actions";
import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateTime } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminAccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const admin = createAdminClient();
  const params = await searchParams;
  const message = typeof params.message === "string" ? decodeURIComponent(params.message) : null;

  const [{ data: admins }, { data: students }] = await Promise.all([
    admin
      .from("profiles")
      .select("id, full_name, email, cohort, last_login_at, created_at")
      .eq("role", "admin")
      .order("full_name", { ascending: true }),
    admin
      .from("profiles")
      .select("id, full_name, email, cohort, last_login_at, created_at")
      .eq("role", "student")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Admin Access</p>
        <h1 className="mt-3 text-3xl font-semibold">Create and manage admin access.</h1>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          This page is visible only to admins. Use it to promote an existing account to admin so it
          can open the reporting dashboard and review student progress across the whole program.
        </p>
      </section>

      {message ? (
        <section className="rounded-2xl border border-[var(--border)] bg-white/85 px-5 py-4 text-sm shadow-sm">
          {message}
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Promote By Email</p>
          <h2 className="mt-2 text-2xl font-semibold">Turn an existing account into an admin.</h2>
          <p className="text-muted mt-3 text-sm leading-6">
            Enter the email address of an account that already exists in the app. On the next sign
            in, that user will land in the admin area instead of the student workspace.
          </p>

          <form action={promoteUserToAdminAction} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="promote-email">
                Account email
              </label>
              <input
                className="input-base"
                id="promote-email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>

            <button className="button-primary" type="submit">
              Make this account an admin
            </button>
          </form>
        </div>

        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Current Admins</p>
          <div className="mt-4 space-y-3">
            {admins?.length ? (
              admins.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-3xl border border-[var(--border)] bg-white/70 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{profile.full_name}</p>
                      <p className="text-muted mt-1 text-sm">{profile.email}</p>
                    </div>
                    <span className="rounded-full bg-[rgba(23,60,255,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                      admin
                    </span>
                  </div>
                  <p className="text-muted mt-3 text-sm leading-6">
                    {profile.cohort ? `Cohort: ${profile.cohort}. ` : ""}
                    {profile.last_login_at
                      ? `Last sign in ${formatDateTime(profile.last_login_at)}.`
                      : `Created ${formatDateTime(profile.created_at)}.`}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted rounded-3xl border border-[var(--border)] bg-white/70 p-4 text-sm">
                No admin profiles are listed yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Recent Students</p>
            <h2 className="mt-2 text-2xl font-semibold">Promote from the latest student accounts.</h2>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white/75">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-[rgba(123,144,158,0.08)]">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Cohort</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {students?.length ? (
                students.map((profile) => (
                  <tr key={profile.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3">
                      <p className="font-medium">{profile.full_name}</p>
                      <p className="text-muted mt-1 text-xs">{profile.email}</p>
                    </td>
                    <td className="px-4 py-3">{profile.cohort ?? "N/A"}</td>
                    <td className="px-4 py-3">{formatDateTime(profile.created_at)}</td>
                    <td className="px-4 py-3">
                      <form action={promoteUserToAdminAction}>
                        <input name="email" type="hidden" value={profile.email} />
                        <button className="button-secondary" type="submit">
                          Make admin
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-muted" colSpan={4}>
                    Student accounts will appear here once users begin signing up.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
