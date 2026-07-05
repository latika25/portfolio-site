import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import { useResumeData } from './hooks/useResumeData';
import { api } from './api/client';

export default function App() {
  const { nodes, source } = useResumeData();

  useEffect(() => {
    api.trackView();
  }, []);

  const coreNode = nodes.find((n) => n.type === 'core') ?? null;
  const experienceNodes = nodes.filter((n) => n.type === 'experience');
  const projectNodes = nodes.filter((n) => n.type === 'project');
  const skillNodes = nodes.filter((n) => n.type === 'skill');

  return (
    <div className="bg-space text-ink-100">
      <Navbar />

      {source === 'error' && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md border border-space-border bg-space-surface/90 px-3 py-1.5 text-xs text-ink-400 backdrop-blur">
          Live API unreachable — showing cached data
        </div>
      )}

      <main>
        <Hero coreNode={coreNode} />
        <Experience experienceNodes={experienceNodes} />
        <Projects projectNodes={projectNodes} />
        <About skillNodes={skillNodes} />
        <Contact />
      </main>

      <Footer coreNode={coreNode} />
    </div>
  );
}
