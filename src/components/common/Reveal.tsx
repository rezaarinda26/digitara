import React from 'react';
import { useReveal } from '../../hooks/useReveal';

type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'fade' | 'zoom' | 'mask';

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  variant?: RevealVariant;
  delay?: number;
  threshold?: number;
  once?: boolean;
  /** Background colour of the curtain used by the "mask" variant. */
  curtain?: string;
}

const variantClass: Record<RevealVariant, string> = {
  up: 'reveal-up',
  down: 'reveal-down',
  left: 'reveal-left',
  right: 'reveal-right',
  fade: 'reveal-fade',
  zoom: 'reveal-zoom',
  mask: 'reveal-mask',
};

export const Reveal: React.FC<RevealProps> = ({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  threshold = 0.15,
  once = true,
  curtain,
  className = '',
  style,
  children,
  ...rest
}) => {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold, once });
  const Comp = Tag as any;

  return (
    <Comp
      ref={ref}
      className={`reveal ${variantClass[variant]} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={
        {
          transitionDelay: `${delay}ms`,
          ...(curtain ? ({ ['--reveal-curtain']: curtain } as React.CSSProperties) : {}),
          ...style,
        }
      }
      {...rest}
    >
      {children}
    </Comp>
  );
};
