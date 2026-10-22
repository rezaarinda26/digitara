import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Phone } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { EditableText } from '../editorial/Editable';

/**
 * Sticky bottom action bar for small screens. Slides in once the hero has
 * been scrolled past so the primary CTA is always one tap away.
 */
export const MobileCtaBar: React.FC = () => {
  const { data } = useCMS();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const accent = data.theme.accentColor || '#6B5CE7';
  const isLight = data.theme.bgMode === 'light-minimal';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden transition-transform duration-400 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ transitionProperty: 'transform' }}
    >
      <div
        className={`mx-3 mb-3 flex items-center gap-2 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl ${
          isLight ? 'bg-white/95 border-neutral-200' : 'bg-[#141419]/92 border-white/15'
        }`}
      >
        <a
          href={`tel:${data.config.phone.replace(/\s/g, '')}`}
          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
            isLight ? 'bg-neutral-100 text-neutral-700' : 'bg-white/[0.07] text-white'
          }`}
          aria-label={`Telepon ${data.config.phone}`}
        >
          <Phone className="w-4 h-4" />
        </a>

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            const el = document.querySelector('#contact');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-wide active:scale-[0.98] transition-transform"
          style={{
            backgroundColor: accent,
            color: accent === '#FFFFFF' ? '#000000' : '#FFFFFF',
            boxShadow: `0 8px 22px ${accent}40`,
          }}
        >
          <EditableText as="span" value="Let's Talk" overrideKey="nav.letsTalk" label="Teks tombol Let's Talk" />
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
