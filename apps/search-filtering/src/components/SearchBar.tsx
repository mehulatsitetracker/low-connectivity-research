import { colors, radii } from '../theme';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  activeFilterCount?: number;
  onFilterClick?: () => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
}

export function SearchBar({
  placeholder = 'Search...',
  activeFilterCount = 0,
  onFilterClick,
  query = '',
  onQueryChange,
  onFocus,
  onBlur,
  focused = false,
}: SearchBarProps) {
  const interactive = onQueryChange !== undefined;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '12px 16px',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        background: colors.surface,
        border: `1px solid ${focused ? colors.brandTeal : colors.border}`,
        borderRadius: radii.input,
        minWidth: 0,
        boxShadow: focused ? `0 0 0 2px ${colors.brandTealLight}` : 'none',
        transition: 'border-color 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}>
        <Search size={18} color={colors.textTertiary} />
        {interactive ? (
          <>
            <input
              type="text"
              value={query}
              placeholder={placeholder}
              onChange={e => onQueryChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 15,
                color: colors.textPrimary,
                background: 'transparent',
                minWidth: 0,
              }}
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                aria-label="Clear search"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0,
                }}
              >
                <X size={18} color={colors.textTertiary} />
              </button>
            )}
          </>
        ) : (
          <span style={{ fontSize: 15, color: colors.textTertiary }}>{placeholder}</span>
        )}
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        aria-label="Filters"
        style={{
          flexShrink: 0,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.input,
          cursor: onFilterClick ? 'pointer' : 'default',
          padding: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <SlidersHorizontal size={20} color={colors.textSecondary} />
        {activeFilterCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            background: colors.brandTeal,
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
          }}>
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
