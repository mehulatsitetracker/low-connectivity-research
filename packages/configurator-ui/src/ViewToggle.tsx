import React from 'react';
import { theme } from './theme';
import { PhoneIcon, DiagramIcon, SplitIcon } from './icons';
import type { ViewMode } from './types';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  hasDiagram: boolean;
}

const modes: { id: ViewMode; label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { id: 'phone', label: 'Phone', Icon: PhoneIcon },
  { id: 'diagram', label: 'Diagram', Icon: DiagramIcon },
  { id: 'side-by-side', label: 'Split', Icon: SplitIcon },
];

export function ViewToggle({ mode, onChange, hasDiagram }: ViewToggleProps) {
  if (!hasDiagram) return null;

  return (
    <div
      style={{
        position: 'absolute' as const,
        top: 12,
        right: 12,
        display: 'flex',
        background: theme.colors.surface,
        borderRadius: theme.radius.pill,
        border: `1px solid ${theme.colors.border}`,
        padding: 2,
        zIndex: 10,
      }}
    >
      {modes.map(({ id, label, Icon }) => {
        const isActive = mode === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            title={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 28,
              background: isActive ? theme.colors.surfaceActive : 'transparent',
              border: 'none',
              borderRadius: theme.radius.pill - 2,
              cursor: 'pointer',
              transition: `all ${theme.transition.fast}`,
              padding: 0,
            }}
          >
            <Icon size={16} color={isActive ? theme.colors.text : theme.colors.textMuted} />
          </button>
        );
      })}
    </div>
  );
}
