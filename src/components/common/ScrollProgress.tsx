import React, { useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAnimatedScroll } from '../../hooks/useAnimatedScroll';

/**
 * Thin accent gradient bar pinned to the top of the viewport that tracks how
 * far the user has scrolled through the page.
 */
export const ScrollProgress: React.FC = () => {
  const { data } = useCMS();
  const reduced = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);

  useAnimatedScroll(
    (p) => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p})`;
      }
    },
    { smoothing: reduced ? 1 : 0.2 }
  );

  const accent = data.theme.accentColor || '#6B5CE7';
  const track =
    data.theme.bgMode === 'light-minimal'
      ? 'rgba(0,0,0,0.06)'
      : 'rgba(255,255,255,0.08)';

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[45] h-[3px] pointer-events-none"
      style={{ backgroundColor: track }}
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left will-change-transform"
        style={{
          transform: 'scaleX(0)',
          background: `linear-gradient(90deg, ${accent} 0%, ${accent}CC 55%, ${accent}88 100%)`,
        }}
      />
    </div>
  );
};
