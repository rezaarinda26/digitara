import { useEffect, useState } from 'react';

export interface ScrollSpyState {
  /** Id of the section currently occupying the upper part of the viewport. */
  activeId: string;
  /** 0..1 progress through the active section. */
  progress: number;
}

/**
 * Tracks which section is currently in the viewport so navigation can
 * highlight the active entry, plus how far the user has travelled through
 * that section.
 */
export const useScrollSpy = (ids: string[], offset = 120): ScrollSpyState => {
  const [state, setState] = useState<ScrollSpyState>({ activeId: '', progress: 0 });

  useEffect(() => {
    if (typeof window === 'undefined' || ids.length === 0) return;

    const compute = () => {
      let current = '';
      let progress = 0;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset) {
          current = id;
          const height = rect.height || 1;
          progress = Math.min(1, Math.max(0, (offset - rect.top) / height));
        }
      }

      // Near the very bottom of the page the last section always wins.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
        const last = ids[ids.length - 1];
        if (document.getElementById(last)) {
          current = last;
          progress = 1;
        }
      }

      setState((prev) =>
        prev.activeId === current && Math.abs(prev.progress - progress) < 0.01
          ? prev
          : { activeId: current, progress }
      );
    };

    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [ids, offset]);

  return state;
};
