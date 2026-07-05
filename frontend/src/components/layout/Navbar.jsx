import { useEffect, useState } from 'react';

const LINKS = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? 'border-b border-space-border bg-space/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:px-8">
        <a href="#top" className="font-display text-sm font-semibold tracking-wide text-ink-100">
          Latika Swarnkar
        </a>

        <ul className="hidden items-center gap-8 text-sm text-ink-400 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className="transition-colors hover:text-ink-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="rounded-md border border-space-border px-4 py-2 text-xs font-medium text-ink-100 transition-colors hover:border-pulse hover:text-pulse md:text-sm"
        >
          Get in touch
        </a>
      </nav>
    </header>
  );
}
