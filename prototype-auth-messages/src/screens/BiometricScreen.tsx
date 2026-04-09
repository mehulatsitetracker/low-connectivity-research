import React, { useEffect, useState } from 'react';
import type { ScreenProps } from '../types';
import { BIOMETRIC } from '../data/messages';
import { colors, radii, typography } from '../theme';

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg) } }`;

const Spinner = ({ size = 40, color = colors.brandTeal }: { size?: number; color?: string }) => (
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

const FaceIdIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect x="3" y="3" width="58" height="58" rx="13" stroke={colors.brandTeal} strokeWidth="3" />
    <circle cx="22" cy="26" r="2.5" fill={colors.brandTeal} />
    <circle cx="42" cy="26" r="2.5" fill={colors.brandTeal} />
    <path d="M22 42c3 5 17 5 20 0" stroke={colors.brandTeal} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M32 26v8h3" stroke={colors.brandTeal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BiometricBottomSheet = ({ text, showCancel = true }: { text: string; showCancel?: boolean }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      background: colors.overlay,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      fontFamily: typography.fontFamily,
    }}
  >
    <div
      style={{
        background: colors.surface,
        borderRadius: radii.bottomSheet,
        padding: '28px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <FaceIdIcon />
      <p style={{ fontSize: 16, color: colors.textPrimary, marginTop: 16, marginBottom: 0, lineHeight: 1.5 }}>
        {text}
      </p>
      {showCancel && (
        <button
          style={{
            marginTop: 20,
            padding: '10px 32px',
            borderRadius: radii.button,
            border: `1px solid ${colors.border}`,
            background: colors.surface,
            color: colors.brandTeal,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      )}
    </div>
  </div>
);

const AlertBox = ({ title, message, buttons }: { title?: string; message: string; buttons: string[] }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: colors.overlay,
      fontFamily: typography.fontFamily,
    }}
  >
    <div
      style={{
        background: colors.surface,
        borderRadius: radii.modal,
        padding: '20px 16px 0',
        maxWidth: 270,
        width: '75%',
        textAlign: 'center',
      }}
    >
      {title && (
        <div style={{ fontSize: 17, fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>
          {title}
        </div>
      )}
      <div style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 1.5, paddingBottom: 16 }}>
        {message}
      </div>
      {buttons.map((btn, i) => (
        <div
          key={i}
          style={{
            borderTop: `1px solid ${colors.border}`,
            padding: '12px 0',
            color: colors.brandTeal,
            fontSize: 17,
            fontWeight: i === buttons.length - 1 ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          {btn}
        </div>
      ))}
    </div>
  </div>
);

export const BiometricScreen: React.FC<ScreenProps> = ({ scenario, copyMode }) => {
  const [autoLoginPhase, setAutoLoginPhase] = useState<'loading' | 'done'>('loading');

  useEffect(() => {
    if (scenario === 'auto-login') {
      const timer = setTimeout(() => setAutoLoginPhase('done'), 1500);
      return () => clearTimeout(timer);
    }
  }, [scenario]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    height: '100%',
    width: '100%',
    background: colors.background,
    fontFamily: typography.fontFamily,
    overflow: 'hidden',
  };

  const btnStyle: React.CSSProperties = {
    marginTop: 20,
    padding: '12px 28px',
    borderRadius: radii.button,
    border: 'none',
    background: colors.brandTeal,
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  };

  // Auto-login scenario
  if (scenario === 'auto-login') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <style>{spinKeyframes}</style>
          {autoLoginPhase === 'loading' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: colors.background }}>
              <div style={{ fontSize: 14, color: colors.textSecondary }}>salesforce.com</div>
            </div>
          ) : (
            <div style={{ padding: '60px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ height: 44, background: colors.border, borderRadius: radii.standard }} />
              <div style={{ height: 44, background: colors.border, borderRadius: radii.standard }} />
              <div
                style={{
                  height: 44,
                  background: colors.sfBlue,
                  borderRadius: radii.standard,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Log In
              </div>
            </div>
          )}
        </div>
      );
    }
    // Proposed auto-login
    return (
      <div style={containerStyle}>
        <style>{spinKeyframes}</style>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div
            style={{
              fontSize: typography.logo.fontSize,
              fontWeight: typography.logo.fontWeight,
              letterSpacing: typography.logo.letterSpacing,
              color: colors.textPrimary,
              marginBottom: 48,
            }}
          >
            {typography.logo.text}
          </div>
          <Spinner size={48} color={colors.brandTeal} />
          <p style={{ marginTop: 24, fontSize: 17, color: colors.textPrimary, fontWeight: 500 }}>
            {BIOMETRIC.proposed.autoLogin}
          </p>
        </div>
      </div>
    );
  }

  // Not-enrolled scenario
  if (scenario === 'not-enrolled') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <AlertBox title="Device Not Secured" message={BIOMETRIC.current.notEnrolled} buttons={['OK']} />
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
          <FaceIdIcon />
          <p style={{ fontSize: 16, color: colors.textPrimary, marginTop: 20, lineHeight: 1.5 }}>
            {BIOMETRIC.proposed.notEnrolled}
          </p>
          <button style={btnStyle}>Open Settings</button>
        </div>
      </div>
    );
  }

  // Cancelled scenario
  if (scenario === 'cancelled') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: colors.textTertiary, fontSize: 14 }}>
            {/* Current: nothing shown */}
          </div>
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
          <FaceIdIcon />
          <p style={{ fontSize: 16, color: colors.textPrimary, marginTop: 20, lineHeight: 1.5 }}>
            {BIOMETRIC.proposed.cancelled}
          </p>
        </div>
      </div>
    );
  }

  // Error scenario
  if (scenario === 'error') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <AlertBox title="Error" message={BIOMETRIC.current.error} buttons={['OK']} />
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
          <FaceIdIcon />
          <p style={{ fontSize: 16, color: colors.textPrimary, marginTop: 20, lineHeight: 1.5 }}>
            {BIOMETRIC.proposed.error}
          </p>
          <button style={btnStyle}>Enter Password</button>
        </div>
      </div>
    );
  }

  // Slow-network scenario
  if (scenario === 'slow-network') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <style>{spinKeyframes}</style>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Spinner size={40} color={colors.brandTeal} />
          </div>
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <style>{spinKeyframes}</style>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div
            style={{
              fontSize: typography.logo.fontSize,
              fontWeight: typography.logo.fontWeight,
              letterSpacing: typography.logo.letterSpacing,
              color: colors.textPrimary,
              marginBottom: 48,
            }}
          >
            {typography.logo.text}
          </div>
          <Spinner size={48} color={colors.brandTeal} />
          <p style={{ marginTop: 24, fontSize: 16, color: colors.textSecondary }}>
            {BIOMETRIC.proposed.slowNetwork}
          </p>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div style={containerStyle}>
      <BiometricBottomSheet text="Confirm with Face ID" />
    </div>
  );
};

export default BiometricScreen;
