import React, { useRef, useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';

/**
 * Compress an uploaded image into a reasonably sized JPEG data URL so it can be
 * persisted inside the CMS (localStorage) without blowing the storage quota.
 */
export const compressImage = (file: File, maxDim = 1600, quality = 0.85): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

/* ------------------------------------------------------------------ */
/* EditableText                                                        */
/* ------------------------------------------------------------------ */

interface EditableTextProps {
  value: string;
  onChange?: (value: string) => void;
  overrideKey?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  editClassName?: string;
  editStyle?: React.CSSProperties;
  multiline?: boolean;
  label?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  overrideKey,
  as: Tag = 'span',
  className = '',
  style,
  editClassName = '',
  editStyle,
  multiline = false,
  label,
}) => {
  const { editorialMode, data, setEditorialText } = useCMS();
  const Comp = Tag as any;
  const resolved = overrideKey ? data.editorial?.texts?.[overrideKey] ?? value : value;
  const commit = (next: string) => {
    if (overrideKey) setEditorialText(overrideKey, next);
    else onChange?.(next);
  };
  const ref = useRef<HTMLElement>(null);

  // In editorial mode React must NOT manage the editable text node, otherwise
  // contentEditable edits can leak into sibling elements. We set the text
  // imperatively and only when the external value actually changes.
  useEffect(() => {
    if (editorialMode && ref.current && ref.current.textContent !== resolved) {
      ref.current.textContent = resolved;
    }
  }, [editorialMode, resolved]);

  if (!editorialMode) {
    return (
      <Comp key="static" className={className} style={style}>
        {resolved}
      </Comp>
    );
  }

  return (
    <Comp
      key="edit"
      ref={ref}
      className={`${className} ${editClassName} outline-dashed outline-1 outline-offset-2 outline-[#6B5CE7]/70 hover:outline-[#6B5CE7] focus:outline-2 focus:outline-[#22C55E] rounded-sm cursor-text transition-[outline] duration-150`}
      style={{ ...style, ...(editStyle || {}) }}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      title={label ? `Klik untuk edit: ${label}` : 'Klik untuk mengedit teks'}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const next = (e.currentTarget.textContent ?? '').replace(/\n+$/g, '');
        if (next !== resolved) commit(next);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
        if (multiline && e.key === 'Escape') {
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* EditableImage                                                       */
/* ------------------------------------------------------------------ */

interface EditableImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  /** Eager-load with high priority (use for LCP images such as the hero). */
  priority?: boolean;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  value,
  onChange,
  className = '',
  label,
  priority = false,
  ...rest
}) => {
  const { editorialMode, showToast } = useCMS();
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // A cached image can already be "complete" before React attaches the
  // onLoad handler, which would leave it stuck at opacity-0.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [value]);

  const handleFile = async (file: File) => {
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
      showToast('Foto berhasil diperbarui');
    } catch {
      showToast('Gagal memuat foto');
    }
  };

  const imgProps = {
    ...rest,
    src: value,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    ...(priority ? { fetchPriority: 'high' as const } : {}),
    referrerPolicy: 'no-referrer' as const,
    onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      (rest as any).onLoad?.(e);
    },
  };

  if (!editorialMode) {
    return (
      <img
        {...imgProps}
        ref={imgRef}
        className={`${className} transition-opacity duration-700 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    );
  }

  return (
    <>
      <img
        {...imgProps}
        ref={imgRef}
        className={`${className} cursor-pointer ring-2 ring-[#6B5CE7] hover:ring-4 ring-offset-1 ring-offset-black/40 transition-all`}
        title={label ? `Klik untuk ganti foto: ${label}` : 'Klik untuk ganti foto'}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.click();
        }}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </>
  );
};

/* ------------------------------------------------------------------ */
/* ImageUploadTrigger                                                  */
/* ------------------------------------------------------------------ */

interface ImageUploadTriggerProps {
  onChange: (value: string) => void;
  className?: string;
  title?: string;
  children: React.ReactNode;
}

export const ImageUploadTrigger: React.FC<ImageUploadTriggerProps> = ({
  onChange,
  className = '',
  title = 'Ganti gambar',
  children,
}) => {
  const { showToast } = useCMS();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
      showToast('Foto berhasil diperbarui');
    } catch {
      showToast('Gagal memuat foto');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className={className}
        title={title}
      >
        {children}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </>
  );
};

/* ------------------------------------------------------------------ */
/* DraggableBox                                                       */
/* ------------------------------------------------------------------ */

interface DraggableBoxProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  label?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: string;
}

export const DraggableBox: React.FC<DraggableBoxProps> = ({
  id,
  as: Tag = 'div',
  className = '',
  style,
  children,
  label,
  ...rest
}) => {
  const { editorialMode, data, setEditorialOffset } = useCMS();
  const offset = data.editorial?.offsets?.[id] || { x: 0, y: 0 };
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const startRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  const pos = drag ?? offset;
  const Comp = Tag as any;

  const onPointerDown = (e: React.PointerEvent) => {
    if (!editorialMode) return;
    const target = e.target as HTMLElement;
    if (target.isContentEditable || target.closest('[contenteditable="true"]')) return;
    startRef.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
    setDrag(offset);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current || !drag) return;
    setDrag({
      x: startRef.current.ox + (e.clientX - startRef.current.px),
      y: startRef.current.oy + (e.clientY - startRef.current.py),
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!startRef.current || !drag) return;
    setEditorialOffset(id, drag);
    startRef.current = null;
    setDrag(null);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <Comp
      {...rest}
      className={`${className} ${
        editorialMode
          ? 'relative outline-dashed outline-1 outline-offset-2 outline-[#22C55E]/80 touch-none'
          : ''
      }`}
      style={{
        ...style,
        translate: `${pos.x}px ${pos.y}px`,
        ...(editorialMode ? { cursor: 'move' } : {}),
      }}
      title={editorialMode ? `Geser ${label || 'elemen'} · double klik untuk reset` : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={(e: React.MouseEvent) => {
        if (editorialMode) {
          e.preventDefault();
          e.stopPropagation();
        }
        (rest as any).onClick?.(e);
      }}
      onDoubleClick={() => {
        if (editorialMode && (offset.x !== 0 || offset.y !== 0)) {
          setEditorialOffset(id, { x: 0, y: 0 });
        }
      }}
    >
      {children}
    </Comp>
  );
};
