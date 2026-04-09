import React, { useEffect, useState } from 'react';
import type { ScreenProps } from '../types';
import { LOGOUT } from '../data/messages';
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

const AlertDialog = ({
  title,
  message,
  buttons,
}: {
  title?: string;
  message: string;
  buttons: { label: string; primary?: boolean }[];
}) => (
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
      <div
        style={{
          fontSize: 13,
          color: colors.textPrimary,
          lineHeight: 1.5,
          paddingBottom: 16,
          whiteSpace: 'pre-line',
        }}
      >
        {message}
      </div>
      {buttons.map((btn, i) => (
        <div
          key={i}
          style={{
            borderTop: `1px solid ${colors.border}`,
            padding: '12px 0',
            color: btn.primary ? colors.error : colors.brandTeal,
            fontSize: 17,
            fontWeight: btn.primary ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          {btn.label}
        </div>
      ))}
    </div>
  </div>
);

// Mock app background for pre-expiry-warning scenario
const MockAppBackground = ({ children }: { children?: React.ReactNode }) => (
  <div
    style={{
      height: '100%',
      background: colors.background,
      fontFamily: typography.fontFamily,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Mock header - dark like the real app */}
    <div
      style={{
        height: 44,
        background: colors.topBar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17,
        fontWeight: 600,
        color: '#fff',
      }}
    >
      Sitetracker
    </div>
    {children}
    {/* Mock content */}
    <div style={{ flex: 1, padding: 16 }}>
      <div
        style={{
          height: 60,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.standard,
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 60,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.standard,
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 60,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.standard,
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 60,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.standard,
        }}
      />
    </div>
    {/* Mock tab bar */}
    <div
      style={{
        height: 56,
        background: colors.surface,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 20px',
      }}
    >
      {['Home', 'Jobs', 'Map', 'More'].map((tab) => (
        <div key={tab} style={{ fontSize: 10, color: colors.textTertiary, textAlign: 'center' }}>
          <div
            style={{
              width: 20,
              height: 20,
              background: colors.border,
              borderRadius: radii.standard,
              margin: '0 auto 2px',
            }}
          />
          {tab}
        </div>
      ))}
    </div>
  </div>
);

export const LogoutScreen: React.FC<ScreenProps> = ({ scenario, copyMode }) => {
  const [logoutPhase, setLogoutPhase] = useState<'signing-out' | 'done'>('signing-out');

  useEffect(() => {
    if (scenario === 'voluntary') {
      const timer = setTimeout(() => setLogoutPhase('done'), 1500);
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

  // Voluntary logout
  if (scenario === 'voluntary') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <style>{spinKeyframes}</style>
          {logoutPhase === 'signing-out' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Spinner size={40} color={colors.brandTeal} />
              <p style={{ marginTop: 20, fontSize: 15, color: colors.textSecondary }}>
                {LOGOUT.current.voluntary}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }} />
          )}
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <style>{spinKeyframes}</style>
        {logoutPhase === 'signing-out' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Spinner size={48} color={colors.brandTeal} />
            <p style={{ marginTop: 24, fontSize: 17, color: colors.textPrimary, fontWeight: 500 }}>
              {LOGOUT.proposed.voluntary}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" stroke={colors.successLight} strokeWidth="3" fill="#4CAF5015" />
              <path d="M18 28l7 7 13-13" stroke={colors.successLight} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <p style={{ marginTop: 20, fontSize: 17, color: colors.textPrimary, fontWeight: 500 }}>
              {LOGOUT.proposed.afterLogout}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Pending uploads
  if (scenario === 'pending-uploads') {
    const message = copyMode === 'current' ? LOGOUT.current.pendingUploads : LOGOUT.proposed.pendingUploads;
    return (
      <div style={containerStyle}>
        <AlertDialog
          title="Sign Out?"
          message={message}
          buttons={
            copyMode === 'current'
              ? [{ label: 'Cancel' }, { label: 'Sign Out', primary: true }]
              : [{ label: 'Cancel' }, { label: 'Sign Out Anyway', primary: true }]
          }
        />
      </div>
    );
  }

  // Session expired
  if (scenario === 'session-expired') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <AlertDialog
            title="Session Expired"
            message={LOGOUT.current.sessionExpired}
            buttons={[{ label: 'OK', primary: true }]}
          />
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#F5A623" strokeWidth="2.5" fill="#F5A62310" />
            <path d="M32 18v18" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="44" r="2.5" fill="#F5A623" />
          </svg>
          <p style={{ fontSize: 17, color: colors.textPrimary, marginTop: 20, lineHeight: 1.6, fontWeight: 500 }}>
            {LOGOUT.proposed.sessionExpired}
          </p>
          <p style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8, lineHeight: 1.5 }}>
            {LOGOUT.proposed.offlineChanges}
          </p>
          <button
            style={{
              marginTop: 24,
              padding: '14px 40px',
              borderRadius: radii.button,
              border: 'none',
              background: colors.brandTeal,
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  // Pre-expiry warning
  if (scenario === 'pre-expiry-warning') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <MockAppBackground />
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <MockAppBackground>
          <div
            style={{
              background: colors.warning,
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L19 18H1L10 2Z" fill={colors.warningDark} />
              <rect x="9" y="8" width="2" height="5" rx="1" fill="#fff" />
              <circle cx="10" cy="15" r="1" fill="#fff" />
            </svg>
            <span style={{ fontSize: 14, color: colors.warningDark, lineHeight: 1.4, flex: 1 }}>
              {LOGOUT.proposed.preWarning}
            </span>
          </div>
        </MockAppBackground>
      </div>
    );
  }

  // Fallback
  return <div style={containerStyle} />;
};

export default LogoutScreen;
