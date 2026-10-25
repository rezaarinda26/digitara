import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight, X, Sparkle, Pencil, Camera, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectItem } from '../types/cms';
import { EditableText, EditableImage, ImageUploadTrigger } from './editorial/Editable';
import { usePresence } from '../hooks/usePresence';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Reveal } from './common/Reveal';

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

        {/* Filter Segmented Controls with Accent Impact */}
        <Reveal variant="up" delay={100} className="mt-8 flex flex-wrap items-center gap-2.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative overflow-hidden px-5 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all duration-300 ease-out active:scale-90 hover:-translate-y-0.5 ${
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
        </Reveal>

        {/* 2-Column Aesthetic Project Grid */}
        <div key={activeCategory} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-filter-grid">
          {filteredItems.map((project) => {
            const pIdx = portfolio.items.findIndex((p) => p.id === project.id);
            const patchProject = (patch: Partial<ProjectItem>) => {
              if (pIdx < 0) return;
              const next = [...portfolio.items];
              next[pIdx] = { ...next[pIdx], ...patch };
              updatePortfolio({ items: next });
            };
            return (
            <Reveal
              key={project.id}
              variant="up"
              delay={(pIdx % 2) * 90}
              className="flex"
            >
            <div
              onClick={() => {
                setActiveProjectModal(project);
              }}
              className={`group w-full cursor-pointer flex flex-col rounded-2xl overflow-hidden border transition-all duration-500 ${
                isLight
                  ? 'bg-neutral-50/80 border-neutral-200 hover:shadow-2xl'
                  : 'bg-white/[0.02] border-white/[0.06]'
              }`}
              style={{
                transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${theme.accentColor}80`;
                e.currentTarget.style.boxShadow = `0 15px 35px ${theme.accentColor}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isLight ? '#E5E7EB' : 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image Frame with Zoom */}
              <div className="relative aspect-video overflow-hidden bg-neutral-900">
                <EditableImage
                  value={project.imageUrl}
                  onChange={(v) => patchProject({ imageUrl: v })}
                  label="Foto project"
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] filter brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />

                {/* Corner Project Year Tag with Accent Pill Accent */}
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono text-white border"
                  style={{ borderColor: `${theme.accentColor}50` }}
                >
                  ©<EditableText
                    as="span"
                    value={project.year}
                    onChange={(v) => patchProject({ year: v })}
                    label="Tahun project"
                  />
                </div>

                {editorialMode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProjectModal(project);
                    }}
                    className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#6B5CE7] hover:bg-[#7d6fec] text-white text-[11px] font-semibold shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Buka & edit detail case study"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit Detail
                  </button>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <EditableText
                      as="h3"
                      value={project.title}
                      onChange={(v) => patchProject({ title: v })}
                      label="Judul project"
                      className={`text-2xl sm:text-3xl font-bold transition-colors ${
                        isLight ? 'text-neutral-950 group-hover:text-black' : 'text-white'
                      }`}
                    />
                    <div
                      className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 group-hover:scale-105"
                      style={{
                        borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.15)',
                        color: isLight ? '#000000' : '#FFFFFF',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.accentColor;
                        e.currentTarget.style.borderColor = theme.accentColor;
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = isLight ? '#E5E7EB' : 'rgba(255,255,255,0.15)';
                        e.currentTarget.style.color = isLight ? '#000000' : '#FFFFFF';
                      }}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <EditableText
                    as="p"
                    value={project.summary}
                    onChange={(v) => patchProject({ summary: v })}
                    label="Ringkasan project"
                    multiline
                    className={`mt-3 text-sm font-light line-clamp-2 ${
                      isLight ? 'text-neutral-600' : 'text-neutral-400'
                    }`}
                  />
                </div>

                {/* Tags unboxed */}
                <div
                  className={`mt-6 pt-4 border-t flex items-center justify-between text-xs ${
                    isLight ? 'border-neutral-200 text-neutral-500' : 'border-white/[0.06] text-neutral-400'
                  }`}
                >
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={isLight ? 'hover:text-black' : 'hover:text-neutral-200'}>
                        <EditableText
                          as="span"
                          value={tag}
                          onChange={(v) => {
                            const next = [...project.tags];
                            next[tIdx] = v;
                            patchProject({ tags: next });
                          }}
                          label="Tag project"
                        />{' '}
                        {tIdx < project.tags.length - 1 ? '·' : ''}
                      </span>
                    ))}
                  </div>
                  <span
                    className="font-mono text-xs uppercase shrink-0 font-bold tracking-wide"
                    style={{ color: isLight ? theme.accentColor : accentText }}
                  >
                    <EditableText as="span" value="Case Study →" overrideKey={`portfolio.caseStudyCta.${project.id}`} label="Teks Case Study" />
                  </span>
                </div>
              </div>
            </div>
            </Reveal>
            );
          })}
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
