import { History, MoreVertical, Star } from 'lucide-react';
import { colors } from '../theme';
import type { FilterValues, SavedFilter } from '../types';
import type { ListConfig } from '../config/listConfigs';
import { inferRecentSearchLabel } from '../utils/recentSearches';
import { formatViewedAgo } from '../utils/recentlyViewed';

const MAX_SAVED_FILTER_LABELS = 2;

function getSavedFilterLabels<T>(config: ListConfig<T>, filters: FilterValues): string[] {
  const labels: string[] = [];
  for (const field of config.filterFields) {
    for (const value of filters[field.key] ?? []) {
      labels.push(value);
    }
  }
  return labels;
}

function SavedFilterSummaryText({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;

  const visible = labels.slice(0, MAX_SAVED_FILTER_LABELS);
  const overflow = labels.length - visible.length;
  const summary = overflow > 0
    ? `${visible.join(' • ')} +${overflow}`
    : visible.join(' • ');

  return (
    <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.4 }}>
      {summary}
    </div>
  );
}

interface SearchHistoryPanelProps<T> {
  config: ListConfig<T>;
  savedFilters: SavedFilter[];
  recentSearches: string[];
  recentlyViewed: { item: T; viewedAt: number }[];
  onSavedFilterSelect: (id: string) => void;
  onSavedFilterMenu: (id: string) => void;
  onRecentSearchSelect: (term: string) => void;
  onClearRecentSearches: () => void;
  onRecentlyViewedSelect: (id: string) => void;
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textSecondary,
};

export function SearchHistoryPanel<T>({
  config,
  savedFilters,
  recentSearches,
  recentlyViewed,
  onSavedFilterSelect,
  onSavedFilterMenu,
  onRecentSearchSelect,
  onClearRecentSearches,
  onRecentlyViewedSelect,
}: SearchHistoryPanelProps<T>) {
  const showSavedFilters = savedFilters.length > 0;
  const showRecentSearches = recentSearches.length > 0;

  return (
    <div
      className="search-panel-view search-panel-view--visible"
      style={{ margin: '0 16px', background: colors.surface, border: `1px solid ${colors.borderLight}`, borderRadius: 8, overflow: 'hidden' }}
    >
      {showRecentSearches && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 6px' }}>
            <span style={sectionLabelStyle}>Recent Searches</span>
            <button
              type="button"
              onPointerDown={e => e.preventDefault()}
              onClick={onClearRecentSearches}
              style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: colors.brandTeal, cursor: 'pointer', padding: 0 }}
            >
              Clear
            </button>
          </div>

          {recentSearches.map(term => {
            const typeLabel = inferRecentSearchLabel(config, term);
            return (
              <button
                key={term}
                type="button"
                onPointerDown={e => e.preventDefault()}
                onClick={() => onRecentSearchSelect(term)}
                className="search-result-row"
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <History size={16} color={colors.textTertiary} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, color: colors.textPrimary, lineHeight: 1.3 }}>{term}</div>
                  {typeLabel && (
                    <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{typeLabel}</div>
                  )}
                </div>
              </button>
            );
          })}

          <div style={{ borderBottom: `1px solid ${colors.borderLight}`, margin: '4px 0' }} />
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 6px' }}>
        <span style={sectionLabelStyle}>{config.recentViewed.heading}</span>
      </div>

      {recentlyViewed.length === 0 ? (
        <div style={{ padding: '20px 14px 24px', textAlign: 'center', fontSize: 14, color: colors.textTertiary }}>
          {config.recentViewed.empty}
        </div>
      ) : (
        recentlyViewed.map(({ item, viewedAt }) => {
          const id = config.getId(item);
          const title = config.recentViewed.getTitle(item);
          const lines = config.recentViewed.getLines(item);
          return (
            <button
              key={id}
              type="button"
              onPointerDown={e => e.preventDefault()}
              onClick={() => onRecentlyViewedSelect(id)}
              className="search-result-row"
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 6, background: `${colors.brandTeal}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {config.recentViewed.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, lineHeight: 1.3 }}>{title}</div>
                {lines.map((line, i) => (
                  <div
                    key={i}
                    style={{ fontSize: i === 0 ? 13 : 12, color: i === 0 ? colors.textSecondary : colors.textTertiary, marginTop: 2, lineHeight: 1.3 }}
                  >
                    {line}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: colors.textTertiary, flexShrink: 0, textAlign: 'right', lineHeight: 1.3, maxWidth: 100 }}>
                {formatViewedAgo(viewedAt)}
              </div>
            </button>
          );
        })
      )}

      {showSavedFilters && (
        <>
          <div style={{ borderBottom: `1px solid ${colors.borderLight}`, margin: '4px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 6px' }}>
            <span style={sectionLabelStyle}>Saved Filters</span>
          </div>

          {savedFilters.map(saved => {
            const chipLabels = getSavedFilterLabels(config, saved.filters);
            return (
              <div key={saved.id} style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    onPointerDown={e => e.preventDefault()}
                    onClick={() => onSavedFilterSelect(saved.id)}
                    className="search-result-row"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      minWidth: 0,
                      textAlign: 'left',
                      padding: 0,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Star size={16} color={colors.brandTeal} fill={colors.brandTeal} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 600, color: colors.textPrimary, lineHeight: 1.3 }}>
                      {saved.name}
                    </div>
                  </button>
                  <button
                    type="button"
                    onPointerDown={e => e.preventDefault()}
                    onClick={() => onSavedFilterMenu(saved.id)}
                    aria-label={`Actions for ${saved.name}`}
                    style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    <MoreVertical size={18} color={colors.textTertiary} />
                  </button>
                </div>
                {chipLabels.length > 0 && (
                  <button
                    type="button"
                    onPointerDown={e => e.preventDefault()}
                    onClick={() => onSavedFilterSelect(saved.id)}
                    className="search-result-row"
                    style={{
                      width: '100%',
                      marginTop: 8,
                      padding: 0,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <SavedFilterSummaryText labels={chipLabels} />
                  </button>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
