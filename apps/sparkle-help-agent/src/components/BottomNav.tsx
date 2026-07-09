import { colors, spacing } from '../theme';
import { Home, Map, Menu } from 'lucide-react';
import type { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const tabs: { id: ActiveTab; label: string; Icon: typeof Home }[] = [
  { id: 'home', label: 'HOME', Icon: Home },
  { id: 'map', label: 'MAP', Icon: Map },
  { id: 'menu', label: 'MENU', Icon: Menu },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div style={{
      height: spacing.bottomNavHeight,
      background: colors.surface,
      borderTop: `1px solid ${colors.borderLight}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexShrink: 0,
    }}>
      {tabs.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              background: active ? colors.navActiveBg : 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '6px 20px',
              borderRadius: 8,
              minWidth: 72,
            }}
          >
            <Icon size={22} color={active ? colors.navActive : colors.navInactive} />
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: active ? colors.navActive : colors.navInactive,
              letterSpacing: 0.5,
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
