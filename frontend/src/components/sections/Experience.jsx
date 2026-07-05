export default function Experience({ experienceNodes }) {
  return (
    <section id="experience" className="border-t border-space-border bg-space-surface/30">
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-8">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-ink-400">Experience</p>
        <h2 className="font-display text-2xl font-semibold text-ink-100 md:text-3xl">
          Where I've worked
        </h2>

        <div className="mt-10 space-y-10">
          {experienceNodes.map((node) => (
            <article
              key={node.id}
              className="relative border-l border-space-border pl-6 md:grid md:grid-cols-4 md:gap-6 md:border-l-0 md:pl-0"
            >
              <div className="md:col-span-1">
                <p className="font-display text-lg font-semibold text-ink-100">{node.label}</p>
                <p className="mt-1 text-xs text-ink-400">{node.subtitle}</p>
              </div>

              <div className="mt-3 md:col-span-3 md:mt-0">
                {node.bullets?.length > 0 && (
                  <ul className="space-y-2">
                    {node.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-400">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {node.tech?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {node.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-space-border bg-space px-2 py-1 text-xs text-ink-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
