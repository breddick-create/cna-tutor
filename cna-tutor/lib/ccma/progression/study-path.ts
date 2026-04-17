import type { ProgressionSnapshot } from "@/lib/ccma/progression/readiness";
import { getLessonByDomain } from "@/lib/ccma/tutor/lessons";
import type { TutorLesson, TutorMode } from "@/lib/ccma/tutor/types";

export type GuidedStudyModuleState = "completed" | "current" | "locked";

export type GuidedStudyModule = {
  order: number;
  state: GuidedStudyModuleState;
  domainSlug: string;
  domainTitle: string;
  description: string;
  baselineScore: number;
  masteryScore: number;
  weakStreak: number;
  priorityLabel: "Start first" | "Build next" | "Maintain";
  recommendation: string;
  lesson: TutorLesson | null;
};

export type GuidedStudySessionLike = {
  id?: string;
  status: string;
  last_activity_at?: string | null;
  session_state_json: unknown;
};

export function getLessonIdFromSessionState(sessionState: unknown) {
  if (
    sessionState &&
    typeof sessionState === "object" &&
    !Array.isArray(sessionState) &&
    "lessonId" in sessionState &&
    typeof sessionState.lessonId === "string"
  ) {
    return sessionState.lessonId;
  }

  return null;
}

export function getCompletedLessonIdsFromSessions(
  sessions: Array<Pick<GuidedStudySessionLike, "status" | "session_state_json">>,
) {
  const completedLessonIds = new Set<string>();

  for (const session of sessions) {
    if (session.status !== "completed") {
      continue;
    }

    const lessonId = getLessonIdFromSessionState(session.session_state_json);

    if (lessonId) {
      completedLessonIds.add(lessonId);
    }
  }

  return completedLessonIds;
}

export function getResumableSessionForLesson<T extends GuidedStudySessionLike>(
  sessions: T[],
  lessonId: string | null,
) {
  if (!lessonId) {
    return null;
  }

  return (
    sessions.find((session) => {
      if (session.status !== "active" && session.status !== "paused") {
        return false;
      }

      return getLessonIdFromSessionState(session.session_state_json) === lessonId;
    }) ?? null
  );
}

export function getPreferredStudyMode(
  lesson: TutorLesson,
  weakDomainSlugs: Set<string>,
): TutorMode {
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

export function buildGuidedStudyPath(args: {
  progression: ProgressionSnapshot;
  completedLessonIds: Iterable<string>;
}) {
  const completedLessonIds = new Set(args.completedLessonIds);
  const modules = args.progression.rankedDomains.map((domain, index) => ({
    order: index + 1,
    state: "locked" as GuidedStudyModuleState,
    domainSlug: domain.domainSlug,
    domainTitle: domain.domainTitle,
    description: domain.description,
    baselineScore: domain.baselineScore,
    masteryScore: domain.masteryScore,
    weakStreak: domain.weakStreak,
    priorityLabel: domain.priorityLabel,
    recommendation: domain.recommendation,
    lesson: getLessonByDomain(domain.domainSlug)[0] ?? null,
  }));

  const firstIncompleteIndex = modules.findIndex(
    (module) => !module.lesson || !completedLessonIds.has(module.lesson.id),
  );
  const nextModule =
    (firstIncompleteIndex >= 0 ? modules[firstIncompleteIndex] : modules[0]) ?? null;

  const modulesWithState = modules.map((module, index) => {
    if (firstIncompleteIndex === -1) {
      return {
        ...module,
        state: "completed" as const,
      };
    }

    if (index < firstIncompleteIndex && module.lesson && completedLessonIds.has(module.lesson.id)) {
      return {
        ...module,
        state: "completed" as const,
      };
    }

    if (index === firstIncompleteIndex) {
      return {
        ...module,
        state: "current" as const,
      };
    }

    return {
      ...module,
      state: "locked" as const,
    };
  });

  const allowedLessonIds = new Set<string>();

  for (const module of modulesWithState) {
    if (!module.lesson) {
      continue;
    }

    if (module.state === "completed") {
      allowedLessonIds.add(module.lesson.id);
    }
  }

  if (nextModule?.lesson?.id) {
    allowedLessonIds.add(nextModule.lesson.id);
  }

  return {
    modules: modulesWithState,
    nextModule,
    allowedLessonIds,
    completedLessonIds,
  };
}

export function isLessonUnlockedForStudyPath(args: {
  lessonId: string;
  progression: ProgressionSnapshot;
  completedLessonIds: Iterable<string>;
}) {
  const studyPath = buildGuidedStudyPath(args);
  return studyPath.allowedLessonIds.has(args.lessonId);
}

