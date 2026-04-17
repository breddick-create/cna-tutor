import Link from "next/link";

import { StudyLauncher } from "@/components/tutor/study-launcher";
import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { listTutorLessons } from "@/lib/tutor/lessons";
import {
  getRecommendedLessonsFromMastery,
  getWeakAreaSummary,
} from "@/lib/tutor/recommendations";
import type { TutorLesson, TutorMode } from "@/lib/tutor/types";
import { formatDateTime } from "@/lib/utils";

function getPreferredMode(lesson: TutorLesson, weakDomainSlugs: Set<string>): TutorMode {
  if (
    weakDomainSlugs.has(lesson.domainSlug) &&
    lesson.supportedModes.includes("weak_area_review")
  ) {
    return "weak_area_review";
  }

  if (lesson.supportedModes.includes("learn")) {
    return "learn";
  }

  return lesson.defaultMode;
}

export default async function StudyPage() {
  const viewer = await requireViewer();
  const supabase = await createClient();
  const lessons = listTutorLessons();

  const [{ data: sessions }, { data: rawMasteryRows }] = await Promise.all([
    supabase
      .from("ccma_tutor_sessions")
      .select("id, status, mode, last_activity_at, session_state_json")
      .eq("user_id", viewer.user.id)
      .order("last_activity_at", { ascending: false })
      .limit(6),
    supabase
      .from("ccma_domain_mastery")
      .select("domain_id, mastery_score, weak_streak")
      .eq("user_id", viewer.user.id)
      .order("mastery_score", { ascending: true })
      .limit(6),
  ]);

  const domainIds = (rawMasteryRows ?? []).map((row) => row.domain_id);
  const { data: domains } = domainIds.length
    ? await supabase.from("ccma_domains").select("id, slug, title").in("id", domainIds)
    : { data: [] };
  const domainMap = new Map((domains ?? []).map((domain) => [domain.id, domain]));

  const masteryRows = (rawMasteryRows ?? []).map((row) => ({
    ...row,
    domainTitle: domainMap.get(row.domain_id)?.title,
    domainSlug: domainMap.get(row.domain_id)?.slug,
  }));

  const recommendedLessons = getRecommendedLessonsFromMastery(masteryRows);
  const weakAreaSummary = getWeakAreaSummary(masteryRows);
  const weakDomainSlugs = new Set(
    masteryRows
      .filter((row) => (row.domainSlug ? row.mastery_score < 75 || row.weak_streak > 0 : false))
      .map((row) => row.domainSlug as string),
  );

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Teacher-Led Study</p>
            <h2 className="mt-3 text-3xl font-semibold">Follow the next best lesson, not just any lesson.</h2>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              The tutor leads each session, checks your understanding, and now uses your performance to
              recommend what to review next.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="button-secondary" href="/quiz">
              Targeted quiz
            </Link>
            <Link className="button-secondary" href="/mock-exam">
              Mock exam
            </Link>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {weakAreaSummary.length ? (
            weakAreaSummary.map((area) => (
              <span
                key={area}
                className="rounded-full bg-[rgba(217,111,50,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]"
              >
                Revisit {area}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-[rgba(28,124,104,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
              No weak areas flagged yet
            </span>
          )}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {recommendedLessons.map((lesson, index) => {
          const preferredMode = getPreferredMode(lesson, weakDomainSlugs);

          return (
            <div key={lesson.id} className="panel rounded-[1.75rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">{index === 0 ? "Recommended Next" : "Keep Building"}</p>
                <span className="rounded-full bg-[rgba(28,124,104,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                  {preferredMode.replaceAll("_", " ")}
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold">{lesson.title}</h3>
              <p className="text-muted mt-3 text-sm leading-6">{lesson.summary}</p>
              <p className="mt-4 text-sm leading-6">
                <span className="font-semibold">Why now:</span>{" "}
                {weakDomainSlugs.has(lesson.domainSlug)
                  ? `This domain is showing up as a weak area, so the tutor should reteach it.`
                  : `This is a strong next step to keep your exam prep moving.`}
              </p>
              <div className="mt-6">
                <StudyLauncher
                  defaultMode={lesson.defaultMode}
                  initialMode={preferredMode}
                  lessonId={lesson.id}
                  supportedModes={lesson.supportedModes}
                />
              </div>
            </div>
          );
        })}
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">All Guided Lessons</p>
            <h3 className="mt-2 text-2xl font-semibold">Choose a topic or let the recommendations lead.</h3>
          </div>
          <Link className="button-secondary" href="/dashboard">
            Back to dashboard
          </Link>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">{lesson.domainTitle}</p>
                <span className="text-muted text-xs font-semibold uppercase tracking-[0.16em]">
                  {lesson.estimatedMinutes} min
                </span>
              </div>
              <h4 className="mt-3 text-xl font-semibold">{lesson.title}</h4>
              <p className="text-muted mt-3 text-sm leading-6">{lesson.summary}</p>
              <p className="mt-3 text-sm leading-6">
                <span className="font-semibold">Goal:</span> {lesson.learningGoal}
              </p>
              <div className="mt-5">
                <StudyLauncher
                  defaultMode={lesson.defaultMode}
                  initialMode={getPreferredMode(lesson, weakDomainSlugs)}
                  lessonId={lesson.id}
                  supportedModes={lesson.supportedModes}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Recent Sessions</p>
        <h3 className="mt-2 text-2xl font-semibold">Pick up where you left off.</h3>
        <div className="mt-5 space-y-3">
          {sessions?.length ? (
            sessions.map((session) => {
              const state =
                session.session_state_json &&
                typeof session.session_state_json === "object" &&
                !Array.isArray(session.session_state_json) &&
                "lessonId" in session.session_state_json
                  ? String(session.session_state_json.lessonId)
                  : null;
              const lesson = state ? lessons.find((item) => item.id === state) : null;

              return (
                <Link
                  key={session.id}
                  className="block rounded-3xl border border-[var(--border)] bg-white/70 p-4 transition hover:bg-white/90"
                  href={`/study/${session.id}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{lesson?.title ?? "Study session"}</p>
                      <p className="text-muted mt-1 text-sm">
                        {session.mode.replaceAll("_", " ")} - Last activity{" "}
                        {formatDateTime(session.last_activity_at)}
                      </p>
                    </div>
                    <span className="rounded-full bg-[rgba(28,124,104,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                      {session.status}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-muted rounded-3xl border border-[var(--border)] bg-white/70 p-4 text-sm">
              No tutor sessions yet. Start with the recommended lesson and let the teacher guide
              the first session.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
