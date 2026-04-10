import type React from 'react';
import { colors, spacing } from '../theme';

interface Props {
  activeTab?: 'home' | 'map' | 'menu';
}

const tabs: { id: 'home' | 'map' | 'menu'; label: string }[] = [
  { id: 'home', label: 'HOME' },
  { id: 'map', label: 'MAP' },
  { id: 'menu', label: 'MENU' },
];

export const BottomNav: React.FC<Props> = ({ activeTab = 'menu' }) => (
  <div style={{
    height: spacing.bottomNavHeight,
    borderTop: `1px solid ${colors.border}`,
    display: 'flex',
    background: colors.surface,
    flexShrink: 0,
  }}>
    {tabs.map(tab => {
      const isActive = tab.id === activeTab;
      return (
        <div key={tab.id} style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          background: isActive ? colors.navActiveBg : 'transparent',
          cursor: 'pointer',
        }}>
          <span style={{ display: 'flex' }}>
            {tab.id === 'home' && (
              <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? colors.navActive : colors.navInactive}>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            )}
            {tab.id === 'map' && (
              <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? colors.navActive : colors.navInactive}>
                <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
              </svg>
            )}
            {tab.id === 'menu' && (
              <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? colors.navActive : colors.navInactive}>
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            )}
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: isActive ? colors.navActive : colors.navInactive,
            letterSpacing: 0.5,
          }}>
            {tab.label}
          </span>
        </div>
      );
    })}
  </div>
);
