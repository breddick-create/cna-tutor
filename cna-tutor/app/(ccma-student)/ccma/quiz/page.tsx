import Link from "next/link";

import { AssessmentRunner } from "@/components/exams/assessment-runner";
import { StudentEmptyState } from "@/components/student/student-empty-state";
import { requireViewer } from "@/lib/auth/session";
import { getAssessmentQuestions } from "@/lib/ccma/exams/bank";
import { pickLocalizedText, resolvePreferredLanguage } from "@/lib/ccma/i18n/languages";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/ccma/onboarding/pretest";
import { getStudentProgressionSnapshot } from "@/lib/ccma/progression/student";

type SearchParams = Promise<{ mode?: string }>;

export default async function QuizPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireViewer();
  const language = resolvePreferredLanguage(viewer.profile.preferred_language);
  const text = (en: string, es: string) => pickLocalizedText(language, { en, es });
  const params = await searchParams;
  const progression = await getStudentProgressionSnapshot({
    userId: viewer.user.id,
    pretestScore: getPretestScore(viewer.user),
    pretestDomainBreakdown: getPretestDomainBreakdown(viewer.user),
  });

  const assignedWeakArea = progression.topWeakAreas[0] ?? null;
  const isWeakAreaDrill = params.mode === "drill";
  const drillDomains = progression.topWeakAreas.slice(0, 3);

  if (!assignedWeakArea) {
    return (
      <div className="space-y-8">
        <section className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">
            {isWeakAreaDrill
              ? text("Weak-Area Drill", "Practica de areas debiles")
              : text("Practice Quiz", "Quiz de practica")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            {text(
              "Your weak-area quizzes are under control.",
              "Tus quizzes de areas debiles estan bajo control.",
            )}
          </h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            {text(
              "You do not have an urgent weak topic that needs another short quiz right now. That is a good sign. The best next checkpoint is a full practice exam.",
              "No tienes un tema debil urgente que necesite otro quiz corto ahora mismo. Eso es una buena senal. El mejor siguiente punto de control es un examen completo de practica.",
            )}
          </p>
        </section>

        <StudentEmptyState
          description={text(
            "You have worked your weaker quiz topics into a stronger range. Use a full practice exam now to confirm that your readiness holds across the whole test.",
            "Has llevado tus temas mas debiles del quiz a un rango mas fuerte. Usa ahora un examen completo de practica para confirmar que tu preparacion se mantiene en toda la prueba.",
          )}
          eyebrow={text("Ready For More", "Listo para mas")}
          primaryAction={{
            href: "/ccma/mock-exam",
            label: text("Go to practice exam", "Ir al examen de practica"),
          }}
          secondaryAction={{
            href: "/ccma/dashboard",
            label: text("Check readiness", "Revisar preparacion"),
          }}
          title={text(
            "Nice work. Your next quiz topic is no longer the blocker.",
            "Buen trabajo. Tu siguiente tema de quiz ya no es el bloqueo principal.",
          )}
        />
      </div>
    );
  }

  const questions = isWeakAreaDrill
    ? getAssessmentQuestions(
        "weak_area_drill",
        undefined,
        drillDomains.map((area) => area.domainSlug),
      )
    : getAssessmentQuestions("quiz", assignedWeakArea.domainSlug);

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">
              {isWeakAreaDrill
                ? text("Weak-Area Drill", "Practica de areas debiles")
                : text("Practice Quiz", "Quiz de practica")}
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              {isWeakAreaDrill
                ? text(
                    "Drill your top weak areas in one rapid check.",
                    "Practica tus principales areas debiles en una revision rapida.",
                  )
                : text(
                    "Quiz the topic that needs the most work next.",
                    "Haz el quiz del tema que mas trabajo necesita ahora.",
                  )}
            </h1>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              {isWeakAreaDrill
                ? text(
                    "This 10-question drill pulls only from your top 3 weak areas so you can get focused repetition where readiness needs it most.",
                    "Esta practica de 10 preguntas toma solo tus 3 areas debiles principales para que obtengas repeticion enfocada donde mas la necesita tu preparacion.",
                  )
                : text(
                    "This quiz is assigned automatically from your highest-priority weak area so you can check the topic that matters most before moving on.",
                    "Este quiz se asigna automaticamente desde tu area debil de mayor prioridad para que revises el tema que mas importa antes de avanzar.",
                  )}
            </p>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-7">
              {isWeakAreaDrill
                ? text(
                    "Next step: finish the drill, compare each weak area to your pre-test baseline, and repeat until the scores feel steadier.",
                    "Siguiente paso: termina la practica, compara cada area debil con tu base de la preevaluacion y repitela hasta que los puntajes se sientan mas estables.",
                  )
                : text(
                    "Next step: finish this quiz, review the result, and then either return to the module or move forward to the next checkpoint.",
                    "Siguiente paso: termina este quiz, revisa el resultado y luego vuelve al modulo o avanza al siguiente punto de control.",
                  )}
            </p>
          </div>
          <Link className="button-secondary w-full sm:w-auto" href="/ccma/study">
            {text("Back to guided study", "Volver al estudio guiado")}
          </Link>
        </div>
        <div className="mt-5 min-w-0 rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
          {isWeakAreaDrill ? (
            <>
              <p className="text-sm font-semibold">
                {text("Drill focus", "Enfoque de la practica")}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {drillDomains.map((area) => area.domainTitle).join(", ")}
              </p>
              <p className="text-muted mt-2 text-sm leading-6">
                {text(
                  "These are your top weak areas right now. The drill stays inside these domains only.",
                  "Estas son tus areas debiles principales en este momento. La practica se mantiene solo dentro de estos dominios.",
                )}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">{text("Assigned topic", "Tema asignado")}</p>
              <p className="mt-2 text-lg font-semibold">{assignedWeakArea.domainTitle}</p>
              <p className="text-muted mt-2 text-sm leading-6">
                {text(
                  `Current mastery: ${assignedWeakArea.masteryScore}%. This topic is still one of the biggest readiness blockers, so it comes first.`,
                  `Dominio actual: ${assignedWeakArea.masteryScore}%. Este tema sigue siendo uno de los mayores bloqueos para tu preparacion, por eso va primero.`,
                )}
              </p>
              <p className="mt-3 text-sm leading-6">{assignedWeakArea.recommendation}</p>
            </>
          )}
        </div>
      </section>

      <AssessmentRunner
        confidencePrompt={{
          topicLabel: isWeakAreaDrill
            ? drillDomains.map((area) => area.domainTitle).join(", ")
            : assignedWeakArea.domainTitle,
        }}
        description={
          isWeakAreaDrill
            ? text(
                `This 10-question drill mixes ${drillDomains.map((area) => area.domainTitle).join(", ")}. Use the result to see how each weak area compares with your pre-test baseline, then drill again if you need another round.`,
                `Esta practica de 10 preguntas mezcla ${drillDomains.map((area) => area.domainTitle).join(", ")}. Usa el resultado para ver como se compara cada area debil con tu base de la preevaluacion y practica otra vez si necesitas otra ronda.`,
              )
            : text(
                `This 10-question check focuses on ${assignedWeakArea.domainTitle}. Answer honestly, then use the result to decide whether to review this topic again or move ahead in your study plan.`,
                `Esta revision de 10 preguntas se enfoca en ${assignedWeakArea.domainTitle}. Responde con honestidad y luego usa el resultado para decidir si debes repasar este tema otra vez o avanzar en tu plan de estudio.`,
              )
        }
        domainSlug={isWeakAreaDrill ? undefined : assignedWeakArea.domainSlug}
        domainSlugs={isWeakAreaDrill ? drillDomains.map((area) => area.domainSlug) : undefined}
        mode={isWeakAreaDrill ? "weak_area_drill" : "quiz"}
        questions={questions}
        title={
          isWeakAreaDrill
            ? text("Weak-area drill", "Practica de areas debiles")
            : text(`${assignedWeakArea.domainTitle} quiz`, `Quiz de ${assignedWeakArea.domainTitle}`)
        }
      />
    </div>
  );
}


