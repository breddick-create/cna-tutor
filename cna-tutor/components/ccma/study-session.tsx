"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useEffect, useMemo, useRef, useState } from "react";

import { useLanguage } from "@/components/ccma/language-context";
import { StudentEmptyState } from "@/components/student/student-empty-state";
import { getTutorModeLabel } from "@/lib/ccma/tutor/mode-labels";
import type { TutorLesson, TutorSessionState } from "@/lib/ccma/tutor/types";
import { formatHours } from "@/lib/utils";

type StudyTurn = {
  id: string;
  actor: "tutor" | "student" | "system";
  content: string;
  correctness: string | null;
  turnType: string;
};

type TutorResponse = {
  studentTurn: Omit<StudyTurn, "id" | "correctness">;
  tutorTurn: StudyTurn;
  evaluation: {
    correct: boolean;
    memoryTip: string;
  };
  session: {
    status: "active" | "completed" | "paused" | "abandoned";
    state: TutorSessionState;
    tracking: {
      activeSeconds: number;
    };
  };
};

const AMERICAN_FEMALE_VOICE_HINTS = [
  "ava",
  "jenny",
  "aria",
  "allison",
  "samantha",
  "zira",
  "joanna",
  "kendra",
  "kimberly",
  "ivy",
  "salli",
  "michelle",
  "emma",
  "ruth",
  "nancy",
  "kathy",
];
const SPANISH_FEMALE_VOICE_HINTS = ["paulina", "monica", "paloma", "soledad", "helena"];

function normalizeVoiceName(voice: SpeechSynthesisVoice) {
  return `${voice.name} ${voice.voiceURI}`.toLowerCase();
}

