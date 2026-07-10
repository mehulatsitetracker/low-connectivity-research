import { Briefcase, MapPin, FolderOpen, Package } from 'lucide-react';
import { colors } from '../theme';
import { HighlightedText } from './HighlightedText';
import type { ObjectType, SearchResult } from '../types';

const TYPE_CONFIG: Record<ObjectType, { icon: typeof Briefcase; tint: string }> = {
  job: { icon: Briefcase, tint: '#00847C' },
  site: { icon: MapPin, tint: '#1976D2' },
  project: { icon: FolderOpen, tint: '#7B1FA2' },
  template: { icon: Package, tint: '#455A64' },
};

interface SearchResultsListProps {
  groups: { type: ObjectType; label: string; items: SearchResult[] }[];
  onSelect: (result: SearchResult) => void;
  query?: string;
  empty?: boolean;
  inline?: boolean;
}

export function SearchResultsList({ groups, onSelect, query = '', empty, inline }: SearchResultsListProps) {
  if (empty) {
    return (
      <div style={{
        padding: inline ? '28px 16px' : '32px 16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, marginBottom: 12 }}>
          No matching records found.
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
          Try searching by:
          <br />
          • Job ID
          <br />
          • Site Name
          <br />
          • Project Name
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: inline ? '4px 0' : '8px 0' }}>
      {groups.map(group => (
        <div key={group.type}>
          <div style={{
            padding: inline ? '8px 14px 4px' : '12px 16px 6px',
            fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
            textTransform: 'uppercase', color: colors.textSecondary,
          }}>
            {group.label}
          </div>
          {group.items.map((item, i) => {
            const { icon: Icon, tint } = TYPE_CONFIG[item.type];
            return (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => onSelect(item)}
                className="search-result-row"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', textAlign: 'left',
                  padding: inline ? '10px 14px' : '10px 16px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: i < group.items.length - 1 || group !== groups[groups.length - 1]
                    ? `1px solid ${colors.borderLight}` : 'none',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: `${tint}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} color={tint} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
                    <HighlightedText text={item.title} query={query} />
                  </div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>
                    <HighlightedText text={item.subtitle} query={query} highlightColor={colors.textLink} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
