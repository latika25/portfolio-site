export default function Projects({ projectNodes }) {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24 md:px-8">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-ink-400">Projects</p>
      <h2 className="font-display text-2xl font-semibold text-ink-100 md:text-3xl">
        Things I've built
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projectNodes.map((node) => (
          <article
            key={node.id}
            className="flex flex-col rounded-lg border border-space-border bg-space-surface/60 p-6 transition-colors hover:border-coral/50"
          >
            <h3 className="font-display text-lg font-semibold text-ink-100">{node.label}</h3>
            <p className="mt-1 text-xs text-ink-400">{node.subtitle}</p>

            {node.description && (
              <p className="mt-4 text-sm leading-relaxed text-ink-400">{node.description}</p>
            )}

            {node.bullets?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {node.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex flex-wrap gap-1.5">
              {node.tech?.map((t) => (
                <span
                  key={t}
                  className="rounded border border-space-border bg-space px-2 py-1 text-xs text-ink-400"
                >
                  {t}
                </span>
              ))}
            </div>

            {node.links?.length > 0 && (
              <div className="mt-5 flex gap-4">
                {node.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-pulse underline decoration-space-border underline-offset-4 hover:decoration-pulse"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
