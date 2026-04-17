import Link from "next/link";

import { ContinueStudyCta } from "@/components/ccma/continue-study-cta";
import { GuidedStudyPath } from "@/components/student/guided-study-path";
import { requireCcmaViewer } from "@/lib/ccma/auth/session";
import { pickLocalizedText, resolvePreferredLanguage } from "@/lib/ccma/i18n/languages";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/ccma/onboarding/pretest";
import {
  buildGuidedStudyPath,
  getCompletedLessonIdsFromSessions,
  getPreferredStudyMode,
  getResumableSessionForLesson,
} from "@/lib/ccma/progression/study-path";
import { getAdaptiveStudyPlan } from "@/lib/ccma/study-plan/generator";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toTopicSelection(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return new Set(value.flatMap((entry) => entry.split(",")));
  }

  if (typeof value === "string") {
    return new Set(value.split(","));
  }

  return new Set<string>();
}

export default async function StudyPlanPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireCcmaViewer();
  const language = resolvePreferredLanguage(viewer.profile.preferred_language);
  const text = (en: string, es: string) => pickLocalizedText(language, { en, es });
  const pretestScore = getPretestScore(viewer.user);
  const pretestDomainBreakdown = getPretestDomainBreakdown(viewer.user);
  const supabase = (await createClient()) as any;
  const params = await searchParams;
  const selectedTopics = toTopicSelection(params.topics);

  const [adaptivePlan, { data: studySessions }] = await Promise.all([
    getAdaptiveStudyPlan({
      userId: viewer.user.id,
      pretestScore,
      pretestDomainBreakdown,
    }),
    supabase
      .from("ccma_tutor_sessions")
      .select("id, status, last_activity_at, session_state_json")
      .eq("user_id", viewer.user.id)
      .order("last_activity_at", { ascending: false }),
  ]);

  const studyPath = buildGuidedStudyPath({
    progression: adaptivePlan.progression,
    completedLessonIds: getCompletedLessonIdsFromSessions(studySessions ?? []),
  });
  const weakDomainSlugs = new Set(
    adaptivePlan.progression.weakAreas.map((area) => area.domainSlug),
  );
  const currentModule = studyPath.nextModule;
  const currentLesson = currentModule?.lesson ?? null;
  const resumableSession = getResumableSessionForLesson(
    studySessions ?? [],
    currentLesson?.id ?? null,
  );
  const currentMode = currentLesson
    ? getPreferredStudyMode(currentLesson, weakDomainSlugs)
    : null;

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{text("Study Plan", "Plan de estudio")}</p>
            <h1 className="mt-3 text-3xl font-semibold">
              {text("Follow the next domain in order.", "Sigue el siguiente dominio en orden.")}
            </h1>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              {text(
                "Your study plan is locked to the weakest-first path below. Finish the current lesson, then use the quiz and section mock for that same domain before moving on.",
                "Tu plan de estudio esta bloqueado a la ruta de temas mas debiles primero. Termina la leccion actual y luego usa el quiz y el examen por seccion de ese mismo dominio antes de avanzar.",
              )}
            </p>
          </div>
          <Link className="button-secondary" href="/ccma/dashboard">
            {text("Check your progress", "Revisar tu progreso")}
          </Link>
        </div>

        <div className="mt-6 max-w-md">
          {currentLesson && currentMode ? (
            <ContinueStudyCta
              defaultMode={currentLesson.defaultMode}
              initialMode={currentMode}
              label={
                resumableSession
                  ? `Continue ${currentLesson.title}`
                  : `Continue with ${currentModule?.domainTitle ?? currentLesson.title}`
              }
              lessonId={currentLesson.id}
              resumableSessionId={resumableSession?.id ?? null}
              supportedModes={currentLesson.supportedModes}
            />
          ) : (
            <Link
              className="button-primary inline-flex items-center justify-center"
              href={adaptivePlan.nextStep.href}
            >
              {text("Continue", "Continuar")}
            </Link>
          )}
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{text("Topic Selection", "Seleccion de temas")}</p>
            <h2 className="mt-2 text-2xl font-semibold">
              {text("Domains ranked weak to strong from your pre-test.", "Dominios ordenados de debil a fuerte desde tu preevaluacion.")}
            </h2>
            <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
              {text(
                "Use the checkboxes to mark the domains you want on your radar while still following the required order.",
                "Usa las casillas para marcar los dominios que quieres mantener presentes mientras sigues el orden requerido.",
              )}
            </p>
          </div>
        </div>

        <form className="mt-5 space-y-4">
          {adaptivePlan.priorityCategories.map((section, index) => (
            <article
              key={section.slug}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <label className="flex min-w-0 flex-1 items-start gap-3">
                  <input
                    className="mt-1 size-5 accent-[var(--brand)]"
                    defaultChecked={selectedTopics.has(section.slug)}
                    name="topics"
                    type="checkbox"
                    value={section.slug}
                  />
                  <span className="min-w-0">
                    <span className="block font-semibold">
                      {index + 1}. {section.title}
                    </span>
                    <span className="text-muted mt-1 block text-sm leading-6">
                      Pre-test {section.baselineScore}% • Current mastery {section.score}%
                    </span>
                  </span>
                </label>
                <span className="rounded-full bg-[rgba(23,60,255,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
                  {section.priorityLabel}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6">{section.recommendation}</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link className="button-primary w-full sm:w-auto" href="/ccma/study">
                  {text("Guided lesson", "Leccion guiada")}
                </Link>
                <Link className="button-secondary w-full sm:w-auto" href={`/ccma/quiz?domain=${section.slug}`}>
                  {text("Quiz", "Quiz")}
                </Link>
                <Link className="button-secondary w-full sm:w-auto" href={`/ccma/mock-exam?domain=${section.slug}`}>
                  {text("Section mock exam", "Examen por seccion")}
                </Link>
              </div>
            </article>
          ))}
          <button className="button-secondary w-full sm:w-auto" type="submit">
            {text("Update focus", "Actualizar enfoque")}
          </button>
        </form>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">{text("Ordered Modules", "Modulos en orden")}</p>
        <h2 className="mt-2 text-2xl font-semibold">
          {text("Study topics open one at a time.", "Los temas de estudio se abren uno por uno.")}
        </h2>
        <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
          {text(
            "Completed modules stay behind you. The current module stays open. Future modules stay locked until you reach them in order.",
            "Los modulos completados quedan atras. El modulo actual sigue abierto. Los modulos futuros permanecen bloqueados hasta que llegues a ellos en orden.",
          )}
        </p>
        <div className="mt-5">
          <GuidedStudyPath
            currentModuleTitle={currentModule?.domainTitle ?? null}
            modules={studyPath.modules}
          />
        </div>
      </section>
    </div>
  );
}
