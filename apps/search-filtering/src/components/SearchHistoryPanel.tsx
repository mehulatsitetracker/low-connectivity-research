import { History } from 'lucide-react';
import { colors } from '../theme';
import type { ListConfig } from '../config/listConfigs';
import { inferRecentSearchLabel } from '../utils/recentSearches';
import { formatViewedAgo } from '../utils/recentlyViewed';

interface SearchHistoryPanelProps<T> {
  config: ListConfig<T>;
  recentSearches: string[];
  recentlyViewed: { item: T; viewedAt: number }[];
  onRecentSearchSelect: (term: string) => void;
  onClearRecentSearches: () => void;
  onRecentlyViewedSelect: (id: string) => void;
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textSecondary,
};

export function SearchHistoryPanel<T>({
  config,
  recentSearches,
  recentlyViewed,
  onRecentSearchSelect,
  onClearRecentSearches,
  onRecentlyViewedSelect,
}: SearchHistoryPanelProps<T>) {
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
    </div>
  );
}
