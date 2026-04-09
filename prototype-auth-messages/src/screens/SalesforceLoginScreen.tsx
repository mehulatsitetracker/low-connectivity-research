import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../types';
import { SALESFORCE_LOGIN } from '../data/messages';
import { colors, radii, typography } from '../theme';

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg) } }`;

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = colors.brandTeal }) => (
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

const BackArrow = () => (
  <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
    <path d="M9 1L1 9L9 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MockLoginForm: React.FC = () => (
  <div style={{ padding: '32px 24px' }}>
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: colors.textPrimary,
          marginBottom: 4,
        }}
      >
        Log in to Salesforce
      </div>
    </div>

    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 6 }}>
        Username
      </label>
      <div
        style={{
          height: 44,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.standard,
          background: '#F9F9F9',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          fontSize: 15,
          color: colors.textTertiary,
        }}
      >
        user@company.com
      </div>
    </div>

    <div style={{ marginBottom: 28 }}>
      <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 6 }}>
        Password
      </label>
      <div
        style={{
          height: 44,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.standard,
          background: '#F9F9F9',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          fontSize: 15,
          color: colors.textTertiary,
        }}
      >
        ••••••••••
      </div>
    </div>

    <div
      style={{
        height: 48,
        borderRadius: radii.standard,
        background: colors.sfBlue,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      Log In
    </div>

    <div style={{ textAlign: 'center', marginTop: 16 }}>
      <span style={{ fontSize: 13, color: colors.brandTeal, cursor: 'pointer' }}>
        Forgot Your Password?
      </span>
    </div>
  </div>
);

export const SalesforceLoginScreen: React.FC<ScreenProps> = ({ scenario, copyMode }) => {
  const copy = copyMode === 'current' ? SALESFORCE_LOGIN.current : SALESFORCE_LOGIN.proposed;
  const [showSlow, setShowSlow] = useState(false);

  useEffect(() => {
    if (scenario === 'slow-loading') {
      const timer = setTimeout(() => setShowSlow(true), 2000);
      return () => clearTimeout(timer);
    }
    setShowSlow(false);
  }, [scenario]);

  const renderOverlay = (content: React.ReactNode) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(255,255,255,0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        zIndex: 10,
      }}
    >
      {content}
    </div>
  );

  const renderAlert = (title: string, message: string, buttons: string[]) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: colors.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: colors.surface,
          borderRadius: radii.modal,
          width: '100%',
          maxWidth: 270,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 16px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
            {message}
          </div>
        </div>
        <div style={{ borderTop: `0.5px solid ${colors.border}`, display: 'flex' }}>
          {buttons.map((btn, i) => (
            <div
              key={btn}
              style={{
                flex: 1,
                padding: '12px 0',
                textAlign: 'center',
                fontSize: 17,
                color: colors.brandTeal,
                fontWeight: i === buttons.length - 1 ? 600 : 400,
                cursor: 'pointer',
                borderLeft: i > 0 ? `0.5px solid ${colors.border}` : 'none',
              }}
            >
              {btn}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: colors.background,
        fontFamily: typography.fontFamily,
        position: 'relative',
      }}
    >
      <style>{spinKeyframes}</style>

      {/* Dark header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 44,
          padding: '0 16px',
          background: colors.topBar,
        }}
      >
        <div style={{ cursor: 'pointer', padding: '4px 8px 4px 0' }}>
          <BackArrow />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 17,
            fontWeight: 600,
            color: '#fff',
            marginRight: 20,
          }}
        >
          Login to Sitetracker
        </div>
      </div>

      {/* WebView content area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: colors.surface }}>
        {/* Always show the form as base layer */}
        <MockLoginForm />

        {/* Scenario-specific overlays */}
        {scenario === 'slow-loading' && (
          renderOverlay(
            <>
              <Spinner size={40} />
              <p style={{ marginTop: 20, fontSize: 15, color: colors.textSecondary, textAlign: 'center' }}>
                {copy.loading || 'Loading...'}
              </p>
              {showSlow && copy.slow && (
                <p style={{ marginTop: 8, fontSize: 13, color: colors.textTertiary, textAlign: 'center' }}>
                  {copy.slow}
                </p>
              )}
            </>
          )
        )}

        {scenario === 'network-drops' && (
          renderOverlay(
            <>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="#FF3B30" strokeWidth="2" />
                <path d="M16 16L32 32M32 16L16 32" stroke="#FF3B30" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <p style={{ marginTop: 20, fontSize: 16, fontWeight: 600, color: colors.textPrimary, textAlign: 'center' }}>
                {copyMode === 'current' ? 'Connection Error' : 'Connection Lost'}
              </p>
              {copy.networkDrop && (
                <p style={{ marginTop: 8, fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 1.5 }}>
                  {copy.networkDrop}
                </p>
              )}
              <div
                style={{
                  marginTop: 24,
                  padding: '10px 32px',
                  borderRadius: radii.button,
                  background: colors.brandTeal,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Retry
              </div>
            </>
          )
        )}

        {scenario === 'oauth-denied' && (
          renderAlert(
            copyMode === 'current' ? 'Access Denied' : 'Account Not Set Up',
            copy.oauthDenied,
            ['OK']
          )
        )}

        {scenario === 'auto-login' && (
          copyMode === 'proposed' ? (
            renderOverlay(
              <>
                <div
                  style={{
                    fontSize: typography.logo.fontSize,
                    fontWeight: typography.logo.fontWeight,
                    letterSpacing: typography.logo.letterSpacing,
                    color: colors.textPrimary,
                    marginBottom: 32,
                  }}
                >
                  {typography.logo.text}
                </div>
                <Spinner size={40} />
                <p style={{ marginTop: 20, fontSize: 16, color: colors.textSecondary }}>
                  {copy.autoLogin}
                </p>
              </>
            )
          ) : (
            renderOverlay(
              <>
                <Spinner size={32} />
              </>
            )
          )
        )}
      </div>
    </div>
  );
};

export default SalesforceLoginScreen;