function pickVoiceByName(voices: SpeechSynthesisVoice[], languages: string[], preferredNames: string[]) {
  return voices.find((voice) => {
    const normalizedName = normalizeVoiceName(voice);
    return (
      languages.some((language) => voice.lang.startsWith(language)) &&
      preferredNames.some((name) => normalizedName.includes(name))
    );
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], preferredLanguage: TutorSessionState["preferredLanguage"]) {
  if (preferredLanguage === "es") {
    const preferredLang = ["es-US", "es-MX", "es"];
    const byName = pickVoiceByName(voices, preferredLang, SPANISH_FEMALE_VOICE_HINTS);

    if (byName) {
      return byName;
    }

    for (const lang of preferredLang) {
      const byLang = voices.find((voice) => voice.lang.startsWith(lang));

      if (byLang) {
        return byLang;
      }
    }

    return voices[0] ?? null;
  }

  const byAmericanName = pickVoiceByName(voices, ["en-US"], AMERICAN_FEMALE_VOICE_HINTS);

  if (byAmericanName) {
    return byAmericanName;
  }

  const byAmericanEnglish = voices.find((voice) => voice.lang.startsWith("en-US"));

  if (byAmericanEnglish) {
    return byAmericanEnglish;
  }

  const byEnglishName = pickVoiceByName(voices, ["en"], AMERICAN_FEMALE_VOICE_HINTS);

  if (byEnglishName) {
    return byEnglishName;
  }

  const byEnglish = voices.find((voice) => voice.lang.startsWith("en"));

  if (byEnglish) {
    return byEnglish;
  }

  return voices[0] ?? null;
}

export function StudySession({
  initialLesson,
  initialSession,
  initialTurns,
}: {
  initialLesson: TutorLesson;
  initialSession: {
    id: string;
    status: "active" | "completed" | "paused" | "abandoned";
    state: TutorSessionState;
    activeSeconds: number;
  };
  initialTurns: StudyTurn[];
}) {
  const { t } = useLanguage();
  const [turns, setTurns] = useState(initialTurns);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState(initialSession.status);
  const [sessionState, setSessionState] = useState(initialSession.state);
  const [activeSeconds, setActiveSeconds] = useState(initialSession.activeSeconds);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceReady, setVoiceReady] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const lastSpokenTutorTurnIdRef = useRef<string | null>(null);
  const pendingAutoplayTurnIdRef = useRef<string | null>(null);
  const modeLabel = getTutorModeLabel(sessionState.mode);
  const weakAreasLabel = sessionState.weakAreasSnapshot.join(", ");

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      setVoiceReady(availableVoices.length > 0);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const selectedVoice = useMemo(
    () => pickVoice(voices, sessionState.preferredLanguage),
    [sessionState.preferredLanguage, voices],
  );
  const voiceLabel = selectedVoice
    ? `${selectedVoice.name} (${selectedVoice.lang})`
    : sessionState.preferredLanguage === "es"
      ? t({ en: "Spanish voice pending", es: "Voz en espanol pendiente" })
      : t({ en: "American woman voice pending", es: "Voz femenina en ingles pendiente" });

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.lang = sessionState.preferredLanguage === "es" ? "es-US" : "en-US";

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function getLatestTutorTurn() {
    return [...turns].reverse().find((turn) => turn.actor === "tutor") ?? null;
  }

  function queueTutorSpeech(turnId: string) {
    pendingAutoplayTurnIdRef.current = turnId;
  }

  function speakTutorTurn(turn: StudyTurn) {
    speak(turn.content);
    lastSpokenTutorTurnIdRef.current = turn.id;
    pendingAutoplayTurnIdRef.current = null;
  }

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || voiceEnabled) {
      return;
    }

    window.speechSynthesis.cancel();
  }, [voiceEnabled]);

  useEffect(() => {
    const lastTutorTurn = getLatestTutorTurn();

    if (!voiceEnabled || !lastTutorTurn) {
      return;
    }

    if (lastSpokenTutorTurnIdRef.current === lastTutorTurn.id) {
      return;
    }

    queueTutorSpeech(lastTutorTurn.id);

    if (voiceReady || selectedVoice) {
      speakTutorTurn(lastTutorTurn);
    }
  }, [turns, voiceEnabled, voiceReady, selectedVoice]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !voiceEnabled ||
      !pendingAutoplayTurnIdRef.current
    ) {
      return;
    }

    const replayPendingTutorSpeech = () => {
      const latestTutorTurn = getLatestTutorTurn();

      if (!latestTutorTurn || latestTutorTurn.id !== pendingAutoplayTurnIdRef.current) {
        return;
      }

      speakTutorTurn(latestTutorTurn);
    };

    const retryOnInteraction = () => {
      replayPendingTutorSpeech();
    };

    window.addEventListener("pointerdown", retryOnInteraction, { once: true });
    window.addEventListener("keydown", retryOnInteraction, { once: true });

    if (voiceReady || selectedVoice) {
      const timeoutId = window.setTimeout(replayPendingTutorSpeech, 150);

      return () => {
        window.clearTimeout(timeoutId);
        window.removeEventListener("pointerdown", retryOnInteraction);
        window.removeEventListener("keydown", retryOnInteraction);
      };
    }

    return () => {
      window.removeEventListener("pointerdown", retryOnInteraction);
      window.removeEventListener("keydown", retryOnInteraction);
    };
  }, [turns, voiceEnabled, voiceReady, selectedVoice]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim() || pending || sessionStatus !== "active") {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/ccma/tutor/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: initialSession.id,
          message: draft,
        }),
      });

      if (!response.ok) {
        throw new Error(
          t({
            en: "Your answer didn't go through. Try again.",
            es: "Tu respuesta no se envio. Intentalo de nuevo.",
          }),
        );
      }

      const data = (await response.json()) as TutorResponse;
      const learnerTurn: StudyTurn = {
        id: `student-${Date.now()}`,
        actor: "student",
        content: data.studentTurn.content,
        correctness: null,
        turnType: data.studentTurn.turnType,
      };

      setTurns((currentTurns) => [...currentTurns, learnerTurn, data.tutorTurn]);
      setSessionStatus(data.session.status);
      setSessionState(data.session.state);
      setActiveSeconds(data.session.tracking.activeSeconds);
      setDraft("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t({
              en: "Your answer didn't go through. Try again.",
              es: "Tu respuesta no se envio. Intentalo de nuevo.",
            }),
      );
    } finally {
      setPending(false);
    }
  }

  const lastTutorTurn = [...turns].reverse().find((turn) => turn.actor === "tutor") ?? null;
  const renderTutorMarkdown = (content: string) => content.replace(/\n/g, "  \n");

  return (
    <div className="grid gap-6 pb-28 xl:grid-cols-[0.72fr_0.28fr] xl:pb-0">
      <section className="space-y-6">
        <div className="panel rounded-[1.75rem] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">{initialLesson.domainTitle}</p>
            <div className="hidden flex-wrap items-center gap-2 md:flex">
              <span className="rounded-full bg-[rgba(23,60,255,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                {modeLabel}
              </span>
              <button
                className="button-secondary"
                onClick={() => setVoiceEnabled((current) => !current)}
                type="button"
              >
                {voiceEnabled
                  ? t({ en: "Voice on", es: "Voz activada" })
                  : t({ en: "Voice off", es: "Voz desactivada" })}
              </button>
              <button
                className="button-secondary"
                disabled={!lastTutorTurn || !voiceReady}
                onClick={() => lastTutorTurn && speakTutorTurn(lastTutorTurn)}
                type="button"
              >
                {t({ en: "Replay voice", es: "Repetir voz" })}
              </button>
            </div>
          </div>
          <h2 className="mt-3 text-3xl font-semibold">{initialLesson.title}</h2>
          <p className="text-muted mt-3 leading-7">{initialLesson.summary}</p>
          <p className="text-muted mt-3 text-sm leading-6">
            {t({ en: "Tutor language:", es: "Idioma del tutor:" })}{" "}
            {sessionState.preferredLanguage === "es"
              ? t({ en: "Spanish", es: "Espanol" })
              : t({ en: "English", es: "Ingles" })}
            {voiceReady
              ? sessionState.preferredLanguage === "es"
                ? t({
                    en: `, with a Spanish woman voice selected: ${voiceLabel}.`,
                    es: `, con una voz femenina en espanol seleccionada: ${voiceLabel}.`,
                  })
                : t({
                    en: `, with an American woman voice selected: ${voiceLabel}.`,
                    es: `, con una voz femenina en ingles seleccionada: ${voiceLabel}.`,
                  })
              : sessionState.preferredLanguage === "es"
                ? t({
                    en: ", with text only until a Spanish browser voice is available.",
                    es: ", con solo texto hasta que haya una voz del navegador en espanol disponible.",
                  })
                : t({
                    en: ", with text only until an American English browser voice is available.",
                    es: ", con solo texto hasta que haya una voz del navegador en ingles disponible.",
                  })}
          </p>
          {weakAreasLabel ? (
            <p className="text-muted mt-3 text-sm leading-6">
              {t({
                en: "Areas that still need extra attention:",
                es: "Areas que todavia necesitan atencion extra:",
              })}{" "}
              {weakAreasLabel}.
            </p>
          ) : null}
          <div className="mt-4 flex flex-col gap-3 md:hidden">
            <span className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[rgba(23,60,255,0.12)] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
              {modeLabel}
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="button-secondary w-full"
                onClick={() => setVoiceEnabled((current) => !current)}
                type="button"
              >
                {voiceEnabled
                  ? t({ en: "Voice on", es: "Voz activada" })
                  : t({ en: "Voice off", es: "Voz desactivada" })}
              </button>
              <button
                className="button-secondary w-full"
                disabled={!lastTutorTurn || !voiceReady}
                onClick={() => lastTutorTurn && speakTutorTurn(lastTutorTurn)}
                type="button"
              >
                {t({ en: "Replay voice", es: "Repetir voz" })}
              </button>
            </div>
          </div>
        </div>

        <div className="panel rounded-[1.75rem] p-5 sm:p-6">
          <div className="space-y-4">
            {turns.length ? (
              turns.map((turn) => (
                <article
                  key={turn.id}
                  className={`rounded-[1.5rem] border p-4 ${
                    turn.actor === "tutor"
                      ? "border-[rgba(23,60,255,0.18)] bg-[rgba(23,60,255,0.08)]"
                      : "border-[var(--border)] bg-white/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                      {turn.actor === "tutor"
                        ? t({ en: "Instructor", es: "Instructor" })
                        : t({ en: "Student", es: "Estudiante" })}
                    </p>
                    {turn.correctness ? (
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">
                        {turn.correctness}
                      </span>
                    ) : null}
                  </div>
                  {turn.actor === "tutor" ? (
                    <div className="mt-3 leading-7 text-[color:var(--foreground)]">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mt-3 first:mt-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="mt-3 list-disc space-y-2 pl-6 first:mt-0">{children}</ul>,
                          ol: ({ children }) => <ol className="mt-3 list-decimal space-y-2 pl-6 first:mt-0">{children}</ol>,
                          li: ({ children }) => <li>{children}</li>,
                        }}
                      >
                        {renderTutorMarkdown(turn.content)}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="mt-3 whitespace-pre-wrap leading-7">{turn.content}</p>
                  )}
                </article>
              ))
            ) : (
              <StudentEmptyState
                compact
                description={t({
                  en: "Your lesson conversation should appear here. If it did not load, go back and restart the lesson so you can keep moving.",
                  es: "La conversacion de tu leccion debe aparecer aqui. Si no cargo, vuelve y reinicia la leccion para seguir avanzando.",
                })}
                eyebrow={t({ en: "Lesson Conversation", es: "Conversacion de la leccion" })}
                primaryAction={{
                  href: "/ccma/study",
                  label: t({ en: "Back to guided study", es: "Volver al estudio guiado" }),
                }}
                secondaryAction={{
                  href: "/ccma/dashboard",
                  label: t({ en: "Go to dashboard", es: "Ir al panel" }),
                }}
                title={t({
                  en: "This lesson has not loaded any conversation yet.",
                  es: "Esta leccion todavia no ha cargado ninguna conversacion.",
                })}
              />
            )}
          </div>

          <form className="mt-6 space-y-3" id="study-session-form" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium" htmlFor="student-response">
              {t({ en: "Your answer", es: "Tu respuesta" })}
            </label>
            <textarea
              className="input-base min-h-32 resize-y text-base"
              id="student-response"
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t({
                en: "Type your answer here...",
                es: "Escribe tu respuesta aqui...",
              })}
              value={draft}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted text-sm">
                {t({
                  en: "Give your best answer before moving on.",
                  es: "Da tu mejor respuesta antes de continuar.",
                })}
              </p>
              <button
                className="button-primary"
                disabled={pending || sessionStatus !== "active"}
                type="submit"
              >
                {pending
                  ? t({ en: "Checking answer...", es: "Revisando respuesta..." })
                  : sessionStatus === "active"
                    ? t({ en: "Send answer", es: "Enviar respuesta" })
                    : t({ en: "Lesson complete", es: "Leccion completada" })}
              </button>
            </div>
            {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}
          </form>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">{t({ en: "Session Status", es: "Estado de la sesion" })}</p>
          <p className="mt-3 text-2xl font-semibold capitalize">{sessionStatus}</p>
          <p className="text-muted mt-3 text-sm leading-6">
            {t({
              en: `Current score: ${sessionState.masteryScore}% across ${sessionState.totalQuestions} guided checks.`,
              es: `Puntaje actual: ${sessionState.masteryScore}% en ${sessionState.totalQuestions} revisiones guiadas.`,
            })}
          </p>
          <p className="text-muted mt-2 text-sm leading-6">
            {t({
              en: `Difficulty: ${sessionState.difficultyTier} - support level ${sessionState.remediationLevel}`,
              es: `Dificultad: ${sessionState.difficultyTier} - nivel de apoyo ${sessionState.remediationLevel}`,
            })}
          </p>
        </div>

        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">{t({ en: "Progress", es: "Progreso" })}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[rgba(123,144,158,0.14)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent))]"
              style={{
                width: `${Math.max(
                  12,
                  ((sessionState.currentSegmentIndex + (sessionStatus === "completed" ? 1 : 0)) /
                    sessionState.totalQuestions) *
                    100,
                )}%`,
              }}
            />
          </div>
          <p className="text-muted mt-3 text-sm">
            {t({
              en: `Time spent in this lesson: ${formatHours(activeSeconds)}`,
              es: `Tiempo en esta leccion: ${formatHours(activeSeconds)}`,
            })}
          </p>
        </div>

        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">{t({ en: "Lesson Goal", es: "Meta de la leccion" })}</p>
          <p className="mt-3 text-sm leading-7">{initialLesson.learningGoal}</p>
        </div>

        <div className="panel rounded-[1.5rem] p-5">
          <p className="eyebrow">{t({ en: "Next", es: "Siguiente" })}</p>
          <div className="mt-4 space-y-3">
            <Link className="button-secondary w-full" href="/ccma/study">
              {t({ en: "Start another lesson", es: "Iniciar otra leccion" })}
            </Link>
            <Link className="button-secondary w-full" href="/ccma/dashboard">
              {t({ en: "Go to dashboard", es: "Ir al panel" })}
            </Link>
          </div>
        </div>
      </aside>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[rgba(247,249,252,0.96)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(32,48,61,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              className="button-secondary w-full"
              onClick={() => setVoiceEnabled((current) => !current)}
              type="button"
            >
              {voiceEnabled
                ? t({ en: "Voice on", es: "Voz activada" })
                : t({ en: "Voice off", es: "Voz desactivada" })}
            </button>
            <button
              className="button-secondary w-full"
              disabled={!lastTutorTurn || !voiceReady}
              onClick={() => lastTutorTurn && speakTutorTurn(lastTutorTurn)}
              type="button"
            >
              {t({ en: "Replay voice", es: "Repetir voz" })}
            </button>
          </div>
          <button
            className="button-primary w-full"
            disabled={pending || sessionStatus !== "active"}
            form="study-session-form"
            type="submit"
          >
            {pending
              ? t({ en: "Checking answer...", es: "Revisando respuesta..." })
              : sessionStatus === "active"
                ? t({ en: "Send answer", es: "Enviar respuesta" })
                : t({ en: "Lesson complete", es: "Leccion completada" })}
          </button>
        </div>
      </div>
    </div>
  );
}


