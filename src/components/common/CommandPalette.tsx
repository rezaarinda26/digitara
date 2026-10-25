import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Layout,
  FolderKanban,
  Palette,
  Settings2,
  Pencil,
  Download,
  CornerDownLeft,
  ArrowUpRight,
  Hash,
  Undo2,
  Redo2,
  Upload,
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { usePresence } from '../../hooks/usePresence';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ThemeMode } from '../../types/cms';

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ElementType;
  run: () => void;
}

const THEME_LABELS: Record<ThemeMode, string> = {
  'reference-hybrid': 'Reference Hybrid',
  'light-minimal': 'Clean Light Minimalist',
  'dark-obsidian': 'Dark Mode Obsidian',
  midnight: 'Midnight Blue & Slate',
  custom: 'Tema Kustom (Bebas)',
};

const SECTION_COMMANDS: { id: string; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'midBanner', label: 'Mid Banner' },
  { id: 'portfolio', label: 'Selected Projects' },
  { id: 'workflow', label: 'Creative Workflow' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: 'smooth' });
};

export const CommandPalette: React.FC = () => {
  const { data, setIsAdminOpen, setEditorialMode, editorialMode, setActiveProjectModal, updateTheme, exportJSON, showToast, undo, redo, publish } =
    useCMS();
  const isLightMode = data.theme.bgMode === 'light-minimal';
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { isMounted, isClosing } = usePresence(open, 180);
  useFocusTrap(isMounted, panelRef);

  // Toggle with Ctrl/Cmd + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const list: Command[] = [];

    SECTION_COMMANDS.forEach((s) => {
      list.push({
        id: `section-${s.id}`,
        label: `Go to ${s.label}`,
        hint: '#' + s.id,
        group: 'Sections',
        icon: Hash,
        run: () => scrollToId(s.id),
      });
    });

    data.portfolio.items.forEach((p) => {
      list.push({
        id: `project-${p.id}`,
        label: p.title,
        hint: p.category,
        group: 'Projects',
        icon: FolderKanban,
        run: () => setActiveProjectModal(p),
      });
    });

    (Object.keys(THEME_LABELS) as ThemeMode[]).forEach((mode) => {
      list.push({
        id: `theme-${mode}`,
        label: `Theme: ${THEME_LABELS[mode]}`,
        group: 'Theme',
        icon: Palette,
        run: () => updateTheme({ bgMode: mode }),
      });
    });

    list.push({
      id: 'open-cms',
      label: 'Open CMS Studio',
      hint: 'Alt + A',
      group: 'Actions',
      icon: Settings2,
      run: () => setIsAdminOpen(true),
    });

    list.push({
      id: 'toggle-editorial',
      label: editorialMode ? 'Exit Editorial Mode' : 'Enter Editorial Mode',
      group: 'Actions',
      icon: Pencil,
      run: () => {
        setEditorialMode(!editorialMode);
        showToast(editorialMode ? 'Mode editorial dimatikan' : 'Mode editorial aktif');
      },
    });

    list.push({
      id: 'export-json',
      label: 'Export CMS data as JSON',
      group: 'Actions',
      icon: Download,
      run: () => {
        try {
          const blob = new Blob([exportJSON()], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `digitara-cms-data-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('CMS JSON berhasil diunduh');
        } catch {
          showToast('Gagal mengekspor JSON');
        }
      },
    });

    list.push({
      id: 'undo',
      label: 'Undo perubahan terakhir',
      hint: 'Ctrl+Z',
      group: 'Actions',
      icon: Undo2,
      run: () => undo(),
    });

    list.push({
      id: 'redo',
      label: 'Redo perubahan',
      hint: 'Ctrl+Shift+Z',
      group: 'Actions',
      icon: Redo2,
      run: () => redo(),
    });

    list.push({
      id: 'publish',
      label: 'Publish snapshot konten',
      group: 'Actions',
      icon: Upload,
      run: () => publish(),
    });

    return list;
  }, [data.portfolio.items, editorialMode, setIsAdminOpen, setEditorialMode, setActiveProjectModal, updateTheme, exportJSON, showToast, undo, redo, publish]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        (c.hint || '').toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setIndex((i) => (i >= filtered.length ? 0 : i));
  }, [filtered.length]);

  const runAt = (i: number) => {
    const cmd = filtered[i];
    if (!cmd) return;
    cmd.run();
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAt(index);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!isMounted) return;
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
  }, [isMounted]);

  // Keep the highlighted row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  if (!isMounted) return null;

  let lastGroup = '';

  return createPortal(
    <div
      className={`fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] backdrop-blur-sm ${
        isLightMode ? 'bg-neutral-900/40' : 'bg-black/70'
      } ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      onClick={() => setOpen(false)}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl ${
          isLightMode ? 'bg-white border-neutral-200' : 'bg-[#0D0D11] border-white/15'
        } ${isClosing ? 'animate-zoom-out' : 'animate-zoom-in'}`}
      >
        {/* Search input */}
        <div className={`flex items-center gap-3 px-4 py-3.5 border-b ${isLightMode ? 'border-neutral-200' : 'border-white/10'}`}>
          <Search className={`w-4 h-4 shrink-0 ${isLightMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Cari section, project, tema, atau aksi…"
            className={`flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500 ${
              isLightMode ? 'text-neutral-900' : 'text-white'
            }`}
            aria-label="Search commands"
          />
          <kbd
            className={`hidden sm:block px-1.5 py-0.5 rounded text-[10px] font-mono border ${
              isLightMode ? 'border-neutral-200 text-neutral-500' : 'border-white/15 text-neutral-500'
            }`}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className={`px-3 py-8 text-center text-xs ${isLightMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Tidak ada hasil untuk &ldquo;{query}&rdquo;
            </p>
          )}

          {filtered.map((cmd, i) => {
            const showGroup = cmd.group !== lastGroup;
            lastGroup = cmd.group;
            const Icon = cmd.icon;
            const active = i === index;
            return (
              <React.Fragment key={cmd.id}>
                {showGroup && (
                  <div
                    className={`px-3 pt-3 pb-1.5 text-[10px] font-mono uppercase tracking-widest ${
                      isLightMode ? 'text-neutral-500' : 'text-neutral-600'
                    }`}
                  >
                    {cmd.group}
                  </div>
                )}
                <button
                  type="button"
                  data-active={active}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => runAt(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors ${
                    active
                      ? isLightMode
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'bg-white/[0.08] text-white'
                      : isLightMode
                      ? 'text-neutral-700 hover:bg-neutral-50'
                      : 'text-neutral-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 opacity-70" />
                  <span className="flex-1 truncate">{cmd.label}</span>
                  {cmd.hint && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isLightMode ? 'bg-neutral-100 text-neutral-500' : 'bg-white/[0.07] text-neutral-500'
                      }`}
                    >
                      {cmd.hint}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer hints */}
        <div
          className={`flex items-center justify-between px-4 py-2.5 border-t text-[10px] font-mono ${
            isLightMode ? 'border-neutral-200 text-neutral-500' : 'border-white/10 text-neutral-600'
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> run
            </span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> navigate
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Layout className="w-3 h-3" /> {filtered.length} results
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};
