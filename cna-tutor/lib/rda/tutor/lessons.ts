import { rdaTutorLessonLibrary } from "@/content/rda/lesson-library";
import type { TutorLesson, TutorMode } from "@/lib/rda/tutor/types";

export function listRdaTutorLessons() {
  return rdaTutorLessonLibrary;
}

export function getRdaTutorLesson(lessonId: string) {
  return rdaTutorLessonLibrary.find((lesson) => lesson.id === lessonId) ?? null;
}

export function getRdaLessonByDomain(domainSlug: string) {
  return rdaTutorLessonLibrary.filter((lesson) => lesson.domainSlug === domainSlug);
}

export function resolveRdaLessonMode(lesson: TutorLesson, requestedMode?: TutorMode): TutorMode {
  if (requestedMode && lesson.supportedModes.includes(requestedMode)) {
    return requestedMode;
  }

  return lesson.defaultMode;
}
