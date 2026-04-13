import React from 'react';
import { theme } from './theme';
import { GridIcon } from './icons';
import type { ReferenceConfig } from './types';

interface SidebarReferenceProps {
  reference: ReferenceConfig;
  isActive: boolean;
  onClick: () => void;
}

export function SidebarReference({ reference, isActive, onClick }: SidebarReferenceProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div style={{ marginBottom: theme.spacing.categoryGap }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 10,
        }}
      >
        <GridIcon size={14} color={theme.colors.categoryLabel} />
        <span
          style={{
            fontSize: theme.font.sizeXs,
            fontWeight: theme.font.weightBold,
            letterSpacing: '1.2px',
            textTransform: 'uppercase' as const,
            color: theme.colors.categoryLabel,
          }}
        >
          REFERENCE
        </span>
      </div>

      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px 14px',
          background: isActive
            ? theme.colors.accentLight
            : isHovered
              ? theme.colors.surfaceHover
              : theme.colors.stepBg,
          border: `1px solid ${isActive ? theme.colors.accent : theme.colors.stepBorder}`,
          borderRadius: theme.radius.step,
          color: isActive ? theme.colors.accent : theme.colors.text,
          fontSize: theme.font.sizeMd,
          fontWeight: theme.font.weightNormal,
          fontFamily: theme.font.family,
          textAlign: 'left' as const,
          cursor: 'pointer',
          transition: `all ${theme.transition.fast}`,
          outline: 'none',
        }}
      >
        {reference.label}
      </button>
    </div>
  );
}
