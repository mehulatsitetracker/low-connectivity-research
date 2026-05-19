import { colors } from '../theme';
import { TopBar } from '../components/TopBar';
import { SearchBar } from '../components/SearchBar';
import { ObjectCard } from '../components/ObjectCard';
import { BottomNav } from '../components/BottomNav';
import { SITES } from '../data/objects';
import type { ActiveTab } from '../types';

interface AllSitesScreenProps {
  activeTab: ActiveTab;
  onAction: (action: string) => void;
  unreadCounts?: Record<string, number>;
}

export function AllSitesScreen({ activeTab, onAction, unreadCounts }: AllSitesScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background }}>
      <TopBar title="All Sites" onBack={() => onAction('back')} showDropdown showPlus />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <SearchBar placeholder="Search sites" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px 16px' }}>
          {SITES.map(site => (
            <ObjectCard
              key={site.id}
              title={site.name}
              meta={[
                { label: 'County', value: site.county },
                { label: 'City', value: site.city },
                { label: 'Site Status', value: site.status },
                { label: 'Site Type', value: site.type },
              ]}
              onClick={() => onAction(`select-site:${site.id}`)}
              unread={(unreadCounts?.[site.id] ?? 0) > 0}
            />
          ))}
        </div>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
