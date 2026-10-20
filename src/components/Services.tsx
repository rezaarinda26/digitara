import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight, Plus, Minus, Check, Sparkle } from 'lucide-react';
import { ServiceItem } from '../types/cms';
import { EditableText, DraggableBox } from './editorial/Editable';

export const Services: React.FC = () => {
  const { data, isSectionLight, updateServices, editorialMode } = useCMS();
  const { services, theme } = data;
  const isLight = isSectionLight('services');

  const [hoveredService, setHoveredService] = useState<ServiceItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleSelectServiceForBrief = (serviceName: string) => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('select-service', { detail: serviceName }));
    }
  };

  const marqueeItems = [
    'Development',
    'Branding',
    'Motion',
    'Digital Products',
    'UI/UX Design',
    'Creative Development',
    'Design Systems',
  ];

  return (
    <section
      id="services"
      className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-500 ${isLight
        ? 'bg-white text-black border-t border-neutral-200'
        : 'bg-[#0A0A0A] text-white border-t border-white/[0.06]'
        }`}
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16 border-b ${isLight ? 'border-neutral-200' : 'border-white/[0.08]'
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
                  value={services.badge}
                  onChange={(v) => updateServices({ badge: v })}
                  label="Badge Services"
                />
              </span>
            </div>
            <EditableText
              as="h2"
              value={services.headline}
              onChange={(v) => updateServices({ headline: v })}
              label="Headline Services"
              className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight ${isLight ? 'text-neutral-950' : 'text-white'
                }`}
            />
          </div>

          <div className="max-w-md flex flex-col md:items-end">
            <EditableText
              as="p"
              value={services.description}
              onChange={(v) => updateServices({ description: v })}
              label="Deskripsi Services"
              multiline
              className={`text-sm font-light leading-relaxed md:text-right ${isLight ? 'text-neutral-600' : 'text-neutral-400'
                }`}
            />
            <a
              href="#about"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold transition-colors"
              style={{ color: theme.accentColor || (isLight ? '#000000' : '#FFFFFF') }}
            >
              <EditableText
                as="span"
                value={services.ctaText}
                onChange={(v) => updateServices({ ctaText: v })}
                label="Teks CTA Services"
              />
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Column Headers */}
        <div
          className={`hidden lg:grid grid-cols-12 gap-6 py-5 text-[11px] font-mono uppercase tracking-wider border-b ${isLight ? 'text-neutral-400 border-neutral-200' : 'text-neutral-500 border-white/[0.06]'
            }`}
        >
          <div className="col-span-4 flex items-center gap-2">
            <span style={{ color: theme.accentColor }}>■</span>
            <EditableText as="span" value="Layanan" overrideKey="services.col.service" label="Header kolom layanan" />
          </div>
          <div className="col-span-5 flex items-center gap-2">
            <span style={{ color: theme.accentColor }}>■</span>
            <EditableText as="span" value="Cakupan & Hasil" overrideKey="services.col.scope" label="Header kolom cakupan" />
          </div>
          <div className="col-span-3 text-right flex items-center justify-end gap-2">
            <span style={{ color: theme.accentColor }}>■</span>
            <EditableText as="span" value="Mulai Dari" overrideKey="services.col.from" label="Header kolom harga" />
          </div>
        </div>

        {/* Services Interactive List Container */}
        <div className={`relative divide-y ${isLight ? 'divide-neutral-200' : 'divide-white/[0.06]'}`}>
          {services.items.map((item, sIdx) => {
            const isExpanded = expandedId === item.id;
            const patchItem = (patch: Partial<ServiceItem>) => {
              const next = [...services.items];
              next[sIdx] = { ...next[sIdx], ...patch };
              updateServices({ items: next });
            };
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredService(item)}
                onMouseLeave={() => setHoveredService(null)}
                className={`group relative transition-all duration-300 ${isLight ? 'hover:bg-neutral-50/80' : 'hover:bg-white/[0.02]'
                  }`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center cursor-pointer"
                >
                  {/* Service Number & Name with High-Impact Accent on number */}
                  <div className="lg:col-span-4 flex items-baseline gap-4 sm:gap-6">
                    <EditableText
                      as="span"
                      value={item.number}
                      onChange={(v) => patchItem({ number: v })}
                      label="Nomor service"
                      className="font-mono text-sm sm:text-base font-bold transition-transform duration-200 group-hover:scale-110"
                      style={{ color: theme.accentColor || '#6B5CE7' }}
                    />
                    <EditableText
                      as="h3"
                      value={item.name}
                      onChange={(v) => patchItem({ name: v })}
                      label="Nama service"
                      className={`text-xl sm:text-2xl lg:text-3xl font-semibold transition-transform duration-300 group-hover:translate-x-2 ${isLight ? 'text-neutral-900 group-hover:text-black' : 'text-white'
                        }`}
                    />
                  </div>

                  {/* Included Badges / Tags */}
                  <div className="lg:col-span-5 flex flex-wrap gap-2">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-normal border transition-colors ${isLight
                          ? 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-neutral-400'
                          : 'bg-white/[0.04] text-neutral-300 border-white/[0.05] hover:border-white/20'
                          }`}
                      >
                        <EditableText
                          as="span"
                          value={tag}
                          onChange={(v) => {
                            const next = [...item.tags];
                            next[tIdx] = v;
                            patchItem({ tags: next });
                          }}
                          label="Tag service"
                        />
                      </span>
                    ))}
                  </div>

                  {/* Price & Action Button */}
                  <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-6">
                    <div className="text-left lg:text-right">
                      <span
                        className={`block text-xs font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'
                          }`}
                      >
                        <EditableText as="span" value="From" overrideKey={`services.from.${item.id}`} label="Label harga" />
                      </span>
                      <EditableText
                        as="span"
                        value={item.startingPrice}
                        onChange={(v) => patchItem({ startingPrice: v })}
                        label="Harga service"
                        className="text-xl sm:text-2xl font-bold font-mono tracking-tight"
                        style={{ color: isLight ? '#0A0A0A' : '#FFFFFF' }}
                      />
                    </div>

                    <div
                      className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 group-hover:scale-105"
                      style={{
                        borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.15)',
                        backgroundColor: isExpanded ? theme.accentColor : 'transparent',
                        color: isExpanded ? '#FFFFFF' : isLight ? '#000000' : '#FFFFFF',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.accentColor;
                        e.currentTarget.style.borderColor = theme.accentColor;
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        if (!isExpanded) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = isLight ? '#E5E7EB' : 'rgba(255,255,255,0.15)';
                          e.currentTarget.style.color = isLight ? '#000000' : '#FFFFFF';
                        }
                      }}
                    >
                      {isExpanded ? <Minus className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Accordion Details */}
                {isExpanded && (
                  <div
                    className={`pb-8 pt-4 px-6 rounded-xl border mb-6 flex flex-col md:flex-row gap-6 justify-between items-start animate-in fade-in duration-300 ${isLight
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-900 shadow-sm'
                      : 'bg-white/[0.02] border-white/[0.05] text-white'
                      }`}
                    style={{
                      borderLeftWidth: '3px',
                      borderLeftColor: theme.accentColor || '#6B5CE7',
                    }}
                  >
                    <div className="max-w-2xl">
                      <h4 className="text-sm font-semibold mb-2">
                        <EditableText as="span" value="Scope & Methodology" overrideKey={`services.scopeHeading.${item.id}`} label="Judul scope" />
                      </h4>
                      <EditableText
                        as="p"
                        value={item.description}
                        onChange={(v) => patchItem({ description: v })}
                        label="Deskripsi service"
                        multiline
                        className={`text-sm leading-relaxed font-light ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}
                      />
                      <div className={`mt-4 flex flex-wrap gap-4 text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        {(item.features || []).map((feature, fIdx) => (
                          <span key={fIdx} className="flex items-center gap-1.5 font-medium">
                            <Check className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                            <EditableText
                              as="span"
                              value={feature}
                              onChange={(v) => {
                                const next = [...item.features];
                                next[fIdx] = v;
                                patchItem({ features: next });
                              }}
                              label="Fitur service"
                            />
                            {editorialMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  patchItem({ features: (item.features || []).filter((_, i) => i !== fIdx) });
                                }}
                                className="ml-1 text-[10px] text-red-400 hover:text-red-300"
                                title="Hapus fitur"
                              >
                                ✕
                              </button>
                            )}
                          </span>
                        ))}
                        {editorialMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              patchItem({ features: [...(item.features || []), 'Fitur baru'] });
                            }}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded border border-dashed border-[#22C55E]/70 text-[#22C55E]"
                            title="Tambah fitur"
                          >
                            <Plus className="w-3 h-3" /> Tambah fitur
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectServiceForBrief(item.name);
                      }}
                      className="px-6 py-3 rounded-xl text-xs font-semibold text-white transition-all shadow-lg hover:brightness-110 active:scale-95 whitespace-nowrap self-end md:self-center"
                      style={{
                        backgroundColor: theme.accentColor || '#0A0A0A',
                        color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                        boxShadow: `0 8px 25px ${theme.accentColor || '#6B5CE7'}35`,
                      }}
                    >
                      <EditableText
                        as="span"
                        value={`Book ${item.name} →`}
                        overrideKey={`services.book.${item.id}`}
                        label="Teks tombol booking"
                      />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Hover Artwork Preview for Desktop */}
      {hoveredService && hoveredService.previewImage && (
        <div
          className="hidden pointer-events-none fixed z-50 rounded-2xl overflow-hidden shadow-2xl border transition-opacity duration-300 w-64 h-44 bg-neutral-900"
          style={{
            left: `${mousePos.x + 40}px`,
            top: `${mousePos.y - 80}px`,
            transform: 'translate3d(0,0,0)',
            borderColor: `${theme.accentColor}60`,
            boxShadow: `0 20px 40px ${theme.accentColor}30`,
          }}
        >
          <img
            src={hoveredService.previewImage}
            alt={hoveredService.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-xs font-semibold text-white drop-shadow flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
              {hoveredService.name}
            </span>
          </div>
        </div>
      )}

      {/* Seamless Ribbon Marquee under Services */}
      <div className={`mt-20 -mx-8 py-5 border-y overflow-hidden flex items-center ${isLight ? 'bg-neutral-100/60 border-neutral-200' : 'bg-black/60 border-white/[0.08]'
        }`}>
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-10 text-xs font-semibold tracking-wider uppercase font-heading ${isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
                }`}
            >
              <EditableText
                as="span"
                value={item}
                overrideKey={`services.marquee.${idx % marqueeItems.length}`}
                label="Item marquee"
              />
              <Sparkle className="w-3.5 h-3.5 fill-current" style={{ color: theme.accentColor }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
