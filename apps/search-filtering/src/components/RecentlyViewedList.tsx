import { Briefcase, MapPin, FolderOpen, Package } from 'lucide-react';
import { colors } from '../theme';
import type { ObjectType, SearchResult } from '../types';

const TYPE_CONFIG: Record<ObjectType, { icon: typeof Briefcase; tint: string }> = {
  job: { icon: Briefcase, tint: '#00847C' },
  site: { icon: MapPin, tint: '#1976D2' },
  project: { icon: FolderOpen, tint: '#7B1FA2' },
  template: { icon: Package, tint: '#455A64' },
};

interface RecentlyViewedListProps {
  items: SearchResult[];
  onSelect: (result: SearchResult) => void;
}

export function RecentlyViewedList({ items, onSelect }: RecentlyViewedListProps) {
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{
        padding: '12px 16px 6px',
        fontSize: 13,
        fontWeight: 600,
        color: colors.textSecondary,
      }}>
        Recently viewed
      </div>
      {items.map((item, i) => {
        const { icon: Icon, tint } = TYPE_CONFIG[item.type];
        return (
          <button
            key={`${item.type}-${item.id}`}
            type="button"
            onClick={() => onSelect(item)}
            className="search-result-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              textAlign: 'left',
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: i < items.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: `${tint}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={16} color={tint} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{item.title}</div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>{item.subtitle}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
