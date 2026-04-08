import React, { useEffect, useState } from 'react';
import type { ScreenProps } from '../types';
import { LOGOUT } from '../data/messages';

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg) } }`;

const Spinner = ({ size = 40, color = '#22333B' }: { size?: number; color?: string }) => (
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
      background: 'rgba(0,0,0,0.4)',
      fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
    }}
  >
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: '20px 16px 0',
        maxWidth: 270,
        width: '75%',
        textAlign: 'center',
      }}
    >
      {title && (
        <div style={{ fontSize: 17, fontWeight: 600, color: '#22333B', marginBottom: 4 }}>
          {title}
        </div>
      )}
      <div
        style={{
          fontSize: 13,
          color: '#22333B',
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
            borderTop: '1px solid #e0e0e0',
            padding: '12px 0',
            color: btn.primary ? '#E53935' : '#007AFF',
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
      background: '#fff',
      fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Mock status bar area */}
    <div
      style={{
        height: 44,
        background: '#f8f8f8',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17,
        fontWeight: 600,
        color: '#22333B',
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
          background: '#f5f5f5',
          borderRadius: 8,
          marginBottom: 12,
        }}
      />
      <div
        style={{
          height: 60,
          background: '#f5f5f5',
          borderRadius: 8,
          marginBottom: 12,
        }}
      />
      <div
        style={{
          height: 60,
          background: '#f5f5f5',
          borderRadius: 8,
          marginBottom: 12,
        }}
      />
      <div
        style={{
          height: 60,
          background: '#f5f5f5',
          borderRadius: 8,
        }}
      />
    </div>
    {/* Mock tab bar */}
    <div
      style={{
        height: 50,
        background: '#f8f8f8',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 20px',
      }}
    >
      {['Home', 'Jobs', 'Map', 'More'].map((tab) => (
        <div key={tab} style={{ fontSize: 10, color: '#999', textAlign: 'center' }}>
          <div
            style={{
              width: 20,
              height: 20,
              background: '#ddd',
              borderRadius: 4,
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
    background: '#fff',
    fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
    overflow: 'hidden',
  };

  // Voluntary logout
  if (scenario === 'voluntary') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <style>{spinKeyframes}</style>
          {logoutPhase === 'signing-out' ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Spinner size={40} color="#007AFF" />
              <p style={{ marginTop: 20, fontSize: 15, color: '#666' }}>
                {LOGOUT.current.voluntary}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              {/* Current: blank after redirect */}
            </div>
          )}
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <style>{spinKeyframes}</style>
        {logoutPhase === 'signing-out' ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Spinner size={48} color="#007AFF" />
            <p style={{ marginTop: 24, fontSize: 17, color: '#22333B', fontWeight: 500 }}>
              {LOGOUT.proposed.voluntary}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" stroke="#4CAF50" strokeWidth="3" fill="#4CAF5015" />
              <path d="M18 28l7 7 13-13" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <p style={{ marginTop: 20, fontSize: 17, color: '#22333B', fontWeight: 500 }}>
              {LOGOUT.proposed.afterLogout}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Pending uploads
  if (scenario === 'pending-uploads') {
    const message = copyMode === 'current'
      ? LOGOUT.current.pendingUploads
      : LOGOUT.proposed.pendingUploads;

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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: 32,
            textAlign: 'center',
          }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#F5A623" strokeWidth="2.5" fill="#F5A62310" />
            <path d="M32 18v18" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="44" r="2.5" fill="#F5A623" />
          </svg>
          <p style={{ fontSize: 17, color: '#22333B', marginTop: 20, lineHeight: 1.6, fontWeight: 500 }}>
            {LOGOUT.proposed.sessionExpired}
          </p>
          <p style={{ fontSize: 14, color: '#666', marginTop: 8, lineHeight: 1.5 }}>
            {LOGOUT.proposed.offlineChanges}
          </p>
          <button
            style={{
              marginTop: 24,
              padding: '14px 40px',
              borderRadius: 8,
              border: 'none',
              background: '#007AFF',
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
      // Current: no warning shown, just normal app
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
              background: '#FFF8E1',
              borderBottom: '1px solid #F5A623',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L19 18H1L10 2Z" fill="#F5A623" />
              <rect x="9" y="8" width="2" height="5" rx="1" fill="#fff" />
              <circle cx="10" cy="15" r="1" fill="#fff" />
            </svg>
            <span style={{ fontSize: 14, color: '#22333B', lineHeight: 1.4, flex: 1 }}>
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
