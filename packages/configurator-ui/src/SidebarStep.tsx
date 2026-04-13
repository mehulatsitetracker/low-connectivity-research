import React from 'react';
import { theme } from './theme';
import type { Step } from './types';

interface SidebarStepProps {
  step: Step;
  isActive: boolean;
  onClick: () => void;
}

export function SidebarStep({ step, isActive, onClick }: SidebarStepProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'block',
        width: '100%',
        padding: '10px 14px',
        background: isActive
          ? theme.colors.surfaceActive
          : isHovered
            ? theme.colors.surfaceHover
            : theme.colors.stepBg,
        border: `1px solid ${isActive ? theme.colors.stepBorderActive : theme.colors.stepBorder}`,
        borderRadius: theme.radius.step,
        color: theme.colors.text,
        fontSize: theme.font.sizeMd,
        fontWeight: theme.font.weightNormal,
        fontFamily: theme.font.family,
        textAlign: 'left' as const,
        cursor: 'pointer',
        transition: `all ${theme.transition.fast}`,
        outline: 'none',
        lineHeight: 1.4,
      }}
    >
      {step.label}
    </button>
  );
}
