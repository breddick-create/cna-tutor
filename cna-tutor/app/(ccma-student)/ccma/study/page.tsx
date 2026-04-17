import Link from "next/link";

import { GuidedStudyPath } from "@/components/student/guided-study-path";
import { StudentEmptyState } from "@/components/student/student-empty-state";
import { ContinueStudyCta } from "@/components/ccma/continue-study-cta";
import { requireCcmaViewer } from "@/lib/ccma/auth/session";
import { pickLocalizedText, resolvePreferredLanguage } from "@/lib/ccma/i18n/languages";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/ccma/onboarding/pretest";
import {
  buildGuidedStudyPath,
  getCompletedLessonIdsFromSessions,
  getLessonIdFromSessionState,
  getPreferredStudyMode,
  getResumableSessionForLesson,
} from "@/lib/ccma/progression/study-path";
import { getStudentProgressionSnapshot } from "@/lib/ccma/progression/student";
import { createClient } from "@/lib/supabase/server";
import { getTutorLesson } from "@/lib/ccma/tutor/lessons";
import { getTutorModeLabel } from "@/lib/ccma/tutor/mode-labels";
import { formatDateTime } from "@/lib/utils";

export default async function StudyPage() {
  const viewer = await requireCcmaViewer();
  const language = resolvePreferredLanguage(viewer.profile.preferred_language);
  const text = (en: string, es: string) => pickLocalizedText(language, { en, es });
  const supabase = (await createClient()) as any;

  const [progression, { data: sessions }] = await Promise.all([
    getStudentProgressionSnapshot({
      userId: viewer.user.id,
      pretestScore: getPretestScore(viewer.user),
      pretestDomainBreakdown: getPretestDomainBreakdown(viewer.user),
    }),
    supabase
      .from("ccma_tutor_sessions")
      .select("id, status, mode, last_activity_at, session_state_json")
      .eq("user_id", viewer.user.id)
      .order("last_activity_at", { ascending: false })
      .limit(12),
  ]);

  const studySessions = sessions ?? [];
  const studyPath = buildGuidedStudyPath({
    progression,
    completedLessonIds: getCompletedLessonIdsFromSessions(studySessions),
  });
  const weakDomainSlugs = new Set(progression.weakAreas.map((area) => area.domainSlug));
  const currentModule = studyPath.nextModule;
  const currentLesson = currentModule?.lesson ?? null;
  const resumableSession = getResumableSessionForLesson(
    studySessions,
    currentLesson?.id ?? null,
  );
  const currentMode = currentLesson
    ? getPreferredStudyMode(currentLesson, weakDomainSlugs)
    : null;
  const recentAllowedSessions = studySessions
    .filter((session: any) => {
      const lessonId = getLessonIdFromSessionState(session.session_state_json);
      return lessonId ? studyPath.allowedLessonIds.has(lessonId) : false;
    })
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">{text("Guided Study", "Estudio guiado")}</p>
            <h1 className="mt-3 text-3xl font-semibold">
              {text(
                "Continue the one module that is open right now.",
                "Continua con el unico modulo que esta abierto ahora mismo.",
              )}
            </h1>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              Guided study is no longer a topic browser. The open module below is the next lesson
              in your plan, based on your weakest areas and current progress.
            </p>
            <p className="mt-4 text-sm leading-6">
              <span className="font-semibold">{text("Open now:", "Abierto ahora:")}</span>{" "}
              {currentModule?.domainTitle ?? progression.nextBestTask.title}
            </p>
          </div>
          <Link className="button-secondary w-full sm:w-auto" href="/ccma/study-plan">
            {text("View full study plan", "Ver plan de estudio completo")}
          </Link>
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-4 sm:p-5">
          <p className="text-sm font-semibold">{text("Start or resume now", "Inicia o retoma ahora")}</p>
          <p className="text-muted mt-2 text-sm leading-6">
            {text(
              "Keep this control close on mobile. Open the current lesson here before you scroll through the rest of the plan.",
              "Manten este control cerca en movil. Abre aqui la leccion actual antes de desplazarte por el resto del plan.",
            )}
          </p>
          <div className="mt-4 max-w-md">
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
              <Link className="button-primary inline-flex w-full items-center justify-center sm:w-auto" href={progression.nextBestTask.href}>
                {text("Continue", "Continuar")}
              </Link>
            )}
          </div>
        </div>
        <p className="text-muted mt-4 max-w-3xl text-sm leading-6">
          Finish this lesson first. Then check the same topic with a practice quiz and section mock
          before you expect the next module to unlock.
        </p>
      </section>

      {currentModule ? (
        <section className="panel-strong rounded-[1.75rem] p-6">
          <p className="eyebrow">{text("Current Module", "Modulo actual")}</p>
          <h2 className="mt-3 text-3xl font-semibold">{currentModule.domainTitle}</h2>
          <p className="text-muted mt-3 max-w-3xl leading-7">{currentModule.description}</p>
          <p className="mt-3 text-sm leading-6">
            <span className="font-semibold">{text("Why this comes first:", "Por que esto va primero:")}</span>{" "}
            {currentModule.recommendation}
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
              <p className="text-sm font-semibold">{text("Current score", "Puntaje actual")}</p>
              <p className="mt-2 text-2xl font-semibold">{currentModule.masteryScore}%</p>
            </div>
            <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
              <p className="text-sm font-semibold">{text("Pre-test baseline", "Base de la preevaluacion")}</p>
              <p className="mt-2 text-2xl font-semibold">{currentModule.baselineScore}%</p>
            </div>
            <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
              <p className="text-sm font-semibold">{text("Weak streak", "Racha debil")}</p>
              <p className="mt-2 text-2xl font-semibold">{currentModule.weakStreak}</p>
            </div>
          </div>
        </section>
      ) : null}

      {!currentModule ? (
        <StudentEmptyState
          description={text(
            "You do not have a guided lesson open right now. Use the next required step to keep your readiness moving.",
            "No tienes una leccion guiada abierta ahora mismo. Usa el siguiente paso requerido para seguir avanzando en tu preparacion.",
          )}
          eyebrow={text("Guided Study", "Estudio guiado")}
          primaryAction={{
            href: progression.nextBestTask.href,
            label: text("Continue next step", "Continuar con el siguiente paso"),
          }}
          secondaryAction={{
            href: "/ccma/dashboard",
            label: text("Check progress", "Revisar progreso"),
          }}
          title={text("Your next guided step is ready.", "Tu siguiente paso guiado esta listo.")}
        />
      ) : null}

      <section className="panel rounded-[1.75rem] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{text("Ordered Modules", "Modulos en orden")}</p>
            <h2 className="mt-2 text-2xl font-semibold">
              {text("Future modules stay locked until you reach them.", "Los modulos futuros permanecen bloqueados hasta que llegues a ellos.")}
            </h2>
            <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
              The order below follows the current study plan. You can resume the current module,
              but you cannot jump ahead to another topic.
            </p>
          </div>
          <p className="text-sm font-medium leading-6">
            {currentModule
              ? `${currentModule.domainTitle} is the only open module right now.`
              : "Your next required step is ready."}
          </p>
        </div>

        <div className="mt-5">
          <GuidedStudyPath
            currentModuleTitle={currentModule?.domainTitle ?? null}
            modules={studyPath.modules}
          />
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">{text("Recent Sessions", "Sesiones recientes")}</p>
        <h3 className="mt-2 text-2xl font-semibold">
          {text("Pick up the work you are allowed to continue.", "Retoma el trabajo que tienes permitido continuar.")}
        </h3>
        <div className="mt-5 space-y-3">
          {recentAllowedSessions.length ? (
            recentAllowedSessions.map((session: any) => {
              const lessonId = getLessonIdFromSessionState(session.session_state_json);
              const lesson = lessonId ? getTutorLesson(lessonId) : null;

              return (
                <Link
                  key={session.id}
                  className="block rounded-3xl border border-[var(--border)] bg-white/70 p-4 transition hover:bg-white/90"
                  href={`/ccma/study/${session.id}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{lesson?.title ?? "Study session"}</p>
                      <p className="text-muted mt-1 text-sm">
                        {getTutorModeLabel(session.mode)} - {text("Last activity", "Ultima actividad")}{" "}
                        {formatDateTime(session.last_activity_at)}
                      </p>
                    </div>
                    <span className="rounded-full bg-[rgba(23,60,255,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                      {session.status}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <StudentEmptyState
              compact
              description={text(
                "Once you start the current module, it will show up here so you can jump back in without guessing.",
                "Cuando inicies el modulo actual, aparecera aqui para que puedas volver sin tener que adivinar.",
              )}
              eyebrow={text("Recent Sessions", "Sesiones recientes")}
              primaryAction={{
                href: "/ccma/study-plan",
                label: text("Open study plan", "Abrir plan de estudio"),
              }}
              secondaryAction={{
                href: "/ccma/dashboard",
                label: text("Check progress", "Revisar progreso"),
              }}
              title={text("No resumable guided session yet.", "Todavia no hay una sesion guiada para retomar.")}
            />
          )}
        </div>
      </section>
    </div>
  );
}
