function groupByCategory(skillNodes) {
  const groups = {};
  for (const node of skillNodes) {
    const cat = node.category || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(node.label);
  }
  return groups;
}

export default function About({ skillNodes }) {
  const groups = groupByCategory(skillNodes);

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24 md:px-8">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-ink-400">About</p>
      <h2 className="font-display text-2xl font-semibold text-ink-100 md:text-3xl">
        Systems-minded, backend-first
      </h2>

      <div className="mt-8 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="text-sm leading-relaxed text-ink-400 md:text-base">
            I build distributed, cloud-native backend systems — microservices in Go and Node.js,
            async event-driven pipelines, and AI-powered workflow automation. At ANZ and DemystData
            I've owned features end-to-end, cut P99 latency by roughly a third under peak load, and
            shipped production services designed for independent deployment and fault isolation.
          </p>

          <div className="mt-8 rounded-lg border border-space-border bg-space-surface/60 p-5">
            <p className="text-xs uppercase tracking-wide text-ink-400">Education</p>
            <p className="mt-2 text-sm font-medium text-ink-100">
              B.Tech, Computer &amp; Communication Engineering
            </p>
            <p className="text-sm text-ink-400">
              The LNM Institute of Information &amp; Technology, Jaipur · CGPA 9.34 · 2018–2022
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {Object.entries(groups).map(([category, skills]) => (
            <div key={category}>
              <p className="mb-2 text-xs uppercase tracking-wide text-ink-400">{category}</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded border border-space-border bg-space-surface px-2 py-1 text-xs text-ink-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
