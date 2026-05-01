export const STUDENT_WORKSPACE_NAVIGATION = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/written", label: "Written Exam" },
  { href: "/skills", label: "Clinical Skills" },
  { href: "/exam-day", label: "Exam Day" },
] as const;

export function isStudentProtectedPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/dashboard" ||
    pathname === "/exam-day" ||
    pathname === "/pretest" ||
    pathname.startsWith("/pretest/") ||
    pathname === "/written" ||
    pathname.startsWith("/written/") ||
    pathname === "/skills" ||
    pathname.startsWith("/skills/") ||
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
