import { Briefcase, History, MoreVertical, Star } from 'lucide-react';
import { colors } from '../theme';
import type { Job, SavedJobFilter } from '../types';
import { buildSavedFilterSummary } from '../utils/jobSavedFilters';
import { inferJobRecentSearchLabel } from '../utils/jobRecentSearches';
import { formatViewedAgo } from '../utils/jobRecentlyViewed';

interface JobsSearchHistoryPanelProps {
  savedFilters: SavedJobFilter[];
  recentSearches: string[];
  recentlyViewed: { job: Job; viewedAt: number }[];
  onSavedFilterSelect: (id: string) => void;
  onSavedFilterMenu: (id: string) => void;
  onRecentSearchSelect: (term: string) => void;
  onClearRecentSearches: () => void;
  onRecentlyViewedSelect: (jobId: string) => void;
}

export function JobsSearchHistoryPanel({
  savedFilters,
  recentSearches,
  recentlyViewed,
  onSavedFilterSelect,
  onSavedFilterMenu,
  onRecentSearchSelect,
  onClearRecentSearches,
  onRecentlyViewedSelect,
}: JobsSearchHistoryPanelProps) {
  const showSavedFilters = savedFilters.length > 0;
  const showRecentSearches = recentSearches.length > 0;

  return (
    <div
      className="search-panel-view search-panel-view--visible"
      style={{
        margin: '0 16px',
        background: colors.surface,
        border: `1px solid ${colors.borderLight}`,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {showSavedFilters && (
        <>
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
              Saved Filters
            </span>
          </div>

          {savedFilters.map(saved => {
          const summary = buildSavedFilterSummary(saved.filters);
          return (
            <div
              key={saved.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                padding: '4px 8px 4px 0',
              }}
            >
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => onSavedFilterSelect(saved.id)}
                className="search-result-row"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  minWidth: 0,
                  textAlign: 'left',
                  padding: '10px 6px 10px 14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Star
                  size={16}
                  color={colors.brandTeal}
                  fill={colors.brandTeal}
                  style={{ flexShrink: 0, marginTop: 2 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, lineHeight: 1.3 }}>
                    {saved.name}
                  </div>
                  {summary.map(line => (
                    <div
                      key={line}
                      style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 1.3 }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </button>
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => onSavedFilterMenu(saved.id)}
                aria-label={`Actions for ${saved.name}`}
                style={{
                  flexShrink: 0,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px 8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <MoreVertical size={18} color={colors.textTertiary} />
              </button>
            </div>
          );
        })}

          <div style={{ borderBottom: `1px solid ${colors.borderLight}`, margin: '4px 0' }} />
        </>
      )}
      {showRecentSearches && (
        <>
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
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
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
          </div>

          {recentSearches.map(term => {
            const typeLabel = inferJobRecentSearchLabel(term);
            return (
              <button
                key={term}
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => onRecentSearchSelect(term)}
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
          })}

          <div style={{ borderBottom: `1px solid ${colors.borderLight}`, margin: '4px 0' }} />
        </>
      )}

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
          Recently Viewed Jobs
        </span>
      </div>

      {recentlyViewed.length === 0 ? (
        <div style={{
          padding: '20px 14px 24px',
          textAlign: 'center',
          fontSize: 14,
          color: colors.textTertiary,
        }}>
          No recently viewed jobs.
        </div>
      ) : (
        recentlyViewed.map(({ job, viewedAt }) => (
          <button
            key={job.id}
            type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={() => onRecentlyViewedSelect(job.id)}
            className="search-result-row"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              width: '100%',
              textAlign: 'left',
              padding: '10px 14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: `${colors.brandTeal}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Briefcase size={16} color={colors.brandTeal} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, lineHeight: 1.3 }}>
                {job.id}
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2, lineHeight: 1.3 }}>
                {job.templateName}
              </div>
              <div style={{ fontSize: 12, color: colors.textTertiary, marginTop: 2, lineHeight: 1.3 }}>
                {job.siteName}
              </div>
            </div>
            <div style={{
              fontSize: 12,
              color: colors.textTertiary,
              flexShrink: 0,
              textAlign: 'right',
              lineHeight: 1.3,
              maxWidth: 100,
            }}>
              {formatViewedAgo(viewedAt)}
            </div>
          </button>
        ))
      )}
    </div>
  );
}
