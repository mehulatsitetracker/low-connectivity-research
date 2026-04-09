import React from 'react';
import type { ScreenProps } from '../types';
import { OFFLINE_SYNC_PHASES } from '../data/messages';
import { colors, radii, typography } from '../theme';

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg) } }`;

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = colors.brandTeal }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: `2px solid ${colors.border}`,
      borderTopColor: color,
      animation: 'spin 0.8s linear infinite',
      flexShrink: 0,
    }}
  />
);

type PhaseStatus = 'completed' | 'in-progress' | 'waiting' | 'failed';

interface PhaseItem {
  label: string;
  status: PhaseStatus;
  errorText?: string;
}

const StatusIcon: React.FC<{ status: PhaseStatus }> = ({ status }) => {
  if (status === 'completed') {
    return (
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: colors.brandTeal,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (status === 'in-progress') {
    return <Spinner size={22} color={colors.brandTeal} />;
  }

  if (status === 'failed') {
    return (
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: colors.error,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 2L8 8M8 2L2 8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // waiting
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: `2px solid ${colors.border}`,
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    />
  );
};

function buildPhases(
  scenario: string,
  copyMode: 'current' | 'proposed',
): PhaseItem[] {
  const labels =
    copyMode === 'current' ? OFFLINE_SYNC_PHASES.current : OFFLINE_SYNC_PHASES.proposed;

  const phases: PhaseItem[] = labels.map((label) => ({
    label,
    status: 'waiting' as PhaseStatus,
  }));

  switch (scenario) {
    case 'happy': {
      for (let i = 0; i < 7; i++) phases[i].status = 'completed';
      phases[7].status = 'in-progress';
      break;
    }
    case 'phase-fails': {
      for (let i = 0; i < 5; i++) phases[i].status = 'completed';
      phases[5].status = 'failed';
      phases[5].errorText =
        copyMode === 'current'
          ? 'Error 500: SOQL query too complex. Aggregate query has too many rows for direct assignment.'
          : "Couldn't download your schedule \u2014 tap to retry";
      break;
    }
    case 'all-fail': {
      for (let i = 0; i < 12; i++) {
        phases[i].status = 'failed';
        phases[i].errorText = copyMode === 'current' ? 'Sync failed' : 'Failed';
      }
      break;
    }
    case 'network-lost': {
      for (let i = 0; i < 3; i++) phases[i].status = 'completed';
      phases[3].status = 'failed';
      phases[3].errorText =
        copyMode === 'current'
          ? 'Network error'
          : 'Sync paused \u2014 waiting for connection';
      break;
    }
    default:
      break;
  }

  return phases;
}

export const OfflineSyncScreen: React.FC<ScreenProps> = ({
  scenario,
  copyMode,
}) => {
  const phases = buildPhases(scenario, copyMode);
  const completedCount = phases.filter((p) => p.status === 'completed').length;
  const totalCount = phases.length;
  const showAllFailSummary = scenario === 'all-fail' && copyMode === 'proposed';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: typography.fontFamily,
      }}
    >
      <style>{spinKeyframes}</style>

      {/* Gray app background */}
      <div style={{ flex: 1, background: colors.background }} />

      {/* Bottom sheet */}
      <div
        style={{
          background: colors.surface,
          borderRadius: radii.bottomSheet,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
          padding: '20px 20px 24px',
          maxHeight: '75%',
          overflow: 'auto',
        }}
      >
        {/* Handle bar */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: colors.border,
            margin: '0 auto 16px',
          }}
        />

        {/* Title */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.textPrimary,
            margin: '0 0 4px',
          }}
        >
          Offline Sync Status
        </h2>

        {/* Progress summary (proposed only) */}
        {copyMode === 'proposed' && (
          <p style={{ fontSize: 14, color: colors.textSecondary, margin: '0 0 16px' }}>
            {completedCount} of {totalCount} complete
          </p>
        )}

        {copyMode === 'current' && <div style={{ height: 12 }} />}

        {/* All-fail summary banner (proposed only) */}
        {showAllFailSummary && (
          <div
            style={{
              background: colors.errorLight,
              border: `1px solid ${colors.error}`,
              borderRadius: radii.standard,
              padding: '12px 14px',
              marginBottom: 16,
            }}
          >
            <p style={{ fontSize: 14, color: colors.error, fontWeight: 600, margin: '0 0 4px' }}>
              Offline mode isn't available right now
            </p>
            <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0, lineHeight: 1.5 }}>
              Connect to Wi-Fi and try again.
            </p>
          </div>
        )}

        {/* Phase rows */}
        {phases.map((phase, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '10px 0',
              borderBottom: i < phases.length - 1 ? `1px solid ${colors.background}` : 'none',
            }}
          >
            <StatusIcon status={phase.status} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 15,
                  color:
                    phase.status === 'failed'
                      ? colors.error
                      : phase.status === 'waiting'
                      ? colors.textTertiary
                      : colors.textPrimary,
                  margin: 0,
                  fontWeight: phase.status === 'in-progress' ? 500 : 400,
                }}
              >
                {phase.label}
              </p>
              {phase.errorText && (
                <p
                  style={{
                    fontSize: 13,
                    color: phase.status === 'failed' ? colors.error : colors.textSecondary,
                    margin: '4px 0 0',
                    lineHeight: 1.4,
                  }}
                >
                  {phase.errorText}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfflineSyncScreen;
