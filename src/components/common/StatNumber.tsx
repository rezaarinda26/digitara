import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { EditableText } from '../editorial/Editable';
import { Counter } from './Counter';

interface StatNumberProps {
  value: string;
  onChange?: (value: string) => void;
  overrideKey?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

/**
 * A number that animates from zero when scrolled into view, while staying
 * editable in editorial mode.
 */
export const StatNumber: React.FC<StatNumberProps> = ({
  value,
  onChange,
  overrideKey,
  className = '',
  style,
  label,
}) => {
  const { editorialMode, data } = useCMS();
  const resolved = overrideKey ? data.editorial?.texts?.[overrideKey] ?? value : value;

  if (editorialMode) {
    return (
      <EditableText
        as="span"
        value={resolved}
        onChange={onChange}
        overrideKey={overrideKey}
        label={label}
        className={className}
        style={style}
      />
    );
  }

  return <Counter value={resolved} className={className} />;
};
