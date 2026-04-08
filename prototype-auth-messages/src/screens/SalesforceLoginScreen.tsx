import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../types';
import { SALESFORCE_LOGIN } from '../data/messages';

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg) } }`;

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#007AFF' }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: '3px solid #e0e0e0',
      borderTopColor: color,
      animation: 'spin 0.8s linear infinite',
    }}
  />
);

const BackArrow = () => (
  <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
    <path d="M10 2L2 10L10 18" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MockLoginForm: React.FC = () => (
  <div style={{ padding: '32px 24px' }}>
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: '#22333B',
          marginBottom: 4,
        }}
      >
        Log in to Salesforce
      </div>
    </div>

    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>
        Username
      </label>
      <div
        style={{
          height: 44,
          border: '1px solid #D1D1D6',
          borderRadius: 8,
          background: '#F9F9F9',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          fontSize: 15,
          color: '#999',
        }}
      >
        user@company.com
      </div>
    </div>

    <div style={{ marginBottom: 28 }}>
      <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>
        Password
      </label>
      <div
        style={{
          height: 44,
          border: '1px solid #D1D1D6',
          borderRadius: 8,
          background: '#F9F9F9',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          fontSize: 15,
          color: '#999',
        }}
      >
        ••••••••••
      </div>
    </div>

    <div
      style={{
        height: 48,
        borderRadius: 8,
        background: '#0070D2',
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
      <span style={{ fontSize: 13, color: '#007AFF', cursor: 'pointer' }}>
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
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          width: '100%',
          maxWidth: 270,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 16px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#22333B', marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
            {message}
          </div>
        </div>
        <div style={{ borderTop: '0.5px solid #E5E5EA', display: 'flex' }}>
          {buttons.map((btn, i) => (
            <div
              key={btn}
              style={{
                flex: 1,
                padding: '12px 0',
                textAlign: 'center',
                fontSize: 17,
                color: '#007AFF',
                fontWeight: i === buttons.length - 1 ? 600 : 400,
                cursor: 'pointer',
                borderLeft: i > 0 ? '0.5px solid #E5E5EA' : 'none',
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
        background: '#fff',
        fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
        position: 'relative',
      }}
    >
      <style>{spinKeyframes}</style>

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 44,
          padding: '0 16px',
          borderBottom: '0.5px solid #E5E5EA',
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
            color: '#22333B',
            marginRight: 20,
          }}
        >
          Login to Sitetracker
        </div>
      </div>

      {/* WebView content area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Always show the form as base layer */}
        <MockLoginForm />

        {/* Scenario-specific overlays */}
        {scenario === 'slow-loading' && (
          renderOverlay(
            <>
              <Spinner size={40} />
              <p style={{ marginTop: 20, fontSize: 15, color: '#666', textAlign: 'center' }}>
                {copy.loading || 'Loading...'}
              </p>
              {showSlow && copy.slow && (
                <p style={{ marginTop: 8, fontSize: 13, color: '#999', textAlign: 'center' }}>
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
              <p style={{ marginTop: 20, fontSize: 16, fontWeight: 600, color: '#22333B', textAlign: 'center' }}>
                {copyMode === 'current' ? 'Connection Error' : 'Connection Lost'}
              </p>
              {copy.networkDrop && (
                <p style={{ marginTop: 8, fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 1.5 }}>
                  {copy.networkDrop}
                </p>
              )}
              <div
                style={{
                  marginTop: 24,
                  padding: '10px 32px',
                  borderRadius: 8,
                  background: '#007AFF',
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
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: '#22333B',
                    marginBottom: 32,
                  }}
                >
                  SITETRACKER
                </div>
                <Spinner size={40} />
                <p style={{ marginTop: 20, fontSize: 16, color: '#666' }}>
                  {copy.autoLogin}
                </p>
              </>
            )
          ) : (
            /* current mode: brief flash of the WebView - just show it with slight opacity */
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
