import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight } from 'lucide-react';
import { HeroTextSize } from '../types/cms';
import { EditableText, EditableImage, DraggableBox } from './editorial/Editable';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useAnimatedScroll } from '../hooks/useAnimatedScroll';

const headlineSizeClasses: Record<HeroTextSize, string> = {
  sm: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
  md: 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl',
  lg: 'text-6xl sm:text-8xl md:text-9xl lg:text-[11rem]',
  xl: 'text-7xl sm:text-9xl md:text-[10rem] lg:text-[13rem]',
};

const editorialSizeClasses: Record<HeroTextSize, string> = {
  sm: 'text-xs sm:text-sm',
  md: 'text-sm sm:text-base',
  lg: 'text-base sm:text-lg',
  xl: 'text-lg sm:text-xl',
};

export const Hero: React.FC = () => {
  const { data, editorialMode, updateHero, isSectionLight, darkBg, accentText } = useCMS();
  const { hero, theme } = data;
  const isLight = isSectionLight('hero');
  const [imageError, setImageError] = useState(false);
  const [intro, setIntro] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Play the staggered entrance once, right after the first paint.
  useEffect(() => {
    if (reduced) {
      setIntro(true);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setIntro(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [reduced]);

  const introClass = (step: 1 | 2 | 3 | 4) =>
    `dg-hero-in dg-hero-in-${step} ${intro ? 'is-in' : ''}`;

  // Parallax: the cinematic background drifts slower than the page scroll
  // while the headline eases out of view.
  useAnimatedScroll(
    (p) => {
      if (bgRef.current) {
        const y = p * 18;
        const scale = 1 + p * 0.14;
        bgRef.current.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;
      }
      if (contentRef.current) {
        const y = p * 10;
        const opacity = Math.max(0.25, 1 - p * 0.75);
        contentRef.current.style.transform = `translate3d(0, ${y}%, 0)`;
        contentRef.current.style.opacity = String(opacity);
      }
    },
    { targetRef: sectionRef, smoothing: reduced ? 1 : 0.14 }
  );

  const headlineSize = headlineSizeClasses[hero.headlineSize || 'md'];
  const editorialSize = editorialSizeClasses[hero.editorialSize || 'md'];

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-500 ${
        isLight ? 'bg-white text-black' : 'text-white'
      }`}
      style={isLight ? undefined : { backgroundColor: darkBg }}
    >
      {/* Dynamic Ambient Glow matching brand accent color */}
      <div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-25 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: theme.accentColor || '#6B5CE7' }}
      />
      <div
        className="absolute bottom-1/3 left-10 w-[350px] h-[350px] rounded-full blur-[140px] opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: theme.accentColor || '#6B5CE7' }}
      />

      {/* Cinematic Background Image Container with Gradient Scrim */}
      <div className={`absolute inset-0 z-0 overflow-hidden select-none ${editorialMode ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {!imageError && hero.bgImageUrl ? (
          <div
            ref={bgRef}
            className={`w-full h-full will-change-transform ${
              isLight ? 'opacity-10' : 'opacity-50'
            }`}
          >
            <EditableImage
              value={hero.bgImageUrl}
              onChange={(v) => updateHero({ bgImageUrl: v })}
              label="Background Hero"
              alt="Cinematic digital agency background"
              priority
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center scale-105 transform"
            />
          </div>
        ) : (
          <div
            className={`w-full h-full ${
              isLight
                ? 'bg-gradient-to-br from-neutral-50 via-white to-neutral-100'
                : 'bg-gradient-to-br from-[#121024] via-[#0A0A0A] to-[#171520]'
            }`}
          />
        )}

        {/* Sophisticated Dark Vignette & Gradient Overlays */}
        {isLight ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/40 pointer-events-none" />
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-10" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A]/80 pointer-events-none" />
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
          </>
        )}
      </div>

      {/* Top Floating Row: Corner Showcase Card & Right Chapter Index */}
      <div
        className={`relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start justify-between gap-6 pt-4 ${introClass(1)}`}
      >
        {/* Floating Showcase Card */}
        {hero.floatingCard && (
          <DraggableBox
            as="a"
            id="hero-floating-card"
            label="Kartu showcase hero"
            href={hero.floatingCard.linkUrl || '#portfolio'}
            className={`group flex items-center gap-3.5 p-2 pr-4 backdrop-blur-xl border rounded-xl transition-all duration-300 max-w-xs shadow-2xl active:scale-98 ${
              isLight
                ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200'
                : 'bg-white/[0.05] hover:bg-white/[0.09] border-white/10 hover:border-white/30'
            }`}
            style={{
              borderColor: `${theme.accentColor}30`,
            }}
          >
            <div className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-neutral-900 border ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <EditableImage
                value={hero.floatingCard.imageUrl}
                onChange={(v) =>
                  updateHero({ floatingCard: { ...hero.floatingCard, imageUrl: v } })
                }
                label="Foto kartu showcase"
                alt={hero.floatingCard.title}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className={`flex items-center gap-1.5 text-xs font-medium ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                <EditableText
                  as="span"
                  value={hero.floatingCard.title}
                  onChange={(v) =>
                    updateHero({ floatingCard: { ...hero.floatingCard, title: v } })
                  }
                  label="Judul kartu showcase"
                  className="truncate"
                />
                <ArrowUpRight
                  className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                  style={{ color: theme.accentColor }}
                />
              </div>
              <div className={`flex items-center gap-1 text-[11px] mt-0.5 font-normal ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                <EditableText
                  as="span"
                  value={hero.floatingCard.category}
                  onChange={(v) =>
                    updateHero({ floatingCard: { ...hero.floatingCard, category: v } })
                  }
                  label="Kategori kartu"
                  style={{ color: isLight ? theme.accentColor : accentText }}
                />
                <span className={isLight ? 'text-neutral-300' : 'text-neutral-400'}>·</span>
                <EditableText
                  as="span"
                  value={hero.floatingCard.year}
                  onChange={(v) => updateHero({ floatingCard: { ...hero.floatingCard, year: v } })}
                  label="Tahun kartu"
                />
              </div>
            </div>
          </DraggableBox>
        )}

        {/* Right Editorial Chapter Indicators */}
        <div className="hidden lg:flex flex-col gap-2 text-right">
          {hero.sideCategories.map((cat, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-end gap-3 text-xs tracking-wide transition-colors cursor-default group ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span
                className="font-mono text-[11px] transition-colors"
                style={{ color: isLight ? `${theme.accentColor}CC` : `${accentText}CC` }}
              >
                <EditableText
                  as="span"
                  value={cat.number}
                  onChange={(v) => {
                    const next = hero.sideCategories.map((c, i) => (i === idx ? { ...c, number: v } : c));
                    updateHero({ sideCategories: next });
                  }}
                  label="Nomor chapter"
                />
              </span>
              <span className="font-medium group-hover:translate-x-0.5 transition-transform">
                <EditableText
                  as="span"
                  value={cat.title}
                  onChange={(v) => {
                    const next = hero.sideCategories.map((c, i) => (i === idx ? { ...c, title: v } : c));
                    updateHero({ sideCategories: next });
                  }}
                  label="Judul chapter"
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Massive Editorial Typography Anchor */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto w-full my-auto py-12 will-change-transform"
      >
        <div className="flex flex-col">
          {/* Top Line "WE MAKE" */}
          <EditableText
            as="h1"
            value={hero.headlineMain}
            onChange={(v) => updateHero({ headlineMain: v })}
            label="Headline utama"
            className={`${headlineSize} font-extrabold tracking-tighter uppercase select-none leading-[0.9] ${introClass(2)} ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}
          />

          {/* Bottom Line "DIGITAL" with vibrant luminous accent gradient */}
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 mt-1">
            <EditableText
              as="h1"
              value={hero.headlineAccent}
              onChange={(v) => updateHero({ headlineAccent: v })}
              label="Headline accent"
              className={`${headlineSize} font-extrabold tracking-tighter uppercase select-none leading-[0.9] ${introClass(3)} ${
                isLight ? 'text-neutral-950' : 'text-transparent bg-clip-text dg-shimmer'
              }`}
              editStyle={
                isLight
                  ? { color: '#0A0A0A', backgroundImage: 'none' }
                  : { WebkitTextFillColor: '#FFFFFF', color: '#FFFFFF', backgroundImage: 'none' }
              }
              style={
                isLight
                  ? { color: '#0A0A0A' }
                  : {
                      backgroundImage: `linear-gradient(120deg, #FFFFFF 25%, ${theme.accentColor || '#6B5CE7'} 50%, #FFFFFF 75%)`,
                      backgroundSize: '220% 100%',
                      textShadow: `0 0 50px ${theme.accentColor}33`,
                    }
              }
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Editorial Description & High-Impact CTA */}
      <div
        className={`relative z-10 max-w-7xl mx-auto w-full border-t pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 ${introClass(4)} ${isLight ? 'border-neutral-200' : 'border-white/10'}`}
      >
        <EditableText
          as="p"
          value={hero.editorialLead}
          onChange={(v) => updateHero({ editorialLead: v })}
          label="Editorial statement"
          multiline
          className={`max-w-xl ${editorialSize} font-light leading-relaxed text-wrap-balance ${
            isLight ? 'text-neutral-600' : 'text-neutral-300'
          }`}
        />

        <div className="flex items-center gap-4 shrink-0">
          <DraggableBox
            as="a"
            id="hero-cta"
            label="Tombol CTA Hero"
            href={hero.ctaLink || '#portfolio'}
            className="group inline-flex items-center gap-3 px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wide rounded-full transition-all duration-300 active:scale-95 shadow-xl hover:brightness-110 cursor-pointer"
            style={{
              backgroundColor: theme.accentColor || '#FFFFFF',
              color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
              boxShadow: `0 10px 30px ${theme.accentColor || '#6B5CE7'}40`,
            }}
          >
            <EditableText
              as="span"
              value={hero.ctaText}
              onChange={(v) => updateHero({ ctaText: v })}
              label="Teks tombol CTA"
            />
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-45"
              style={{
                backgroundColor: theme.accentColor === '#FFFFFF' ? '#000000' : 'rgba(0,0,0,0.3)',
                color: '#FFFFFF',
              }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </DraggableBox>
        </div>
      </div>
    </section>
  );
};
