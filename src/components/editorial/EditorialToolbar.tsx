import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Pencil, MousePointer2, Move, ImagePlus, RotateCcw, Check, Settings2 } from 'lucide-react';

export const EditorialToolbar: React.FC = () => {
  const { editorialMode, setEditorialMode, setIsAdminOpen, resetEditorialOffsets, resetEditorialTexts, data, isAdminOpen } = useCMS();

  if (!editorialMode || isAdminOpen) return null;

  const offsetCount = Object.keys(data.editorial?.offsets || {}).length;
  const textCount = Object.keys(data.editorial?.texts || {}).length;

  return (
    <>
      {/* Status strip (positioned above the bottom control bar so it never covers the navbar) */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] pointer-events-none px-4 w-full max-w-3xl">
        <div className="flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-[#141419]/95 border border-[#6B5CE7]/50 backdrop-blur-xl shadow-2xl text-[11px] text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white uppercase tracking-wider">Mode Editorial Aktif</span>
          <span className="hidden sm:inline text-neutral-500">
            Klik teks untuk edit · Klik gambar untuk ganti · Geser elemen untuk pindah posisi
          </span>
        </div>
      </div>

      {/* Bottom control bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] w-fit max-w-[calc(100%-2rem)]">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-2xl bg-[#141419]/95 border border-[#6B5CE7]/40 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 pl-1 pr-2 border-r border-white/10">
            <div className="w-7 h-7 rounded-lg bg-[#6B5CE7] flex items-center justify-center text-white">
              <Pencil className="w-3.5 h-3.5" />
            </div>
            <span className="hidden md:block text-xs font-semibold text-white whitespace-nowrap">
              Editorial
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <MousePointer2 className="w-3 h-3" /> Teks
            </span>
            <span className="flex items-center gap-1">
              <ImagePlus className="w-3 h-3" /> Foto
            </span>
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3" /> Geser
            </span>
          </div>

          <div className="flex-1" />

          <button
            type="button"
            onClick={resetEditorialOffsets}
            disabled={offsetCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors disabled:opacity-30 disabled:pointer-events-none whitespace-nowrap"
            title="Kembalikan semua posisi elemen yang digeser"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Posisi</span>
          </button>

          <button
            type="button"
            onClick={resetEditorialTexts}
            disabled={textCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors disabled:opacity-30 disabled:pointer-events-none whitespace-nowrap"
            title="Kembalikan semua teks yang diubah ke teks asli"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Teks</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors whitespace-nowrap"
            title="Buka kembali Headless CMS Studio"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buka CMS</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorialMode(false)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-colors whitespace-nowrap"
            title="Selesai & keluar dari mode editorial (Esc)"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Selesai</span>
          </button>
        </div>
      </div>
    </>
  );
};
