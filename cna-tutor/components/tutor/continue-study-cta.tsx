import Link from "next/link";

import { StudyLauncher } from "@/components/tutor/study-launcher";
import type { TutorMode } from "@/lib/tutor/types";

export function ContinueStudyCta({
  lessonId,
  supportedModes,
  defaultMode,
  initialMode,
  resumableSessionId,
  label = "Continue",
}: {
  lessonId: string;
  supportedModes: TutorMode[];
  defaultMode: TutorMode;
  initialMode?: TutorMode;
  resumableSessionId?: string | null;
  label?: string;
}) {
  if (resumableSessionId) {
    return (
      <Link className="button-primary inline-flex w-full items-center justify-center sm:w-auto" href={`/study/${resumableSessionId}`}>
        {label}
      </Link>
    );
  }

  return (
    <StudyLauncher
      ctaLabel={label}
      defaultMode={defaultMode}
      hideModeSelector
      initialMode={initialMode}
      lessonId={lessonId}
      supportedModes={supportedModes}
    />
  );
}
