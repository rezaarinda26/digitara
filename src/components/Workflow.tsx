import React, { useRef } from 'react';
import { useCMS } from '../context/CMSContext';
import { Compass, PenTool, Layers, Rocket } from 'lucide-react';
import { EditableText } from './editorial/Editable';
import { Reveal } from './common/Reveal';
import { useAnimatedScroll } from '../hooks/useAnimatedScroll';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const Workflow: React.FC = () => {
  const { data, isSectionLight, updateWorkflow, darkBg, accentText } = useCMS();
  const { workflow, theme } = data;
  const isLight = isSectionLight('workflow');
  const gridRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  // The connector line draws itself as the row travels across the viewport.
  useAnimatedScroll(
    (p) => {
      if (lineRef.current) {
        lineRef.current.style.transform = `scaleX(${p})`;
      }
    },
    { targetRef: gridRef, smoothing: reduced ? 1 : 0.16 }
  );

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'search':
        return <Compass className="w-5 h-5" />;
      case 'pen':
        return <PenTool className="w-5 h-5" />;
      case 'layers':
        return <Layers className="w-5 h-5" />;
      case 'rocket':
        return <Rocket className="w-5 h-5" />;
      default:
        return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <section
      id="workflow"
      className={`relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
        isLight
          ? 'bg-white text-black border-t border-neutral-200'
          : 'text-white border-t border-white/[0.06]'
      }`}
      style={isLight ? undefined : { backgroundColor: darkBg }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Reveal
          variant="mask"
          curtain={isLight ? '#FFFFFF' : darkBg}
          className="text-center max-w-3xl mx-auto pb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-3">
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
                value={workflow.badge}
                onChange={(v) => updateWorkflow({ badge: v })}
                label="Badge Workflow"
              />
            </span>
          </div>
          <EditableText
            as="h2"
            value={workflow.headline}
            onChange={(v) => updateWorkflow({ headline: v })}
            label="Headline Workflow"
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}
          />
        </Reveal>

        {/* 4 Step Cards Sequential Grid */}
        <div ref={gridRef} className="relative">
          {/* Progressive accent connector that draws itself as the row is scrolled through */}
          <div
            className="hidden lg:block absolute left-0 right-0 top-[38px] h-px pointer-events-none"
            style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)' }}
            aria-hidden="true"
          >
            <span
              ref={lineRef}
              className="block h-full origin-left"
              style={{
                transform: 'scaleX(0)',
                background: `linear-gradient(90deg, ${theme.accentColor || '#6B5CE7'} 0%, ${theme.accentColor || '#6B5CE7'}99 100%)`,
                boxShadow: `0 0 10px ${theme.accentColor || '#6B5CE7'}70`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflow.steps.map((step, idx) => (
            <Reveal key={step.id} variant="up" delay={(idx % 4) * 80} className="flex">
            <div
              className={`w-full group relative p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[290px] ${
                isLight
                  ? 'bg-[#F7F7F8] hover:bg-white border-neutral-200/90 hover:shadow-xl'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06]'
              }`}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${theme.accentColor}80`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isLight ? '#E5E7EB' : 'rgba(255,255,255,0.06)';
              }}
            >
              {/* Top Row: Icon & Step Number with Accent Impact */}
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105"
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                    borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.1)',
                    color: isLight ? '#0A0A0A' : '#FFFFFF',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.accentColor;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isLight ? '#FFFFFF' : 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = isLight ? '#0A0A0A' : '#FFFFFF';
                  }}
                >
                  {renderIcon(step.icon)}
                </div>
                <span
                  className="text-sm font-mono font-bold transition-colors"
                  style={{ color: isLight ? theme.accentColor : accentText }}
                >
                  0{idx + 1}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-8">
                <EditableText
                  as="h3"
                  value={step.title}
                  onChange={(v) => {
                    const next = [...workflow.steps];
                    next[idx] = { ...next[idx], title: v };
                    updateWorkflow({ steps: next });
                  }}
                  label="Judul step"
                  className={`text-xl font-bold mb-3 transition-transform duration-200 group-hover:translate-x-1 ${
                    isLight ? 'text-neutral-950' : 'text-white'
                  }`}
                />
                <EditableText
                  as="p"
                  value={step.description}
                  onChange={(v) => {
                    const next = [...workflow.steps];
                    next[idx] = { ...next[idx], description: v };
                    updateWorkflow({ steps: next });
                  }}
                  label="Deskripsi step"
                  multiline
                  className={`text-xs sm:text-sm font-light leading-relaxed ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                />
              </div>

              {/* Bottom Subtle Indicator */}
              <div
                className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] font-mono ${
                  isLight ? 'border-neutral-200/70 text-neutral-400' : 'border-white/[0.04] text-neutral-300'
                }`}
              >
                <span>
                  <EditableText as="span" value="Phase" overrideKey={`workflow.phaseLabel.${step.id}`} label="Label fase" /> 0{idx + 1}
                </span>
                <span
                  className="font-bold tracking-wide"
                  style={{ color: isLight ? theme.accentColor : accentText }}
                >
                  <EditableText as="span" value="Execution →" overrideKey={`workflow.execution.${step.id}`} label="Teks execution" />
                </span>
              </div>
            </div>
            </Reveal>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};
