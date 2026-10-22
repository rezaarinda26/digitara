import { RefObject, useEffect, useRef } from 'react';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface Options {
  /** Element to measure against. Defaults to the whole document. */
  targetRef?: RefObject<HTMLElement | null>;
  /**
   * Smoothing factor per frame (0 = instant, 0.2 = lazy). Use 1 for no easing.
   */
  smoothing?: number;
}

/**
 * Tracks scroll progress and calls `onUpdate` on every animation frame with a
 * smoothed value (0..1). Keeps everything off the React render path.
 */
export const useAnimatedScroll = (
  onUpdate: (progress: number) => void,
  { targetRef, smoothing = 0.18 }: Options = {}
) => {
  const cbRef = useRef(onUpdate);
  cbRef.current = onUpdate;

  const targetRefRef = useRef(targetRef);
  targetRefRef.current = targetRef;

  const smoothingRef = useRef(smoothing);
  smoothingRef.current = smoothing;

  useEffect(() => {
    let raf = 0;
    let current = 0;
    let target = 0;
    let running = false;

    const measure = () => {
      const el = targetRefRef.current?.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        // "start start" -> "end start" range
        target = clamp01(-rect.top / (rect.height || 1));
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        target = max > 0 ? clamp01(window.scrollY / max) : 0;
      }
    };

    const tick = () => {
      const s = smoothingRef.current;
      current += (target - current) * (s >= 1 ? 1 : s);
      cbRef.current(current);
      if (Math.abs(target - current) > 0.0005) {
        raf = requestAnimationFrame(tick);
      } else {
        current = target;
        cbRef.current(current);
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      start();
    };

    measure();
    start();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
};
