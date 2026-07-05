import ContactForm from '../UI/ContactForm';

export default function Contact() {
  return (
    <section id="contact" className="border-t border-space-border bg-space-surface/30">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-24 md:grid-cols-2 md:px-8">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-ink-400">Contact</p>
          <h2 className="font-display text-2xl font-semibold text-ink-100 md:text-3xl">
            Let's work together
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
            Open to backend engineering roles and interesting distributed-systems problems. Fastest
            way to reach me is the form — or drop a line directly below.
          </p>

          <div className="mt-6 space-y-2 text-sm">
            <a
              href="mailto:latikaswarnkar25@gmail.com"
              className="block text-ink-100 hover:text-pulse"
            >
              latikaswarnkar25@gmail.com
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-space-border bg-space-surface/60 p-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
