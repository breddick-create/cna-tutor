import Link from "next/link";

import { GuidedStudyPath } from "@/components/student/guided-study-path";
import { ContinueStudyCta } from "@/components/ccma/continue-study-cta";
import { requireViewer } from "@/lib/auth/session";
import { pickLocalizedText, resolvePreferredLanguage } from "@/lib/ccma/i18n/languages";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/ccma/onboarding/pretest";
import {
  buildGuidedStudyPath,
  getCompletedLessonIdsFromSessions,
  getPreferredStudyMode,
  getResumableSessionForLesson,
} from "@/lib/ccma/progression/study-path";
import { createClient } from "@/lib/supabase/server";
import { getAdaptiveStudyPlan } from "@/lib/ccma/study-plan/generator";

export default async function StudyPlanPage() {
  const viewer = await requireViewer();
  const language = resolvePreferredLanguage(viewer.profile.preferred_language);
  const text = (en: string, es: string) => pickLocalizedText(language, { en, es });
  const pretestScore = getPretestScore(viewer.user);
  const pretestDomainBreakdown = getPretestDomainBreakdown(viewer.user);
  const supabase = await createClient();

  const [adaptivePlan, { data: studySessions }] = await Promise.all([
    getAdaptiveStudyPlan({
      userId: viewer.user.id,
      pretestScore,
      pretestDomainBreakdown,
    }),
    supabase
      .from("tutor_sessions")
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
  const continueLabel =
    resumableSession && currentLesson
      ? `Continue ${currentLesson.title}`
      : currentLesson
        ? `Continue with ${currentModule?.domainTitle ?? currentLesson.title}`
        : "Continue";
  const focusDomains = adaptivePlan.notes.firstFocus;

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{text("Study Plan", "Plan de estudio")}</p>
            <h1 className="mt-3 text-3xl font-semibold">
              {text("Follow the next module in order.", "Sigue el siguiente modulo en orden.")}
            </h1>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              {text(
                "Your study plan is locked to the weakest-first path below. Finish the current module before the next topic opens so you always know what matters now.",
                "Tu plan de estudio esta bloqueado a la ruta de temas mas debiles primero que aparece abajo. Termina el modulo actual antes de que se abra el siguiente tema para que siempre sepas que importa ahora.",
              )}
            </p>
            <p className="mt-4 text-sm leading-6">
              <span className="font-semibold">{text("Current focus:", "Enfoque actual:")}</span>{" "}
              {currentModule?.domainTitle ?? adaptivePlan.nextStep.title}
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
              label={continueLabel}
              lessonId={currentLesson.id}
              resumableSessionId={resumableSession?.id ?? null}
              supportedModes={currentLesson.supportedModes}
            />
          ) : (
            <Link className="button-primary inline-flex items-center justify-center" href={adaptivePlan.nextStep.href}>
              {text("Continue", "Continuar")}
            </Link>
          )}
        </div>
        <p className="text-muted mt-4 max-w-3xl text-sm leading-6">
          {text(
            "Start with the guided lesson. Then take the practice quiz and section mock for that same topic before you move down the list.",
            "Empieza con la leccion guiada. Luego toma el quiz de practica y el examen por seccion de ese mismo tema antes de bajar en la lista.",
          )}
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">{text("Pre-Test Snapshot", "Resumen de la preevaluacion")}</p>
          <p className="mt-3 text-3xl font-semibold">{pretestScore ?? 0}%</p>
          <p className="text-muted mt-3 text-sm leading-6">
            {text(
              "This score sets the opening order for your guided study path.",
              "Este puntaje define el orden inicial de tu ruta de estudio guiado.",
            )}
          </p>
        </div>
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">{text("Next Step", "Siguiente paso")}</p>
          <p className="mt-3 text-2xl font-semibold">{adaptivePlan.nextStep.title}</p>
          <p className="text-muted mt-3 text-sm leading-6">
            {adaptivePlan.nextStep.description}
          </p>
        </div>
        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">{text("First Focus", "Primer enfoque")}</p>
          <p className="mt-3 text-lg font-semibold">
            {focusDomains.join(", ") || "Your top ranked sections"}
          </p>
          <p className="text-muted mt-3 text-sm leading-6">
            {adaptivePlan.notes.sequencing}
          </p>
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">{text("Weekly Rhythm", "Ritmo semanal")}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5">
            <p className="text-sm font-semibold">{text("1. Finish the current module", "1. Termina el modulo actual")}</p>
            <p className="text-muted mt-2 text-sm leading-6">
              Stay with the open topic until you finish the guided lesson and understand the core ideas.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5">
            <p className="text-sm font-semibold">{text("2. Check it with a practice quiz", "2. Compruebalo con un quiz de practica")}</p>
            <p className="text-muted mt-2 text-sm leading-6">
              Use the 10-question quiz right after the lesson so you know whether the topic is sticking.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5">
            <p className="text-sm font-semibold">{text("3. Prove it with the section mock", "3. Compruebalo con el examen por seccion")}</p>
            <p className="text-muted mt-2 text-sm leading-6">
              Finish the section mock before you expect the next topic to open.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5">
            <p className="text-sm font-semibold">{text("4. Save the full practice exam for later", "4. Deja el examen completo para despues")}</p>
            <p className="text-muted mt-2 text-sm leading-6">
              {adaptivePlan.notes.practiceExam}
            </p>
          </div>
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
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
          </div>
          <p className="text-sm font-medium leading-6">
            {currentModule
              ? text(`${currentModule.domainTitle} is your current module.`, `${currentModule.domainTitle} es tu modulo actual.`)
              : text("Your next required step is ready.", "Tu siguiente paso requerido ya esta listo.")}
          </p>
        </div>

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


