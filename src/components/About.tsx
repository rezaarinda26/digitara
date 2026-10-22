import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight } from 'lucide-react';
import { EditableText, EditableImage, DraggableBox } from './editorial/Editable';
import { Reveal } from './common/Reveal';
import { StatNumber } from './common/StatNumber';

export const About: React.FC = () => {
  const { data, isSectionLight, updateAbout, darkBg } = useCMS();
  const { about, theme } = data;
  const isLight = isSectionLight('about');

  return (
    <section
      id="about"
      className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-500 overflow-hidden ${
        isLight
          ? 'bg-white text-black border-t border-neutral-200'
          : 'text-white border-t border-white/[0.06]'
      }`}
      style={isLight ? undefined : { backgroundColor: darkBg }}
    >
      {/* Subtle ambient accent gradient blur */}
      <div
        className="absolute top-1/2 -right-40 w-96 h-96 rounded-full blur-[140px] opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: theme.accentColor || '#6B5CE7' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Kicker Row */}
        <Reveal
          variant="up"
          className={`flex items-center justify-between pb-6 mb-16 border-b ${
            isLight ? 'border-neutral-200' : 'border-white/[0.08]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-full ring-4 shadow-sm"
              style={{
                backgroundColor: theme.accentColor || '#6B5CE7',
                boxShadow: `0 0 12px ${theme.accentColor || '#6B5CE7'}60`,
              }}
            />
            <span
              className={`text-xs font-mono uppercase tracking-widest font-semibold ${
                isLight ? 'text-neutral-700' : 'text-neutral-300'
              }`}
            >
              <EditableText
                as="span"
                value={about.pretitle}
                onChange={(v) => updateAbout({ pretitle: v })}
                label="Pre-title About"
              />
            </span>
          </div>
          <span
            className="text-xs font-mono tracking-wider px-3 py-1 rounded-full border text-[11px]"
            style={{
              borderColor: `${theme.accentColor}40`,
              color: isLight ? '#0A0A0A' : '#FFFFFF',
              backgroundColor: `${theme.accentColor}10`,
            }}
          >
            <EditableText
              as="span"
              value={about.floatingCardTag}
              onChange={(v) => updateAbout({ floatingCardTag: v })}
              label="Tag kartu About"
            />
          </span>
        </Reveal>

        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Atmospheric Visual Card */}
          <Reveal variant="left" className="lg:col-span-4 flex">
            <div className="w-full flex flex-col gap-6">
            <div
              className={`relative rounded-2xl overflow-hidden aspect-[4/5] border group shadow-xl ${
                isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-900 border-white/10'
              }`}
              style={{
                borderColor: `${theme.accentColor}30`,
              }}
            >
              <EditableImage
                value={about.imageUrl}
                onChange={(v) => updateAbout({ imageUrl: v })}
                label="Foto About"
                alt="Creative agency workspace"
                className="w-full h-full object-cover grayscale contrast-105 group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:contrast-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="dark-surface absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs text-white">
                <span className="font-semibold tracking-wide flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <EditableText as="span" value="DIGITARA Atelier" overrideKey="about.photoTag" label="Label foto About" />
                </span>
                <span className="text-neutral-300 font-mono text-[11px]">
                  <EditableText as="span" value="Jakarta · Worldwide" overrideKey="about.photoLocation" label="Lokasi foto About" />
                </span>
              </div>
            </div>

            {/* Sub-card: Philosophy */}
            <DraggableBox
              id="about-philosophy-card"
              label="Kartu Philosophy"
              className={`p-6 rounded-2xl border flex items-center justify-between transition-all hover:shadow-md ${
                isLight
                  ? 'bg-neutral-50 border-neutral-200 text-black'
                  : 'bg-white/[0.03] border-white/[0.06] text-white'
              }`}
              style={{
                borderLeftWidth: '3px',
                borderLeftColor: theme.accentColor || '#6B5CE7',
              }}
            >
              <div>
                <p className={`text-xs font-mono uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  <EditableText as="span" value="Philosophy" overrideKey="about.philosophyKicker" label="Kicker Philosophy" />
                </p>
                <EditableText
                  as="h4"
                  value={about.subhead}
                  onChange={(v) => updateAbout({ subhead: v })}
                  label="Subhead Philosophy"
                  className="text-sm font-semibold mt-1"
                />
              </div>
              <a
                href="#services"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105"
                style={{
                  backgroundColor: theme.accentColor || '#0A0A0A',
                  color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                }}
                aria-label="View Services"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </DraggableBox>
            </div>
          </Reveal>

          {/* Right Column: Editorial Intro & Capabilities */}
          <Reveal variant="right" className="lg:col-span-8 flex" delay={100}>
            <div className="w-full flex flex-col">
            {/* Dual Tone Editorial Headline with Accent Impact */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
              <EditableText
                as="span"
                value={about.mainHeadlineBold}
                onChange={(v) => updateAbout({ mainHeadlineBold: v })}
                label="Headline About (bold)"
                className={isLight ? 'text-neutral-950' : 'text-white'}
              />{' '}
              <EditableText
                as="span"
                value={about.mainHeadlineMuted}
                onChange={(v) => updateAbout({ mainHeadlineMuted: v })}
                label="Headline About (muted)"
                className={isLight ? 'text-neutral-400 font-normal' : 'text-neutral-400 font-normal'}
              />
            </h2>

            {/* Paragraph */}
            <EditableText
              as="p"
              value={about.paragraph}
              onChange={(v) => updateAbout({ paragraph: v })}
              label="Paragraf About"
              multiline
              className={`mt-8 text-base sm:text-lg leading-relaxed font-light max-w-2xl ${
                isLight ? 'text-neutral-600' : 'text-neutral-300'
              }`}
            />

            {/* Founder Signature */}
            <div className="mt-6 flex items-center gap-3">
              <span
                className="h-px w-8"
                style={{ backgroundColor: theme.accentColor }}
              />
              <div className="flex flex-col">
                <EditableText
                  as="span"
                  value="Reza Arinda Pratama"
                  overrideKey="about.founderName"
                  label="Nama founder"
                  className={`text-sm font-semibold tracking-wide ${
                    isLight ? 'text-neutral-900' : 'text-white'
                  }`}
                />
                <EditableText
                  as="span"
                  value="Founder & Creative Director"
                  overrideKey="about.founderRole"
                  label="Jabatan founder"
                  className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}
                />
              </div>
            </div>

            {/* Badges / Pill matrix with Accent Hover and Border Tint */}
            <Reveal variant="up" delay={120} className="mt-10">
              <div className="flex flex-wrap gap-2.5">
                {about.badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-default border ${
                      isLight
                        ? 'bg-neutral-50 hover:bg-white text-neutral-800 border-neutral-300/80 shadow-2xs hover:shadow'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-neutral-200'
                    }`}
                    style={{
                      borderColor: `${theme.accentColor}35`,
                    }}
                  >
                    <EditableText
                      as="span"
                      value={badge}
                      onChange={(v) => {
                        const next = [...about.badges];
                        next[idx] = v;
                        updateAbout({ badges: next });
                      }}
                      label="Tag About"
                    />
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Stats Row with High-Impact Accent Color Numbers */}
            <div
              className={`mt-16 pt-12 border-t grid grid-cols-2 sm:grid-cols-3 gap-8 ${
                isLight ? 'border-neutral-200' : 'border-white/[0.08]'
              }`}
            >
              {about.stats.map((stat, sIdx) => (
                <Reveal key={stat.id} variant="up" delay={(sIdx % 3) * 80} className="flex">
                  <div className="w-full flex flex-col group">
                    <StatNumber
                      value={stat.number}
                      onChange={(v) => {
                        const next = [...about.stats];
                        next[sIdx] = { ...next[sIdx], number: v };
                        updateAbout({ stats: next });
                      }}
                      label="Angka statistik"
                      className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums tracking-tight transition-transform duration-300 group-hover:translate-x-1"
                      style={{
                        color: theme.accentColor || (isLight ? '#0A0A0A' : '#FFFFFF'),
                      }}
                    />
                    <EditableText
                      as="span"
                      value={stat.label}
                      onChange={(v) => {
                        const next = [...about.stats];
                        next[sIdx] = { ...next[sIdx], label: v };
                        updateAbout({ stats: next });
                      }}
                      label="Label statistik"
                      className={`text-xs sm:text-sm mt-2 font-medium ${
                        isLight ? 'text-neutral-600' : 'text-neutral-400'
                      }`}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
