import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { Logo } from './Logo';
import { ArrowUpRight, Menu, X, Settings2 } from 'lucide-react';
import { EditableText } from './editorial/Editable';

export const Navbar: React.FC = () => {
  const { data, setIsAdminOpen } = useCMS();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'works', label: 'Works', href: '#portfolio' },
    { id: 'process', label: 'Process', href: '#workflow' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Single element brand mark */}
          <a
            href="#"
            className="flex items-center gap-3 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md"
            aria-label={`${data.config.name} Home`}
          >
            <Logo size="md" showSubtext={true} />
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-white transition-colors duration-150 relative py-1 group whitespace-nowrap shrink-0"
              >
                <EditableText as="span" value={link.label} overrideKey={`nav.${link.id}`} label="Menu navigasi" />
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-200" />
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions (CTA button + CMS Admin Studio launcher) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick CMS Admin Trigger */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/30"
              title="Open Headless CMS Studio (Shortcut: Alt+A)"
              aria-label="Open Headless CMS Admin"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px] tracking-wide">
                <EditableText as="span" value="CMS Studio" overrideKey="nav.cmsStudio" label="Teks CMS Studio" />
              </span>
            </button>

            {/* Primary Action CTA */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="group flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide active:scale-95 rounded-lg transition-all duration-200 whitespace-nowrap shadow-sm hover:opacity-90"
              style={{
                backgroundColor: data.theme.accentColor || '#FFFFFF',
                color: data.theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
              }}
            >
              <EditableText as="span" value="Let's Talk" overrideKey="nav.letsTalk" label="Teks tombol Let's Talk" />
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg focus-visible:ring-2 focus-visible:ring-white/20"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
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
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
            >
              <Settings2 className="w-4 h-4" />
              <EditableText as="span" value="Headless CMS Admin Panel" overrideKey="nav.cmsPanelMobile" label="Teks panel CMS" />
            </button>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-black bg-white rounded-lg hover:bg-neutral-200"
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
