import React from 'react';
import type { ScreenProps } from '../types';
import { RESET_SCREEN } from '../data/messages';
import { colors, typography } from '../theme';

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg) } }`;

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = colors.brandTeal }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: `3px solid ${colors.border}`,
      borderTopColor: color,
      animation: 'spin 0.8s linear infinite',
    }}
  />
);

export const ResetScreen: React.FC<ScreenProps> = ({ scenario, userContext, copyMode }) => {
  const getMessage = (): string => {
    if (copyMode === 'current') {
      return RESET_SCREEN.current.title;
    }

    if (scenario === 'corrupted-session') {
      return RESET_SCREEN.proposed.corrupted;
    }

    if (userContext === 'returning') {
      return RESET_SCREEN.proposed.returning;
    }

    return RESET_SCREEN.proposed.firstTime;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: colors.background,
        fontFamily: typography.fontFamily,
        padding: 32,
      }}
    >
      <style>{spinKeyframes}</style>

      <div
        style={{
          fontSize: typography.logo.fontSize,
          fontWeight: typography.logo.fontWeight,
          letterSpacing: typography.logo.letterSpacing,
          color: colors.textPrimary,
          marginBottom: 80,
        }}
      >
        {typography.logo.text}
      </div>

      <Spinner size={48} color={colors.brandTeal} />

      <p
        style={{
          marginTop: 32,
          fontSize: 16,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        {getMessage()}
      </p>

      {scenario === 'corrupted-session' && copyMode === 'proposed' && (
        <p style={{ marginTop: 8, fontSize: 13, color: colors.textTertiary, textAlign: 'center' }}>
          This only takes a moment.
        </p>
      )}
    </div>
  );
};

export default ResetScreen;
