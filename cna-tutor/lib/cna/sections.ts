export type CnaSection = "written" | "skills";

export const CNA_SECTION_WEIGHTS = {
  written: 0.7,
  skills: 0.3,
} as const;

export function getCnaSectionLabel(section: CnaSection) {
  return section === "written" ? "Written Exam Prep" : "Clinical Skills Prep";
}

export function getCnaSectionHref(section: CnaSection) {
  return section === "written" ? "/written" : "/skills";
}

export function getCnaSectionDescription(section: CnaSection) {
  return section === "written"
    ? "Build written-exam readiness through pre-test results, guided lessons, quizzes, and full practice exams."
    : "Build clinical-skills confidence through the official Prometric skill list, walkthrough practice, and timed runs.";
}

export function getOverallCnaReadiness(args: {
  writtenReadinessScore: number;
  skillsReadinessScore: number;
}) {
  return Math.round(
    args.writtenReadinessScore * CNA_SECTION_WEIGHTS.written +
      args.skillsReadinessScore * CNA_SECTION_WEIGHTS.skills,
  );
}

export function getLowerReadinessSection(args: {
  writtenReadinessScore: number;
  skillsReadinessScore: number;
}): CnaSection {
  if (args.skillsReadinessScore < args.writtenReadinessScore) {
    return "skills";
  }

  return "written";
}

export function mapLegacyCnaPathToWrittenPath(href: string) {
  if (href === "/dashboard") {
    return href;
  }

  if (href.startsWith("/written")) {
    return href;
  }

  if (href === "/pretest") {
    return "/written/pretest";
  }

  if (href.startsWith("/pretest/")) {
    return href.replace("/pretest", "/written/pretest");
  }

  if (href === "/study-plan") {
    return "/written/study-plan";
  }

  if (href === "/study") {
    return "/written/study";
  }

  if (href.startsWith("/study/")) {
    return href.replace("/study", "/written/study");
  }

  if (href.startsWith("/quiz")) {
    return href.replace("/quiz", "/written/quiz");
  }

  if (href === "/mock-exam") {
    return "/written/mock-exam";
  }

  if (href.startsWith("/mock-exam/")) {
    return href.replace("/mock-exam", "/written/mock-exam");
  }

  if (href === "/exam-day") {
    return "/written/exam-day";
  }

  return href;
}
