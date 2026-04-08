import React, { useEffect, useState } from 'react';
import type { ScreenProps } from '../types';
import { BIOMETRIC } from '../data/messages';

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

const FaceIdIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="30" stroke="#22333B" strokeWidth="2" />
    <circle cx="24" cy="26" r="2.5" fill="#22333B" />
    <circle cx="40" cy="26" r="2.5" fill="#22333B" />
    <path d="M32 22V30" stroke="#22333B" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 40c2 4 6 6 8 6s6-2 8-6" stroke="#22333B" strokeWidth="2" strokeLinecap="round" fill="none" />
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
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
    }}
  >
    <div
      style={{
        background: '#fff',
        borderRadius: '16px 16px 0 0',
        padding: '28px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <FaceIdIcon />
      <p style={{ fontSize: 16, color: '#22333B', marginTop: 16, marginBottom: 0, lineHeight: 1.5 }}>
        {text}
      </p>
      {showCancel && (
        <button
          style={{
            marginTop: 20,
            padding: '10px 32px',
            borderRadius: 8,
            border: '1px solid #e0e0e0',
            background: '#fff',
            color: '#007AFF',
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
      <div style={{ fontSize: 13, color: '#22333B', lineHeight: 1.5, paddingBottom: 16 }}>
        {message}
      </div>
      {buttons.map((btn, i) => (
        <div
          key={i}
          style={{
            borderTop: '1px solid #e0e0e0',
            padding: '12px 0',
            color: '#007AFF',
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
    background: '#fff',
    fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
    overflow: 'hidden',
  };

  // Auto-login scenario
  if (scenario === 'auto-login') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <style>{spinKeyframes}</style>
          {autoLoginPhase === 'loading' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                background: '#f0f0f0',
              }}
            >
              <div style={{ fontSize: 14, color: '#666' }}>salesforce.com</div>
            </div>
          ) : (
            <div
              style={{
                padding: '60px 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ height: 44, background: '#e0e0e0', borderRadius: 8 }} />
              <div style={{ height: 44, background: '#e0e0e0', borderRadius: 8 }} />
              <div
                style={{
                  height: 44,
                  background: '#007AFF',
                  borderRadius: 8,
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: '#fff',
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 3,
              color: '#22333B',
              marginBottom: 48,
            }}
          >
            SITETRACKER
          </div>
          <Spinner size={48} color="#007AFF" />
          <p style={{ marginTop: 24, fontSize: 17, color: '#22333B', fontWeight: 500 }}>
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
          <AlertBox
            title="Device Not Secured"
            message={BIOMETRIC.current.notEnrolled}
            buttons={['OK']}
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
          <FaceIdIcon />
          <p style={{ fontSize: 16, color: '#22333B', marginTop: 20, lineHeight: 1.5 }}>
            {BIOMETRIC.proposed.notEnrolled}
          </p>
          <button
            style={{
              marginTop: 20,
              padding: '12px 28px',
              borderRadius: 8,
              border: 'none',
              background: '#007AFF',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Open Settings
          </button>
        </div>
      </div>
    );
  }

  // Cancelled scenario
  if (scenario === 'cancelled') {
    if (copyMode === 'current') {
      return (
        <div style={containerStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#999',
              fontSize: 14,
            }}
          >
            {/* Current: nothing shown */}
          </div>
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
          <FaceIdIcon />
          <p style={{ fontSize: 16, color: '#22333B', marginTop: 20, lineHeight: 1.5 }}>
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
          <AlertBox
            title="Error"
            message={BIOMETRIC.current.error}
            buttons={['OK']}
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
          <FaceIdIcon />
          <p style={{ fontSize: 16, color: '#22333B', marginTop: 20, lineHeight: 1.5 }}>
            {BIOMETRIC.proposed.error}
          </p>
          <button
            style={{
              marginTop: 20,
              padding: '12px 28px',
              borderRadius: 8,
              border: 'none',
              background: '#007AFF',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Enter Password
          </button>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Spinner size={40} color="#007AFF" />
          </div>
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <style>{spinKeyframes}</style>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 3,
              color: '#22333B',
              marginBottom: 48,
            }}
          >
            SITETRACKER
          </div>
          <Spinner size={48} color="#007AFF" />
          <p style={{ marginTop: 24, fontSize: 16, color: '#666' }}>
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
