export const STUDENT_WORKSPACE_NAVIGATION = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/exam-day", label: "Exam Day" },
  { href: "/study", label: "Study" },
  { href: "/study-plan", label: "Plan" },
  { href: "/quiz", label: "Quiz" },
  { href: "/mock-exam", label: "Mock Exam" },
] as const;

export function isStudentProtectedPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/dashboard" ||
    pathname === "/exam-day" ||
    pathname === "/pretest" ||
    pathname.startsWith("/pretest/") ||
    pathname === "/study" ||
    pathname.startsWith("/study/") ||
    pathname === "/study-plan" ||
    pathname === "/quiz" ||
    pathname === "/mock-exam" ||
    pathname.startsWith("/mock-exam/")
  );
}

export function isPretestIntroPath(pathname: string) {
  return pathname === "/pretest";
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
