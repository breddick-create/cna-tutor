import type { User } from "@supabase/supabase-js";

import {
  getPretestDomainBreakdown,
  getPretestScore,
  hasCompletedPretest,
} from "@/lib/onboarding/pretest";
import {
  pathMatchesPrefix,
  STUDENT_WORKSPACE_NAVIGATION,
} from "@/lib/progression/paths";
import {
  buildGuidedStudyPath,
  getCompletedLessonIdsFromSessions,
  getResumableSessionForLesson,
} from "@/lib/progression/study-path";
import type { ProgressionSnapshot } from "@/lib/progression/readiness";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";
import { createClient } from "@/lib/supabase/server";

export type StudentStage =
  | "pretest_required"
  | "study_plan_required"
  | "guided_practice_required"
  | "practice_exam_required"
  | "readiness_building"
  | "exam_ready";

export type StudentStageSnapshot = {
  stage: StudentStage;
  label: string;
  description: string;
  nextRequiredPath: string;
  allowedPrefixes: string[];
  progression: ProgressionSnapshot | null;
};

type StudentStageDefinition = Omit<StudentStageSnapshot, "progression">;

function createStage(
  definition: StudentStageDefinition,
  progression: ProgressionSnapshot | null,
) {
  return {
    ...definition,
    progression,
  } satisfies StudentStageSnapshot;
}

function hasAnyStudyEvidence(progression: ProgressionSnapshot) {
  return (
    progression.signals.lessonsCompleted > 0 ||
    progression.signals.quizzesCompleted > 0 ||
    progression.signals.mockExamsCompleted > 0
  );
}

export function canAccessStudentPath(pathname: string, stage: StudentStageSnapshot) {
  return stage.allowedPrefixes.some((prefix) => pathMatchesPrefix(pathname, prefix));
}

export function getStudentNavigation(stage: StudentStageSnapshot) {
  if (stage.stage === "pretest_required") {
    return [{ href: stage.nextRequiredPath, label: stage.label }];
  }

  if (stage.stage === "exam_ready") {
    return [...STUDENT_WORKSPACE_NAVIGATION];
  }

  return STUDENT_WORKSPACE_NAVIGATION.filter((item) => item.href !== "/exam-day");
}

export function resolveStudentStage(args: {
  pretestCompleted: boolean;
  progression: ProgressionSnapshot | null;
}): StudentStageSnapshot {
  if (!args.pretestCompleted) {
    return createStage(
      {
        stage: "pretest_required",
        label: "Pre-Test",
        description:
          "Complete the pre-test first so the app can build the right study plan for you.",
        nextRequiredPath: "/pretest",
        allowedPrefixes: ["/pretest", "/written"],
      },
      null,
    );
  }

  const progression = args.progression;

  if (!progression) {
    return createStage(
      {
        stage: "study_plan_required",
        label: "Study Plan",
        description:
          "Your pre-test is done. Review your ranked study plan before moving into practice.",
        nextRequiredPath: "/study-plan",
        allowedPrefixes: ["/study-plan", "/pretest/results", "/written", "/skills", "/dashboard"],
      },
      null,
    );
  }

  if (!hasAnyStudyEvidence(progression)) {
    return createStage(
      {
        stage: "study_plan_required",
        label: "Study Plan",
        description:
          "Your pre-test is complete. Review your ranked study plan and begin with the weakest topic first.",
        nextRequiredPath: "/study-plan",
        allowedPrefixes: ["/study-plan", "/pretest/results", "/written", "/skills", "/dashboard"],
      },
      progression,
    );
  }

  if (progression.examReady) {
    return createStage(
      {
        stage: "exam_ready",
        label: "Exam Ready",
        description:
          "You’re in the exam-ready range. Use the dashboard to keep an eye on your progress and protect weak spots from slipping.",
        nextRequiredPath: "/exam-day",
        allowedPrefixes: ["/dashboard", "/exam-day", "/study", "/study-plan", "/quiz", "/mock-exam", "/written", "/skills"],
      },
      progression,
    );
  }

  if (progression.practiceExamUnlocked && progression.signals.mockExamsCompleted === 0) {
    return createStage(
      {
        stage: "practice_exam_required",
        label: "Practice Exam",
        description:
          "You’ve built enough foundation. Your next required step is a full practice exam.",
        nextRequiredPath: "/mock-exam",
        allowedPrefixes: ["/mock-exam", "/written", "/skills", "/dashboard"],
      },
      progression,
    );
  }

  if (!progression.practiceExamUnlocked) {
    // Business rule: until the full mock unlocks, students should stay inside the ranked
    // study-and-quiz loop instead of wandering between unrelated parts of the app.
    return createStage(
      {
        stage: "guided_practice_required",
        label: "Next Step",
        description:
          "Keep working from weakest to strongest through your study plan and short checkpoints.",
        nextRequiredPath: progression.nextBestTask.href,
        allowedPrefixes: ["/study-plan", "/study", "/quiz", "/mock-exam/results", "/written", "/skills", "/dashboard"],
      },
      progression,
    );
  }

  return createStage(
    {
      stage: "readiness_building",
      label: "Next Step",
      description:
        "Keep following the next required step so your score and full-practice results keep moving in the right direction.",
      nextRequiredPath: progression.nextBestTask.href,
      allowedPrefixes: ["/study-plan", "/study", "/quiz", "/mock-exam", "/written", "/skills", "/dashboard"],
    },
    progression,
  );
}

export async function getStudentStageForUser(args: {
  userId: string;
  user: User;
}) {
  const pretestCompleted = hasCompletedPretest(args.user);

  if (!pretestCompleted) {
    return resolveStudentStage({
      pretestCompleted,
      progression: null,
    });
  }

  const progression = await getStudentProgressionSnapshot({
    userId: args.userId,
    pretestScore: getPretestScore(args.user),
    pretestDomainBreakdown: getPretestDomainBreakdown(args.user),
  });

  return resolveStudentStage({
    pretestCompleted,
    progression,
  });
}

export async function getStudentNextRequiredPathForUser(args: {
  userId: string;
  user: User;
}) {
  const stage = await getStudentStageForUser(args);
  return stage.nextRequiredPath;
}

async function getStudentResumableStudyPath(args: {
  userId: string;
  progression: ProgressionSnapshot;
}) {
  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("tutor_sessions")
    .select("id, status, last_activity_at, session_state_json")
    .eq("user_id", args.userId)
    .eq("section", "written")
    .order("last_activity_at", { ascending: false })
    .limit(12);

  const studyPath = buildGuidedStudyPath({
    progression: args.progression,
    completedLessonIds: getCompletedLessonIdsFromSessions(sessions ?? []),
  });
  const currentLessonId = studyPath.nextModule?.lesson?.id ?? null;
  const resumableSession = getResumableSessionForLesson(sessions ?? [], currentLessonId);

  return resumableSession ? `/study/${resumableSession.id}` : null;
}

export async function getStudentAuthRedirectPathForUser(args: {
  userId: string;
  user: User;
}) {
  const stage = await getStudentStageForUser(args);

  if (stage.stage === "pretest_required") {
    return stage.nextRequiredPath;
  }

  if (stage.progression) {
    const resumableStudyPath = await getStudentResumableStudyPath({
      userId: args.userId,
      progression: stage.progression,
    });

    if (resumableStudyPath) {
      return resumableStudyPath;
    }
  }

  return "/dashboard";
}
