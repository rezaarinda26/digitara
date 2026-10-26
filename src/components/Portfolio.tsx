import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight, X, Sparkle, Pencil, Camera, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectItem } from '../types/cms';
import { EditableText, EditableImage, ImageUploadTrigger } from './editorial/Editable';
import { usePresence } from '../hooks/usePresence';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Reveal } from './common/Reveal';

type CardLayout = { span: string; size: 'lg' | 'md' | 'sm' };

const SPAN_CLASS = {
  3: 'sm:col-span-1 lg:col-span-3',
  4: 'sm:col-span-1 lg:col-span-4',
  5: 'sm:col-span-1 lg:col-span-5',
  7: 'sm:col-span-1 lg:col-span-7',
  8: 'sm:col-span-2 lg:col-span-8 lg:col-start-3',
} as const;

const CARD_TILTS = [-3.4, 2.2, -1.8, 2.8, -2.6, 2, -2.2, 3, -2.8];

const ROW_PATTERNS: (3 | 4 | 5)[][] = [
  [5, 4, 3],
  [3, 4, 5],
  [4, 5, 3],
];

const buildCardLayouts = (count: number): CardLayout[] => {
  const make = (span: keyof typeof SPAN_CLASS, size: CardLayout['size']): CardLayout => ({
    span: SPAN_CLASS[span],
    size,
  });

  const layouts: CardLayout[] = [];
  let remaining = count;
  let row = 0;

  while (remaining > 0) {
    if (remaining === 1) {
      layouts.push(make(8, 'lg'));
      remaining = 0;
    } else if (remaining === 2) {
      layouts.push(make(7, 'lg'), make(5, 'md'));
      remaining = 0;
    } else {
      const pattern = ROW_PATTERNS[row % ROW_PATTERNS.length];
      layouts.push(...pattern.map((span) => make(span, span >= 5 ? 'lg' : span === 4 ? 'md' : 'sm')));
      remaining -= 3;
      row += 1;
    }
  }

  // On the 2-column tablet grid an odd card count leaves a lone half-width
  // card at the end; let the final card close the row instead.
  if (count > 1 && count % 2 === 1) {
    const last = layouts[layouts.length - 1];
    if (!last.span.includes('sm:col-span-2')) {
      last.span = last.span.replace('sm:col-span-1', 'sm:col-span-2');
    }
  }

  return layouts;
};

