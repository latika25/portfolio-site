import { Suspense } from 'react';
import HeroCanvas from '../Scene/HeroCanvas';

export default function Hero({ coreNode }) {
  const pitch =
    coreNode?.description ||
    'Backend-focused Software Engineer with 4+ years building distributed, cloud-native systems and data pipelines.';

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-12 px-6 pt-24 md:grid-cols-2 md:px-8">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-ink-400">Backend Engineer</p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink-100 md:text-5xl">
            Latika Swarnkar
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-400 md:text-base">{pitch}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-md bg-pulse px-5 py-2.5 text-sm font-medium text-space transition-opacity hover:opacity-90"
            >
              View projects
            </a>
            <a
              href="#contact"
              className="rounded-md border border-space-border px-5 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:border-pulse hover:text-pulse"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Decorative only — hidden on small screens where space is tight
            and the content itself should carry the page. */}
        <div className="hidden h-80 md:block">
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
