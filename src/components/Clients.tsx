import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight } from 'lucide-react';
import { EditableText } from './editorial/Editable';
import { Reveal } from './common/Reveal';

export const Clients: React.FC = () => {
  const { data, isSectionLight, updateClients, darkBg } = useCMS();
  const { clients, theme } = data;
  const isLight = isSectionLight('clients');
  const accent = theme.accentColor || '#6B5CE7';

  if (!clients?.items?.length) return null;

  return (
    <section
      id="clients"
      className={`relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 transition-colors duration-500 border-t ${
        isLight
          ? 'bg-[#FAFAFA] text-black border-neutral-200'
          : 'text-white border-white/[0.06]'
      }`}
      style={isLight ? undefined : { backgroundColor: darkBg }}
    >
      {/* Ambient accent wash */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[720px] h-[220px] blur-[130px] opacity-[0.12] pointer-events-none"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <Reveal
          variant="mask"
          curtain={isLight ? '#FAFAFA' : darkBg}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-3">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
            <span className={isLight ? 'text-neutral-500 font-semibold' : 'text-neutral-400 font-semibold'}>
              <EditableText
                as="span"
                value={clients.badge}
                onChange={(v) => updateClients({ badge: v })}
                label="Badge Clients"
              />
            </span>
          </div>
          <EditableText
            as="h2"
            value={clients.headline}
            onChange={(v) => updateClients({ headline: v })}
            label="Headline Clients"
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}
          />
        </Reveal>

        {/* Logo wall */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {clients.items.map((item, idx) => {
            const Wrapper: any = item.url ? 'a' : 'div';
            return (
              <Reveal key={item.id} variant="up" delay={(idx % 4) * 70} className="flex">
                <Wrapper
                  {...(item.url
                    ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className={`group w-full relative overflow-hidden rounded-xl border px-5 py-6 sm:px-6 sm:py-7 transition-all duration-400 cursor-pointer ${
                    isLight
                      ? 'bg-white border-neutral-200 hover:border-neutral-400 hover:shadow-lg'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/25 hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Accent sweep on hover */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{
                      background: `radial-gradient(120% 100% at 50% 0%, ${accent}1F 0%, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />

                  <div className="relative flex flex-col gap-1.5">
                    <span
                      className={`font-heading text-lg sm:text-xl font-extrabold uppercase tracking-tight transition-colors duration-300 ${
                        isLight
                          ? 'text-neutral-400 group-hover:text-neutral-950'
                          : 'text-neutral-500 group-hover:text-white'
                      }`}
                    >
                      <EditableText
                        as="span"
                        value={item.name}
                        onChange={(v) => {
                          const next = [...clients.items];
                          next[idx] = { ...next[idx], name: v };
                          updateClients({ items: next });
                        }}
                        label="Nama klien"
                      />
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-colors duration-300 ${
                        isLight ? 'text-neutral-500' : 'text-neutral-600'
                      }`}
                    >
                      <EditableText
                        as="span"
                        value={item.tagline}
                        onChange={(v) => {
                          const next = [...clients.items];
                          next[idx] = { ...next[idx], tagline: v };
                          updateClients({ items: next });
                        }}
                        label="Tagline klien"
                      />
                    </span>
                  </div>

                  {item.url && (
                    <ArrowUpRight
                      className={`absolute top-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 ${
                        isLight ? 'text-neutral-900' : 'text-white'
                      }`}
                    />
                  )}

                  {/* Bottom accent line */}
                  <span
                    className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    style={{ backgroundColor: accent }}
                    aria-hidden="true"
                  />
                </Wrapper>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
