import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAnimatedScroll } from '../../hooks/useAnimatedScroll';

/**
 * Floating back-to-top button that appears once the user has scrolled past
 * the hero. The ring around the icon doubles as a scroll progress indicator.
 */
export const BackToTop: React.FC = () => {
  const { data } = useCMS();
  const reduced = useReducedMotion();
  const ringRef = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const radius = 21;
  const circumference = 2 * Math.PI * radius;

  useAnimatedScroll(
    (p) => {
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(circumference * (1 - p));
      }
    },
    { smoothing: reduced ? 1 : 0.22 }
  );

  const isLight = data.theme.bgMode === 'light-minimal';
  const accent = data.theme.accentColor || '#6B5CE7';

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
      aria-label="Kembali ke atas"
      className={`fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out group ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      } ${
        isLight
          ? 'bg-white text-neutral-800 border border-neutral-200 shadow-xl hover:shadow-2xl'
          : 'bg-[#141419]/90 text-white border border-white/15 shadow-2xl backdrop-blur-md hover:border-white/35'
      }`}
      style={{ transitionProperty: 'opacity, transform, box-shadow' }}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}
          strokeWidth="2"
        />
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ transition: 'stroke-dashoffset 80ms linear' }}
        />
      </svg>
      <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
};
