import React from 'react';
import type { ScreenProps } from '../types';
import { DEEP_LINK } from '../data/messages';

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

const LinkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      stroke="#007AFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      stroke="#007AFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const DeepLinkScreen: React.FC<ScreenProps> = ({ scenario, copyMode }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    background: '#fff',
    fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
    padding: 32,
    textAlign: 'center',
  };

  // Happy / loading
  if (scenario === 'happy') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <style>{spinKeyframes}</style>
          <Spinner size={40} color="#007AFF" />
          <p style={{ marginTop: 20, fontSize: 16, color: '#666' }}>
            {DEEP_LINK.current.loading}
          </p>
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <style>{spinKeyframes}</style>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 3,
            color: '#22333B',
            marginBottom: 60,
          }}
        >
          SITETRACKER
        </div>
        <Spinner size={48} color="#007AFF" />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
          }}
        >
          <LinkIcon />
          <span style={{ fontSize: 17, color: '#22333B', fontWeight: 500 }}>
            {DEEP_LINK.proposed.loading}
          </span>
        </div>
      </div>
    );
  }

  // Needs login
  if (scenario === 'needs-login') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <style>{spinKeyframes}</style>
          <Spinner size={40} color="#007AFF" />
          <p style={{ marginTop: 20, fontSize: 16, color: '#666' }}>
            {DEEP_LINK.current.needsLogin}
          </p>
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 3,
            color: '#22333B',
            marginBottom: 60,
          }}
        >
          SITETRACKER
        </div>
        <LinkIcon />
        <p style={{ marginTop: 20, fontSize: 17, color: '#22333B', lineHeight: 1.6, fontWeight: 500 }}>
          {DEEP_LINK.proposed.needsLogin}
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
          Sign In
        </button>
      </div>
    );
  }

  // Auth fails
  if (scenario === 'auth-fails') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <p style={{ fontSize: 16, color: '#E53935' }}>
            {DEEP_LINK.current.authFails || 'Error'}
          </p>
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 3,
            color: '#22333B',
            marginBottom: 60,
          }}
        >
          SITETRACKER
        </div>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="#E53935" strokeWidth="2.5" fill="#E5393510" />
          <path d="M16 16l16 16M32 16L16 32" stroke="#E53935" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <p style={{ marginTop: 20, fontSize: 17, color: '#22333B', lineHeight: 1.6, fontWeight: 500 }}>
          {DEEP_LINK.proposed.authFails}
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
          Try Again
        </button>
      </div>
    );
  }

  // Expired session
  if (scenario === 'expired-session') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
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
              <div style={{ fontSize: 17, fontWeight: 600, color: '#22333B', marginBottom: 4 }}>
                Session Expired
              </div>
              <div style={{ fontSize: 13, color: '#22333B', lineHeight: 1.5, paddingBottom: 16 }}>
                Your current session is invalid. You will need to log back in.
              </div>
              <div
                style={{
                  borderTop: '1px solid #e0e0e0',
                  padding: '12px 0',
                  color: '#007AFF',
                  fontSize: 17,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                OK
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 3,
            color: '#22333B',
            marginBottom: 60,
          }}
        >
          SITETRACKER
        </div>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="#F5A623" strokeWidth="2.5" fill="#F5A62310" />
          <path d="M24 14v12" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="32" r="2" fill="#F5A623" />
        </svg>
        <p style={{ marginTop: 20, fontSize: 17, color: '#22333B', lineHeight: 1.6, fontWeight: 500 }}>
          {DEEP_LINK.proposed.expired}
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
          Sign In
        </button>
      </div>
    );
  }

  // Fallback
  return (
    <div style={containerStyle}>
      <style>{spinKeyframes}</style>
      <Spinner size={40} color="#007AFF" />
    </div>
  );
};

export default DeepLinkScreen;
