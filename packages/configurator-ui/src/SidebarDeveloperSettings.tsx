import React from 'react';
import { theme } from './theme';
import { SettingsIcon } from './icons';

interface SidebarDeveloperSettingsProps {
  children: React.ReactNode;
}

export function SidebarDeveloperSettings({ children }: SidebarDeveloperSettingsProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      style={{
        borderTop: `1px solid ${theme.colors.border}`,
        paddingTop: 16,
        marginTop: 8,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          width: '100%',
        }}
      >
        <SettingsIcon size={12} color={theme.colors.textMuted} />
        <span
          style={{
            fontSize: theme.font.sizeXs,
            fontWeight: theme.font.weightBold,
            letterSpacing: '1.2px',
            textTransform: 'uppercase' as const,
            color: theme.colors.textMuted,
          }}
        >
          Developer Settings
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 10,
            color: theme.colors.textMuted,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform ${theme.transition.fast}`,
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={{ paddingTop: 12 }}>
          {children}
        </div>
      )}
    </div>
  );
}
