type StreakBadgeProps = {
  currentStreak: number;
  longestStreak: number;
};

function flameColor(streak: number): string {
  if (streak >= 14) return "#e55a00";
  if (streak >= 7)  return "#d97706";
  if (streak >= 3)  return "#f59e0b";
  return "var(--muted)";
}

export function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  const color = flameColor(currentStreak);
  const active = currentStreak > 0;

  return (
    <div className="flex items-center gap-3 rounded-[1.5rem] border border-[var(--border)] bg-white/75 px-4 py-3">
      <span
        aria-hidden="true"
        style={{ color, fontSize: "1.5rem", lineHeight: 1, transition: "color 0.4s ease" }}
      >
        🔥
      </span>
      <div>
        <p className="text-sm font-semibold">
          {active ? `${currentStreak}-day streak` : "No active streak"}
        </p>
        <p className="text-muted mt-0.5 text-xs leading-5">
          {longestStreak > 0
            ? `Longest: ${longestStreak} day${longestStreak === 1 ? "" : "s"}`
            : "Start a streak by completing a lesson today"}
        </p>
      </div>
    </div>
  );
}
