import React, { useEffect, useRef, useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, label[for], [contenteditable="true"], .cursor-magnetic';

/**
 * Accent cursor ring that trails the pointer and swells over interactive
 * elements. Disabled on touch devices and when the user prefers reduced
 * motion. The native cursor is left untouched so usability is unaffected.
 */
export const CustomCursor: React.FC = () => {
  const { data } = useCMS();
  const reduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    setEnabled(fine && !reduced);
    document.body.classList.toggle('cursor-custom', fine && !reduced);

    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    const dot = { x: target.x, y: target.y };
    let visible = false;

    const hide = () => {
      visible = false;
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const onMove = (e: MouseEvent) => {
      // Ignore spurious events at the very edge of the viewport: when the
      // pointer leaves for the browser chrome the ring would otherwise be
      // clipped into a stray line at the top/left edge.
      if (
        e.clientX <= 0 ||
        e.clientY <= 0 ||
        e.clientX >= window.innerWidth - 1 ||
        e.clientY >= window.innerHeight - 1
      ) {
        hide();
        return;
      }

      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        ring.x = dot.x = target.x;
        ring.y = dot.y = target.y;
        if (ringRef.current) ringRef.current.style.opacity = '1';
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }

      const el = e.target as HTMLElement | null;
      const interactive = el?.closest?.(INTERACTIVE) as HTMLElement | null;
      setActive(!!interactive);
      const cursorLabel = interactive?.dataset?.cursor;
      setLabel(cursorLabel ? cursorLabel : null);
    };

    const onLeave = () => hide();

    const onOut = (e: MouseEvent) => {
      // relatedTarget is null when the pointer crosses the document boundary
      // (e.g. moving onto the browser toolbar).
      if (!e.relatedTarget) hide();
    };

    const onBlur = () => hide();

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;
      dot.x += (target.x - dot.x) * 0.42;
      dot.y += (target.y - dot.y) * 0.42;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseout', onOut);
    window.addEventListener('blur', onBlur);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('blur', onBlur);
      cancelAnimationFrame(raf);
      document.body.classList.remove('cursor-custom');
    };
  }, [reduced]);

  if (!enabled) return null;

  const accent = data.theme.accentColor || '#6B5CE7';
  const isLight = data.theme.bgMode === 'light-minimal';

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full transition-[width,height,background-color,border-color] duration-200 ease-out"
        style={{
          width: active ? 46 : 30,
          height: active ? 46 : 30,
          border: `1.5px solid ${accent}`,
          backgroundColor: active ? `${accent}1F` : 'transparent',
          opacity: 0,
          willChange: 'transform',
        }}
      >
        {label && (
          <div
            className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-mono font-semibold text-white"
            style={{ backgroundColor: accent }}
          >
            {label}
          </div>
        )}
      </div>
      {/* Solid dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 rounded-full transition-[width,height] duration-200 ease-out"
        style={{
          width: active ? 5 : 6,
          height: active ? 5 : 6,
          backgroundColor: accent,
          opacity: 0,
          willChange: 'transform',
          boxShadow: isLight ? `0 0 0 1px ${accent}30` : `0 0 10px ${accent}90`,
        }}
      />
    </div>
  );
};
