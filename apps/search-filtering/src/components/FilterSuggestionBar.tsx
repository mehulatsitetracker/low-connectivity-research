import { SlidersHorizontal } from 'lucide-react';
import { colors, radii } from '../theme';
import { HighlightedText } from './HighlightedText';
import type { FilterSuggestion } from '../types';

interface FilterSuggestionBarProps {
  suggestions: FilterSuggestion[];
  highlightQuery: string;
  onApply: (suggestion: FilterSuggestion) => void;
}

export function FilterSuggestionBar({ suggestions, highlightQuery, onApply }: FilterSuggestionBarProps) {
  if (suggestions.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px 12px' }}>
      {suggestions.map(suggestion => (
        <button
          key={suggestion.id}
          type="button"
          onClick={() => onApply(suggestion)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px',
            borderRadius: radii.card, border: `1px solid ${colors.border}`, background: colors.surface,
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <SlidersHorizontal size={16} color={colors.brandTeal} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: colors.textPrimary, minWidth: 0 }}>
            <HighlightedText text={suggestion.label} query={highlightQuery} />
          </span>
        </button>
      ))}
    </div>
  );
}
