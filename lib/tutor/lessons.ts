import { tutorLessonLibrary } from "@/content/texas-cna/lesson-library";
import type { TutorLesson, TutorMode } from "@/lib/tutor/types";

export function listTutorLessons() {
  return tutorLessonLibrary;
}

export function getTutorLesson(lessonId: string) {
  return tutorLessonLibrary.find((lesson) => lesson.id === lessonId) ?? null;
}

export function getLessonByDomain(domainSlug: string) {
  return tutorLessonLibrary.filter((lesson) => lesson.domainSlug === domainSlug);
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
