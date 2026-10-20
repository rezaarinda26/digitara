import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight } from 'lucide-react';
import { HeroTextSize } from '../types/cms';
import { EditableText, EditableImage, DraggableBox } from './editorial/Editable';

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
  const { data, editorialMode, updateHero } = useCMS();
  const { hero, theme } = data;
  const [imageError, setImageError] = useState(false);

  const headlineSize = headlineSizeClasses[hero.headlineSize || 'md'];
  const editorialSize = editorialSizeClasses[hero.editorialSize || 'md'];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0A0A0A]">
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
          <EditableImage
            value={hero.bgImageUrl}
            onChange={(v) => updateHero({ bgImageUrl: v })}
            label="Background Hero"
            alt="Cinematic digital agency background"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center opacity-45 scale-105 transform motion-safe:animate-pulse duration-1000"
            style={{ animationDuration: '8s' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#121024] via-[#0A0A0A] to-[#171520]" />
        )}

        {/* Sophisticated Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
      </div>

      {/* Top Floating Row: Corner Showcase Card & Right Chapter Index */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start justify-between gap-6 pt-4">
        {/* Floating Showcase Card */}
        {hero.floatingCard && (
          <DraggableBox
            as="a"
            id="hero-floating-card"
            label="Kartu showcase hero"
            href={hero.floatingCard.linkUrl || '#portfolio'}
            className="group flex items-center gap-3.5 p-2 pr-4 bg-white/[0.05] hover:bg-white/[0.09] backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-xl transition-all duration-300 max-w-xs shadow-2xl active:scale-98"
            style={{
              borderColor: `${theme.accentColor}30`,
            }}
          >
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
              <EditableImage
                value={hero.floatingCard.imageUrl}
                onChange={(v) =>
                  updateHero({ floatingCard: { ...hero.floatingCard, imageUrl: v } })
                }
                label="Foto kartu showcase"
                alt={hero.floatingCard.title}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-white font-medium group-hover:text-white transition-colors">
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
              <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-0.5 font-normal">
                <EditableText
                  as="span"
                  value={hero.floatingCard.category}
                  onChange={(v) =>
                    updateHero({ floatingCard: { ...hero.floatingCard, category: v } })
                  }
                  label="Kategori kartu"
                  style={{ color: `${theme.accentColor}` }}
                />
                <span className="text-neutral-600">·</span>
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
              className="flex items-center justify-end gap-3 text-xs tracking-wide text-neutral-400 hover:text-white transition-colors cursor-default group"
            >
              <span
                className="font-mono text-[11px] transition-colors"
                style={{ color: `${theme.accentColor}CC` }}
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
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-12">
        <div className="flex flex-col">
          {/* Top Line "WE MAKE" */}
          <EditableText
            as="h1"
            value={hero.headlineMain}
            onChange={(v) => updateHero({ headlineMain: v })}
            label="Headline utama"
            className={`${headlineSize} font-extrabold tracking-tighter text-white uppercase select-none leading-[0.9]`}
          />

          {/* Bottom Line "DIGITAL" with vibrant luminous accent gradient */}
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 mt-1">
            <EditableText
              as="h1"
              value={hero.headlineAccent}
              onChange={(v) => updateHero({ headlineAccent: v })}
              label="Headline accent"
              className={`${headlineSize} font-extrabold tracking-tighter uppercase select-none leading-[0.9] text-transparent bg-clip-text`}
              editStyle={{ WebkitTextFillColor: '#FFFFFF', color: '#FFFFFF', backgroundImage: 'none' }}
              style={{
                backgroundImage: `linear-gradient(120deg, #FFFFFF 40%, ${theme.accentColor || '#6B5CE7'} 100%)`,
                textShadow: `0 0 50px ${theme.accentColor}33`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Editorial Description & High-Impact CTA */}
      <div className="relative z-10 max-w-7xl mx-auto w-full border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <EditableText
          as="p"
          value={hero.editorialLead}
          onChange={(v) => updateHero({ editorialLead: v })}
          label="Editorial statement"
          multiline
          className={`max-w-xl ${editorialSize} text-neutral-300 font-light leading-relaxed text-wrap-balance`}
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
