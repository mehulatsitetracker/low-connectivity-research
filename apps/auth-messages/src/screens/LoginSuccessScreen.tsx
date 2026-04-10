import React from 'react';
import type { ScreenProps } from '../types';
import { LOGIN_SUCCESS } from '../data/messages';
import { colors, typography } from '../theme';

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg) } }`;

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = colors.brandTeal }) => (
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

const CheckmarkIcon: React.FC = () => (
  <div
    style={{
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: colors.successLight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path
        d="M10 20L17 27L30 13"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const ErrorIcon: React.FC = () => (
  <div
    style={{
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: colors.error,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M12 12L28 28M28 12L12 28" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  </div>
);

export const LoginSuccessScreen: React.FC<ScreenProps> = ({ scenario, copyMode, userContext }) => {
  const baseStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    background: colors.background,
    fontFamily: typography.fontFamily,
    padding: 32,
  };

  // Access denied scenario
  if (scenario === 'access-denied') {
    return (
      <div style={baseStyle}>
        <ErrorIcon />
        <p style={{ marginTop: 24, fontSize: 18, fontWeight: 600, color: colors.error, textAlign: 'center' }}>
          Access denied
        </p>
        <p style={{ marginTop: 8, fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 1.5 }}>
          {copyMode === 'proposed'
            ? 'In the proposed flow, this screen is skipped and the user is redirected automatically.'
            : 'User should not see the success screen. An error occurred during validation.'}
        </p>
      </div>
    );
  }

  // Validation hangs scenario
  if (scenario === 'validation-hangs') {
    const hangMessage =
      copyMode === 'proposed'
        ? LOGIN_SUCCESS.proposed.validationHangs
        : LOGIN_SUCCESS.current.validationHangs || 'Validating...';

    return (
      <div style={baseStyle}>
        <style>{spinKeyframes}</style>
        <CheckmarkIcon />
        <p style={{ marginTop: 24, fontSize: 18, fontWeight: 600, color: colors.textPrimary, textAlign: 'center' }}>
          {hangMessage}
        </p>
        <div style={{ marginTop: 20 }}>
          <Spinner size={32} color={colors.brandTeal} />
        </div>
      </div>
    );
  }

  // Happy scenario
  const getTitle = (): string => {
    if (copyMode === 'current') return LOGIN_SUCCESS.current.title;
    if (userContext === 'first-time') return LOGIN_SUCCESS.proposed.firstTime.title;
    return LOGIN_SUCCESS.proposed.returning.title;
  };

  const getSubtitle = (): string => {
    if (copyMode === 'current') return LOGIN_SUCCESS.current.subtitle;
    if (userContext === 'first-time') return LOGIN_SUCCESS.proposed.firstTime.subtitle;
    return LOGIN_SUCCESS.proposed.returning.subtitle;
  };

  return (
    <div style={baseStyle}>
      <CheckmarkIcon />
      <p style={{ marginTop: 24, fontSize: 20, fontWeight: 600, color: colors.textPrimary, textAlign: 'center' }}>
        {getTitle()}
      </p>
      {getSubtitle() && (
        <p style={{ marginTop: 8, fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>
          {getSubtitle()}
        </p>
      )}
    </div>
  );
};

export default LoginSuccessScreen;
