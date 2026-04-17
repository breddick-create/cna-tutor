"use client";

import Link from "next/link";

import { useLanguage } from "@/components/ccma/language-context";
import type { ReadinessChecklistItem } from "@/lib/ccma/progression/readiness";

function ChecklistIcon({ met }: { met: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
        met
          ? "border-[rgba(28,124,104,0.24)] bg-[rgba(28,124,104,0.14)] text-[color:var(--brand)]"
          : "border-[rgba(29,42,38,0.12)] bg-[rgba(29,42,38,0.06)] text-[color:var(--muted)]"
      }`}
      aria-hidden="true"
    >
      {met ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16">
          <path
            d="M3.5 8.5 6.5 11.5 12.5 4.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </span>
  );
}

export function CcmaReadinessChecklist({
  items,
}: {
  items: ReadinessChecklistItem[];
}) {
  const { t } = useLanguage();

  return (
    <div className="mt-5 space-y-3">
      <div>
        <p className="text-sm font-semibold">
          {t({
            en: "Readiness checklist",
            es: "Lista de preparacion",
          })}
        </p>
        <p className="text-muted mt-2 text-sm leading-6">
          {t({
            en: "These milestones show what still needs to be true before the app should call you exam-ready.",
            es: "Estos hitos muestran lo que todavia debe cumplirse antes de que la app te marque como listo para el examen.",
          })}
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className={`rounded-[1.5rem] border p-4 ${
              item.met
                ? "border-[rgba(28,124,104,0.18)] bg-white/80"
                : "border-[rgba(29,42,38,0.1)] bg-[rgba(255,255,255,0.56)] text-[color:var(--muted)]"
            }`}
          >
            <div className="flex items-start gap-3">
              <ChecklistIcon met={item.met} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className={`text-sm font-semibold ${item.met ? "text-[color:var(--foreground)]" : ""}`}>
                    {item.title}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                      item.met
                        ? "bg-[rgba(28,124,104,0.14)] text-[color:var(--brand)]"
                        : "bg-[rgba(29,42,38,0.08)] text-[color:var(--muted)]"
                    }`}
                  >
                    {item.met
                      ? t({ en: "Met", es: "Cumplido" })
                      : t({ en: "Still needed", es: "Aun falta" })}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6">{item.description}</p>
                <div className="mt-3">
                  <Link className="text-sm font-medium underline underline-offset-4" href={item.href}>
                    {item.met
                      ? t({ en: "Review this area", es: "Revisar esta area" })
                      : t({ en: "Work on this next", es: "Trabajar en esto ahora" })}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
