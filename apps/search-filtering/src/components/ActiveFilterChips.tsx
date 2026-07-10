import { X } from 'lucide-react';
import { colors, radii } from '../theme';
import { HighlightedText } from './HighlightedText';
import type { ActiveFilterChip } from '../types';

interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  onRemove: (chipId: string) => void;
  highlightQuery?: string;
}

export function ActiveFilterChips({ chips, onRemove, highlightQuery = '' }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      padding: '10px 16px 0',
      overflowX: 'auto',
      flexWrap: 'nowrap',
    }}>
      {chips.map(chip => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onRemove(chip.id)}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px 5px 12px',
            borderRadius: radii.pill,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            border: `1px solid ${colors.brandTeal}`,
            background: colors.brandTealLight,
            color: colors.brandTeal,
          }}
        >
          <HighlightedText text={chip.label} query={highlightQuery} />
          <X size={14} strokeWidth={2.5} />
        </button>
      ))}
    </div>
  );
}
