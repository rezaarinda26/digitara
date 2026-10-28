import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  CMSData,
  AgencyConfig,
  ThemeConfig,
  SectionMeta,
  SectionKey,
  HeroData,
  AboutData,
  ServicesData,
  MidBannerData,
  PortfolioData,
  WorkflowData,
  TestimonialsData,
  ContactData,
  ClientsData,
  ContactInquiry,
  ProjectItem,
  UiStyle,
} from '../types/cms';
import { DEFAULT_CMS_DATA, APPLIED_CMS_VERSION } from '../data/defaultCMS';
import { SWISS } from '../theme/swiss';
import { CMS_ENABLED } from '../config/appMode';

const STORAGE_KEY = 'digitara_headless_cms_v1';
const PUBLISHED_KEY = 'digitara_cms_published_v1';
const DRAFT_VERSION_KEY = 'digitara_cms_applied_version_v1';

/**
 * `?style=swiss` / `?style=classic` forces a style for this visit only. Handy
 * for previewing and QA without touching the value every visitor sees.
 */
const UI_STYLE_OVERRIDE: UiStyle | null = (() => {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('style');
  return value === 'swiss' || value === 'classic' ? value : null;
})();

/** Mixes a hex colour towards white. `amount` 0 = unchanged, 1 = white. */
const lightenHex = (hex: string, amount: number): string => {
  const m = (hex || '').replace('#', '').trim();
  if (m.length !== 6) return hex;
  const n = parseInt(m, 16);
  if (Number.isNaN(n)) return hex;
  const mix = (v: number) => Math.round(v * (1 - amount) + 255 * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

interface CMSContextType {
  data: CMSData;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  editorialMode: boolean;
  setEditorialMode: (active: boolean) => void;
  editorialUIHidden: boolean;
  setEditorialUIHidden: (hidden: boolean) => void;
  setEditorialOffset: (id: string, offset: { x: number; y: number }) => void;
  resetEditorialOffsets: () => void;
  resetEditorialTexts: () => void;
  setEditorialText: (id: string, value: string) => void;
  activeProjectModal: ProjectItem | null;
  setActiveProjectModal: (p: ProjectItem | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isSectionLight: (sectionKey: SectionKey) => boolean;
  darkBg: string;
  /** Active visual style system (classic or swiss), honouring ?style= override. */
  uiStyle: UiStyle;
  /** Shorthand for `uiStyle === 'swiss'`. */
  isSwiss: boolean;
  /** Swiss ink (dark surfaces), honouring Swiss Custom colours. */
  swissInk: string;
  /** Swiss paper (content sections), honouring Swiss Custom colours. */
  swissPaper: string;
  /** Swiss panel ink (strips / cards on ink), honouring Swiss Custom colours. */
  swissPanel: string;
  /** Non-null while a ?style= preview link is masking the CMS value. */
  uiStyleOverride: UiStyle | null;
  accentContrast: string;
  /** Lighter accent variant for text placed on dark surfaces. */
  accentText: string;

  updateConfig: (config: Partial<AgencyConfig>) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateSections: (sections: SectionMeta[]) => void;
  toggleSectionVisibility: (id: SectionKey) => void;
  moveSection: (id: SectionKey, direction: 'up' | 'down') => void;

  updateHero: (data: Partial<HeroData>) => void;
  updateAbout: (data: Partial<AboutData>) => void;
  updateServices: (data: Partial<ServicesData>) => void;
  updateMidBanner: (data: Partial<MidBannerData>) => void;
  updatePortfolio: (data: Partial<PortfolioData>) => void;
  updateWorkflow: (data: Partial<WorkflowData>) => void;
  updateTestimonials: (data: Partial<TestimonialsData>) => void;
  updateContact: (data: Partial<ContactData>) => void;
  updateClients: (data: Partial<ClientsData>) => void;

  addInquiry: (inquiry: {
    name: string;
    email: string;
    services: string[];
    budget: string;
    message: string;
  }) => void;
  updateInquiryStatus: (id: string, status: ContactInquiry['status']) => void;
  deleteInquiry: (id: string) => void;

  exportJSON: () => string;
  importJSON: (jsonString: string) => boolean;
  resetToDefault: () => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  publish: () => void;
  revertToPublished: () => void;
  applyToCode: () => Promise<boolean>;
  publishedAt: string | null;
  hasUnpublishedChanges: boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CMSData>(() => {
    try {
      const draftVersion = localStorage.getItem(DRAFT_VERSION_KEY);

      // Anything stored against an older applied snapshot is stale: both the
      // draft and the published snapshot must go, otherwise browsers that
      // visited before the last "Apply to Code" keep showing their old copy or
      // the "unpublished changes" badge. The code snapshot always wins.
      const stale = !!APPLIED_CMS_VERSION && draftVersion !== APPLIED_CMS_VERSION;
      if (stale) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PUBLISHED_KEY);
      }
      localStorage.setItem(DRAFT_VERSION_KEY, APPLIED_CMS_VERSION);

      const saved = stale ? null : localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme && (!parsed.theme.bgMode || parsed.theme.bgMode === 'obsidian' || parsed.theme.bgMode === 'carbon' || parsed.theme.bgMode === 'custom')) {
          parsed.theme.bgMode = 'reference-hybrid';
        }
        // Backfill sections that were introduced after this payload was saved.
        if (Array.isArray(parsed.sections)) {
          const existing = new Set(parsed.sections.map((s: any) => s.id));
          const missing = DEFAULT_CMS_DATA.sections.filter((s) => !existing.has(s.id));
          parsed.sections = [...parsed.sections, ...missing];
        }
        // Backfill any newly introduced fields with defaults from the current schema
        const mergedServices = {
          ...DEFAULT_CMS_DATA.services,
          ...parsed.services,
          items: (parsed.services?.items || DEFAULT_CMS_DATA.services.items).map((it: any) => {
            const def = DEFAULT_CMS_DATA.services.items.find((d) => d.id === it.id);
            return { ...it, features: it.features ?? def?.features ?? [] };
          }),
        };
        const mergedPortfolio = {
          ...DEFAULT_CMS_DATA.portfolio,
          ...parsed.portfolio,
          items: (parsed.portfolio?.items || DEFAULT_CMS_DATA.portfolio.items).map((it: any) => {
            const def = DEFAULT_CMS_DATA.portfolio.items.find((d) => d.id === it.id);
            const gallery =
              Array.isArray(it.gallery) && it.gallery.length > 0
                ? it.gallery
                : def?.gallery ?? (it.imageUrl ? [it.imageUrl] : []);
            return { ...it, gallery };
          }),
        };
        return {
          ...DEFAULT_CMS_DATA,
          ...parsed,
          theme: { ...DEFAULT_CMS_DATA.theme, ...parsed.theme },
          hero: { ...DEFAULT_CMS_DATA.hero, ...parsed.hero },
          services: mergedServices,
          portfolio: mergedPortfolio,
          clients: {
            ...DEFAULT_CMS_DATA.clients,
            ...(parsed.clients || {}),
            items: (parsed.clients?.items || DEFAULT_CMS_DATA.clients.items).map((it: any) => ({
              ...it,
              tagline: it.tagline ?? '',
              url: it.url ?? '',
            })),
          },
          editorial: {
            ...DEFAULT_CMS_DATA.editorial,
            ...parsed.editorial,
            offsets: { ...DEFAULT_CMS_DATA.editorial.offsets, ...(parsed.editorial?.offsets || {}) },
            texts: { ...DEFAULT_CMS_DATA.editorial.texts, ...(parsed.editorial?.texts || {}) },
          },
        };
      }
    } catch (e) {
      console.warn('Failed to parse CMS data from localStorage:', e);
    }
    return DEFAULT_CMS_DATA;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  // The ?style= preview link only wins until the user makes an explicit choice
  // in the CMS — see updateTheme().
  const [styleOverride, setStyleOverride] = useState<UiStyle | null>(UI_STYLE_OVERRIDE);
  const [activeAdminTab, setActiveAdminTab] = useState('theme');
  const [editorialMode, setEditorialMode] = useState(false);
  const [editorialUIHidden, setEditorialUIHidden] = useState(false);
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  /* ------------------------------------------------------------------ */
  /* History (undo / redo) + publish snapshot                          */
  /* ------------------------------------------------------------------ */

  const dataRef = useRef(data);
  dataRef.current = data;
  const storageErrorRef = useRef(false);
  const skipInitialSaveRef = useRef(true);

  const historyRef = useRef<{ past: CMSData[]; future: CMSData[]; lastPush: number }>({
    past: [],
    future: [],
    lastPush: 0,
  });
  const [, forceHistoryRender] = useState(0);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);

  const readPublished = (): (CMSData & { __publishedAt?: string }) | null => {
    try {
      const raw = localStorage.getItem(PUBLISHED_KEY);
      return raw ? (JSON.parse(raw) as CMSData & { __publishedAt?: string }) : null;
    } catch {
      return null;
    }
  };

  // Load the last published snapshot on boot
  useEffect(() => {
    const snap = readPublished();
    if (snap) {
      setPublishedAt(snap?.__publishedAt || null);
      setHasUnpublishedChanges(JSON.stringify(snap) !== JSON.stringify(dataRef.current));
    } else {
      // First run: treat the current state as published.
      try {
        localStorage.setItem(PUBLISHED_KEY, JSON.stringify({ ...dataRef.current, __publishedAt: new Date().toISOString() }));
        setPublishedAt(new Date().toISOString());
      } catch {
        /* storage full - ignore */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Applies a change, recording the previous state on the undo stack.
   * Rapid successive edits (typing) are coalesced into a single entry.
   */
  const commit = (updater: (prev: CMSData) => CMSData, message?: string) => {
    const now = Date.now();
    const hist = historyRef.current;

    if (now - hist.lastPush > 700) {
      hist.past.push(dataRef.current);
      if (hist.past.length > 60) hist.past.shift();
      hist.future = [];
    }
    hist.lastPush = now;

    setData((prev) => updater(prev));
    if (message) showToast(message);
  };

  const undo = () => {
    const hist = historyRef.current;
    if (hist.past.length === 0) {
      showToast('Tidak ada perubahan untuk di-undo');
      return;
    }
    const previous = hist.past.pop()!;
    hist.future.push(dataRef.current);
    hist.lastPush = 0;
    setData(previous);
    forceHistoryRender((v) => v + 1);
    showToast('Perubahan di-undo');
  };

  const redo = () => {
    const hist = historyRef.current;
    if (hist.future.length === 0) {
      showToast('Tidak ada perubahan untuk di-redo');
      return;
    }
    const next = hist.future.pop()!;
    hist.past.push(dataRef.current);
    hist.lastPush = 0;
    setData(next);
    forceHistoryRender((v) => v + 1);
    showToast('Perubahan di-redo');
  };

  const canUndo = historyRef.current.past.length > 0;
  const canRedo = historyRef.current.future.length > 0;

  const publish = () => {
    const stamp = new Date().toISOString();
    try {
      localStorage.setItem(PUBLISHED_KEY, JSON.stringify({ ...dataRef.current, __publishedAt: stamp }));
    } catch {
      showToast('Gagal menyimpan snapshot (storage penuh)');
      return;
    }
    setPublishedAt(stamp);
    setHasUnpublishedChanges(false);
    showToast('Konten dipublish — snapshot tersimpan');
  };

  /**
   * Dev-only: writes the current content into `src/data/appliedCMS.json` (via
   * the Vite middleware) and clears the local draft so the applied snapshot
   * becomes the single source of truth for every browser and every build.
   */
  const applyToCode = async (): Promise<boolean> => {
    try {
      const res = await fetch('/__cms/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataRef.current),
      });
      if (!res.ok) throw new Error(`Apply failed with status ${res.status}`);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PUBLISHED_KEY);
      localStorage.removeItem(DRAFT_VERSION_KEY);
      showToast('Konten diterapkan ke kode. Memuat ulang…');
      setTimeout(() => window.location.reload(), 500);
      return true;
    } catch (e) {
      console.error('Failed to apply CMS data to code:', e);
      showToast('Gagal menerapkan ke kode. Jalankan lewat `npm run dev` (dev server).');
      return false;
    }
  };

  const revertToPublished = () => {
    const snap = readPublished();
    if (!snap) {
      showToast('Belum ada snapshot yang dipublish');
      return;
    }
    const { __publishedAt, ...rest } = snap as any;
    historyRef.current.past.push(dataRef.current);
    historyRef.current.future = [];
    historyRef.current.lastPush = 0;
    setData(rest as CMSData);
    setPublishedAt(__publishedAt || null);
    setHasUnpublishedChanges(false);
    showToast('Kembali ke versi yang dipublish');
  };

  // Track whether the working copy differs from the published snapshot
  useEffect(() => {
    const snap = readPublished();
    if (!snap) return;
    const { __publishedAt, ...rest } = snap as any;
    setHasUnpublishedChanges(JSON.stringify(rest) !== JSON.stringify(data));
  }, [data]);

  // Ctrl/Cmd + Z / Shift + Z for undo & redo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (isTyping) return;
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() !== 'z') return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uiStyle: UiStyle = styleOverride ?? data.theme.uiStyle ?? 'classic';
  const isSwiss = uiStyle === 'swiss';

  const swissInk = SWISS.blue;
  const swissPaper = SWISS.paper;
  const swissPanel = SWISS.panel;

  // Helper to determine if a section should be rendered with Light or Dark theme
  const isSectionLight = (sectionKey: SectionKey): boolean => {
    // Swiss is always a duotone: hero / mid-banner / footer sit on ink, every
    // content section sits on paper — regardless of a stale Modern bgMode.
    if (isSwiss) {
      return ['about', 'services', 'portfolio', 'workflow', 'testimonials', 'contact', 'clients'].includes(sectionKey);
    }
    if (data.theme.bgMode === 'light-minimal') return true;
    if (data.theme.bgMode === 'dark-obsidian' || data.theme.bgMode === 'midnight') return false;
    // 'reference-hybrid' matches the uploaded reference image:
    // About, Services, Portfolio, Workflow, Testimonials, Contact are clean, crisp WHITE!
    // Hero, MidBanner, and Footer are Dark cinematic!
    return ['about', 'services', 'portfolio', 'workflow', 'testimonials', 'contact', 'clients'].includes(sectionKey);
  };

  // Shared dark background token so every dark surface reacts to the mode.
  // The Swiss style system is two-tone, so it overrides the dark surface.
  const darkBg = isSwiss
    ? swissInk
    : data.theme.bgMode === 'midnight'
      ? '#060814'
      : '#0A0A0A';

  // Text/icon color that reads well on top of the accent color.
  const accentContrast = data.theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF';

  // A slightly lighter variant of the accent, used whenever accent-coloured
  // TEXT sits on a dark surface. The raw brand accent only reaches ~4.1:1 on
  // near-black, which is just under the WCAG AA 4.5:1 threshold.
  const accentText = lightenHex(data.theme.accentColor || '#6B5CE7', 0.2);

  // Sync with localStorage
  useEffect(() => {
    // On boot there is nothing new to persist: the state either came from the
    // localStorage draft we just read or from the applied code snapshot. Writing
    // the applied snapshot back would be redundant and can overflow the quota
    // for content that is already baked into the bundle.
    if (skipInitialSaveRef.current) {
      skipInitialSaveRef.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(DRAFT_VERSION_KEY, APPLIED_CMS_VERSION);
      storageErrorRef.current = false;
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      // Only warn once per failure streak so typing doesn't spam toasts.
      if (!storageErrorRef.current) {
        storageErrorRef.current = true;
        showToast(
          'Penyimpanan browser penuh — perubahan TERAKHIR belum tersimpan. Export JSON sekarang atau perkecil gambar.'
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Apply theme variables dynamically to the document root
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.style.setProperty('--brand-accent', data.theme.accentColor);
    let bg = '#0A0A0A';
    if (isSwiss) bg = swissInk;
    else if (data.theme.bgMode === 'light-minimal') bg = '#FFFFFF';
    else if (data.theme.bgMode === 'midnight') bg = '#060814';
    root.style.setProperty('--brand-bg', bg);
    root.style.setProperty('--brand-secondary', bg);
    root.style.setProperty('--brand-tertiary', bg);
    root.style.setProperty('--brand-text', data.theme.bgMode === 'light-minimal' ? '#0A0A0A' : '#FFFFFF');
    body.style.backgroundColor = bg;
    body.classList.remove('custom-theme');

    if (isSwiss) {
      body.style.setProperty('--swiss-blue', swissInk);
      body.style.setProperty('--swiss-paper', swissPaper);
      body.style.setProperty('--swiss-panel', swissPanel);
    } else {
      body.style.removeProperty('--swiss-blue');
      body.style.removeProperty('--swiss-paper');
      body.style.removeProperty('--swiss-panel');
    }

    body.classList.toggle('light-mode', data.theme.bgMode === 'light-minimal');
    body.classList.toggle('style-swiss', isSwiss);
    // Typography is a first-class control in both styles: Swiss no longer
    // forces Archivo, it only seeds it when the style is first selected.
    root.style.setProperty('--font-heading', `'${data.theme.headingFont}', sans-serif`);
    root.style.setProperty('--font-body', `'${data.theme.bodyFont}', sans-serif`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.theme, isSwiss, swissInk, swissPaper, swissPanel]);

  // Keyboard shortcut: Alt + A or Cmd/Ctrl + Shift + A
  // - When editorial mode is OFF: toggle CMS Studio
  // - When editorial mode is ON: toggle editorial UI overlay (outlines, toolbar)
  //   so the user can preview the clean design underneath
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        if (!CMS_ENABLED) return;
        e.preventDefault();
        if (editorialMode) {
          setEditorialUIHidden((prev) => !prev);
        } else {
          setIsAdminOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorialMode]);

  useEffect(() => {
    document.body.classList.toggle('editorial-hidden', editorialUIHidden);
    return () => document.body.classList.remove('editorial-hidden');
  }, [editorialUIHidden]);

  const handleSetEditorialMode = (active: boolean) => {
    setEditorialMode(active);
    if (!active) setEditorialUIHidden(false);
  };

  // Exit editorial mode with Escape
  useEffect(() => {
    if (!editorialMode) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditorialMode(false);
        setEditorialUIHidden(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [editorialMode]);

  const updateConfig = (cfg: Partial<AgencyConfig>) => {
    commit((prev) => ({ ...prev, config: { ...prev.config, ...cfg } }), 'Agency settings updated');
  };

  const updateTheme = (thm: Partial<ThemeConfig>) => {
    // Picking a style in the CMS must beat a ?style= preview link: drop the
    // override (and the parameter itself) so what was just chosen is what
    // renders — otherwise the preview flag would silently mask it.
    if (thm.uiStyle !== undefined) {
      setStyleOverride(null);
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has('style')) {
          url.searchParams.delete('style');
          window.history.replaceState({}, '', url);
        }
      } catch {
        // Non-browser environment — the override state already covers it.
      }
    }

    const next: Partial<ThemeConfig> = { ...thm };
    const targetStyle = thm.uiStyle ?? uiStyle;
    const enteringSwiss = thm.uiStyle === 'swiss' && data.theme.uiStyle !== 'swiss';

    if (targetStyle === 'swiss') {
      // Seed the poster grotesk once, on the actual style change; afterwards
      // the user is free to pick any font for Swiss too.
      if (enteringSwiss) {
        next.headingFont = 'Archivo';
        next.bodyFont = 'Archivo';
      }
    }

    commit((prev) => ({ ...prev, theme: { ...prev.theme, ...next } }), 'Theme system updated');
  };

  const updateSections = (sections: SectionMeta[]) => {
    commit((prev) => ({ ...prev, sections }));
  };

  const toggleSectionVisibility = (id: SectionKey) => {
    commit(
      (prev) => ({
        ...prev,
        sections: prev.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
      }),
      'Section visibility toggled'
    );
  };

  const moveSection = (id: SectionKey, direction: 'up' | 'down') => {
    commit((prev) => {
      const sorted = [...prev.sections].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((s) => s.id === id);
      if (index < 0) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sorted.length) return prev;

      const currentSec = sorted[index];
      const targetSec = sorted[targetIndex];

      const currentOrder = currentSec.order;
      currentSec.order = targetSec.order;
      targetSec.order = currentOrder;

      return { ...prev, sections: [...sorted] };
    }, 'Section order re-aligned');
  };

  const updateHero = (hero: Partial<HeroData>) => {
    commit((prev) => ({ ...prev, hero: { ...prev.hero, ...hero } }), 'Hero section updated');
  };

  const updateAbout = (about: Partial<AboutData>) => {
    commit((prev) => ({ ...prev, about: { ...prev.about, ...about } }), 'About section updated');
  };

  const updateServices = (services: Partial<ServicesData>) => {
    commit((prev) => ({ ...prev, services: { ...prev.services, ...services } }), 'Services updated');
  };

  const updateMidBanner = (midBanner: Partial<MidBannerData>) => {
    commit((prev) => ({ ...prev, midBanner: { ...prev.midBanner, ...midBanner } }), 'Mid-Banner updated');
  };

  const updatePortfolio = (portfolio: Partial<PortfolioData>) => {
    commit((prev) => ({ ...prev, portfolio: { ...prev.portfolio, ...portfolio } }), 'Portfolio items updated');
  };

  const updateWorkflow = (workflow: Partial<WorkflowData>) => {
    commit((prev) => ({ ...prev, workflow: { ...prev.workflow, ...workflow } }), 'Creative workflow updated');
  };

  const updateTestimonials = (testimonials: Partial<TestimonialsData>) => {
    commit((prev) => ({ ...prev, testimonials: { ...prev.testimonials, ...testimonials } }), 'Testimonials updated');
  };

  const updateContact = (contact: Partial<ContactData>) => {
    commit((prev) => ({ ...prev, contact: { ...prev.contact, ...contact } }), 'Contact info updated');
  };

  const updateClients = (clients: Partial<ClientsData>) => {
    commit((prev) => ({ ...prev, clients: { ...prev.clients, ...clients } }), 'Client list updated');
  };

  const setEditorialOffset = (id: string, offset: { x: number; y: number }) => {
    commit(
      (prev) => ({
        ...prev,
        editorial: {
          ...prev.editorial,
          offsets: { ...(prev.editorial?.offsets || {}), [id]: offset },
        },
      })
    );
  };

  const resetEditorialOffsets = () => {
    commit((prev) => ({ ...prev, editorial: { ...prev.editorial, offsets: {} } }), 'Semua posisi elemen di-reset');
  };

  const resetEditorialTexts = () => {
    commit((prev) => ({ ...prev, editorial: { ...prev.editorial, texts: {} } }), 'Semua teks editorial di-reset');
  };

  const setEditorialText = (id: string, value: string) => {
    commit((prev) => ({
      ...prev,
      editorial: {
        ...prev.editorial,
        texts: { ...(prev.editorial?.texts || {}), [id]: value },
      },
    }));
  };

  const addInquiry = (inquiry: {
    name: string;
    email: string;
    services: string[];
    budget: string;
    message: string;
  }) => {
    const newInquiry: ContactInquiry = {
      id: `inq-${Date.now()}`,
      ...inquiry,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'new',
    };
    commit(
      (prev) => ({
        ...prev,
        inquiries: [newInquiry, ...(prev.inquiries || [])],
      }),
      'Brief received! We will reach out within 24 hours.'
    );
  };

  const updateInquiryStatus = (id: string, status: ContactInquiry['status']) => {
    commit(
      (prev) => ({
        ...prev,
        inquiries: prev.inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)),
      }),
      'Inquiry status updated'
    );
  };

  const deleteInquiry = (id: string) => {
    commit(
      (prev) => ({
        ...prev,
        inquiries: prev.inquiries.filter((inq) => inq.id !== id),
      }),
      'Inquiry removed'
    );
  };

  const exportJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.config && parsed.hero && parsed.services) {
        commit(() => parsed, 'Headless CMS state imported successfully!');
        return true;
      }
      showToast('Invalid JSON structure');
      return false;
    } catch (e) {
      console.error(e);
      showToast('Could not parse JSON');
      return false;
    }
  };

  const resetToDefault = () => {
    commit(() => DEFAULT_CMS_DATA, 'Reset to original default state');
  };

  return (
    <CMSContext.Provider
      value={{
        data,
        isAdminOpen,
        setIsAdminOpen,
        activeAdminTab,
        setActiveAdminTab,
        editorialMode,
        setEditorialMode: handleSetEditorialMode,
        editorialUIHidden,
        setEditorialUIHidden,
        setEditorialOffset,
        resetEditorialOffsets,
        resetEditorialTexts,
        setEditorialText,
        activeProjectModal,
        setActiveProjectModal,
        toastMessage,
        showToast,
        isSectionLight,
        darkBg,
        uiStyle,
        isSwiss,
        swissInk,
        swissPaper,
        swissPanel,
        uiStyleOverride: styleOverride,
        accentContrast,
        accentText,
        updateConfig,
        updateTheme,
        updateSections,
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
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        exportJSON,
        importJSON,
        resetToDefault,
        undo,
        redo,
        canUndo,
        canRedo,
        publish,
        revertToPublished,
        applyToCode,
        publishedAt,
        hasUnpublishedChanges,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
