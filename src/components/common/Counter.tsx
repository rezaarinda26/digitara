import React, { useEffect, useRef, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CounterProps {
  /** Raw text from the CMS, e.g. "15+", "4.8", "120+". */
  value: string;
  /** Optional class for the rendered value. */
  className?: string;
  /** Animation duration in ms. */
  duration?: number;
}

/**
 * Animates numeric parts of a string (e.g. "15+" -> counts 0 to 15, then the
 * "+" suffix) when the element scrolls into view. Non-numeric values render
 * as-is.
 */
export const Counter: React.FC<CounterProps> = ({ value, className = '', duration = 1600 }) => {
  const { ref, isVisible } = useReveal<HTMLSpanElement>({ threshold: 0.4, once: true });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);

  const match = value.match(/^([^\d]*)([\d.]+)(.*)$/);

  useEffect(() => {
    if (!isVisible) return;
    if (!match) {
      setDisplay(value);
      return;
    }
    if (reduced) {
      setDisplay(value);
      return;
    }

    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

    if (!Number.isFinite(target)) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = target * eased;
      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, value, duration, reduced, match]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};
