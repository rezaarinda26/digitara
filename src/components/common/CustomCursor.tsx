import React, { useEffect, useRef, useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, label[for], [contenteditable="true"], .cursor-magnetic';

// Pointer position captured at module scope, i.e. before React has mounted.
// Without it the cursor stays invisible until the user moves the pointer,
// which is noticeable right after a page load.
let lastPointer: { x: number; y: number } | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener(
    'mousemove',
    (e) => {
      lastPointer = { x: e.clientX, y: e.clientY };
    },
    { passive: true }
  );
}

/**
 * Accent cursor ring that trails the pointer and swells over interactive
 * elements. Disabled on touch devices and when the user prefers reduced
 * motion. The native cursor stays visible until the custom one is painted, so
 * the pointer is never lost during load.
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
    const active = fine && !reduced;
    setEnabled(active);
    // Do not hide the native cursor yet: applyVisibility() only swaps it out
    // once the custom cursor is actually painted. This keeps the pointer
    // visible during load, before the first mousemove.
    document.body.classList.remove('cursor-custom');
    if (!active) return;

    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    const dot = { x: target.x, y: target.y };

    // Show the cursor straight away if the pointer is already over the page,
    // using the last position recorded before mount. Edge positions are
    // ignored for the same reason as in onMove.
    const startVisible =
      !!lastPointer &&
      lastPointer.x > 0 &&
      lastPointer.y > 0 &&
      lastPointer.x < window.innerWidth - 1 &&
      lastPointer.y < window.innerHeight - 1;
    if (startVisible && lastPointer) {
      target.x = ring.x = dot.x = lastPointer.x;
      target.y = ring.y = dot.y = lastPointer.y;
    }
    let visible = startVisible;

    // Keep the rendered opacity in sync with the logical `visible` flag. This
    // is also called from the rAF loop so a pointer event that lands before
    // the refs are mounted cannot leave the cursor stuck invisible: on the
    // next frame the styles are applied instead of waiting for the pointer to
    // leave and re-enter the window.
    const applyVisibility = () => {
      const opacity = visible ? '1' : '0';
      if (ringRef.current && ringRef.current.style.opacity !== opacity) {
        ringRef.current.style.opacity = opacity;
      }
      if (dotRef.current && dotRef.current.style.opacity !== opacity) {
        dotRef.current.style.opacity = opacity;
      }
      // Hide the native pointer only while the custom cursor is on screen, so
      // there is never a moment with no visible cursor at all.
      const hideNative = visible && !!ringRef.current;
      if (document.body.classList.contains('cursor-custom') !== hideNative) {
        document.body.classList.toggle('cursor-custom', hideNative);
      }
    };

    const hide = () => {
      visible = false;
      applyVisibility();
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
        applyVisibility();
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
      applyVisibility();
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
          // Contrast sandwich: white halo + dark hairline keeps the accent
          // ring readable on the accent-coloured portfolio stage as well as
          // on white cards and dark sections.
          boxShadow: `0 0 0 1.5px rgba(255,255,255,0.9), 0 0 0 2.5px rgba(0,0,0,0.28), 0 10px 24px -6px rgba(0,0,0,0.45)${
            isLight ? '' : `, 0 0 24px ${accent}55`
          }`,
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
          backgroundColor: '#ffffff',
          opacity: 0,
          willChange: 'transform',
          boxShadow: `0 0 0 1.5px ${accent}, 0 0 0 2.5px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.35)${
            isLight ? '' : `, 0 0 14px ${accent}70`
          }`,
        }}
      />
    </div>
  );
};
