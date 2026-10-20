/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
import { Footer } from './components/Footer';
import { AdminCMSModal } from './components/admin/AdminCMSModal';
import { EditorialToolbar } from './components/editorial/EditorialToolbar';
import { Settings2, Sparkles, CheckCircle2 } from 'lucide-react';
import { SectionKey } from './types/cms';

const MainContent: React.FC = () => {
  const { data, setIsAdminOpen, toastMessage } = useCMS();

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
        isOverallLight ? 'bg-white text-black selection:text-black' : 'bg-[#0A0A0A] text-white selection:text-white'
      }`}
    >
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Sections render dynamic flow */}
      <main className="flex-1">
        {activeSections.map((sec) => renderSection(sec.id))}
      </main>

      {/* Footer */}
      <Footer />

      {/* Headless CMS Studio Drawer / Modal */}
      <AdminCMSModal />

      {/* Editorial mode overlay toolbar */}
      <EditorialToolbar />

      {/* Floating CMS Studio Launcher at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40">
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
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#141419]/95 border border-white/20 text-white text-xs shadow-2xl backdrop-blur-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
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
