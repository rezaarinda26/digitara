/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { CMSProvider, useCMS } from './context/CMSContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { MidBanner } from './components/MidBanner';
import { Portfolio } from './components/Portfolio';
import { Workflow } from './components/Workflow';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Clients } from './components/Clients';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollProgress } from './components/common/ScrollProgress';
import { CustomCursor } from './components/common/CustomCursor';
import { BackToTop } from './components/common/BackToTop';
import { MobileCtaBar } from './components/common/MobileCtaBar';
import { CommandPalette } from './components/common/CommandPalette';
import { useSeo } from './hooks/useSeo';
import { Settings2, Sparkles, CheckCircle2 } from 'lucide-react';
import { SectionKey } from './types/cms';

// Heavy admin surfaces are code-split: the chunks are only downloaded the
// first time the user actually opens them, keeping the initial bundle small.
const AdminCMSModal = lazy(() =>
  import('./components/admin/AdminCMSModal').then((m) => ({ default: m.AdminCMSModal }))
);
const EditorialToolbar = lazy(() =>
  import('./components/editorial/EditorialToolbar').then((m) => ({ default: m.EditorialToolbar }))
);

const SECTION_LABELS: Record<SectionKey, string> = {
  hero: 'Hero Showcase',
  about: 'About Agency',
  services: 'Services & Rates',
  midBanner: 'Cinematic Mid-Banner',
  portfolio: 'Selected Projects',
  workflow: 'Creative Workflow',
  testimonials: 'Client Testimonials',
  contact: 'Contact & Brief',
  clients: 'Trusted By Clients',
  footer: 'Footer',
};

const MainContent: React.FC = () => {
  const { data, setIsAdminOpen, toastMessage, darkBg, isAdminOpen, editorialMode, isSectionLight, hasUnpublishedChanges } = useCMS();

  // Sync document head (title, meta, JSON-LD) with the live CMS content
  useSeo();

  // Only mount the lazy chunks once they have been requested at least once,
  // so their code is never fetched during the initial page load.
  const [cmsRequested, setCmsRequested] = useState(false);
  const [editorialRequested, setEditorialRequested] = useState(false);

  useEffect(() => {
    if (isAdminOpen) setCmsRequested(true);
  }, [isAdminOpen]);

  useEffect(() => {
    if (editorialMode) setEditorialRequested(true);
  }, [editorialMode]);

  // Map section keys to actual components
  const renderSection = (id: SectionKey) => {
    switch (id) {
      case 'hero':
        return <Hero key="hero" />;
      case 'about':
        return <About key="about" />;
      case 'services':
        return <Services key="services" />;
      case 'midBanner':
        return <MidBanner key="midBanner" />;
      case 'portfolio':
        return <Portfolio key="portfolio" />;
      case 'workflow':
        return <Workflow key="workflow" />;
      case 'testimonials':
        return <Testimonials key="testimonials" />;
      case 'contact':
        return <Contact key="contact" />;
      case 'clients':
        return <Clients key="clients" />;
      default:
        return null;
    }
  };

  // Sort enabled sections according to their order in CMS
  const activeSections = [...data.sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const isOverallLight = data.theme.bgMode === 'light-minimal';

  return (
    <div
      className={`min-h-screen selection:bg-[#6B5CE7]/30 flex flex-col font-sans relative transition-colors duration-500 ${
        isOverallLight ? 'bg-white text-black selection:text-black' : 'text-white selection:text-white'
      }`}
      style={isOverallLight ? undefined : { backgroundColor: darkBg }}
    >
      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Accent cursor (desktop, fine pointers only) */}
      <CustomCursor />

      {/* Back to top with scroll-progress ring */}
      <BackToTop />

      {/* Sticky mobile CTA bar */}
      <MobileCtaBar />

      {/* Command palette (Ctrl / Cmd + K) */}
      <CommandPalette />

      {/* Skip to content for keyboard & screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-[#6B5CE7] focus:text-white focus:text-sm focus:font-semibold focus:shadow-2xl"
      >
        Skip to content
      </a>

      {/* Sticky Top Navbar */}
      <ErrorBoundary label="Navigation" compact>
        <Navbar />
      </ErrorBoundary>

      {/* Main Sections render dynamic flow */}
      <main id="main-content" className="flex-1">
        {activeSections.map((sec) => (
          <div
            key={sec.id}
            className={isSectionLight(sec.id) ? 'light-section' : undefined}
          >
            <ErrorBoundary label={SECTION_LABELS[sec.id] ?? sec.id} compact>
              {renderSection(sec.id)}
            </ErrorBoundary>
          </div>
        ))}
      </main>

      {/* Footer */}
      <ErrorBoundary label="Footer" compact>
        <Footer />
      </ErrorBoundary>

      {/* Headless CMS Studio Drawer / Modal */}
      {cmsRequested && (
        <ErrorBoundary label="CMS Studio" compact>
          <Suspense fallback={null}>
            <AdminCMSModal />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Editorial mode overlay toolbar */}
      {editorialRequested && (
        <ErrorBoundary label="Editorial toolbar" compact>
          <Suspense fallback={null}>
            <EditorialToolbar />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Floating CMS Studio Launcher at Bottom-Right.
          On small screens it sits above the sticky mobile CTA bar so the two
          never overlap. */}
      <div className="fixed bottom-24 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#141419]/90 hover:bg-[#1E1E24] text-white border border-white/15 hover:border-white/30 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
          title="Open DIGITARA Headless CMS Studio (Shortcut: Alt+A)"
        >
          <div className="w-5 h-5 rounded-full bg-[#6B5CE7] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            <Settings2 className="w-3 h-3" />
          </div>
          <span className="text-xs font-semibold tracking-wide">CMS Studio</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-neutral-400">
            Alt+A
          </span>
          {data.inquiries?.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Live System Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-4 z-50 animate-slide-in-bottom sm:bottom-6 sm:left-6">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#141419]/95 border border-white/20 text-white text-xs shadow-2xl backdrop-blur-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Unpublished changes indicator */}
      {hasUnpublishedChanges && !isAdminOpen && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 animate-slide-in-top">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] font-medium backdrop-blur-md shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Preview mode · there are unpublished changes
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <CMSProvider>
      <MainContent />
    </CMSProvider>
  );
}
