import React from 'react';
import type { ScreenProps } from '../types';
import { LOGIN_SUCCESS } from '../data/messages';

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg) } }`;

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#22333B' }) => (
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

const CheckmarkIcon: React.FC = () => (
  <div
    style={{
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: '#4CAF50',
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
      background: '#E53935',
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
  // Access denied scenario
  if (scenario === 'access-denied') {
    if (copyMode === 'proposed') {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: '#fff',
            fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
            padding: 32,
          }}
        >
          <ErrorIcon />
          <p
            style={{
              marginTop: 24,
              fontSize: 18,
              fontWeight: 600,
              color: '#E53935',
              textAlign: 'center',
            }}
          >
            Access denied
          </p>
          <p
            style={{
              marginTop: 8,
              fontSize: 14,
              color: '#666',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            In the proposed flow, this screen is skipped and the user is redirected automatically.
          </p>
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#fff',
          fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
          padding: 32,
        }}
      >
        <ErrorIcon />
        <p
          style={{
            marginTop: 24,
            fontSize: 18,
            fontWeight: 600,
            color: '#E53935',
            textAlign: 'center',
          }}
        >
          Access denied
        </p>
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          User should not see the success screen. An error occurred during validation.
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#fff',
          fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
          padding: 32,
        }}
      >
        <style>{spinKeyframes}</style>
        <CheckmarkIcon />
        <p
          style={{
            marginTop: 24,
            fontSize: 18,
            fontWeight: 600,
            color: '#22333B',
            textAlign: 'center',
          }}
        >
          {hangMessage}
        </p>
        <div style={{ marginTop: 20 }}>
          <Spinner size={32} color="#007AFF" />
        </div>
      </div>
    );
  }

  // Happy scenario
  const getTitle = (): string => {
    if (copyMode === 'current') {
      return LOGIN_SUCCESS.current.title;
    }
    if (userContext === 'first-time') {
      return LOGIN_SUCCESS.proposed.firstTime.title;
    }
    return LOGIN_SUCCESS.proposed.returning.title;
  };

  const getSubtitle = (): string => {
    if (copyMode === 'current') {
      return LOGIN_SUCCESS.current.subtitle;
    }
    if (userContext === 'first-time') {
      return LOGIN_SUCCESS.proposed.firstTime.subtitle;
    }
    return LOGIN_SUCCESS.proposed.returning.subtitle;
  };

  const title = getTitle();
  const subtitle = getSubtitle();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: '#fff',
        fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
        padding: 32,
      }}
    >
      <CheckmarkIcon />
      <p
        style={{
          marginTop: 24,
          fontSize: 20,
          fontWeight: 600,
          color: '#22333B',
          textAlign: 'center',
        }}
      >
        {title}
      </p>
      {subtitle && (
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default LoginSuccessScreen;
