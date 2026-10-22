import React, { useEffect, useRef, useState } from 'react';

interface SmartImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  /** CSS aspect-ratio for the frame, e.g. '16 / 9'. Prevents layout shift. */
  aspectRatio?: string;
  /** Eager-load + high priority for LCP images (hero). */
  priority?: boolean;
  /** Placeholder tint behind the image while it loads. */
  placeholderClassName?: string;
  /** Extra classes for the <img> itself. */
  imgClassName?: string;
  /** Extra classes for the wrapper frame. */
  frameClassName?: string;
}

/**
 * Image with a reserved aspect-ratio box, a tinted placeholder and a soft
 * fade-in once the bitmap is ready. Prevents CLS and avoids the "flash of
 * empty box" that makes a page feel unpolished.
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt = '',
  aspectRatio,
  priority = false,
  placeholderClassName = 'bg-neutral-200',
  imgClassName = '',
  frameClassName = '',
  style,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // A cached image can already be complete before React attaches onLoad.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden ${placeholderClassName} ${frameClassName}`}
      style={{ ...(aspectRatio ? { aspectRatio } : {}), ...style }}
    >
      <img
        {...rest}
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};
