import Link from "next/link";

import { AssessmentRunner } from "@/components/ccma/assessment-runner";
import { StudentEmptyState } from "@/components/student/student-empty-state";
import { requireCcmaViewer } from "@/lib/ccma/auth/session";
import { getAssessmentQuestions, listExamDomains } from "@/lib/ccma/exams/bank";
import { pickLocalizedText, resolvePreferredLanguage } from "@/lib/ccma/i18n/languages";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/ccma/onboarding/pretest";
import { getStudentProgressionSnapshot } from "@/lib/ccma/progression/student";

type SearchParams = Promise<{ mode?: string; domain?: string }>;

export default async function QuizPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireCcmaViewer();
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
  const selectedDomain =
    listExamDomains().find((domain) => domain.slug === params.domain) ?? null;
  const rankedMatch = selectedDomain
    ? progression.rankedDomains.find((domain) => domain.domainSlug === selectedDomain.slug) ?? null
    : null;
  const chosenDomain =
    !isWeakAreaDrill && selectedDomain
      ? {
          domainSlug: selectedDomain.slug,
          domainTitle: selectedDomain.title,
          masteryScore: rankedMatch?.masteryScore ?? 0,
          recommendation:
            rankedMatch?.recommendation ??
            "Use this quiz to check whether the guided lesson is sticking before you move on.",
        }
      : assignedWeakArea;

  if (!chosenDomain && !isWeakAreaDrill) {
    return (
      <div className="space-y-8">
        <section className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">{text("Practice Quiz", "Quiz de practica")}</p>
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
    : getAssessmentQuestions("quiz", chosenDomain?.domainSlug);

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
                    "This quiz is assigned from the domain that most needs the next checkpoint so you can verify the topic that matters before moving on.",
                    "Este quiz se asigna desde el dominio que mas necesita el siguiente punto de control para que verifiques el tema que importa antes de avanzar.",
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
              <p className="mt-2 text-lg font-semibold">{chosenDomain?.domainTitle}</p>
              <p className="text-muted mt-2 text-sm leading-6">
                {text(
                  `Current mastery: ${chosenDomain?.masteryScore ?? 0}%. This topic is still one of the biggest readiness blockers, so it comes first.`,
                  `Dominio actual: ${chosenDomain?.masteryScore ?? 0}%. Este tema sigue siendo uno de los mayores bloqueos para tu preparacion, por eso va primero.`,
                )}
              </p>
              <p className="mt-3 text-sm leading-6">{chosenDomain?.recommendation}</p>
            </>
          )}
        </div>
      </section>

      <AssessmentRunner
        confidencePrompt={{
          topicLabel: isWeakAreaDrill
            ? drillDomains.map((area) => area.domainTitle).join(", ")
            : (chosenDomain?.domainTitle ?? "this topic"),
        }}
        description={
          isWeakAreaDrill
            ? text(
                `This 10-question drill mixes ${drillDomains.map((area) => area.domainTitle).join(", ")}. Use the result to see how each weak area compares with your pre-test baseline, then drill again if you need another round.`,
                `Esta practica de 10 preguntas mezcla ${drillDomains.map((area) => area.domainTitle).join(", ")}. Usa el resultado para ver como se compara cada area debil con tu base de la preevaluacion y practica otra vez si necesitas otra ronda.`,
              )
            : text(
                `This 10-question check focuses on ${chosenDomain?.domainTitle ?? "this domain"}. Answer honestly, then use the result to decide whether to review this topic again or move ahead in your study plan.`,
                `Esta revision de 10 preguntas se enfoca en ${chosenDomain?.domainTitle ?? "este dominio"}. Responde con honestidad y luego usa el resultado para decidir si debes repasar este tema otra vez o avanzar en tu plan de estudio.`,
              )
        }
        domainSlug={isWeakAreaDrill ? undefined : chosenDomain?.domainSlug}
        domainSlugs={isWeakAreaDrill ? drillDomains.map((area) => area.domainSlug) : undefined}
        mode={isWeakAreaDrill ? "weak_area_drill" : "quiz"}
        questions={questions}
        title={
          isWeakAreaDrill
            ? text("Weak-area drill", "Practica de areas debiles")
            : text(
                `${chosenDomain?.domainTitle ?? "Assigned domain"} quiz`,
                `Quiz de ${chosenDomain?.domainTitle ?? "dominio asignado"}`,
              )
        }
      />
    </div>
  );
}
