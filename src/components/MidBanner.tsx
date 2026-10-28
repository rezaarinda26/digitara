import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight, Sparkle } from 'lucide-react';
import { EditableText, EditableImage, DraggableBox } from './editorial/Editable';
import { Reveal } from './common/Reveal';

export const MidBanner: React.FC = () => {
  const {
    data,
    updateMidBanner,
    editorialMode,
    isSectionLight,
    darkBg,
    accentText,
    isSwiss,
    swissInk,
    swissPaper,
  } = useCMS();
  const { midBanner, theme } = data;
  const isLight = isSectionLight('midBanner');

  return (
    <section
      className={`relative overflow-hidden transition-colors duration-500 ${
        isLight ? 'bg-white text-black' : 'text-white'
      }`}
      style={isLight ? undefined : { backgroundColor: darkBg }}
    >
      {/* Dynamic Accent Color Glow Orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[170px] opacity-25 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: theme.accentColor || '#6B5CE7' }}
      />

      {/* Cinematic Full-Bleed Media Break */}
      <div className={`relative min-h-[70vh] flex flex-col justify-between py-16 px-4 sm:px-6 lg:px-8 border-y ${isLight ? 'border-neutral-200' : 'border-white/[0.08]'}`}>
        {/* Background Image Container */}
        <Reveal variant="zoom" className="absolute inset-0 z-0 select-none pointer-events-none">
          <EditableImage
            value={midBanner.bgImageUrl}
            onChange={(v) => updateMidBanner({ bgImageUrl: v })}
            label="Background Mid-Banner"
            alt="Digital experience visual art"
            className={`w-full h-full object-cover object-center scale-100 mid-banner-photo ${
              // Swiss: a single flat ink wash instead of a lit photo — the
              // picture becomes a faint duotone texture on the cobalt block.
              // (The final opacity is enforced in index.css: EditableImage
              // appends opacity-100 when the file finishes loading.)
              isSwiss
                ? 'opacity-25 grayscale'
                : isLight
                  ? 'opacity-10'
                  : 'opacity-40 filter brightness-90'
            }`}
          />
          {/* Subtle gradient scrim (classic only: Swiss keeps the block flat) */}
          {!isSwiss &&
            (isLight ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-white/30 pointer-events-none" />
                <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/90 pointer-events-none" />
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />
              </>
            ))}
        </Reveal>

        {/* Top Floating Editorial Labels */}
        <Reveal variant="up" className={`relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
          <EditableText
            as="span"
            value={midBanner.topLabelLeft}
            onChange={(v) => updateMidBanner({ topLabelLeft: v })}
            label="Label kiri atas"
            className="tracking-wider"
          />
          <span className={`tracking-wider flex items-center gap-1.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accentColor }} />
            <EditableText
              as="span"
              value={midBanner.topLabelRight}
              onChange={(v) => updateMidBanner({ topLabelRight: v })}
              label="Label kanan atas"
            />
          </span>
        </Reveal>

        {/* Center Prominent Headline */}
        <Reveal
          variant="mask"
          curtain={isLight ? '#FFFFFF' : darkBg}
          className="relative z-10 max-w-5xl mx-auto text-center py-12"
        >
          <EditableText
            as="h2"
            value={midBanner.headline}
            onChange={(v) => updateMidBanner({ headline: v })}
            label="Headline Mid-Banner"
            className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] ${
              isLight ? 'text-neutral-950' : isSwiss ? 'swiss-on-ink' : 'text-white drop-shadow-2xl'
            }`}
          />
        </Reveal>

        {/* Bottom Bar: Action & Tag */}
        <Reveal variant="up" delay={120} className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
          <EditableText
            as="span"
            value={midBanner.bottomLabel}
            onChange={(v) => updateMidBanner({ bottomLabel: v })}
            label="Label bawah"
            className="text-xs font-mono uppercase tracking-widest font-semibold"
            style={{
              // accentText on cobalt dips below AA contrast; Swiss keeps the
              // label in paper ink instead.
              color: isSwiss ? (isLight ? swissInk : swissPaper) : isLight ? theme.accentColor : accentText,
            }}
          />

          <DraggableBox
            as="a"
            id="midbanner-cta"
            label="Tombol CTA Mid-Banner"
            href="#portfolio"
            className="group flex items-center gap-3 px-7 py-3.5 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-2xl hover:brightness-110"
            style={
              isSwiss
                ? isLight
                  ? { backgroundColor: swissInk, color: swissPaper }
                  : { backgroundColor: swissPaper, color: swissInk }
                : {
                    backgroundColor: theme.accentColor || '#FFFFFF',
                    color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                    boxShadow: `0 10px 30px ${theme.accentColor || '#6B5CE7'}45`,
                  }
            }
          >
            <EditableText
              as="span"
              value={midBanner.ctaText}
              onChange={(v) => updateMidBanner({ ctaText: v })}
              label="Teks CTA Mid-Banner"
            />
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </DraggableBox>
        </Reveal>
      </div>

      {/* Infinite Partners Marquee */}
      <div className={`py-6 border-b overflow-hidden flex items-center ${
        isLight ? 'border-neutral-200 bg-neutral-50' : 'border-white/[0.08] bg-black/60'
      }`}>
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {[...midBanner.partners, ...midBanner.partners, ...midBanner.partners].map((partner, idx) => (
            <div key={idx} className={`flex items-center gap-10 transition-colors cursor-default ${
              isLight ? 'text-neutral-700 hover:text-black' : 'text-neutral-400 hover:text-white'
            }`}>
              <span className={`text-sm font-semibold tracking-wide font-heading uppercase ${
                isLight ? 'text-neutral-700' : 'text-neutral-200'
              }`}>
                <EditableText
                  as="span"
                  value={partner}
                  onChange={(v) => {
                    const len = midBanner.partners.length || 1;
                    const realIdx = idx % len;
                    const next = [...midBanner.partners];
                    next[realIdx] = v;
                    updateMidBanner({ partners: next });
                  }}
                  label="Partner"
                />
              </span>
              <Sparkle className="w-3.5 h-3.5 fill-current" style={{ color: theme.accentColor }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
