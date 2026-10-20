import React from 'react';
import { useCMS } from '../context/CMSContext';

interface LogoProps {
  className?: string;
  showSubtext?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'white';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showSubtext = true,
  size = 'md',
  variant = 'brand',
}) => {
  const { data } = useCMS();

  // Grid dimensions
  const squareSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-2xl font-bold tracking-tight',
  };

  const subtextSizes = {
    sm: 'text-[7px] tracking-[0.22em]',
    md: 'text-[9px] tracking-[0.25em]',
    lg: 'text-[11px] tracking-[0.28em]',
  };

  // Color values derived dynamically from brand accent color
  const accent = data.theme.accentColor || '#6B5CE7';
  const cDark = variant === 'white' ? '#A1A1AA' : accent;
  const cMedium = variant === 'white' ? '#FFFFFF' : `${accent}CC`;
  const cLight = variant === 'white' ? '#D4D4D8' : `${accent}88`;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 3x3 Matrix Mark */}
      <div className={`shrink-0 ${squareSizes[size]} grid grid-cols-3 grid-rows-3 gap-[2.5px] p-[1px]`}>
        {/* Row 0 */}
        <div className="opacity-0" /> {/* (0,0) empty */}
        <div
          className="rounded-[0.5px] transition-all duration-300"
          style={{ backgroundColor: cMedium }}
        />
        <div
          className="rounded-[0.5px] transition-all duration-300"
          style={{ backgroundColor: cLight }}
        />

        {/* Row 1 */}
        <div
          className="rounded-[0.5px] transition-all duration-300"
          style={{ backgroundColor: cMedium }}
        />
        <div
          className="rounded-[0.5px] transition-all duration-300 shadow-sm"
          style={{ backgroundColor: cDark }}
        />
        <div
          className="rounded-[0.5px] transition-all duration-300"
          style={{ backgroundColor: cMedium }}
        />

        {/* Row 2 */}
        <div
          className="rounded-[0.5px] transition-all duration-300"
          style={{ backgroundColor: cLight }}
        />
        <div
          className="rounded-[0.5px] transition-all duration-300"
          style={{ backgroundColor: cMedium }}
        />
        <div
          className="rounded-[0.5px] transition-all duration-300"
          style={{ backgroundColor: cDark }}
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`${titleSizes[size]} text-white transition-colors duration-200`}
          style={{
            color: variant === 'brand' ? (data.theme.accentColor === '#6B5CE7' ? '#FFFFFF' : '#FFFFFF') : '#FFFFFF',
          }}
        >
          {data.config.name.toLowerCase()}
        </span>
        {showSubtext && (
          <span
            className={`${subtextSizes[size]} uppercase font-medium text-neutral-400 mt-[3px] whitespace-nowrap`}
          >
            {data.config.subtext}
          </span>
        )}
      </div>
    </div>
  );
};
