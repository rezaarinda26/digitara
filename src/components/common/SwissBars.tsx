import React from 'react';
import { useCMS } from '../../context/CMSContext';

/**
 * Authentic 1955 Josef Müller-Brockmann "Musica Viva" Swiss Constructivist Composition.
 * 
 * Re-calibrated for landing hero:
 * - Positioned predominantly to the right / center-right (`left: 18%` to `left: 36%` shift)
 *   so the main headline ("WE MAKE DIGITAL") on the left has crystal clear readability.
 * - Bars use muted opacities (25% to 55%) so they are clean, tinted and NOT glaring solid white,
 *   preventing any clash with the crisp white headline.
 * - Purely geometrical bars and hairlines without any distracting background text labels.
 */
export const SwissBars: React.FC<{ tone?: 'paper' | 'blue'; className?: string }> = ({
  tone = 'paper',
  className = '',
}) => {
  const { swissInk, swissPaper } = useCMS();
  const color = tone === 'paper' ? swissPaper : swissInk;

  // Primary axis angle matching Müller-Brockmann's geometry
  const PRIMARY_ANGLE = -28;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      {/* 
        Container shifted towards the right side of the hero,
        leaving the left region open and clutter-free for the main headline.
      */}
      <div
        className="absolute left-[14%] sm:left-[22%] md:left-[30%] lg:left-[38%] top-[-30%] w-[125%] h-[165%]"
        style={{
          transform: `rotate(${PRIMARY_ANGLE}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* =========================================================================
            1. PRIMARY ASCENDING AXIS (Vertical Pillars in rotated coordinate space)
            All opacities calibrated to be soft & tinted (0.20 - 0.50)
            ========================================================================= */}

        {/* Far-left Thin Support Bar */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '12%',
            top: '42%',
            width: '12px',
            height: '24%',
            backgroundColor: color,
            opacity: 0.35,
            animationDelay: '60ms',
          }}
        />

        {/* Primary Giant Pillar (The iconic spine of the poster) */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '16%',
            top: '35%',
            width: '64px',
            height: '65%',
            backgroundColor: color,
            opacity: 0.50,
            animationDelay: '120ms',
          }}
        />

        {/* Secondary Mid-thick Bar parallel to the spine */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '24%',
            top: '44%',
            width: '36px',
            height: '40%',
            backgroundColor: color,
            opacity: 0.42,
            animationDelay: '180ms',
          }}
        />

        {/* Thin bottom trailing bar */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '25.5%',
            top: '86%',
            width: '14px',
            height: '14%',
            backgroundColor: color,
            opacity: 0.30,
            animationDelay: '220ms',
          }}
        />

        {/* Long Slender Central Shaft extending high up into the right corner */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '38%',
            top: '3%',
            width: '24px',
            height: '84%',
            backgroundColor: color,
            opacity: 0.45,
            animationDelay: '260ms',
          }}
        />

        {/* Top-Right Tower Bar 1 (Upper section) */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '42%',
            top: '2%',
            width: '48px',
            height: '24%',
            backgroundColor: color,
            opacity: 0.52,
            animationDelay: '300ms',
          }}
        />

        {/* Top-Right Slender Needle Bar */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '48%',
            top: '8%',
            width: '12px',
            height: '20%',
            backgroundColor: color,
            opacity: 0.35,
            animationDelay: '340ms',
          }}
        />

        {/* Top-Right Secondary Block */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '51%',
            top: '15%',
            width: '22px',
            height: '17%',
            backgroundColor: color,
            opacity: 0.40,
            animationDelay: '380ms',
          }}
        />

        {/* Central Lower Resting Bar */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '34%',
            top: '32%',
            width: '28px',
            height: '26%',
            backgroundColor: color,
            opacity: 0.38,
            animationDelay: '200ms',
          }}
        />

        {/* =========================================================================
            2. PERPENDICULAR CROSS-AXIS (Horizontal in rotated space)
            Hairlines and crossbars with elegant translucent feel
            ========================================================================= */}

        {/* Upper Left Horizontal Solid Crossbar */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '13%',
            top: '16%',
            width: '26%',
            height: '28px',
            backgroundColor: color,
            opacity: 0.45,
            animationDelay: '140ms',
          }}
        />

        {/* Upper Left Hairline above the crossbar */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '8%',
            top: '13%',
            width: '36%',
            height: '1.5px',
            backgroundColor: color,
            opacity: 0.28,
            animationDelay: '100ms',
          }}
        />

        {/* Mid-Left Hairline cutting across the space */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '5%',
            top: '19.5%',
            width: '30%',
            height: '1.5px',
            backgroundColor: color,
            opacity: 0.22,
            animationDelay: '160ms',
          }}
        />

        {/* Central Piercing Hairline slicing through vertical bars */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '26%',
            top: '33%',
            width: '26%',
            height: '1.5px',
            backgroundColor: color,
            opacity: 0.35,
            animationDelay: '240ms',
          }}
        />

        {/* Middle Intersecting Hairline */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '24%',
            top: '41%',
            width: '32%',
            height: '1.5px',
            backgroundColor: color,
            opacity: 0.25,
            animationDelay: '280ms',
          }}
        />

        {/* Right Horizontal Crossbar */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '44%',
            top: '38%',
            width: '18%',
            height: '24px',
            backgroundColor: color,
            opacity: 0.42,
            animationDelay: '360ms',
          }}
        />

        {/* Far-Right Floating Hairline */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '52%',
            top: '35.5%',
            width: '24%',
            height: '1.5px',
            backgroundColor: color,
            opacity: 0.25,
            animationDelay: '420ms',
          }}
        />

        {/* Underline for the block on the right */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '41%',
            top: '50%',
            width: '16%',
            height: '1.5px',
            backgroundColor: color,
            opacity: 0.28,
            animationDelay: '400ms',
          }}
        />

        {/* Vertical Guide Hairline on Grid */}
        <div
          className="swiss-bar absolute"
          style={{
            left: '30%',
            top: '12%',
            width: '1.5px',
            height: '24%',
            backgroundColor: color,
            opacity: 0.20,
            animationDelay: '210ms',
          }}
        />
      </div>
    </div>
  );
};
