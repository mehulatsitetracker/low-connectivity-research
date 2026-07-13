import { useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, X, History } from 'lucide-react';
import { colors, radii } from '../theme';
import { inferRecentSearchLabel } from '../utils/search';

interface LiveSearchBarProps {
  query: string;
  focused: boolean;
  recentSearches: string[];
  onQueryChange: (query: string) => void;
  onFocus: () => void;
  onDismiss?: () => void;
  onClear: () => void;
  onRecentSelect: (term: string) => void;
  onClearRecentSearches: () => void;
  panelContent?: React.ReactNode;
  activeFilterCount?: number;
  hasActiveFilters?: boolean;
  onFilterClick?: () => void;
}

export function LiveSearchBar({
  query,
  focused,
  recentSearches,
  onQueryChange,
  onFocus,
  onDismiss,
  onClear,
  onRecentSelect,
  onClearRecentSearches,
  panelContent,
  activeFilterCount = 0,
  hasActiveFilters = false,
  onFilterClick,
}: LiveSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [focused]);

  useEffect(() => {
    if (!focused || !onDismiss) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    let active = true;
    const id = window.requestAnimationFrame(() => {
      if (!active) return;
      document.addEventListener('pointerdown', handlePointerDown);
    });
    return () => {
      active = false;
      window.cancelAnimationFrame(id);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [focused, onDismiss]);

  const focusField = () => {
    inputRef.current?.focus();
    onFocus();
  };

  const showRecent = focused && query.length === 0 && !hasActiveFilters;
  const showResults = focused && (query.length > 0 || hasActiveFilters);
  const showPanel = showRecent || showResults;

  return (
    <div
      ref={containerRef}
      className="live-search-container"
      style={{ position: 'relative', zIndex: 20, margin: '12px 16px 0' }}
    >
      <div
        className={`live-search-module${focused ? ' live-search-module--focused' : ''}`}
        style={{
          background: colors.surface,
          border: `1px solid ${focused ? colors.brandTeal : colors.border}`,
          borderRadius: radii.input,
          boxShadow: focused ? `0 0 0 2px ${colors.brandTealLight}` : 'none',
          overflow: 'hidden',
        }}
      >
        <div
          className={`live-search-field${focused ? ' live-search-field--focused' : ''}`}
          onClick={e => {
            if ((e.target as HTMLElement).closest('button')) return;
            focusField();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '7px 12px',
            height: 36,
            cursor: 'text',
          }}
        >
          <Search size={17} color={colors.textTertiary} style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            value={query}
            placeholder={focused ? '' : 'Search'}
            onChange={e => onQueryChange(e.target.value)}
            onFocus={onFocus}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 15,
              lineHeight: '20px',
              color: colors.textPrimary,
              background: 'transparent',
              minWidth: 0,
              padding: 0,
              margin: 0,
            }}
          />
          {query.length > 0 && (
            <button
              type="button"
              onPointerDown={e => e.preventDefault()}
              onClick={onClear}
              aria-label="Clear search"
              className="search-clear-btn"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0,
              }}
            >
              <X size={17} color={colors.textTertiary} />
            </button>
          )}
          {onFilterClick && (
            <button
              type="button"
              onClick={onFilterClick}
              aria-label="Filters"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 2, display: 'flex', alignItems: 'center', position: 'relative', flexShrink: 0,
              }}
            >
              <SlidersHorizontal size={18} color={colors.textSecondary} />
              {activeFilterCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -6,
                  minWidth: 16, height: 16, borderRadius: 8,
                  background: colors.brandTeal, color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>

        {showPanel && (
          <div
            className="live-search-panel"
            style={{
              borderTop: `1px solid ${colors.borderLight}`,
            }}
          >
            {showRecent && (
              <div className="search-panel-view search-panel-view--visible">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px 6px',
                }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    color: colors.textSecondary,
                  }}>
                    Recent Searches
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onPointerDown={e => e.preventDefault()}
                      onClick={onClearRecentSearches}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 14,
                        fontWeight: 500,
                        color: colors.brandTeal,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                {recentSearches.length === 0 ? (
                  <div style={{
                    padding: '20px 14px 24px',
                    textAlign: 'center',
                    fontSize: 14,
                    color: colors.textTertiary,
                  }}>
                    No recent searches
                  </div>
                ) : (
                  recentSearches.slice(0, 5).map(term => {
                    const typeLabel = inferRecentSearchLabel(term);
                    return (
                      <button
                        key={term}
                        type="button"
                        onPointerDown={e => e.preventDefault()}
                        onClick={() => {
                          onRecentSelect(term);
                          inputRef.current?.focus();
                        }}
                        className="search-result-row"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 14px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <History size={16} color={colors.textTertiary} style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, color: colors.textPrimary, lineHeight: 1.3 }}>
                            {term}
                          </div>
                          {typeLabel && (
                            <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                              {typeLabel}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
            {showResults && (
              <div className="search-panel-view search-panel-view--visible">
                {panelContent}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
