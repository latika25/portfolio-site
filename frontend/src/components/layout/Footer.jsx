export default function Footer({ coreNode }) {
  const socials = coreNode?.links ?? [];

  return (
    <footer className="border-t border-space-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-sm text-ink-400 md:flex-row md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} Latika Swarnkar. Built with React, R3F, and Go.</p>
        <ul className="flex flex-wrap items-center gap-5">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-pulse"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
