import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { Star, ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { EditableText, EditableImage } from './editorial/Editable';

export const Testimonials: React.FC = () => {
  const { data, isSectionLight, updateTestimonials } = useCMS();
  const { testimonials, theme } = data;
  const isLight = isSectionLight('testimonials');
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials.items.length) return null;

  const current = testimonials.items[currentIndex] || testimonials.items[0];

  const patchCurrent = (patch: Partial<typeof current>) => {
    const next = [...testimonials.items];
    next[currentIndex] = { ...next[currentIndex], ...patch };
    updateTestimonials({ items: next });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.items.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
        isLight
          ? 'bg-white text-black border-t border-neutral-200'
          : 'bg-[#0A0A0A] text-white border-t border-white/[0.06]'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-6 mb-16 border-b ${
            isLight ? 'border-neutral-200' : 'border-white/[0.08]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.accentColor || (isLight ? '#0A0A0A' : '#FFFFFF') }}
            />
            <span
              className={`text-xs font-mono uppercase tracking-widest ${
                isLight ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              <EditableText
                as="span"
                value={testimonials.badge}
                onChange={(v) => updateTestimonials({ badge: v })}
                label="Badge Testimonials"
              />
            </span>
          </div>
          <EditableText
            as="h2"
            value={testimonials.headline}
            onChange={(v) => updateTestimonials({ headline: v })}
            label="Headline Testimonials"
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}
          />
        </div>

        {/* Cinematic Testimonial Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Client Portrait Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start gap-4">
            <div
              className={`relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border shadow-xl ${
                isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-900 border-white/10'
              }`}
            >
              <EditableImage
                value={current.avatarUrl}
                onChange={(v) => patchCurrent({ avatarUrl: v })}
                label="Foto klien"
                alt={current.author}
                className="w-full h-full object-cover grayscale contrast-115 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <EditableText
                    as="h4"
                    value={current.author}
                    onChange={(v) => patchCurrent({ author: v })}
                    label="Nama klien"
                    className="text-base font-bold"
                  />
                  <EditableText
                    as="p"
                    value={current.company}
                    onChange={(v) => patchCurrent({ company: v })}
                    label="Perusahaan klien"
                    className="text-xs text-neutral-300 font-light"
                  />
                </div>
                {/* Micro Thumbnail switcher */}
                <div className="flex items-center gap-1.5">
                  {testimonials.items.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-7 h-7 rounded-md overflow-hidden border transition-all ${
                        currentIndex === idx
                          ? 'border-white scale-110 ring-1 ring-white'
                          : 'border-white/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.avatarUrl}
                        alt={item.author}
                        className="w-full h-full object-cover grayscale"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Big Editorial Quote & Ratings */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <Quote
                className={`w-12 h-12 mb-6 ${
                  isLight ? 'text-neutral-300' : 'text-white/10'
                }`}
              />

              <blockquote
                className={`text-2xl sm:text-3xl lg:text-4xl font-light leading-relaxed tracking-tight ${
                  isLight ? 'text-neutral-900' : 'text-white'
                }`}
              >
                "<EditableText
                  as="span"
                  value={current.quote}
                  onChange={(v) => patchCurrent({ quote: v })}
                  label="Isi testimoni"
                  multiline
                />"
              </blockquote>

              <div
                className={`mt-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b pb-8 ${
                  isLight ? 'border-neutral-200' : 'border-white/[0.08]'
                }`}
              >
                <div>
                  <div
                    className={`text-lg font-bold ${
                      isLight ? 'text-neutral-950' : 'text-white'
                    }`}
                  >
                    <EditableText
                      as="span"
                      value={current.author}
                      onChange={(v) => patchCurrent({ author: v })}
                      label="Nama klien"
                    />
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-light ${
                      isLight ? 'text-neutral-500' : 'text-neutral-400'
                    }`}
                  >
                    <EditableText
                      as="span"
                      value={current.role}
                      onChange={(v) => patchCurrent({ role: v })}
                      label="Jabatan klien"
                    />
                    ,{' '}
                    <span className={isLight ? 'text-neutral-800 font-medium' : 'text-neutral-200'}>
                      <EditableText
                        as="span"
                        value={current.company}
                        onChange={(v) => patchCurrent({ company: v })}
                        label="Perusahaan klien"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Satisfaction Metric & Carousel Controls */}
            <div className="mt-8 flex items-center justify-between">
              <div>
                <span
                  className={`text-xs font-mono block mb-1 ${
                    isLight ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  <EditableText as="span" value="Customer Satisfaction" overrideKey="testimonials.satisfactionLabel" label="Label kepuasan" />
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className="text-3xl font-extrabold font-mono tabular-nums"
                    style={{ color: theme.accentColor || (isLight ? '#0A0A0A' : '#FFFFFF') }}
                  >
                    <EditableText
                      as="span"
                      value={testimonials.customerSatisfactionScore}
                      onChange={(v) => updateTestimonials({ customerSatisfactionScore: v })}
                      label="Skor kepuasan"
                    />
                    <span className={isLight ? 'text-neutral-400 text-lg font-normal' : 'text-neutral-500 text-lg font-normal'}>
                      <EditableText as="span" value="/5" overrideKey="testimonials.scoreDenominator" label="Denominator skor" />
                    </span>
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Prev / Next buttons with accent hover */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-sm"
                  style={{
                    borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.15)',
                    color: isLight ? '#0A0A0A' : '#FFFFFF',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.accentColor;
                    e.currentTarget.style.borderColor = theme.accentColor;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = isLight ? '#E5E7EB' : 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.color = isLight ? '#0A0A0A' : '#FFFFFF';
                  }}
                  aria-label="Previous Testimonial"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-sm"
                  style={{
                    borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.15)',
                    color: isLight ? '#0A0A0A' : '#FFFFFF',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.accentColor;
                    e.currentTarget.style.borderColor = theme.accentColor;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = isLight ? '#E5E7EB' : 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.color = isLight ? '#0A0A0A' : '#FFFFFF';
                  }}
                  aria-label="Next Testimonial"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
