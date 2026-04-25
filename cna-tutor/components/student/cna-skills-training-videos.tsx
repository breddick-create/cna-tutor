import { cnaTrainingVideoResource } from "@/lib/resources/cna-training-videos";

export function CnaSkillsTrainingVideos() {
  return (
    <section className="panel rounded-[1.75rem] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="eyebrow">CNA Training Videos</p>
          <h2 className="mt-3 text-2xl font-semibold">
            {cnaTrainingVideoResource.title}
          </h2>
          <p className="text-muted mt-3 leading-7">
            {cnaTrainingVideoResource.description}
          </p>
        </div>
        <a
          className="button-secondary w-full sm:w-auto"
          href={cnaTrainingVideoResource.playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open on YouTube
        </a>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white/75 shadow-sm">
        <div className="aspect-video w-full">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
            referrerPolicy="strict-origin-when-cross-origin"
            src={cnaTrainingVideoResource.embedUrl}
            title={cnaTrainingVideoResource.playlistTitle}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          className="button-primary w-full sm:w-auto"
          href={cnaTrainingVideoResource.playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch full playlist
        </a>
        <p className="text-muted text-sm leading-6">
          Keep this open alongside your CNA lessons whenever you want a visual refresher on core skills.
        </p>
      </div>
    </section>
  );
}
