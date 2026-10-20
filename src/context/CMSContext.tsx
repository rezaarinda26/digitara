import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ContactInquiry,
  ProjectItem,
} from '../types/cms';
import { DEFAULT_CMS_DATA } from '../data/defaultCMS';

const STORAGE_KEY = 'digitara_headless_cms_v1';

interface CMSContextType {
  data: CMSData;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  editorialMode: boolean;
  setEditorialMode: (active: boolean) => void;
  setEditorialOffset: (id: string, offset: { x: number; y: number }) => void;
  resetEditorialOffsets: () => void;
  resetEditorialTexts: () => void;
  setEditorialText: (id: string, value: string) => void;
  activeProjectModal: ProjectItem | null;
  setActiveProjectModal: (p: ProjectItem | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isSectionLight: (sectionKey: SectionKey) => boolean;

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
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CMSData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatic migration: if bgMode was old 'obsidian' or missing, default to 'reference-hybrid'
        if (parsed.theme && (!parsed.theme.bgMode || parsed.theme.bgMode === 'obsidian' || parsed.theme.bgMode === 'carbon')) {
          parsed.theme.bgMode = 'reference-hybrid';
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
  const [activeAdminTab, setActiveAdminTab] = useState('theme');
  const [editorialMode, setEditorialMode] = useState(false);
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Helper to determine if a section should be rendered with Light or Dark theme
  const isSectionLight = (sectionKey: SectionKey): boolean => {
    if (data.theme.bgMode === 'light-minimal') return true;
    if (data.theme.bgMode === 'dark-obsidian' || data.theme.bgMode === 'midnight') return false;
    // 'reference-hybrid' matches the uploaded reference image:
    // About, Services, Portfolio, Workflow, Testimonials, Contact are clean, crisp WHITE!
    // Hero, MidBanner, and Footer are Dark cinematic!
    return ['about', 'services', 'portfolio', 'workflow', 'testimonials', 'contact'].includes(sectionKey);
  };

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [data]);

  // Apply theme variables dynamically to the document root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-accent', data.theme.accentColor);
    root.style.setProperty('--font-heading', `'${data.theme.headingFont}', sans-serif`);
    root.style.setProperty('--font-body', `'${data.theme.bodyFont}', sans-serif`);

    let bg = '#0A0A0A';
    if (data.theme.bgMode === 'light-minimal') bg = '#FFFFFF';
    else if (data.theme.bgMode === 'midnight') bg = '#060814';
    else if (data.theme.bgMode === 'reference-hybrid') bg = '#0A0A0A';
    else if (data.theme.bgMode === 'dark-obsidian') bg = '#0A0A0A';

    root.style.setProperty('--brand-bg', bg);
    document.body.style.backgroundColor = bg;
  }, [data.theme]);

  // Keyboard shortcut: Alt + A or Cmd/Ctrl + Shift + A to open Headless CMS Studio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Exit editorial mode with Escape
  useEffect(() => {
    if (!editorialMode) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditorialMode(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [editorialMode]);

  const updateConfig = (cfg: Partial<AgencyConfig>) => {
    setData((prev) => ({ ...prev, config: { ...prev.config, ...cfg } }));
    showToast('Agency settings updated');
  };

  const updateTheme = (thm: Partial<ThemeConfig>) => {
    setData((prev) => ({ ...prev, theme: { ...prev.theme, ...thm } }));
    showToast('Theme system updated');
  };

  const updateSections = (sections: SectionMeta[]) => {
    setData((prev) => ({ ...prev, sections }));
  };

  const toggleSectionVisibility = (id: SectionKey) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    }));
    showToast(`Section visibility toggled`);
  };

  const moveSection = (id: SectionKey, direction: 'up' | 'down') => {
    setData((prev) => {
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
    });
    showToast('Section order re-aligned');
  };

  const updateHero = (hero: Partial<HeroData>) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, ...hero } }));
    showToast('Hero section updated');
  };

  const updateAbout = (about: Partial<AboutData>) => {
    setData((prev) => ({ ...prev, about: { ...prev.about, ...about } }));
    showToast('About section updated');
  };

  const updateServices = (services: Partial<ServicesData>) => {
    setData((prev) => ({ ...prev, services: { ...prev.services, ...services } }));
    showToast('Services updated');
  };

  const updateMidBanner = (midBanner: Partial<MidBannerData>) => {
    setData((prev) => ({ ...prev, midBanner: { ...prev.midBanner, ...midBanner } }));
    showToast('Mid-Banner updated');
  };

  const updatePortfolio = (portfolio: Partial<PortfolioData>) => {
    setData((prev) => ({ ...prev, portfolio: { ...prev.portfolio, ...portfolio } }));
    showToast('Portfolio items updated');
  };

  const updateWorkflow = (workflow: Partial<WorkflowData>) => {
    setData((prev) => ({ ...prev, workflow: { ...prev.workflow, ...workflow } }));
    showToast('Creative workflow updated');
  };

  const updateTestimonials = (testimonials: Partial<TestimonialsData>) => {
    setData((prev) => ({ ...prev, testimonials: { ...prev.testimonials, ...testimonials } }));
    showToast('Testimonials updated');
  };

  const updateContact = (contact: Partial<ContactData>) => {
    setData((prev) => ({ ...prev, contact: { ...prev.contact, ...contact } }));
    showToast('Contact info updated');
  };

  const setEditorialOffset = (id: string, offset: { x: number; y: number }) => {
    setData((prev) => ({
      ...prev,
      editorial: {
        ...prev.editorial,
        offsets: { ...(prev.editorial?.offsets || {}), [id]: offset },
      },
    }));
  };

  const resetEditorialOffsets = () => {
    setData((prev) => ({ ...prev, editorial: { ...prev.editorial, offsets: {} } }));
    showToast('Semua posisi elemen di-reset');
  };

  const resetEditorialTexts = () => {
    setData((prev) => ({ ...prev, editorial: { ...prev.editorial, texts: {} } }));
    showToast('Semua teks editorial di-reset');
  };

  const setEditorialText = (id: string, value: string) => {
    setData((prev) => ({
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
    setData((prev) => ({
      ...prev,
      inquiries: [newInquiry, ...(prev.inquiries || [])],
    }));
    showToast('Brief received! We will reach out within 24 hours.');
  };

  const updateInquiryStatus = (id: string, status: ContactInquiry['status']) => {
    setData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)),
    }));
    showToast('Inquiry status updated');
  };

  const deleteInquiry = (id: string) => {
    setData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.filter((inq) => inq.id !== id),
    }));
    showToast('Inquiry removed');
  };

  const exportJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.config && parsed.hero && parsed.services) {
        setData(parsed);
        showToast('Headless CMS state imported successfully!');
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
    setData(DEFAULT_CMS_DATA);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Reset to original default state');
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
        setEditorialMode,
        setEditorialOffset,
        resetEditorialOffsets,
        resetEditorialTexts,
        setEditorialText,
        activeProjectModal,
        setActiveProjectModal,
        toastMessage,
        showToast,
        isSectionLight,
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
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        exportJSON,
        importJSON,
        resetToDefault,
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
