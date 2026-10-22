import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCMS } from '../../context/CMSContext';
import {
  X,
  Palette,
  Layout,
  Type,
  Briefcase,
  FileText,
  MessageSquare,
  Mail,
  Award,
  Undo2,
  Redo2,
  History,
  Code2,
  Save,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Layers,
  Settings,
  Pencil,
} from 'lucide-react';
import { SectionKey, ProjectItem, ServiceItem } from '../../types/cms';
import { usePresence } from '../../hooks/usePresence';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { SmartImage } from '../common/SmartImage';

export const AdminCMSModal: React.FC = () => {
  const {
    data,
    isAdminOpen,
    setIsAdminOpen,
    activeAdminTab,
    setActiveAdminTab,
    setEditorialMode,
    updateConfig,
    updateTheme,
    toggleSectionVisibility,
    moveSection,
    updateHero,
    updateAbout,
    updateServices,
    updateMidBanner,
    updatePortfolio,
    updateWorkflow,
    updateTestimonials,
    updateContact,
    updateClients,
    updateInquiryStatus,
    deleteInquiry,
    exportJSON,
    importJSON,
    undo,
    redo,
    canUndo,
    canRedo,
    publish,
    revertToPublished,
    publishedAt,
    hasUnpublishedChanges,
    resetToDefault,
    showToast,
  } = useCMS();

  const [importJsonText, setImportJsonText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const { isMounted, isClosing } = usePresence(isAdminOpen, 220);
  const isLight = data.theme.bgMode === 'light-minimal';
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll while the CMS modal is open
  useEffect(() => {
    if (!isMounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMounted]);

  // Trap keyboard focus inside the modal while it is open
  useFocusTrap(isMounted, modalRef);

  if (!isMounted) return null;

  const tabs = [
    { id: 'overview', label: 'Dashboard & Inquiries', icon: Mail, count: data.inquiries?.length || 0 },
    { id: 'theme', label: 'Theme & Typography', icon: Palette },
    { id: 'sections', label: 'Section Reordering', icon: Layout },
    { id: 'branding', label: 'Agency Identity', icon: Settings },
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'about', label: 'About Agency', icon: FileText },
    { id: 'services', label: 'Services Manager', icon: Briefcase },
    { id: 'portfolio', label: 'Portfolio Projects', icon: Layers },
    { id: 'workflow', label: 'Creative Process', icon: Layout },
    { id: 'testimonials', label: 'Client Reviews', icon: MessageSquare },
    { id: 'clients', label: 'Client Wall', icon: Award, count: data.clients?.items?.length || 0 },
    { id: 'headless', label: 'Headless JSON API', icon: Code2 },
    { id: 'editorial', label: 'Admin Editorial Mode', icon: Pencil },
  ];

  const launchEditorialMode = () => {
    setEditorialMode(true);
    setIsAdminOpen(false);
    showToast('Mode editorial aktif — klik teks, gambar, atau geser elemen');
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(exportJSON());
    setCopySuccess(true);
    showToast('JSON copied to clipboard!');
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digitara-cms-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded CMS JSON export file');
  };

  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 backdrop-blur-xl ${isLight ? 'bg-neutral-900/50' : 'bg-black/90'} ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="DIGITARA Headless CMS Studio"
        className={`relative w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${isLight ? 'cms-light bg-white border-neutral-300' : 'bg-[#0D0D11] border-white/15'} ${isClosing ? 'animate-zoom-out' : 'animate-zoom-in'}`}
      >
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6B5CE7] flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  DIGITARA Studio Headless CMS
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE SYNC ACTIVE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Visual real-time content management system & API engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo / Redo */}
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-25 disabled:pointer-events-none transition-colors"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-25 disabled:pointer-events-none transition-colors"
              title="Redo (Ctrl+Shift+Z)"
              aria-label="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            {/* Publish / Revert */}
            <button
              onClick={publish}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                hasUnpublishedChanges
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
              }`}
              title={
                publishedAt
                  ? `Last published: ${new Date(publishedAt).toLocaleString()}`
                  : 'Publish a snapshot of the current content'
              }
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {hasUnpublishedChanges ? 'Publish' : 'Published'}
              </span>
            </button>

            <button
              onClick={revertToPublished}
              disabled={!hasUnpublishedChanges}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs transition-colors border border-white/5 disabled:opacity-30 disabled:pointer-events-none"
              title="Revert to the last published snapshot"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Revert</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all CMS content and theme back to default state?')) {
                  resetToDefault();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 text-xs transition-colors border border-white/5"
              title="Reset to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close CMS Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Sidebar + Right Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar */}
          <aside className="w-64 border-r border-white/10 bg-black/30 p-3 overflow-y-auto shrink-0 hidden md:block">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeAdminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      tab.id === 'editorial' ? launchEditorialMode() : setActiveAdminTab(tab.id)
                    }
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-[#6B5CE7] text-white shadow-md'
                        : tab.id === 'editorial'
                        ? 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10'
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-neutral-300'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Mobile Tab Selector */}
          <div className="md:hidden p-2 border-b border-white/10 bg-black/40 overflow-x-auto flex gap-1 shrink-0 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  tab.id === 'editorial' ? launchEditorialMode() : setActiveAdminTab(tab.id)
                }
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${
                  activeAdminTab === tab.id ? 'bg-[#6B5CE7] text-white' : 'text-neutral-400 bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Content Editor Area */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#0D0D11]">
            {/* TAB: OVERVIEW & INQUIRIES */}
            {activeAdminTab === 'overview' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Client Briefs & Inbound Inquiries</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Real-time leads submitted through the landing page contact form.
                  </p>
                </div>

                {data.inquiries.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/10 text-neutral-400">
                    No inquiries received yet. Submit a test brief in the Contact section!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="text-base font-bold text-white">{inq.name}</h4>
                            <span className="font-mono text-xs text-neutral-400">{inq.email}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                                inq.status === 'new'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : inq.status === 'contacted'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="text-neutral-500 font-mono">Budget:</span>
                            <span className="text-neutral-200 font-medium">{inq.budget}</span>
                            <span className="text-neutral-600">·</span>
                            <span className="text-neutral-500 font-mono">Services:</span>
                            <span className="text-neutral-300">{inq.services.join(', ')}</span>
                          </div>

                          <p className="text-xs sm:text-sm text-neutral-300 bg-black/40 p-3 rounded-lg border border-white/5 font-light">
                            "{inq.message}"
                          </p>

                          <div className="text-[11px] font-mono text-neutral-500">
                            Received: {inq.submittedAt}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              updateInquiryStatus(inq.id, e.target.value as any)
                            }
                            className="bg-black/60 border border-white/15 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                          >
                            <option value="new">Mark New</option>
                            <option value="contacted">Mark Contacted</option>
                            <option value="archived">Mark Archived</option>
                          </select>

                          <button
                            onClick={() => deleteInquiry(inq.id)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: THEME & TYPOGRAPHY */}
            {activeAdminTab === 'theme' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">Theme & Design System</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#6B5CE7]/30 text-white border border-[#6B5CE7]/50">
                      REAL-TIME SYNC
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Atur palet tampilan landing page (pilihan putih bersih sesuai referensi gambar, mode gelap, warna aksen kustom, dan tipografi).
                  </p>
                </div>

                {/* Live Preview Box */}
                <div
                  className="p-6 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
                  style={{
                    backgroundColor:
                      data.theme.bgMode === 'light-minimal'
                        ? '#FFFFFF'
                        : data.theme.bgMode === 'reference-hybrid'
                        ? '#F9FAFB'
                        : data.theme.bgMode === 'midnight'
                        ? '#060814'
                        : data.theme.bgMode === 'custom' && data.theme.customColors
                        ? data.theme.customColors.primary
                        : '#0A0A0A',
                    borderColor: 'rgba(255,255,255,0.15)',
                    color:
                      data.theme.bgMode === 'light-minimal' || data.theme.bgMode === 'reference-hybrid'
                        ? '#0A0A0A'
                        : '#FFFFFF',
                  }}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                      Live Preview Status
                    </span>
                    <h4 className="text-lg font-bold">
                      DIGITARA Nuansa Teknologi
                    </h4>
                    <p className="text-xs opacity-75 font-light max-w-md">
                    {data.theme.bgMode === 'reference-hybrid'
                      ? 'Mode Referensi Gambar Aktif: Seksi Konten (About, Services, Works, Form) Putih Bersih + Hero/Footer Gelap Sinematik.'
                      : data.theme.bgMode === 'light-minimal'
                      ? 'Mode Light Minimalist: Tampilan Putih Bersih di seluruh landing page.'
                      : data.theme.bgMode === 'custom'
                      ? 'Mode Custom Aktif: Seluruh warna mengikuti Primary/Secondary/Tertiary & Accent yang kamu atur.'
                      : 'Mode Gelap Aktif: Tampilan gelap pekat kontras tinggi.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-transform active:scale-95"
                      style={{
                        backgroundColor: data.theme.accentColor || '#6B5CE7',
                        color: data.theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                      }}
                    >
                      Aksen Tombol ({data.theme.accentColor})
                    </button>
                  </div>
                </div>

                {/* Background Mode */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                    Pilihan Mode Tema (Theme Mode)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: 'reference-hybrid',
                        badge: 'REKOMENDASI (SESUAI GAMBAR)',
                        label: 'Reference Hybrid (Dual Contrast)',
                        desc: 'Seksi Konten Putih Bersih (#FFFFFF) + Hero & Footer Gelap Sinematik persis referensi gambar.',
                        bgPreview: 'from-[#0A0A0A] to-[#FFFFFF]',
                        textColor: 'text-white',
                      },
                      {
                        id: 'light-minimal',
                        badge: 'PUTIH BERSIH',
                        label: 'Clean Light Minimalist',
                        desc: 'Tampilan serba putih bersih (#FFFFFF) untuk seluruh seksi konten.',
                        bgPreview: 'from-[#FFFFFF] to-[#F3F4F6]',
                        textColor: 'text-white',
                      },
                      {
                        id: 'dark-obsidian',
                        badge: 'DARK TOTAL',
                        label: 'Dark Mode Obsidian',
                        desc: 'Tampilan serba hitam pekat (#0A0A0A) dengan teks putih kontras tinggi.',
                        bgPreview: 'from-[#0A0A0A] to-[#171717]',
                        textColor: 'text-white',
                      },
                      {
                        id: 'midnight',
                        badge: 'COSMIC NAVY',
                        label: 'Midnight Blue & Slate',
                        desc: 'Palet biru dongker sinematik pekat bernuansa tech studio masa depan.',
                        bgPreview: 'from-[#060814] to-[#0F172A]',
                        textColor: 'text-white',
                      },
                      {
                        id: 'custom',
                        badge: 'CUSTOM',
                        label: 'Tema Kustom (Bebas)',
                        desc: 'Atur warna Primary, Secondary, Tertiary, dan Accent sesuai keinginan kamu.',
                        bgPreview: 'from-[#0A0A0A] via-[#151517] to-[#6B5CE7]',
                        textColor: 'text-white',
                      },
                    ].map((mode) => {
                      const isSelected = data.theme.bgMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => {
                            updateTheme({ bgMode: mode.id as any });
                          }}
                          className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                            isSelected
                              ? 'border-white bg-white/10 ring-2 ring-white/60 shadow-xl'
                              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300 font-semibold border border-white/10">
                              {mode.badge}
                            </span>
                            {isSelected && (
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            )}
                          </div>

                          <div
                            className={`cms-swatch w-full h-10 rounded-lg mb-3 border border-white/20 bg-gradient-to-r ${mode.bgPreview} shadow-inner flex items-center justify-center text-[11px] font-bold ${
                              mode.id === 'light-minimal' ? 'text-black' : 'text-white'
                            }`}
                          >
                            {mode.label}
                          </div>

                          <span className="text-sm font-semibold text-white block">
                            {mode.label}
                          </span>
                          <span className="text-xs text-neutral-400 font-light mt-1 block leading-relaxed">
                            {mode.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Colors */}
                {data.theme.bgMode === 'custom' && (
                  <div className="space-y-3">
                    <label className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                      Warna Kustom (Custom Theme)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { key: 'primary', label: 'Primary', desc: 'Latar Utama' },
                        { key: 'secondary', label: 'Secondary', desc: 'Panel/Seksi' },
                        { key: 'tertiary', label: 'Tertiary', desc: 'Card/Surface' },
                        { key: 'accent', label: 'Accent', desc: 'Tombol & Highlight' },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="text-xs font-semibold text-white">{item.label}</div>
                            <div className="text-[10px] text-neutral-500">{item.desc}</div>
                            <div className="text-[10px] font-mono text-neutral-400 mt-1">
                              {(data.theme.customColors as any)?.[item.key] || '#000000'}
                            </div>
                          </div>
                          <input
                            type="color"
                            value={(data.theme.customColors as any)?.[item.key] || '#000000'}
                            onChange={(e) => {
                              updateTheme({
                                customColors: {
                                  ...(data.theme.customColors || {
                                    primary: '#0A0A0A',
                                    secondary: '#0E0E10',
                                    tertiary: '#151517',
                                    accent: '#6B5CE7',
                                  }),
                                  [item.key]: e.target.value,
                                },
                                accentColor: item.key === 'accent' ? e.target.value : data.theme.accentColor,
                              });
                            }}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-white/20 bg-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accent Color */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                      Warna Aksen Brand (Accent Color)
                    </label>
                    <span className="text-xs font-mono text-neutral-300">
                      Hex: {data.theme.accentColor}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 items-center">
                    {[
                      { name: 'Digitara Violet', hex: '#6B5CE7' },
                      { name: 'Electric Indigo', hex: '#4F46E5' },
                      { name: 'Royal Cobalt', hex: '#2563EB' },
                      { name: 'Emerald Jade', hex: '#10B981' },
                      { name: 'Luxury Amber', hex: '#F59E0B' },
                      { name: 'Crimson Rose', hex: '#E11D48' },
                      { name: 'Obsidian Black', hex: '#0A0A0A' },
                      { name: 'Crisp White', hex: '#FFFFFF' },
                    ].map((c) => {
                      const isColorActive = data.theme.accentColor?.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => updateTheme({ accentColor: c.hex })}
                          className={`px-3 py-2 rounded-xl text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                            isColorActive
                              ? 'border-white bg-white/20 ring-1 ring-white'
                              : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08]'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/30 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-white font-medium">{c.name}</span>
                        </button>
                      );
                    })}

                    {/* Custom Color Input */}
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/15">
                      <span className="text-xs text-neutral-300">Pilih Bebas:</span>
                      <input
                        type="color"
                        value={data.theme.accentColor || '#6B5CE7'}
                        onChange={(e) => updateTheme({ accentColor: e.target.value })}
                        className="w-7 h-7 rounded border-none bg-transparent cursor-pointer"
                        title="Pilih warna aksen kustom"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-neutral-300 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: data.theme.accentColor }} />
                    <span className="leading-relaxed">
                      <strong>Cakupan Dampak Aksen Tinggi:</strong> Warna ini otomatis diaplikasikan secara kuat pada Tombol Utama (CTA Hero & Navbar), Angka Statistik (15+, 75+, 200+), Nomor & Harga Layanan (01, 02...), Tag Filter Portfolio, Kotak Matriks Logo, Efek Hover Kartu, Cahaya Latar (Ambient Glow), dan Formulir Brief Proyek.
                    </span>
                  </div>
                </div>

                {/* Typography System */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                      Heading Font Family
                    </label>
                    <select
                      value={data.theme.headingFont}
                      onChange={(e) => updateTheme({ headingFont: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none"
                    >
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                      <option value="Syne">Syne (High-Fashion Geometric)</option>
                      <option value="Outfit">Outfit (Crisp Tech Aesthetic)</option>
                      <option value="Space Grotesk">Space Grotesk (Neo-Brutalist)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                      Body Font Family
                    </label>
                    <select
                      value={data.theme.bodyFont}
                      onChange={(e) => updateTheme({ bodyFont: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none"
                    >
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      <option value="Manrope">Manrope</option>
                      <option value="JetBrains Mono">JetBrains Mono (Editorial Data)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SECTION REORDERING */}
            {activeAdminTab === 'sections' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Section Hierarchy & Visibility</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Re-order sections on the landing page or toggle visibility in real-time.
                  </p>
                </div>

                <div className="space-y-3">
                  {[...data.sections]
                    .sort((a, b) => a.order - b.order)
                    .map((section, idx, arr) => (
                      <div
                        key={section.id}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          section.enabled
                            ? 'bg-white/[0.03] border-white/10'
                            : 'bg-white/[0.01] border-white/5 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-neutral-500 w-6">
                            0{section.order}
                          </span>
                          <div>
                            <span className="text-sm font-semibold text-white">{section.name}</span>
                            <span className="block text-[11px] font-mono text-neutral-500">
                              ID: #{section.id}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveSection(section.id, 'up')}
                            disabled={idx === 0}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => moveSection(section.id, 'down')}
                            disabled={idx === arr.length - 1}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleSectionVisibility(section.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              section.enabled
                                ? 'bg-white/10 text-white hover:bg-white/20'
                                : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                            }`}
                            title={section.enabled ? 'Hide Section' : 'Show Section'}
                          >
                            {section.enabled ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB: BRANDING IDENTITY */}
            {activeAdminTab === 'branding' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Agency Profile & Coordinates</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Update core company naming, legal entities, contact endpoints, and social channels.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      value={data.config.name}
                      onChange={(e) => updateConfig({ name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Legal Subtitle
                    </label>
                    <input
                      type="text"
                      value={data.config.subtext}
                      onChange={(e) => updateConfig({ subtext: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Primary Email
                    </label>
                    <input
                      type="email"
                      value={data.config.email}
                      onChange={(e) => updateConfig({ email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={data.config.phone}
                      onChange={(e) => updateConfig({ phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Location / Base
                    </label>
                    <input
                      type="text"
                      value={data.config.location}
                      onChange={(e) => updateConfig({ location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: HERO SECTION */}
            {activeAdminTab === 'hero' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Hero Section Content</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Control the massive display typography, editorial statement, and background art.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Headline Primary (Top Line)
                    </label>
                    <input
                      type="text"
                      value={data.hero.headlineMain}
                      onChange={(e) => updateHero({ headlineMain: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Headline Accent (Bottom Line)
                    </label>
                    <input
                      type="text"
                      value={data.hero.headlineAccent}
                      onChange={(e) => updateHero({ headlineAccent: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Headline Text Size
                    </label>
                    <select
                      value={data.hero.headlineSize || 'sm'}
                      onChange={(e) => updateHero({ headlineSize: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none"
                    >
                      <option value="xs">Extra Small (2xl - 5xl)</option>
                      <option value="sm">Medium (4xl - 7xl) — Default</option>
                      <option value="md">Large (5xl - 9xl)</option>
                      <option value="lg">Extra Large (6xl - 11rem)</option>
                      <option value="xl">Maximum (7xl - 13rem)</option>
                      <option value="2xl">Ultra (8xl - 15rem)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Editorial Statement Text Size
                    </label>
                    <select
                      value={data.hero.editorialSize || 'md'}
                      onChange={(e) => updateHero({ editorialSize: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none"
                    >
                      <option value="sm">Small</option>
                      <option value="md">Medium — Default</option>
                      <option value="lg">Large</option>
                      <option value="xl">Extra Large</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Editorial Statement
                    </label>
                    <textarea
                      rows={3}
                      value={data.hero.editorialLead}
                      onChange={(e) => updateHero({ editorialLead: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Background Image URL / Asset Path
                    </label>
                    <input
                      type="text"
                      value={data.hero.bgImageUrl}
                      onChange={(e) => updateHero({ bgImageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Corner Floating Card settings */}
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-3">Floating Corner Showcase Card</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">
                        Card Title
                      </label>
                      <input
                        type="text"
                        value={data.hero.floatingCard.title}
                        onChange={(e) =>
                          updateHero({
                            floatingCard: { ...data.hero.floatingCard, title: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">
                        Category & Year
                      </label>
                      <input
                        type="text"
                        value={data.hero.floatingCard.category}
                        onChange={(e) =>
                          updateHero({
                            floatingCard: { ...data.hero.floatingCard, category: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ABOUT AGENCY */}
            {activeAdminTab === 'about' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-bold text-white">About Agency Content</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage agency manifesto, stats numbers, and capability badges.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Main Headline (Bold Text)
                    </label>
                    <input
                      type="text"
                      value={data.about.mainHeadlineBold}
                      onChange={(e) => updateAbout({ mainHeadlineBold: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Main Headline (Muted Continuation)
                    </label>
                    <input
                      type="text"
                      value={data.about.mainHeadlineMuted}
                      onChange={(e) => updateAbout({ mainHeadlineMuted: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Agency Narrative Paragraph
                    </label>
                    <textarea
                      rows={4}
                      value={data.about.paragraph}
                      onChange={(e) => updateAbout({ paragraph: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white resize-none"
                    />
                  </div>

                  {/* Featured Photo */}
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-white mb-3">Featured Photo</h4>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Image URL / Asset Path
                    </label>
                    <input
                      type="text"
                      value={data.about.imageUrl}
                      onChange={(e) => updateAbout({ imageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white font-mono"
                    />
                    {data.about.imageUrl && (
                      <SmartImage
                        src={data.about.imageUrl}
                        alt="About preview"
                        aspectRatio="4 / 5"
                        placeholderClassName="bg-neutral-900"
                        frameClassName="mt-3 w-32 rounded-xl overflow-hidden border border-white/10"
                      />
                    )}
                  </div>

                  {/* Capability Tags / Badges Editor */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-white">Capability Tags / Badges</h4>
                      <button
                        type="button"
                        onClick={() => updateAbout({ badges: [...data.about.badges, 'New Capability'] })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Tag</span>
                      </button>
                    </div>
                    {data.about.badges.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic">No tags yet. Click "Add Tag" to create one.</p>
                    ) : (
                      <div className="space-y-2">
                        {data.about.badges.map((badge, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={badge}
                              onChange={(e) => {
                                const newBadges = [...data.about.badges];
                                newBadges[bIdx] = e.target.value;
                                updateAbout({ badges: newBadges });
                              }}
                              className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateAbout({ badges: data.about.badges.filter((_, i) => i !== bIdx) })
                              }
                              className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Remove Tag"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stats Editor */}
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-white mb-3">Key Quantified Stats</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {data.about.stats.map((stat, sIdx) => (
                        <div key={stat.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Number Value
                          </label>
                          <input
                            type="text"
                            value={stat.number}
                            onChange={(e) => {
                              const newStats = [...data.about.stats];
                              newStats[sIdx].number = e.target.value;
                              updateAbout({ stats: newStats });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-mono font-bold mb-2"
                          />
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...data.about.stats];
                              newStats[sIdx].label = e.target.value;
                              updateAbout({ stats: newStats });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-xs text-neutral-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SERVICES MANAGER */}
            {activeAdminTab === 'services' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Services & Pricing Architecture</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Manage agency service rows, deliverables tags, prices, and hover preview graphics.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const newSrv: ServiceItem = {
                        id: `srv-${Date.now()}`,
                        number: `0${data.services.items.length + 1}`,
                        name: 'New Custom Service',
                        tags: ['Strategy', 'Execution'],
                        features: [
                          'Dedicated Lead Art Director',
                          'Complete Figma & Code Deliverables',
                          '2 Rounds Revision & Post-launch QA',
                        ],
                        startingPrice: '$800',
                        previewImage: '/src/assets/images/project_velvet_commerce_1792030863190.jpg',
                        description: 'Detailed service description and client deliverables.',
                      };
                      updateServices({ items: [...data.services.items, newSrv] });
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.services.items.map((srv, idx) => (
                    <div
                      key={srv.id}
                      className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-neutral-500">Service 0{idx + 1}</span>
                        <button
                          onClick={() => {
                            updateServices({
                              items: data.services.items.filter((s) => s.id !== srv.id),
                            });
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Service Name
                          </label>
                          <input
                            type="text"
                            value={srv.name}
                            onChange={(e) => {
                              const newItems = [...data.services.items];
                              newItems[idx].name = e.target.value;
                              updateServices({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Starting Price
                          </label>
                          <input
                            type="text"
                            value={srv.startingPrice}
                            onChange={(e) => {
                              const newItems = [...data.services.items];
                              newItems[idx].startingPrice = e.target.value;
                              updateServices({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-mono font-bold"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Tags & Deliverables (Comma-separated)
                          </label>
                          <input
                            type="text"
                            value={srv.tags.join(', ')}
                            onChange={(e) => {
                              const newItems = [...data.services.items];
                              newItems[idx].tags = e.target.value.split(',').map((t) => t.trim());
                              updateServices({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-neutral-300"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Included Features (Comma-separated)
                          </label>
                          <input
                            type="text"
                            value={(srv.features || []).join(', ')}
                            onChange={(e) => {
                              const newItems = [...data.services.items];
                              newItems[idx].features = e.target.value.split(',').map((t) => t.trim());
                              updateServices({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-neutral-300"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Hover Preview Image URL
                          </label>
                          <input
                            type="text"
                            value={srv.previewImage}
                            onChange={(e) => {
                              const newItems = [...data.services.items];
                              newItems[idx].previewImage = e.target.value;
                              updateServices({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-neutral-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PORTFOLIO PROJECTS */}
            {activeAdminTab === 'portfolio' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Selected Projects Portfolio</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Manage visual case studies, hero images, client metrics, and deep dives.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const newProj: ProjectItem = {
                        id: `proj-${Date.now()}`,
                        title: 'New Flagship Project',
                        year: '2026',
                        category: 'Web Design',
                        tags: ['UI/UX', 'Engineering'],
                        imageUrl: '/src/assets/images/project_aurora_sunflower_1792030864092.jpg',
                        gallery: ['/src/assets/images/project_aurora_sunflower_1792030864092.jpg'],
                        summary: 'Brief summary of the creative endeavor.',
                        client: 'Client Studio',
                        challenge: 'Design challenge details.',
                        solution: 'Engineered solution and creative execution.',
                        metrics: '+120% conversion bump',
                      };
                      updatePortfolio({ items: [newProj, ...data.portfolio.items] });
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.portfolio.items.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-neutral-400">
                          {proj.category} · ©{proj.year}
                        </span>
                        <button
                          onClick={() => {
                            updatePortfolio({
                              items: data.portfolio.items.filter((p) => p.id !== proj.id),
                            });
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const newItems = [...data.portfolio.items];
                              newItems[idx].title = e.target.value;
                              updatePortfolio({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={proj.category}
                            onChange={(e) => {
                              const newItems = [...data.portfolio.items];
                              newItems[idx].category = e.target.value;
                              updatePortfolio({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Year
                          </label>
                          <input
                            type="text"
                            value={proj.year}
                            onChange={(e) => {
                              const newItems = [...data.portfolio.items];
                              newItems[idx].year = e.target.value;
                              updatePortfolio({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Image URL / Generated Asset
                          </label>
                          <input
                            type="text"
                            value={proj.imageUrl}
                            onChange={(e) => {
                              const newItems = [...data.portfolio.items];
                              newItems[idx].imageUrl = e.target.value;
                              updatePortfolio({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-neutral-400 font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-[11px] font-mono text-neutral-400">
                              Project Gallery (main + supporting screenshots)
                            </label>
                            <button
                              onClick={() => {
                                const newItems = [...data.portfolio.items];
                                const g = newItems[idx].gallery || [];
                                newItems[idx].gallery = [...g, proj.imageUrl];
                                updatePortfolio({ items: newItems });
                              }}
                              className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                            >
                              <Plus className="w-3 h-3" /> Add Image
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(proj.gallery || []).map((img, gIdx) => (
                              <div key={gIdx} className="flex items-center gap-2">
                                <SmartImage
                                  src={img}
                                  alt=""
                                  aspectRatio="4 / 3"
                                  placeholderClassName="bg-neutral-900"
                                  frameClassName="w-12 h-9 rounded-md border border-white/10 shrink-0"
                                />
                                <input
                                  type="text"
                                  value={img}
                                  onChange={(e) => {
                                    const newItems = [...data.portfolio.items];
                                    const g = [...(newItems[idx].gallery || [])];
                                    g[gIdx] = e.target.value;
                                    newItems[idx].gallery = g;
                                    if (gIdx === 0) newItems[idx].imageUrl = e.target.value;
                                    updatePortfolio({ items: newItems });
                                  }}
                                  className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-neutral-400 font-mono"
                                />
                                {gIdx === 0 ? (
                                  <span className="text-[10px] font-mono text-emerald-400 px-2 shrink-0">COVER</span>
                                ) : (
                                  <button
                                    onClick={() => {
                                      const newItems = [...data.portfolio.items];
                                      const g = [...(newItems[idx].gallery || [])];
                                      const [moved] = g.splice(gIdx, 1);
                                      g.unshift(moved);
                                      newItems[idx].gallery = g;
                                      newItems[idx].imageUrl = moved;
                                      updatePortfolio({ items: newItems });
                                    }}
                                    className="text-[10px] text-neutral-400 hover:text-white px-2 shrink-0"
                                    title="Jadikan cover"
                                  >
                                    Set Cover
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    const newItems = [...data.portfolio.items];
                                    const g = (newItems[idx].gallery || []).filter((_, i) => i !== gIdx);
                                    newItems[idx].gallery = g;
                                    if (gIdx === 0 && g[0]) newItems[idx].imageUrl = g[0];
                                    updatePortfolio({ items: newItems });
                                  }}
                                  className="text-rose-400 hover:text-rose-300 shrink-0"
                                  title="Hapus gambar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            {(proj.gallery || []).length === 0 && (
                              <p className="text-[11px] text-neutral-500">
                                Belum ada gambar galeri. Klik "Add Image".
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Summary
                          </label>
                          <input
                            type="text"
                            value={proj.summary}
                            onChange={(e) => {
                              const newItems = [...data.portfolio.items];
                              newItems[idx].summary = e.target.value;
                              updatePortfolio({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-neutral-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: WORKFLOW STEPS */}
            {activeAdminTab === 'workflow' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Creative Workflow Process</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Edit the 4-step sequence from research to final production deployment.
                  </p>
                </div>

                <div className="space-y-4">
                  {data.workflow.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-neutral-400">Step 0{idx + 1}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Step Title
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => {
                              const newSteps = [...data.workflow.steps];
                              newSteps[idx].title = e.target.value;
                              updateWorkflow({ steps: newSteps });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Icon
                          </label>
                          <select
                            value={step.icon}
                            onChange={(e) => {
                              const newSteps = [...data.workflow.steps];
                              newSteps[idx].icon = e.target.value as any;
                              updateWorkflow({ steps: newSteps });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white"
                          >
                            <option value="search">Search / Compass</option>
                            <option value="pen">Pen / Concept</option>
                            <option value="layers">Layers / Design</option>
                            <option value="rocket">Rocket / Launch</option>
                          </select>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={step.description}
                            onChange={(e) => {
                              const newSteps = [...data.workflow.steps];
                              newSteps[idx].description = e.target.value;
                              updateWorkflow({ steps: newSteps });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-neutral-300 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TESTIMONIALS */}
            {activeAdminTab === 'testimonials' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Client Testimonials & Ratings</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Manage client quotes, founder names, company titles, and avatars.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.testimonials.items.map((t, idx) => (
                    <div
                      key={t.id}
                      className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Author Name
                          </label>
                          <input
                            type="text"
                            value={t.author}
                            onChange={(e) => {
                              const newItems = [...data.testimonials.items];
                              newItems[idx].author = e.target.value;
                              updateTestimonials({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Role & Company
                          </label>
                          <input
                            type="text"
                            value={`${t.role}, ${t.company}`}
                            onChange={(e) => {
                              const parts = e.target.value.split(',');
                              const newItems = [...data.testimonials.items];
                              newItems[idx].role = parts[0]?.trim() || '';
                              newItems[idx].company = parts[1]?.trim() || '';
                              updateTestimonials({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Rating (1 - 5)
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={t.rating}
                            onChange={(e) => {
                              const newItems = [...data.testimonials.items];
                              newItems[idx].rating = Number(e.target.value);
                              updateTestimonials({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Quote Content
                          </label>
                          <textarea
                            rows={3}
                            value={t.quote}
                            onChange={(e) => {
                              const newItems = [...data.testimonials.items];
                              newItems[idx].quote = e.target.value;
                              updateTestimonials({ items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-neutral-200 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CLIENT WALL */}
            {activeAdminTab === 'clients' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Trusted By — Client Wall</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Daftar klien yang tampil di section &ldquo;Trusted By&rdquo;.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase text-neutral-400 tracking-wider">Badge</label>
                  <input
                    type="text"
                    value={data.clients?.badge || ''}
                    onChange={(e) => updateClients({ badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase text-neutral-400 tracking-wider">Headline</label>
                  <input
                    type="text"
                    value={data.clients?.headline || ''}
                    onChange={(e) => updateClients({ headline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                      Klien ({data.clients?.items?.length || 0})
                    </label>
                    <button
                      onClick={() =>
                        updateClients({
                          items: [
                            ...(data.clients?.items || []),
                            {
                              id: `client-${Date.now()}`,
                              name: 'New Client',
                              tagline: 'Industry',
                              url: '',
                            },
                          ],
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Client
                    </button>
                  </div>

                  {(data.clients?.items || []).map((client, cIdx) => (
                    <div
                      key={client.id}
                      className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={client.name}
                            placeholder="Nama klien"
                            onChange={(e) => {
                              const next = [...(data.clients?.items || [])];
                              next[cIdx] = { ...next[cIdx], name: e.target.value };
                              updateClients({ items: next });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-semibold"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={client.tagline}
                              placeholder="Tagline / industri"
                              onChange={(e) => {
                                const next = [...(data.clients?.items || [])];
                                next[cIdx] = { ...next[cIdx], tagline: e.target.value };
                                updateClients({ items: next });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-[11px] text-neutral-300"
                            />
                            <input
                              type="text"
                              value={client.url}
                              placeholder="https:// (opsional)"
                              onChange={(e) => {
                                const next = [...(data.clients?.items || [])];
                                next[cIdx] = { ...next[cIdx], url: e.target.value };
                                updateClients({ items: next });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-[11px] text-neutral-400 font-mono"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            updateClients({
                              items: (data.clients?.items || []).filter((_, i) => i !== cIdx),
                            })
                          }
                          className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors shrink-0"
                          title="Remove Client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: HEADLESS JSON API & SYNC */}
            {activeAdminTab === 'headless' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Headless CMS Engine & JSON API</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Export your complete website content model, import backup schemas, or integrate with headless API pipelines.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopyJSON}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4" />}
                    <span>{copySuccess ? 'Copied JSON!' : 'Copy Full JSON'}</span>
                  </button>

                  <button
                    onClick={handleDownloadJSON}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .json Schema</span>
                  </button>
                </div>

                {/* Per-section export */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="text-sm font-semibold text-white">Export per Section</h4>
                  <p className="text-xs text-neutral-400">
                    Unduh satu section sebagai payload JSON terpisah — berguna untuk migrasi bertahap atau
                    sinkronisasi parsial.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ['config', 'Agency Config'],
                        ['theme', 'Theme'],
                        ['sections', 'Section Order'],
                        ['hero', 'Hero'],
                        ['about', 'About'],
                        ['services', 'Services'],
                        ['midBanner', 'Mid Banner'],
                        ['portfolio', 'Portfolio'],
                        ['workflow', 'Workflow'],
                        ['testimonials', 'Testimonials'],
                        ['clients', 'Clients'],
                        ['contact', 'Contact'],
                        ['editorial', 'Editorial Overrides'],
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          const payload = JSON.stringify(
                            { [key]: (data as any)[key] ?? null },
                            null,
                            2
                          );
                          const blob = new Blob([payload], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `digitara-${key}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          showToast(`${label} exported`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[11px] font-medium transition-colors border border-white/5"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Import JSON Box */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="text-sm font-semibold text-white">Import Headless JSON Payload</h4>
                  <p className="text-xs text-neutral-400">
                    Paste an exported JSON payload to update the entire application content immediately.
                  </p>
                  <textarea
                    rows={6}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder="Paste valid JSON schema here..."
                    className="w-full p-3 rounded-lg bg-black/60 border border-white/15 text-xs font-mono text-neutral-300 resize-none"
                  />
                  <button
                    onClick={() => {
                      if (importJsonText.trim()) {
                        const ok = importJSON(importJsonText);
                        if (ok) setImportJsonText('');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6B5CE7] hover:bg-[#5A4CC7] text-white text-xs font-semibold transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Apply Imported Schema</span>
                  </button>
                </div>

                {/* Live Schema Preview */}
                <div>
                  <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                    Active JSON State (Live Output)
                  </h4>
                  <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-[11px] font-mono text-neutral-400 overflow-x-auto max-h-72">
                    {exportJSON()}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB: ADMIN EDITORIAL MODE (falls back here if reached directly) */}
            {activeAdminTab === 'editorial' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Admin Editorial Mode</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Edit konten langsung di halaman — klik teks untuk mengetik ulang, klik gambar untuk
                    mengganti foto, dan geser elemen untuk mengatur posisinya.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-start gap-3 text-sm text-neutral-300">
                    <Pencil className="w-5 h-5 text-[#6B5CE7] shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <p><strong className="text-white">Klik teks</strong> — kursor berubah, ketik ulang langsung, klik di luar untuk menyimpan.</p>
                      <p><strong className="text-white">Klik gambar</strong> — pilih file foto dari perangkat, otomatis dikompres & disimpan.</p>
                      <p><strong className="text-white">Geser elemen (shape/button)</strong> — tahan lalu pindahkan; posisi tersimpan otomatis.</p>
                      <p><strong className="text-white">Double klik</strong> elemen yang digeser untuk reset posisinya. <strong className="text-white">Esc</strong> untuk keluar.</p>
                    </div>
                  </div>

                  <button
                    onClick={launchEditorialMode}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Aktifkan Mode Editorial</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>,
    document.body
  );
};
