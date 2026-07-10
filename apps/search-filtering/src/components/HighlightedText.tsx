import { Fragment } from 'react';
import { colors } from '../theme';

interface HighlightedTextProps {
  text: string;
  query: string;
  highlightColor?: string;
  highlightBackground?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function HighlightedText({
  text,
  query,
  highlightColor = colors.brandTeal,
  highlightBackground = colors.brandTealLight,
}: HighlightedTextProps) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const pattern = new RegExp(`(${escapeRegExp(q)})`, 'gi');
  const parts = text.split(pattern);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = i % 2 === 1;
        if (!isMatch) return <Fragment key={i}>{part}</Fragment>;
        return (
          <mark
            key={i}
            style={{
              color: highlightColor,
              background: highlightBackground,
              fontWeight: 700,
              borderRadius: 2,
              padding: '0 1px',
            }}
          >
            {part}
          </mark>
        );
      })}
    </>
  );
}
