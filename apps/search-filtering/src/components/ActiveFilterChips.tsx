import { X } from 'lucide-react';
import { colors, radii } from '../theme';
import { HighlightedText } from './HighlightedText';
import type { ActiveFilterChip } from '../types';

interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  onRemove?: (chipId: string) => void;
  highlightQuery?: string;
  readOnly?: boolean;
  wrap?: boolean;
  padding?: string;
  resultCount?: number;
}

function formatResultCount(count: number): string {
  const label = count === 1 ? 'result' : 'results';
  return `Found (${count}) ${label}`;
}

export function ActiveFilterChips({
  chips,
  onRemove,
  highlightQuery = '',
  readOnly = false,
  wrap = false,
  padding = '10px 16px 0',
  resultCount,
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  const showResultCount = resultCount !== undefined;

  const chipStyle = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: readOnly ? '4px 10px' : '5px 10px 5px 12px',
    borderRadius: radii.pill,
    fontSize: readOnly ? 12 : 13,
    fontWeight: 500,
    border: `1px solid ${colors.brandTeal}`,
    background: colors.brandTealLight,
    color: colors.brandTeal,
  } as const;

  return (
    <div style={{ padding }}>
      <div style={{
        display: 'flex',
        gap: readOnly ? 6 : 8,
        overflowX: wrap ? 'visible' : 'auto',
        flexWrap: wrap ? 'wrap' : 'nowrap',
      }}>
        {chips.map(chip => (
          readOnly ? (
            <span key={chip.id} style={chipStyle}>
              <HighlightedText text={chip.label} query={highlightQuery} />
            </span>
          ) : (
            <button
              key={chip.id}
              type="button"
              onClick={() => onRemove?.(chip.id)}
              style={{ ...chipStyle, cursor: 'pointer' }}
            >
              <HighlightedText text={chip.label} query={highlightQuery} />
              <X size={14} strokeWidth={2.5} />
            </button>
          )
        ))}
      </div>
      {showResultCount && (
        <div style={{
          marginTop: 8,
          fontSize: 13,
          fontWeight: 500,
          color: colors.textSecondary,
        }}>
          {formatResultCount(resultCount)}
        </div>
      )}
    </div>
  );
}
