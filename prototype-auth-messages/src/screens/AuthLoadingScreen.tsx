import React, { useState, useEffect, useRef } from 'react';
import type { ScreenProps } from '../types';
import {
  AUTH_LOADING_STEPS,
  AUTH_LOADING_SUBTITLES,
  AUTH_LOADING_INFO_TIP,
} from '../data/messages';

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

const InfoIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="8" stroke="#007AFF" strokeWidth="1.5" />
    <path d="M9 8v5M9 5.5v.01" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WarningBanner: React.FC<{ message: string }> = ({ message }) => (
  <div
    style={{
      background: '#FFF8E1',
      border: '1px solid #F5A623',
      borderRadius: 10,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 20,
      width: '100%',
    }}
  >
    <span style={{ fontSize: 16 }}>&#9888;</span>
    <span style={{ fontSize: 13, color: '#22333B', lineHeight: 1.4 }}>{message}</span>
  </div>
);

const ErrorAlert: React.FC<{
  title: string;
  message: string;
  onRetry?: () => void;
}> = ({ title, message, onRetry }) => (
  <div
    style={{
      background: '#FFF5F5',
      border: '1px solid #E53935',
      borderRadius: 12,
      padding: 20,
      width: '100%',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: '#E53935',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 6L18 18M18 6L6 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
    <p style={{ fontSize: 16, fontWeight: 600, color: '#E53935', margin: '0 0 6px' }}>{title}</p>
    <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.5 }}>{message}</p>
    {onRetry && (
      <button
        style={{
          marginTop: 16,
          padding: '10px 32px',
          background: '#007AFF',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    )}
  </div>
);

// Step timings in ms: steps 1-6 = 800ms, step 7 = 4000ms, step 8 = 1500ms
const STEP_TIMINGS = [800, 800, 800, 800, 800, 800, 4000, 1500];
const TOTAL_STEPS = 8;

export const AuthLoadingScreen: React.FC<ScreenProps> = ({
  scenario,
  copyMode,
  userContext,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [showError, setShowError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determine at which step to interrupt for error scenarios
  const getInterruptStep = (): number => {
    switch (scenario) {
      case 'connection-drops':
        return 5; // ~60%
      case 'session-expired':
        return 3; // ~40%
      case 'timeout':
        return 2; // very early, crawling
      default:
        return TOTAL_STEPS; // no interrupt
    }
  };

  const interruptStep = getInterruptStep();

  useEffect(() => {
    // Elapsed time tracker
    elapsedRef.current = setInterval(() => {
      setElapsedMs((prev) => prev + 500);
    }, 500);

    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, []);

  useEffect(() => {
    if (stepIndex >= TOTAL_STEPS || showError) return;

    // If we hit the interrupt point, show error
    if (stepIndex >= interruptStep) {
      const delay = scenario === 'timeout' ? 3000 : 1500;
      timerRef.current = setTimeout(() => {
        setShowError(true);
      }, delay);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    // For slow-3g scenario, double the timing
    const multiplier = scenario === 'slow-3g' ? 2.5 : 1;
    const timing = STEP_TIMINGS[stepIndex] * multiplier;

    timerRef.current = setTimeout(() => {
      setStepIndex((prev) => prev + 1);
    }, timing);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stepIndex, scenario, interruptStep, showError]);

  const steps = copyMode === 'current' ? AUTH_LOADING_STEPS.current : AUTH_LOADING_STEPS.proposed;
  const currentStep = steps[Math.min(stepIndex, TOTAL_STEPS - 1)];

  const progress = Math.min((stepIndex / TOTAL_STEPS) * 100, 100);

  // Subtitle logic
  const getSubtitle = (): string => {
    if (copyMode === 'current') {
      return AUTH_LOADING_SUBTITLES.current;
    }

    // Proposed mode: adaptive subtitle
    const subs = AUTH_LOADING_SUBTITLES.proposed;
    if (elapsedMs < 5000) return subs.early;
    if (elapsedMs < 15000) return subs.medium;
    if (elapsedMs < 30000) return subs.long;
    if (elapsedMs < 45000) return subs.veryLong;
    return subs.tooLong;
  };

  // First time user extra subtitle
  const getFirstTimeNote = (): string | null => {
    if (copyMode === 'proposed' && userContext === 'first-time') {
      return 'First time? This may take a few minutes to set up.';
    }
    return null;
  };

  // Info tip
  const infoTip =
    copyMode === 'current' ? AUTH_LOADING_INFO_TIP.current : AUTH_LOADING_INFO_TIP.proposed;

  // Error content for interrupted scenarios
  const renderError = () => {
    if (scenario === 'connection-drops') {
      if (copyMode === 'current') {
        return (
          <ErrorAlert
            title="Error"
            message="An unknown error has occurred."
          />
        );
      }
      return (
        <ErrorAlert
          title="Connection lost"
          message="Check your signal and tap Retry."
          onRetry={() => {}}
        />
      );
    }

    if (scenario === 'session-expired') {
      if (copyMode === 'current') {
        return (
          <ErrorAlert
            title="Session Error"
            message="Your current session is invalid."
          />
        );
      }
      return (
        <ErrorAlert
          title="Session ended"
          message="Your session ended. Please sign in again to continue."
        />
      );
    }

    if (scenario === 'timeout') {
      if (copyMode === 'current') {
        return (
          <ErrorAlert
            title="Timeout"
            message="The request has timed out. Please try again."
          />
        );
      }
      return (
        <ErrorAlert
          title="Taking too long"
          message="This is taking longer than usual. You can keep waiting or try again on a stronger connection."
          onRetry={() => {}}
        />
      );
    }

    return null;
  };

  const showSlowBanner =
    scenario === 'slow-3g' && copyMode === 'proposed' && elapsedMs > 3000;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        background: '#fff',
        fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
        padding: '60px 24px 32px',
        boxSizing: 'border-box',
      }}
    >
      <style>{spinKeyframes}</style>

      {showSlowBanner && (
        <WarningBanner message="Slow connection detected. This may take longer than usual." />
      )}

      {showError ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {renderError()}
        </div>
      ) : (
        <>
          {/* Spinner */}
          <div style={{ marginBottom: 28 }}>
            <Spinner size={52} color="#007AFF" />
          </div>

          {/* Current step message */}
          <p
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#22333B',
              textAlign: 'center',
              margin: '0 0 8px',
            }}
          >
            {currentStep}
          </p>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center',
              margin: '0 0 4px',
              lineHeight: 1.5,
              maxWidth: 300,
            }}
          >
            {getSubtitle()}
          </p>

          {/* First-time note */}
          {getFirstTimeNote() && (
            <p
              style={{
                fontSize: 13,
                color: '#007AFF',
                textAlign: 'center',
                margin: '4px 0 0',
                fontWeight: 500,
              }}
            >
              {getFirstTimeNote()}
            </p>
          )}

          {/* Progress bar area */}
          <div style={{ width: '100%', marginTop: 36 }}>
            <div
              style={{
                width: '100%',
                height: 8,
                borderRadius: 4,
                background: '#E8E8E8',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  borderRadius: 4,
                  background: '#007AFF',
                  transition: 'width 300ms ease',
                }}
              />
            </div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#22333B',
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              {Math.round(progress)}%
            </p>
          </div>
        </>
      )}

      {/* Info tip box at bottom */}
      <div style={{ flexGrow: 1 }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          background: '#EFF6FF',
          borderRadius: 10,
          padding: '12px 14px',
          width: '100%',
        }}
      >
        <InfoIcon />
        <span style={{ fontSize: 13, color: '#22333B', lineHeight: 1.5 }}>{infoTip}</span>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
