"use client";

type RingProps = {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  label?: string;
};

function ringColor(value: number): string {
  if (value >= 80) return "var(--brand-strong)";
  if (value >= 60) return "#1a7a4a";
  if (value >= 40) return "#c87014";
  return "var(--danger)";
}

export function ReadinessRing({ value, size = 120, strokeWidth = 10, label }: RingProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clampedValue / 100);
  const color = ringColor(clampedValue);
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        aria-label={`Readiness: ${clampedValue}%`}
        height={size}
        role="img"
        style={{ display: "block" }}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke="rgba(0,0,0,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
          transform={`rotate(-90 ${center} ${center})`}
        />
        {/* Center text */}
        <text
          dominantBaseline="middle"
          fill="currentColor"
          fontSize={size * 0.22}
          fontWeight="600"
          textAnchor="middle"
          x={center}
          y={center}
        >
          {clampedValue}%
        </text>
      </svg>
      {label ? (
        <p className="text-muted text-center text-xs font-medium leading-5">{label}</p>
      ) : null}
    </div>
  );
}
