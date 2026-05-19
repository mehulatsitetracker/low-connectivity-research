import { colors } from '../theme';
import { TopBar } from '../components/TopBar';
import { SearchBar } from '../components/SearchBar';
import { ObjectCard } from '../components/ObjectCard';
import { BottomNav } from '../components/BottomNav';
import { ObjectListSkeleton } from '../components/ObjectListSkeleton';
import { FullScreenError } from '../components/FullScreenError';
import { JOBS } from '../data/objects';
import type { ActiveTab, AppState } from '../types';

interface AllJobsScreenProps {
  activeTab: ActiveTab;
  onAction: (action: string) => void;
  unreadCounts?: Record<string, number>;
  loading?: boolean;
  errorState?: AppState['errorState'];
}

export function AllJobsScreen({ activeTab, onAction, unreadCounts, loading, errorState }: AllJobsScreenProps) {
  if (loading) return <ObjectListSkeleton />;
  if (errorState === 'load-fail') return <FullScreenError title="Couldn't load list" onRetry={() => onAction('retry-list-load')} />;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background }}>
      <TopBar title="All Jobs" onBack={() => onAction('back')} showDropdown showPlus />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <SearchBar placeholder="Search jobs" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px 16px' }}>
          {JOBS.map(job => (
            <ObjectCard
              key={job.id}
              title={job.id}
              meta={[
                { label: 'Job Template', value: job.templateName },
                { label: 'Site', value: job.siteName },
                { label: 'Status', value: job.status },
              ]}
              onClick={() => onAction(`select-job:${job.id}`)}
              unread={(unreadCounts?.[job.id] ?? 0) > 0}
            />
          ))}
        </div>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
