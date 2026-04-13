import { Bell, User, Clock, Briefcase, Building2, ClipboardList } from 'lucide-react';
import { colors } from '../theme';
import { BottomNav } from '../components/BottomNav';
import { SearchBar } from '../components/SearchBar';
import { JOBS, SITES, PROJECTS } from '../data/objects';
import type { ActiveTab } from '../types';

interface HomeScreenProps {
  hasUnread: boolean;
  activeTab: ActiveTab;
  onAction: (action: string) => void;
}

const recentItems = [
  { type: 'job' as const, id: JOBS[0].id, title: JOBS[0].id, subtitle: `Site: ${JOBS[0].siteName}`, iconBg: '#00847C' },
  { type: 'job' as const, id: JOBS[1].id, title: JOBS[1].id, subtitle: `Job Template: ${JOBS[1].templateName}`, iconBg: '#00847C' },
  { type: 'site' as const, id: SITES[0].id, title: SITES[0].name, subtitle: `Site Type: ${SITES[0].type}`, iconBg: '#455A64' },
  { type: 'project' as const, id: PROJECTS[0].id, title: PROJECTS[0].id, subtitle: `Site: ${PROJECTS[0].siteName}`, iconBg: '#1976D2' },
];

const iconForType = (type: string) => {
  if (type === 'job') return <Briefcase size={18} color="#fff" fill="#fff" />;
  if (type === 'site') return <Building2 size={18} color="#fff" fill="#fff" />;
  return <ClipboardList size={18} color="#fff" />;
};

export function HomeScreen({ hasUnread, activeTab, onAction }: HomeScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background }}>
      {/* Header with brand */}
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
              <div style={{
                position: 'absolute', top: 2, right: 2, width: 8, height: 8,
                borderRadius: '50%', background: colors.error,
              }} />
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

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <SearchBar placeholder="Search..." />

        {/* Recently Viewed — widget card */}
        <div style={{
          margin: '0 12px', padding: 16, background: colors.surface,
          borderRadius: 8, border: `1px solid ${colors.borderLight}`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
            fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
            textTransform: 'uppercase', color: colors.textPrimary,
          }}>
            <Clock size={16} color={colors.textSecondary} strokeWidth={2} />
            RECENTLY VIEWED ({recentItems.length * 5})
          </div>
          {recentItems.map((item, i) => (
            <div
              key={item.id}
              onClick={() => onAction(`select-${item.type}:${item.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < recentItems.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 6, background: item.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {iconForType(item.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{item.title}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
