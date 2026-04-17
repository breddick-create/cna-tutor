export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-shell flex items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] border border-white/30 bg-[linear-gradient(135deg,rgba(28,124,104,0.94),rgba(20,95,80,0.94))] p-10 text-white shadow-2xl lg:block">
          <p className="eyebrow !text-white/70">NHA CCMA Exam Prep</p>
          <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight">
            Build a tutoring experience that teaches like a real instructor.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/82">
            This MVP is designed for guided study sessions, measurable engagement,
            and clean reporting so you can support learners and prove outcomes.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-white/65">
                Teaching style
              </p>
              <p className="mt-3 text-2xl font-semibold">Teacher-led</p>
              <p className="mt-2 text-sm leading-6 text-white/78">
                Explain, question, correct, reinforce, then advance.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-white/65">
                Reporting
              </p>
              <p className="mt-3 text-2xl font-semibold">Audit-ready</p>
              <p className="mt-2 text-sm leading-6 text-white/78">
                Track active study time, progress, mastery, and completion.
              </p>
            </div>
          </div>
        </section>
        {children}
      </div>
    </main>
  );
}
