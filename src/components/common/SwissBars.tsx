import React from 'react';
import { SWISS, SWISS_AXIS_DEG } from '../../theme/swiss';

type Bar = {
  /** Horizontal position inside the rotated plane, in %. */
  left: string;
  /** Vertical position inside the rotated plane, in %. */
  top: string;
  /** Thickness in px — the poster alternates heavy bars with 1.5px hairlines. */
  width: number;
  /** Length in % of the rotated plane. */
  height: string;
  opacity?: number;
};

/**
 * Decorative bar composition: the diagonal axis every Swiss layout in this
 * style system is built on. Purely graphical — always `aria-hidden` and
 * non-interactive — and it never affects the layout of its siblings.
 */
const BARS: Bar[] = [
  { left: '3%', top: '-8%', width: 30, height: '48%' },
  { left: '3%', top: '54%', width: 30, height: '16%', opacity: 0.85 },
  { left: '10%', top: '0%', width: 1.5, height: '76%', opacity: 0.55 },
  { left: '19%', top: '-12%', width: 46, height: '40%', opacity: 0.95 },
  { left: '21%', top: '34%', width: 1.5, height: '54%', opacity: 0.45 },
  { left: '32%', top: '10%', width: 18, height: '70%', opacity: 0.8 },
  { left: '44%', top: '-4%', width: 1.5, height: '46%', opacity: 0.5 },
  { left: '51%', top: '22%', width: 34, height: '32%', opacity: 0.85 },
  { left: '63%', top: '2%', width: 11, height: '84%', opacity: 0.65 },
  { left: '77%', top: '12%', width: 26, height: '58%' },
  { left: '87%', top: '-6%', width: 1.5, height: '64%', opacity: 0.4 },
  { left: '91%', top: '56%', width: 40, height: '26%', opacity: 0.9 },
];

export const SwissBars: React.FC<{ tone?: 'paper' | 'blue'; className?: string }> = ({
  tone = 'paper',
  className = '',
}) => {
  const color = tone === 'paper' ? SWISS.paper : SWISS.blue;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Oversized plane rotated on the shared axis, so the bars never leave
          empty corners once the whole composition is tilted. */}
      <div
        className="absolute left-[-20%] top-[-28%] h-[156%] w-[140%]"
        style={{ transform: `rotate(${SWISS_AXIS_DEG}deg)` }}
      >
        {BARS.map((bar, i) => (
          <span
            key={i}
            className="swiss-bar absolute block"
            style={{
              left: bar.left,
              top: bar.top,
              width: bar.width,
              height: bar.height,
              backgroundColor: color,
              opacity: bar.opacity ?? 1,
              animationDelay: `${i * 55}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
