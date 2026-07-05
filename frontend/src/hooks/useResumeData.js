import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { fallbackResumeData } from '../data/fallbackResumeData';

export function useResumeData() {
  const [graph, setGraph] = useState(fallbackResumeData);
  const [source, setSource] = useState('fallback');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const live = await api.getResumeGraph();
        if (!cancelled && live?.nodes?.length) {
          setGraph(live);
          setSource('live');
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[useResumeData] using local fallback data:', err.message);
          setSource('error');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { nodes: graph.nodes, edges: graph.edges, source, isLoading };
}
