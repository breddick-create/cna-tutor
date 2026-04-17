"use client";

import { useState } from "react";

type SignInRole = "student" | "admin";

const roleContent: Record<
  SignInRole,
  {
    label: string;
    title: string;
    description: string;
    points: string[];
  }
> = {
  student: {
    label: "Student",
    title: "Student sign-in",
    description:
      "Use this if you are preparing for the Texas CNA written exam and want your study plan, quizzes, and mock exams.",
    points: [
      "Start with your pre-test and weak-area study plan.",
      "See only your own lessons, quizzes, and progress.",
      "Study in a calmer, more structured flow built to help you pass.",
    ],
  },
  admin: {
    label: "Admin",
    title: "Staff and admin sign-in",
    description:
      "Use this if you manage learners, monitor participation, or need reporting and access-management tools.",
    points: [
      "View cohort progress, weak areas, and activity trends.",
      "Promote accounts and manage admin access.",
      "Follow up quickly with students who need more support.",
    ],
  },
};

export function SignInRoleFraming() {
  const [role, setRole] = useState<SignInRole>("student");
  const content = roleContent[role];

  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
      <p className="text-sm font-semibold">Choose the view that matches your account</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(roleContent) as SignInRole[]).map((option) => (
          <button
            key={option}
            aria-pressed={role === option}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              role === option
                ? "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]"
                : "border border-[var(--border)] bg-white/80"
            }`}
            onClick={() => setRole(option)}
            type="button"
          >
            {roleContent[option].label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm font-semibold">{content.title}</p>
      <p className="text-muted mt-2 text-sm leading-6">{content.description}</p>
      <div className="mt-4 space-y-2">
        {content.points.map((point) => (
          <div
            key={point}
            className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 px-4 py-3"
          >
            <p className="text-sm leading-6">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
