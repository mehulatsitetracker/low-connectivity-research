import { colors } from '../theme';
import { TopBar } from '../components/TopBar';
import { SearchBar } from '../components/SearchBar';
import { ObjectCard } from '../components/ObjectCard';
import { BottomNav } from '../components/BottomNav';
import { PROJECTS } from '../data/objects';
import type { ActiveTab } from '../types';

interface AllProjectsScreenProps {
  activeTab: ActiveTab;
  onAction: (action: string) => void;
  unreadCounts?: Record<string, number>;
}

export function AllProjectsScreen({ activeTab, onAction, unreadCounts }: AllProjectsScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background }}>
      <TopBar title="All New Build Pr..." onBack={() => onAction('back')} showDropdown showPlus />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <SearchBar placeholder="Search projects" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px 16px' }}>
          {PROJECTS.map(proj => (
            <ObjectCard
              key={proj.id}
              title={proj.id}
              meta={[
                { label: 'Project Template', value: proj.templateName },
                { label: 'Site Name', value: proj.siteName },
                { label: 'Project Status', value: proj.status },
                { label: 'Project Type', value: proj.type },
              ]}
              onClick={() => onAction(`select-project:${proj.id}`)}
              unread={(unreadCounts?.[proj.id] ?? 0) > 0}
            />
          ))}
        </div>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
