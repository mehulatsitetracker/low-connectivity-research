import React from 'react';
import type { ScreenProps } from '../types';
import { ACCESS_MODAL } from '../data/messages';
import { colors, radii, typography } from '../theme';

const LockIcon = ({ color = colors.brandTeal }: { color?: string }) => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="38" stroke={color} strokeWidth="3" fill={`${color}15`} />
    <rect x="28" y="38" width="24" height="18" rx="3" fill={color} />
    <path d="M32 38V30a8 8 0 0 1 16 0v8" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="40" cy="48" r="2.5" fill="#fff" />
  </svg>
);

const WarningIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="38" stroke="#F5A623" strokeWidth="3" fill="#F5A62315" />
    <path d="M40 24L58 56H22L40 24Z" fill="#F5A623" />
    <rect x="38.5" y="34" width="3" height="12" rx="1.5" fill="#fff" />
    <circle cx="40" cy="50" r="2" fill="#fff" />
  </svg>
);

const SignalIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="38" stroke={colors.error} strokeWidth="3" fill="#E5393515" />
    <path d="M28 52V46" stroke={colors.error} strokeWidth="4" strokeLinecap="round" />
    <path d="M36 52V40" stroke={colors.error} strokeWidth="4" strokeLinecap="round" />
    <path d="M44 52V34" stroke={colors.error} strokeWidth="4" strokeLinecap="round" />
    <path d="M52 52V28" stroke={colors.error} strokeWidth="4" strokeLinecap="round" />
    <line x1="26" y1="30" x2="54" y2="30" stroke={colors.error} strokeWidth="2.5" strokeLinecap="round" transform="rotate(45 40 30)" />
  </svg>
);

const getIcon = (scenario: string) => {
  switch (scenario) {
    case 'permission-error':
    case 'api-disabled':
      return <LockIcon />;
    case 'server-error':
      return <WarningIcon />;
    case 'network-error':
      return <SignalIcon />;
    default:
      return <LockIcon />;
  }
};

const getMessage = (scenario: string, copyMode: 'current' | 'proposed'): string => {
  if (copyMode === 'current') {
    switch (scenario) {
      case 'permission-error': return ACCESS_MODAL.current.namespace;
      case 'api-disabled': return ACCESS_MODAL.current.apiDisabled;
      case 'server-error': return ACCESS_MODAL.current.serverError;
      case 'network-error': return ACCESS_MODAL.current.networkError;
      default: return ACCESS_MODAL.current.serverError;
    }
  }
  switch (scenario) {
    case 'permission-error': return ACCESS_MODAL.proposed.appAccess;
    case 'api-disabled': return ACCESS_MODAL.proposed.apiDisabled;
    case 'server-error': return ACCESS_MODAL.proposed.serverError;
    case 'network-error': return ACCESS_MODAL.proposed.networkError;
    default: return ACCESS_MODAL.proposed.serverError;
  }
};

const isPermissionScenario = (scenario: string) =>
  scenario === 'permission-error' || scenario === 'api-disabled';

export const AccessModalScreen: React.FC<ScreenProps> = ({ scenario, copyMode }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: '#00000066',
        fontFamily: typography.fontFamily,
      }}
    >
      <div
        style={{
          background: colors.surface,
          borderRadius: radii.standard,
          padding: 24,
          maxWidth: 320,
          width: '85%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: 16 }}>{getIcon(scenario)}</div>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: colors.textPrimary,
            margin: '0 0 20px 0',
            whiteSpace: 'pre-line',
          }}
        >
          {getMessage(scenario, copyMode)}
        </p>

        {copyMode === 'proposed' && isPermissionScenario(scenario) && (
          <div
            style={{
              background: colors.background,
              borderRadius: radii.standard,
              padding: 12,
              width: '100%',
              marginBottom: 20,
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>
              Show this to your admin:
            </div>
            <div style={{ fontSize: 14, color: colors.textPrimary, fontStyle: 'italic', lineHeight: 1.5 }}>
              "This user needs the Sitetracker Mobile permission set enabled in Salesforce Setup."
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, width: '100%', flexDirection: 'column' }}>
          {copyMode === 'current' ? (
            <button
              style={{
                padding: '12px 24px',
                borderRadius: radii.button,
                border: 'none',
                background: colors.border,
                color: colors.textPrimary,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          ) : (
            <>
              {isPermissionScenario(scenario) ? (
                <p
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    margin: 0,
                    lineHeight: 1.5,
                    textAlign: 'center',
                  }}
                >
                  Contact your Sitetracker admin for help.
                </p>
              ) : (
                <button
                  style={{
                    padding: '12px 24px',
                    borderRadius: radii.button,
                    border: 'none',
                    background: colors.brandTeal,
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Try Again
                </button>
              )}
              <button
                style={{
                  padding: '12px 24px',
                  borderRadius: radii.button,
                  border: 'none',
                  background: colors.border,
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessModalScreen;
