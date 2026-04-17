export const STUDENT_WORKSPACE_NAVIGATION = [
  { href: "/ccma/dashboard", label: "Dashboard" },
  { href: "/ccma/exam-day", label: "Exam Day" },
  { href: "/ccma/study", label: "Study" },
  { href: "/ccma/study-plan", label: "Plan" },
  { href: "/ccma/quiz", label: "Quiz" },
  { href: "/ccma/mock-exam", label: "Mock Exam" },
] as const;

export function isStudentProtectedPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/ccma/dashboard" ||
    pathname === "/ccma/exam-day" ||
    pathname === "/ccma/pretest" ||
    pathname.startsWith("/pretest/") ||
    pathname === "/ccma/study" ||
    pathname.startsWith("/study/") ||
    pathname === "/ccma/study-plan" ||
    pathname === "/ccma/quiz" ||
    pathname === "/ccma/mock-exam" ||
    pathname.startsWith("/mock-exam/")
  );
}

export function isPretestIntroPath(pathname: string) {
  return pathname === "/ccma/pretest";
}

export function isPretestStartPath(pathname: string) {
  return pathname === "/pretest/start";
}

export function isPretestResultsPath(pathname: string) {
  return pathname === "/pretest/results";
}

export function isAnyPretestPath(pathname: string) {
  return (
    isPretestIntroPath(pathname) ||
    isPretestStartPath(pathname) ||
    isPretestResultsPath(pathname)
  );
}

export function pathMatchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

