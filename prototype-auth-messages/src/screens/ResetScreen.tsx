import React from 'react';
import type { ScreenProps } from '../types';
import { RESET_SCREEN } from '../data/messages';

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg) } }`;

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = '#22333B' }) => (
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
        background: '#fff',
        fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
        padding: 32,
      }}
    >
      <style>{spinKeyframes}</style>

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 3,
          color: '#22333B',
          marginBottom: 80,
        }}
      >
        SITETRACKER
      </div>

      <Spinner size={48} color="#007AFF" />

      <p
        style={{
          marginTop: 32,
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        {getMessage()}
      </p>

      {scenario === 'corrupted-session' && copyMode === 'proposed' && (
        <p style={{ marginTop: 8, fontSize: 13, color: '#999', textAlign: 'center' }}>
          This only takes a moment.
        </p>
      )}
    </div>
  );
};

export default ResetScreen;
