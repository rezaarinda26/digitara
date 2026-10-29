import React, { useState, useEffect, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';
import { Logo } from './Logo';
import { ArrowUpRight, Menu, X, Settings2 } from 'lucide-react';
import { EditableText } from './editorial/Editable';
import { withAlpha } from '../theme/swiss';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { CMS_ENABLED } from '../config/appMode';

export const Navbar: React.FC = () => {
  const { data, setIsAdminOpen, darkBg, isSectionLight, isSwiss, swissInk, swissPaper } = useCMS();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // At the top of the page the navbar floats over the Hero. In light mode the
  // Hero is white, so the navbar text must flip to dark to stay readable.
  const heroIsLight = isSectionLight('hero');
  const useDarkText = !scrolled && heroIsLight;
  const navLinkText = useDarkText ? 'text-neutral-600' : 'text-neutral-300';
  const navLinkHover = useDarkText ? 'hover:text-black' : 'hover:text-white';
  const navLinkUnderline = useDarkText
    ? 'bg-black'
    : isSwiss
    ? 'swiss-fill-paper'
    : 'bg-white';

  // Shared glass treatment for the desktop bar and the mobile drawer so both
  // surfaces always stay in sync (and avoid the backdrop-filter artifact).
  // The Swiss style system is flat: a solid ink block with a hairline rule
  // instead of a translucent gradient.
  const glassStyle: React.CSSProperties = isSwiss
    ? { backgroundColor: swissInk, backgroundImage: 'none' }
    : {
        backgroundColor: `${darkBg}E6`,
        backgroundImage:
          'linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.10) 100%)',
      };
  const hairline = isSwiss ? withAlpha(swissPaper, 0.35) : 'rgba(255,255,255,0.08)';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'services', section: 'services', label: 'Services', href: '#services' },
    { id: 'about', section: 'about', label: 'About', href: '#about' },
    { id: 'works', section: 'portfolio', label: 'Works', href: '#portfolio' },
    { id: 'process', section: 'workflow', label: 'Process', href: '#workflow' },
    { id: 'contact', section: 'contact', label: 'Contact', href: '#contact' },
  ];

  // The menu order is intentionally Services → About, but scroll-spy must
  // inspect sections in their actual document order. Otherwise About (which
  // appears above Services) overwrites Services after it has been detected.
  const spyIds = useMemo(() => ['about', 'services', 'portfolio', 'workflow', 'contact'], []);
  const { activeId: activeSection, progress: sectionProgress } = useScrollSpy(spyIds);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-[padding] duration-300 ${
        scrolled ? 'py-3.5' : 'py-5'
      }`}
    >
      {/* Glass layer without backdrop-filter. Chromium on Windows renders
          backdrop-filter with an occasional unfiltered vertical band; a
          translucent fill plus a soft gradient keeps the glass look without
          that artifact. */}
      {scrolled && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={glassStyle}
        />
      )}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: hairline }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Single element brand mark */}
          <a
            href="#"
            className="flex items-center gap-3 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md"
            aria-label={`${data.config.name} Home`}
          >
            <Logo
              size="md"
              showSubtext={true}
              textColor={useDarkText ? '#0A0A0A' : '#FFFFFF'}
              subtextColor={useDarkText ? '#525252' : '#A3A3A3'}
            />
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${navLinkText}`}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.section;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={`${navLinkHover} transition-colors duration-150 relative py-1 group whitespace-nowrap shrink-0 ${
                    isActive ? (useDarkText ? 'text-black' : 'text-white') : ''
                  }`}
                >
                  <EditableText as="span" value={link.label} overrideKey={`nav.${link.id}`} label="Menu navigasi" />
                  <span className="absolute bottom-0 left-0 h-[1.5px] w-full">
                    <span
                      className={`block h-full origin-left ${navLinkUnderline} ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                      }`}
                      style={{
                        transform: `scaleX(${isActive ? Math.max(0.08, sectionProgress) : 0})`,
                        transition: 'transform 120ms linear, opacity 250ms ease',
                      }}
                    />
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Actions (CTA button + CMS Admin Studio launcher) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick CMS Admin Trigger */}
            {CMS_ENABLED && <button
              onClick={() => setIsAdminOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/30 ${
                isSwiss
                  ? useDarkText
                    ? 'swiss-on-paper swiss-on-paper-soft swiss-rule-paper'
                    : 'swiss-on-ink swiss-on-ink-soft swiss-rule-ink'
                  : `rounded-lg ${
                      useDarkText
                        ? 'text-neutral-600 hover:text-black bg-black/[0.04] hover:bg-black/[0.08] border-black/[0.08]'
                        : 'text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08]'
                    }`
              }`}
              title="Open Headless CMS Studio (Shortcut: Alt+A)"
              aria-label="Open Headless CMS Admin"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px] tracking-wide">
                <EditableText as="span" value="CMS Studio" overrideKey="nav.cmsStudio" label="Teks CMS Studio" />
              </span>
            </button>}

            {/* Primary Action CTA */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className={`group flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide active:scale-95 transition-all duration-200 whitespace-nowrap ${
                isSwiss ? 'hover:opacity-85' : 'rounded-lg shadow-sm hover:opacity-90'
              }`}
              style={
                isSwiss
                  ? { backgroundColor: swissPaper, color: swissInk }
                  : {
                      backgroundColor: data.theme.accentColor || '#FFFFFF',
                      color: data.theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                    }
              }
            >
              <EditableText as="span" value="Let's Talk" overrideKey="nav.letsTalk" label="Teks tombol Let's Talk" />
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 ${isSwiss ? '' : 'rounded-lg'} focus-visible:ring-2 focus-visible:ring-white/20 ${
                useDarkText ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-x-0 top-[65px] border-b px-6 py-6 flex flex-col gap-4 animate-slide-in-top"
          style={{ ...glassStyle, borderBottomColor: hairline }}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-lg font-medium text-neutral-200 hover:text-white py-2 border-b border-white/5"
              >
                <EditableText as="span" value={link.label} overrideKey={`nav.${link.id}`} label="Menu navigasi" />
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            {CMS_ENABLED && <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-medium border ${
                isSwiss
                  ? 'swiss-on-ink swiss-on-ink-soft swiss-rule-ink'
                  : 'rounded-lg text-neutral-300 bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              <EditableText as="span" value="Headless CMS Admin Panel" overrideKey="nav.cmsPanelMobile" label="Teks panel CMS" />
            </button>}

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold ${
                isSwiss
                  ? 'swiss-on-paper swiss-fill-paper hover:opacity-90'
                  : 'text-black bg-white rounded-lg hover:bg-neutral-200'
              }`}
            >
              <EditableText as="span" value="Start A Project" overrideKey="nav.startProject" label="Teks Start A Project" />
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
