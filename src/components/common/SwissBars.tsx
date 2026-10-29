import React from 'react';
import { useCMS } from '../../context/CMSContext';

/**
 * Exact Swiss Geometric Diagonal Bar Composition.
 * Built with pure geometric polygons to ensure perfectly straight, crisp edges
 * with 90° rectangular end caps and razor-sharp intersections.
 */
export const SwissBars: React.FC<{ tone?: 'paper' | 'blue'; className?: string }> = ({
  tone = 'paper',
  className = '',
}) => {
  const { swissInk, swissPaper } = useCMS();
  const color = tone === 'paper' ? swissPaper : swissInk;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      style={{ color }}
    >
      <svg
        viewBox="0 0 1024 576"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="geometricPrecision"
        className="swiss-bar absolute inset-0 w-full h-full opacity-90 transition-opacity duration-700"
      >
        {/* 1. Top Wide Bar */}
        {/* <polygon points="428.5,-28.5 476,-76 706,154 658.5,201.5" fill="currentColor" /> */}

        {/* 2. Top Mid Bar */}
        <polygon points="642.5,-2.5 653,-13 714,48 703.5,58.5" fill="currentColor" />

        {/* 3. Top Thin Hairline */}
        <polygon points="713,-3 714.5,-4.5 878.5,159.5 877,161" fill="currentColor" />

        {/* 4. Upper-Left Hairline */}
        {/* <polygon points="392.5,31.5 394.5,29.5 473.5,108.5 471.5,110.5" fill="currentColor" /> */}

        {/* 5. Parallel Hairline (aligned with Upper-Left, after the center gap) */}
        <polygon points="562.5,201.5 564.5,199.5 825.5,460.5 823.5,462.5" fill="currentColor" />

        {/* 6. Crossing Hairline (perpendicular 135° diagonal running across) */}
        <polygon points="335.5,585.5 863.5,57.5 865,59 337,587" fill="currentColor" />

        {/* 7. Main Center Bar (sharp 90° square end cap in the middle) */}
        <polygon points="420.5,620.5 702,339 734,371 452.5,652.5" fill="currentColor" />

        {/* 8. Hairline parallel below Main Bar */}
        <polygon points="541.5,591.5 1023,110 1024.5,111.5 543,593" fill="currentColor" />

        {/* 9. Hairline parallel further below */}
        <polygon points="671,575 1023,223 1024.5,224.5 672.5,576.5" fill="currentColor" />

        {/* 10. Far-Right Wide Bar */}
        <polygon points="756,-6 778.5,-28.5 1045,238 1022.5,260.5" fill="currentColor" />

        {/* 11. Mid-Right Bar */}
        <polygon points="836.5,200.5 847,190 977,320 966.5,330.5" fill="currentColor" />

        {/* 12. Bottom-Right Wide Bar */}
        <polygon points="884.5,442.5 935.5,391.5 1097,553 1046,604" fill="currentColor" />

        {/* 13. Top-Right Corner Bar */}
        <polygon points="970.5,69.5 1022,18 1057,53 1005.5,104.5" fill="currentColor" />
      </svg>
    </div>
  );
};
