import { Bell, User, Star, Building2, ClipboardList, Check } from 'lucide-react';
import { colors } from '../theme';
import { BottomNav } from '../components/BottomNav';
import type { ActiveTab } from '../types';

interface MenuScreenProps {
  hasUnread: boolean;
  activeTab: ActiveTab;
  onAction: (action: string) => void;
}

const menuItems = [
  { id: 'favorites', label: 'Favorites', color: '#00847C', icon: 'star' },
  { id: 'sites', label: 'Sites', color: '#455A64', icon: 'building' },
  { id: 'projects', label: 'Projects', color: '#1976D2', icon: 'project' },
  { id: 'forms', label: 'Forms', color: '#1976D2', icon: 'form' },
  { id: 'activities', label: 'Activities', color: '#1976D2', icon: 'check' },
  { id: 'job-tasks', label: 'Job Tasks', color: '#1976D2', icon: 'tasks' },
  { id: 'timetracker', label: 'Timetracker', color: '#00847C', icon: 'time' },
  { id: 'expense-reports', label: 'Expense Reports', color: '#1976D2', icon: 'expense' },
  { id: 'job-items', label: 'Job Items', color: '#1D2D34', icon: 'items' },
  { id: 'jobs', label: 'Jobs', color: '#00847C', icon: 'jobs' },
];

const iconForItem = (icon: string) => {
  const c = '#fff';
  switch (icon) {
    case 'star': return <Star size={18} color={c} fill={c} />;
    case 'building': return <Building2 size={18} color={c} fill={c} />;
    case 'project': return <ClipboardList size={18} color={c} />;
    default: return <Check size={18} color={c} />;
  }
};

export function MenuScreen({ hasUnread, activeTab, onAction }: MenuScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        background: colors.topBar, padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, letterSpacing: 1.5 }}>SITETRACKER</div>
          <div style={{ color: '#aaa', fontSize: 11 }}>st-r50-edu.my.salesforce.com</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => onAction('go-notifications')} style={{
            background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
            position: 'relative', padding: 4,
          }}>
            <Bell size={24} color="currentColor" strokeWidth={1.5} />
            {hasUnread && (
              <div style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: colors.error }} />
            )}
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={18} color={colors.topBar} fill={colors.topBar} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
        {menuItems.map(item => (
          <div
            key={item.id}
            onClick={() => {
              if (item.id === 'sites') onAction('go-all-sites');
              else if (item.id === 'projects') onAction('go-all-projects');
              else if (item.id === 'jobs') onAction('go-all-jobs');
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 12px', background: colors.surface,
              border: `1px solid ${colors.borderLight}`, borderRadius: 8,
              marginBottom: 6, cursor: 'pointer',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 8, background: item.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {iconForItem(item.icon)}
            </div>
            <span style={{ fontSize: 16, fontWeight: 500, color: colors.textPrimary, flex: 1 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
