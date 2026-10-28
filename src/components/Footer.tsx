import React from 'react';
import { useCMS } from '../context/CMSContext';
import { Logo } from './Logo';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { EditableText } from './editorial/Editable';

export const Footer: React.FC = () => {
  const { data, isSectionLight, darkBg, isSwiss, swissInk, swissPaper } = useCMS();
  const { config } = data;
  const isLight = isSectionLight('footer');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { id: 'instagram', label: 'Instagram', href: config.socials.instagram },
    { id: 'twitter', label: 'Twitter / X', href: config.socials.twitter },
    { id: 'linkedin', label: 'LinkedIn', href: config.socials.linkedin },
    { id: 'facebook', label: 'Facebook', href: config.socials.facebook },
    { id: 'github', label: 'GitHub', href: config.socials.github },
  ];

  return (
    <footer
      className={`relative border-t pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-visible transition-colors duration-500 ${
        isLight ? 'bg-white text-black border-neutral-200' : 'text-white border-white/[0.08]'
      }`}
      style={isLight ? undefined : { backgroundColor: darkBg }}
    >
      {/* Background radial glow matching theme accent color */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] blur-[150px] pointer-events-none transition-all duration-700 opacity-20"
        style={{ backgroundColor: data.theme.accentColor || '#6B5CE7' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Callout Banner */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 pb-16 border-b ${isLight ? 'border-neutral-200' : 'border-white/[0.08]'}`}>
          <div>
            <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? 'text-neutral-950' : 'text-white'}`}>
              <EditableText as="span" value="Let's make it happen together." overrideKey="footer.headline" label="Judul footer" />
            </h3>
            <p className={`text-sm font-light mt-1 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              <EditableText
                as="span"
                value="Currently accepting selected clients for Q1/Q2 2026."
                overrideKey="footer.subline"
                label="Subjudul footer"
              />
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="px-7 py-3.5 rounded-full text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-2 shadow-xl active:scale-95"
              style={
                isSwiss
                  ? // Paper on cobalt, cobalt on paper: two inks, no glow.
                    isLight
                      ? { backgroundColor: swissInk, color: swissPaper }
                      : { backgroundColor: swissPaper, color: swissInk }
                  : {
                      backgroundColor: data.theme.accentColor || '#FFFFFF',
                      color: data.theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                      boxShadow: `0 8px 25px ${data.theme.accentColor || '#6B5CE7'}35`,
                    }
              }
            >
              <EditableText as="span" value="Start A Conversation" overrideKey="footer.cta" label="Teks CTA footer" />
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={scrollToTop}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                isLight
                  ? 'border-neutral-200 hover:border-neutral-900 text-neutral-500 hover:text-black'
                  : 'border-white/10 hover:border-white text-neutral-400 hover:text-white'
              }`}
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Social Links Row */}
        <div className={`py-10 border-b flex flex-wrap items-center justify-between gap-4 ${isLight ? 'border-neutral-200' : 'border-white/[0.08]'}`}>
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-sm font-medium">
            {socialLinks.map((s) =>
              s.href ? (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-1.5 transition-colors ${
                    isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <EditableText as="span" value={s.label} overrideKey={`footer.social.${s.id}`} label="Label sosial" />
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ) : (
                <span
                  key={s.label}
                  className={isLight ? 'text-neutral-500' : 'text-neutral-400'}
                >
                  <EditableText as="span" value={s.label} overrideKey={`footer.social.${s.id}`} label="Label sosial" />
                </span>
              ),
            )}
          </div>

          <div className={`text-xs font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            <EditableText as="span" value="Jakarta GMT+7 · Worldwide" overrideKey="footer.location" label="Lokasi footer" />
          </div>
        </div>

        {/* Logo Display */}
        <div className="pt-24 pb-32 sm:pt-28 sm:pb-36 md:pt-32 md:pb-40 flex justify-center items-center select-none overflow-visible">
          <div
            className={`scale-[3] sm:scale-[4] md:scale-[5] lg:scale-[6.5] transition-opacity duration-500 ${
              isLight ? 'opacity-[0.08] hover:opacity-[0.12]' : 'opacity-[0.08] hover:opacity-[0.14]'
            }`}
          >
            {isLight ? (
              <Logo size="md" showSubtext={false} textColor="#000000" />
            ) : (
              <Logo size="md" showSubtext={false} variant="white" />
            )}
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div
          className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
            isLight ? 'text-neutral-500 border-neutral-200' : 'text-neutral-400 border-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-3">
            {isLight ? (
              <Logo size="sm" showSubtext={false} textColor="#0A0A0A" />
            ) : (
              <Logo size="sm" showSubtext={false} />
            )}
            <span>© {new Date().getFullYear()} {config.name} ({config.subtext}). All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <EditableText as="span" value="Crafted with Precision & Passion" overrideKey="footer.crafted" label="Teks footer 1" />
            <span>·</span>
            <EditableText as="span" value="Made with Figma + Code" overrideKey="footer.madeWith" label="Teks footer 2" />
          </div>
        </div>
      </div>
    </footer>
  );
};