export const Portfolio: React.FC = () => {
  const { data, activeProjectModal, setActiveProjectModal, isSectionLight, updatePortfolio, editorialMode, darkBg, accentText } = useCMS();
  const { portfolio, theme } = data;
  const isLight = isSectionLight('portfolio');
  const isModalLight = data.theme.bgMode === 'light-minimal';
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState(0);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const { isMounted: modalMounted, isClosing: modalClosing } = usePresence(!!activeProjectModal, 220);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastProjectRef = useRef<ProjectItem | null>(null);
  if (activeProjectModal) lastProjectRef.current = activeProjectModal;
  const modalProject = activeProjectModal || lastProjectRef.current;

  // Trap keyboard focus inside the modal while it is open
  useFocusTrap(modalMounted, modalRef);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(portfolio.items.map((i) => i.category)))];

  const filteredItems =
    activeCategory === 'All'
      ? portfolio.items
      : portfolio.items.filter((item) => item.category === activeCategory);

  const cardLayouts = buildCardLayouts(filteredItems.length);

  const patchActiveProject = (patch: Partial<ProjectItem>) => {
    if (!activeProjectModal) return;
    const next = portfolio.items.map((p) =>
      p.id === activeProjectModal.id ? { ...p, ...patch } : p
    );
    updatePortfolio({ items: next });
    setActiveProjectModal({ ...activeProjectModal, ...patch });
  };

  const gallery = modalProject?.gallery?.length
    ? modalProject.gallery
    : modalProject?.imageUrl
    ? [modalProject.imageUrl]
    : [];
  const safeActiveImage = Math.min(activeImage, Math.max(0, gallery.length - 1));

  // Prevent background scroll while the modal is open
  useEffect(() => {
    if (!modalMounted) return;
    const body = document.body;
    const html = document.documentElement;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    html.style.overflow = 'hidden';
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      html.style.overflow = '';
    };
  }, [modalMounted]);

  const goToImage = (next: number, dir: 'left' | 'right') => {
    if (next === safeActiveImage) return;
    setSlideDir(dir);
    setActiveImage(next);
  };

  const patchGalleryImage = (index: number, value: string) => {
    if (!activeProjectModal) return;
    const nextGallery = [...gallery];
    nextGallery[index] = value;
    const patch: Partial<ProjectItem> = { gallery: nextGallery };
    if (index === 0) patch.imageUrl = value;
    patchActiveProject(patch);
  };
  const addGalleryImage = (value: string) => {
    if (!activeProjectModal) return;
    patchActiveProject({ gallery: [...gallery, value] });
    setActiveImage(gallery.length);
  };
  const removeGalleryImage = (index: number) => {
    if (!activeProjectModal) return;
    const nextGallery = gallery.filter((_, i) => i !== index);
    const patch: Partial<ProjectItem> = { gallery: nextGallery };
    if (index === 0 && nextGallery[0]) patch.imageUrl = nextGallery[0];
    patchActiveProject(patch);
    setActiveImage((curr) => (curr >= nextGallery.length ? Math.max(0, nextGallery.length - 1) : curr));
  };

  useEffect(() => {
    if (activeProjectModal?.id) setActiveImage(0);
  }, [activeProjectModal?.id]);

  const clientMarquee = [
    'Aura',
    'Modern Health',
    'Orbital',
    'Northstar',
    'Acme Labs',
    'Velvet Geneva',
    'Digitara',
  ];

  return (
    <section
      id="portfolio"
      className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
        isLight
          ? 'bg-white text-black border-t border-neutral-200'
          : 'text-white border-t border-white/[0.06]'
      }`}
      style={isLight ? undefined : { backgroundColor: darkBg }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <Reveal
          variant="mask"
          curtain={isLight ? '#FFFFFF' : darkBg}
          className={`flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16 border-b ${
            isLight ? 'border-neutral-200' : 'border-white/[0.08]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: theme.accentColor || '#6B5CE7',
                  boxShadow: `0 0 10px ${theme.accentColor || '#6B5CE7'}60`,
                }}
              />
              <span className={isLight ? 'text-neutral-500 font-semibold' : 'text-neutral-400 font-semibold'}>
                <EditableText
                  as="span"
                  value={portfolio.badge}
                  onChange={(v) => updatePortfolio({ badge: v })}
                  label="Badge Portfolio"
                />
              </span>
            </div>
            <EditableText
              as="h2"
              value={portfolio.headline}
              onChange={(v) => updatePortfolio({ headline: v })}
              label="Headline Portfolio"
              className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight ${
                isLight ? 'text-neutral-950' : 'text-white'
              }`}
            />
          </div>

          <div className="max-w-md flex flex-col md:items-end">
            <EditableText
              as="p"
              value={portfolio.description}
              onChange={(v) => updatePortfolio({ description: v })}
              label="Deskripsi Portfolio"
              multiline
              className={`text-sm font-light leading-relaxed md:text-right ${
                isLight ? 'text-neutral-600' : 'text-neutral-400'
              }`}
            />
          </div>
        </Reveal>

        {/* Controls Bar: Category Filters */}
        <Reveal variant="up" delay={100} className="mt-8 flex flex-wrap items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative overflow-hidden px-4 sm:px-5 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all duration-300 ease-out active:scale-90 hover:-translate-y-0.5 ${
                    isActive
                      ? 'text-white font-semibold shadow-md scale-105'
                      : isLight
                      ? 'bg-neutral-100 text-neutral-600 hover:text-black border-neutral-200 hover:border-neutral-400 hover:shadow-md'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border-white/[0.06] hover:shadow-md'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: theme.accentColor || '#6B5CE7',
                          borderColor: theme.accentColor || '#6B5CE7',
                          color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                          boxShadow: `0 6px 20px ${theme.accentColor || '#6B5CE7'}40`,
                        }
                      : {}
                  }
                >
                  <span className="relative z-10">{cat}</span>
                  {isActive && (
                    <span
                      className="absolute inset-0 z-0 animate-filter-pop"
                      style={{ backgroundColor: theme.accentColor || '#6B5CE7' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Project Grid Collage */}
        <div className="relative mt-14 sm:mt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-10 bottom-0 rounded-[34px] sm:rounded-[48px]"
            style={{
              background: isLight
                ? `radial-gradient(130% 120% at 12% 0%, color-mix(in srgb, ${theme.accentColor} 42%, #ffffff) 0%, ${theme.accentColor} 45%, color-mix(in srgb, ${theme.accentColor} 76%, #000000) 100%)`
                : `radial-gradient(130% 120% at 15% 0%, color-mix(in srgb, ${theme.accentColor} 34%, ${darkBg}) 0%, ${darkBg} 65%)`,
              boxShadow: `0 40px 90px -50px ${theme.accentColor}AA`,
            }}
          />
          <div className="relative px-3 py-10 sm:px-8 sm:py-14 lg:px-12">
            <div
              key={activeCategory}
              className="grid animate-filter-grid grid-cols-1 items-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-6 lg:gap-y-4"
            >
              {filteredItems.map((project, fIdx) => {
                const pIdx = portfolio.items.findIndex((p) => p.id === project.id);
                const patchProject = (patch: Partial<ProjectItem>) => {
                  if (pIdx < 0) return;
                  const next = [...portfolio.items];
                  next[pIdx] = { ...next[pIdx], ...patch };
                  updatePortfolio({ items: next });
                };
                const featured = filteredItems[0]?.id === project.id;
                const layout = cardLayouts[fIdx] ?? cardLayouts[cardLayouts.length - 1];
                const tagLimit = layout.size === 'lg' ? 4 : layout.size === 'md' ? 3 : 2;
                const tilt = CARD_TILTS[fIdx % CARD_TILTS.length];
                return (
                  <Reveal
                    key={project.id}
                    variant="up"
                    delay={(fIdx % 3) * 80}
                    className={`block ${layout.span}`}
                  >
                    <article
                      onClick={() => setActiveProjectModal(project)}
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveProjectModal(project);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Buka case study ${project.title}`}
                      style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}
                      className={`portfolio-card group relative cursor-pointer rounded-[26px] p-2.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:p-3 ${
                        isLight
                          ? 'bg-white text-neutral-950 shadow-[0_22px_45px_-20px_rgba(10,10,10,0.55)] hover:shadow-[0_32px_60px_-24px_rgba(10,10,10,0.6)]'
                          : 'border border-white/10 bg-[#141416] text-white shadow-[0_24px_50px_-22px_rgba(0,0,0,0.9)]'
                      } ${featured ? 'ring-1 ring-white/25' : ''}`}
                    >
                      <div
                        className={`relative aspect-[16/9] overflow-hidden rounded-[18px] ${
                          isLight ? 'bg-neutral-100' : 'bg-neutral-900'
                        }`}
                      >
                        <EditableImage
                          value={project.imageUrl}
                          onChange={(v) => patchProject({ imageUrl: v })}
                          label="Foto project"
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] group-hover:brightness-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {editorialMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveProjectModal(project);
                            }}
                            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-[#6B5CE7] px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#7d6fec] active:scale-95"
                            title="Buka & edit detail case study"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit Detail
                          </button>
                        )}
                      </div>

                      <div className="px-1.5 pb-1 pt-4 sm:px-2.5">
                        <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                          <EditableText
                            as="span"
                            value={project.category}
                            onChange={(v) => patchProject({ category: v })}
                            label="Kategori project"
                          />
                        </p>

                        <EditableText
                          as="h3"
                          value={project.title}
                          onChange={(v) => patchProject({ title: v })}
                          label="Judul project"
                          className={`mt-1 leading-tight font-bold ${
                            layout.size === 'lg'
                              ? 'text-2xl sm:text-3xl'
                              : layout.size === 'md'
                              ? 'text-xl sm:text-2xl'
                              : 'text-lg sm:text-xl'
                          }`}
                        />

                        {layout.size !== 'sm' && (
                          <EditableText
                            as="p"
                            value={project.summary}
                            onChange={(v) => patchProject({ summary: v })}
                            label="Ringkasan project"
                            multiline
                            className={`mt-2 line-clamp-2 text-xs font-light sm:text-sm ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}
                          />
                        )}

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.tags.slice(0, tagLimit).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${isLight ? 'bg-neutral-100 text-neutral-600' : 'bg-white/[0.06] text-neutral-400'}`}
                            >
                              <EditableText
                                as="span"
                                value={tag}
                                onChange={(v) => {
                                  const next = [...project.tags];
                                  next[tIdx] = v;
                                  patchProject({ tags: next });
                                }}
                                label="Tag project"
                              />
                            </span>
                          ))}
                          {project.tags.length > tagLimit && (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${isLight ? 'bg-neutral-100 text-neutral-500' : 'bg-white/[0.06] text-neutral-500'}`}>
                              +{project.tags.length - tagLimit}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-end justify-between gap-3">
                          <span className={`font-mono text-[11px] ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                            ©<EditableText
                              as="span"
                              value={project.year}
                              onChange={(v) => patchProject({ year: v })}
                              label="Tahun project"
                            />
                          </span>

                          {featured ? (
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5"
                              style={{
                                backgroundColor: theme.accentColor,
                                color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                              }}
                            >
                              <EditableText as="span" value="View Case Study" overrideKey="portfolio.cardCta" label="Teks CTA kartu" />
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </span>
                          ) : (
                            <span
                              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-300 group-hover:rotate-90 group-hover:scale-105 ${
                                isLight ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-950'
                              }`}
                              aria-hidden="true"
                            >
                              <Plus className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ribbon Marquee under Portfolio matching reference with accent icons */}
      {/* NOTE: this ribbon keeps a DARK background in light mode, so its text
          must not inherit the light-section muted-text remap (text-neutral-*). */}
      <div
        className={`dark-surface mt-24 -mx-8 py-5 border-y overflow-hidden flex items-center ${
          isLight ? 'bg-neutral-950 text-white border-neutral-900' : 'bg-black/60 border-white/[0.08]'
        }`}
      >
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {[...clientMarquee, ...clientMarquee, ...clientMarquee].map((partner, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-10 transition-colors cursor-default ${
                isLight ? 'text-white/70 hover:text-white' : 'text-neutral-300 hover:text-white'
              }`}
            >
              <span className="text-xs font-semibold tracking-wide font-heading uppercase">
                <EditableText as="span" value={partner} overrideKey={`portfolio.client.${idx % clientMarquee.length}`} label="Nama klien marquee" />
              </span>
              <Sparkle className="w-3.5 h-3.5 fill-current" style={{ color: theme.accentColor }} />
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal — near full screen gallery */}
      {modalMounted &&
        modalProject &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 lg:p-6 backdrop-blur-xl ${isModalLight ? 'bg-neutral-900/60' : 'bg-black/90'} ${modalClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
            onClick={() => setActiveProjectModal(null)}
          >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={modalProject.title}
            className={`relative w-full h-full sm:h-[94vh] sm:w-[96vw] max-w-[1600px] border sm:rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-2xl ${
              isModalLight ? 'modal-light bg-white text-neutral-900 border-neutral-200' : 'bg-[#0E0E10] text-white border-white/15'
            } ${modalClosing ? 'animate-zoom-out' : 'animate-zoom-in'}`}
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: isModalLight ? undefined : `${theme.accentColor}40` }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveProjectModal(null)}
              className={`absolute top-4 right-4 z-20 p-2 rounded-full cursor-pointer border transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${
                isModalLight
                  ? 'bg-white/80 hover:bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500 focus-visible:ring-neutral-500'
                  : 'bg-black/60 hover:bg-black/90 text-white border-white/10 hover:border-white/40 focus-visible:ring-white/60'
              }`}
              aria-label="Close Case Study"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT: Project Gallery */}
            <div className={`flex-1 flex flex-col min-h-0 lg:h-full ${isModalLight ? 'bg-neutral-100' : 'bg-black'}`}>
              {/* Main large screenshot */}
              <div className={`relative flex-1 min-h-[220px] overflow-hidden ${isModalLight ? 'bg-neutral-200' : 'bg-neutral-950'}`}>
                <div
                  key={`main-${safeActiveImage}`}
                  className={`w-full h-full ${slideDir === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}
                >
                  <EditableImage
                    value={gallery[safeActiveImage]}
                    onChange={(v) => patchGalleryImage(safeActiveImage, v)}
                    label="Screenshot utama"
                    alt={modalProject.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Prev / Next controls */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage((safeActiveImage - 1 + gallery.length) % gallery.length, 'left');
                      }}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 ${
                        isModalLight
                          ? 'bg-white/85 hover:bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500 focus-visible:ring-neutral-500'
                          : 'bg-black/60 hover:bg-black/90 text-white border-white/15 hover:border-white/50 focus-visible:ring-white/60'
                      }`}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage((safeActiveImage + 1) % gallery.length, 'right');
                      }}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 ${
                        isModalLight
                          ? 'bg-white/85 hover:bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500 focus-visible:ring-neutral-500'
                          : 'bg-black/60 hover:bg-black/90 text-white border-white/15 hover:border-white/50 focus-visible:ring-white/60'
                      }`}
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className={`absolute bottom-4 right-4 px-2.5 py-1 rounded-md backdrop-blur-md text-[11px] font-mono border ${
                      isModalLight ? 'bg-white/80 text-neutral-700 border-neutral-300' : 'bg-black/60 text-white border-white/10'
                    }`}>
                      {safeActiveImage + 1} / {gallery.length}
                    </div>
                  </>
                )}

                {editorialMode && (
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#6B5CE7]/90 text-white text-[11px] font-semibold">
                      Klik gambar untuk ganti
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail strip (project gallery) */}
              <div className={`shrink-0 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 overflow-x-auto border-t ${
                isModalLight ? 'border-neutral-200 bg-neutral-50' : 'border-white/10 bg-[#0A0A0B]'
              }`}>
                {gallery.map((img, i) => (
                  <div key={i} className="relative group/thumb shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage(i, i > safeActiveImage ? 'right' : 'left');
                      }}
                      className={`block w-20 h-14 sm:w-28 sm:h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${
                        i === safeActiveImage
                          ? 'border-[#6B5CE7] opacity-100'
                          : isModalLight
                          ? 'border-neutral-200 opacity-60 hover:opacity-100 hover:border-neutral-400 focus-visible:ring-neutral-500'
                          : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/40 focus-visible:ring-white/60'
                      }`}
                      aria-label={`Lihat gambar ${i + 1}`}
                    >
                      <img src={img} alt={`${modalProject.title} ${i + 1}`} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                    {editorialMode && (
                      <>
                        <ImageUploadTrigger
                          onChange={(v) => patchGalleryImage(i, v)}
                          title="Ganti gambar ini"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#6B5CE7] text-white flex items-center justify-center shadow-lg hover:bg-[#7d6fec]"
                        >
                          <Camera className="w-3 h-3" />
                        </ImageUploadTrigger>
                        {gallery.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGalleryImage(i);
                            }}
                            title="Hapus gambar"
                            className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {editorialMode && gallery.length < 8 && (
                  <ImageUploadTrigger
                    onChange={(v) => addGalleryImage(v)}
                    title="Tambah gambar galeri"
                    className="shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-lg border-2 border-dashed border-[#22C55E]/70 text-[#22C55E] flex flex-col items-center justify-center gap-1 hover:bg-[#22C55E]/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[10px] font-medium">Tambah</span>
                  </ImageUploadTrigger>
                )}
              </div>
            </div>

            {/* RIGHT: Project Information */}
            <div className={`w-full lg:w-[440px] xl:w-[500px] shrink-0 overflow-y-auto lg:h-full p-6 sm:p-8 border-t lg:border-t-0 lg:border-l ${
              isModalLight ? 'border-neutral-200 bg-white' : 'border-white/10'
            }`}>
              {/* Header */}
              <div className={`flex items-center gap-3 text-xs font-mono mb-2 ${isModalLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                <EditableText
                  as="span"
                  value={modalProject.category}
                  onChange={(v) => patchActiveProject({ category: v })}
                  label="Kategori project"
                  style={{ color: isModalLight ? theme.accentColor : accentText }}
                  className="font-semibold"
                />
                <span>·</span>
                <span>
                  <EditableText as="span" value="Year" overrideKey="portfolio.modal.yearLabel" label="Label tahun" />{' '}
                  <EditableText
                    as="span"
                    value={modalProject.year}
                    onChange={(v) => patchActiveProject({ year: v })}
                    label="Tahun project"
                  />
                </span>
              </div>

              <EditableText
                as="h2"
                value={modalProject.title}
                onChange={(v) => patchActiveProject({ title: v })}
                label="Judul project"
                className={`text-2xl sm:text-3xl font-bold mb-3 ${isModalLight ? 'text-neutral-950' : 'text-white'}`}
              />

              <EditableText
                as="p"
                value={modalProject.summary}
                onChange={(v) => patchActiveProject({ summary: v })}
                label="Ringkasan project"
                multiline
                className={`text-sm font-light leading-relaxed mb-6 ${isModalLight ? 'text-neutral-600' : 'text-neutral-400'}`}
              />

              {/* Quick Specs */}
              <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl border mb-6 text-xs ${
                isModalLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.03] border-white/5'
              }`}>
                <div>
                  <span className={`font-mono block ${isModalLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                    <EditableText as="span" value="Client" overrideKey="portfolio.modal.client" label="Label client" />
                  </span>
                  <EditableText
                    as="span"
                    value={modalProject.client}
                    onChange={(v) => patchActiveProject({ client: v })}
                    label="Nama client"
                    className={`font-medium ${isModalLight ? 'text-neutral-900' : 'text-white'}`}
                  />
                </div>
                {modalProject.metrics !== undefined && (
                  <div>
                    <span className={`font-mono block ${isModalLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                      <EditableText as="span" value="Key Metric" overrideKey="portfolio.modal.metric" label="Label metric" />
                    </span>
                    <EditableText
                      as="span"
                      value={modalProject.metrics}
                      onChange={(v) => patchActiveProject({ metrics: v })}
                      label="Metric project"
                      className="font-semibold"
                      style={{ color: isModalLight ? theme.accentColor : accentText }}
                    />
                  </div>
                )}
                <div className="col-span-2">
                  <span className={`font-mono block ${isModalLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                    <EditableText as="span" value="Deliverables" overrideKey="portfolio.modal.deliverables" label="Label deliverables" />
                  </span>
                  <span className={`font-medium ${isModalLight ? 'text-neutral-900' : 'text-white'}`}>
                    {modalProject.tags.map((tag, tIdx) => (
                      <span key={tIdx}>
                        <EditableText
                          as="span"
                          value={tag}
                          onChange={(v) => {
                            const next = [...modalProject.tags];
                            next[tIdx] = v;
                            patchActiveProject({ tags: next });
                          }}
                          label="Deliverable project"
                        />
                        {tIdx < modalProject.tags.length - 1 ? <>, </> : null}
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className={`space-y-6 text-sm leading-relaxed font-light ${isModalLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                <div>
                  <h4 className={`text-xs font-mono uppercase tracking-wider mb-2 font-semibold ${isModalLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    <EditableText as="span" value="The Challenge" overrideKey="portfolio.modal.challenge" label="Judul challenge" />
                  </h4>
                  <EditableText
                    as="p"
                    value={modalProject.challenge}
                    onChange={(v) => patchActiveProject({ challenge: v })}
                    label="Deskripsi challenge"
                    multiline
                    className={`p-4 rounded-xl border ${isModalLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.02] border-white/5'}`}
                  />
                </div>

                <div>
                  <h4 className={`text-xs font-mono uppercase tracking-wider mb-2 font-semibold ${isModalLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    <EditableText as="span" value="Strategic Solution & Execution" overrideKey="portfolio.modal.solution" label="Judul solution" />
                  </h4>
                  <EditableText
                    as="p"
                    value={modalProject.solution}
                    onChange={(v) => patchActiveProject({ solution: v })}
                    label="Deskripsi solution"
                    multiline
                    className={`p-4 rounded-xl border ${isModalLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.02] border-white/5'}`}
                  />
                </div>
              </div>

              {/* Footer with CTA */}
              <div className={`mt-8 pt-6 border-t flex items-center justify-between gap-4 ${isModalLight ? 'border-neutral-200' : 'border-white/10'}`}>
                <EditableText
                  as="span"
                  value="DIGITARA Archive · Confidential"
                  overrideKey="portfolio.modal.confidential"
                  label="Teks confidential"
                  className={`text-xs ${isModalLight ? 'text-neutral-400' : 'text-neutral-500'}`}
                />
                <a
                  href="#contact"
                  onClick={() => {
                    setActiveProjectModal(null);
                    const el = document.querySelector('#contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-xs font-semibold cursor-pointer hover:brightness-110 hover:scale-[1.03] transition-all shadow-xl active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  style={{
                    backgroundColor: theme.accentColor || '#FFFFFF',
                    color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                    boxShadow: `0 8px 25px ${theme.accentColor}35`,
                  }}
                >
                  <EditableText as="span" value="Request Similar Project" overrideKey="portfolio.modal.requestCta" label="Teks tombol request" />
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>,
          document.body
        )}
    </section>
  );
};
