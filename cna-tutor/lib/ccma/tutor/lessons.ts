import { ccmaTutorLessonLibrary } from "@/content/ccma/lesson-library";
import type { TutorLesson, TutorMode } from "@/lib/ccma/tutor/types";

export function listTutorLessons() {
  return ccmaTutorLessonLibrary;
}

export function getTutorLesson(lessonId: string) {
  return ccmaTutorLessonLibrary.find((lesson) => lesson.id === lessonId) ?? null;
}

export function getLessonByDomain(domainSlug: string) {
  return ccmaTutorLessonLibrary.filter((lesson) => lesson.domainSlug === domainSlug);
}

export function resolveLessonMode(
  lesson: TutorLesson,
  requestedMode?: TutorMode,
): TutorMode {
  if (requestedMode && lesson.supportedModes.includes(requestedMode)) {
    return requestedMode;
  }

  return lesson.defaultMode;
}

