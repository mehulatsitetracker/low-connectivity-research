import React from 'react';
import type { ScreenProps } from '../types';
import { DOMAIN_SELECT } from '../data/messages';
import { colors, radii, typography, spacing } from '../theme';

const MOCK_ACCOUNTS = [
  {
    id: '1',
    name: 'SITETR\u25B2CKER',
    domain: 'st-r50-edu.my.salesforce.com',
    email: 'mehul.k@sitetracker.r50.pu',
    loggedIn: true,
    isSitetracker: true,
  },
  {
    id: '2',
    name: '',
    domain: 'st-pre-prod-52-pi-patch-lu.my.salesforce.com',
    email: 'qa@sitetracker.com.preprod.patch.lu',
    loggedIn: false,
    isSitetracker: false,
  },
];

const GearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
      stroke={colors.textTertiary}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.2 12.5a1.4 1.4 0 00.3 1.5l.05.05a1.7 1.7 0 11-2.4 2.4l-.05-.05a1.4 1.4 0 00-1.5-.3 1.4 1.4 0 00-.85 1.28v.14a1.7 1.7 0 11-3.4 0v-.07A1.4 1.4 0 007.5 16.2a1.4 1.4 0 00-1.5.3l-.05.05a1.7 1.7 0 11-2.4-2.4l.05-.05a1.4 1.4 0 00.3-1.5 1.4 1.4 0 00-1.28-.85H2.5a1.7 1.7 0 110-3.4h.07A1.4 1.4 0 003.8 7.5a1.4 1.4 0 00-.3-1.5l-.05-.05a1.7 1.7 0 112.4-2.4l.05.05a1.4 1.4 0 001.5.3h.07a1.4 1.4 0 00.85-1.28V2.5a1.7 1.7 0 013.4 0v.07a1.4 1.4 0 00.85 1.28 1.4 1.4 0 001.5-.3l.05-.05a1.7 1.7 0 112.4 2.4l-.05.05a1.4 1.4 0 00-.3 1.5v.07a1.4 1.4 0 001.28.85h.14a1.7 1.7 0 110 3.4h-.07a1.4 1.4 0 00-1.28.85z"
      stroke={colors.textTertiary}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SalesforceCloudIcon = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
    <path
      d="M8.5 3.5a4.5 4.5 0 014.2 2.9A3.5 3.5 0 0120 9.5a3.5 3.5 0 01-3.5 3.5H6a4 4 0 01-.8-7.9A4.5 4.5 0 018.5 3.5z"
      fill="#1798C1"
      stroke="#1798C1"
      strokeWidth="0.5"
    />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke={colors.offlineText} strokeWidth="1.5" />
    <path d="M8 7V11" stroke={colors.offlineText} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.75" fill={colors.offlineText} />
  </svg>
);

export const DomainSelectScreen: React.FC<ScreenProps> = ({ scenario, copyMode }) => {
  const msgs = copyMode === 'current' ? DOMAIN_SELECT.current : DOMAIN_SELECT.proposed;
  const copy = { ...DOMAIN_SELECT.proposed, ...msgs };
  const isOffline = scenario === 'offline' || scenario === 'offline-no-accounts';
  const showAccounts = scenario !== 'offline-no-accounts';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: colors.background,
        fontFamily: typography.fontFamily,
      }}
    >
      {/* Offline banner */}
      {isOffline && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            background: colors.offlineBg,
          }}
        >
          <InfoIcon />
          <span style={{ fontSize: 13, color: colors.offlineText, lineHeight: 1.4 }}>
            {copy.offlineBanner}
          </span>
        </div>
      )}

      {/* Header area with logo */}
      <div style={{ padding: '40px 24px 16px' }}>
        <div
          style={{
            fontSize: typography.logo.fontSize,
            fontWeight: typography.logo.fontWeight,
            letterSpacing: typography.logo.letterSpacing,
            color: colors.textPrimary,
            marginBottom: 16,
          }}
        >
          {typography.logo.text}
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: colors.textPrimary,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {copy.title}
        </h1>

        {copyMode === 'proposed' && copy.helpText && (
          <p style={{ fontSize: 14, color: colors.textSecondary, margin: '8px 0 0', lineHeight: 1.5 }}>
            {copy.helpText}
          </p>
        )}
      </div>

      {/* Account list */}
      {showAccounts ? (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: '0 16px' }}>
            {MOCK_ACCOUNTS.map((account) => (
              <div
                key={account.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderLeft: `3px solid ${colors.brandTeal}`,
                  borderRadius: radii.standard,
                  padding: spacing.cardPadding,
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Logo / icon row */}
                  <div style={{ marginBottom: 4 }}>
                    {account.isSitetracker ? (
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: typography.logo.fontWeight,
                          letterSpacing: 2,
                          color: colors.textPrimary,
                        }}
                      >
                        {typography.logo.text}
                      </span>
                    ) : (
                      <SalesforceCloudIcon />
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 2 }}>
                    {account.domain}
                  </div>
                  <div style={{ fontSize: 13, color: colors.textTertiary }}>
                    {account.email}
                  </div>
                  {!account.loggedIn && (
                    <div
                      style={{
                        display: 'inline-block',
                        marginTop: 6,
                        padding: '2px 8px',
                        background: '#f5f5f5',
                        borderRadius: 3,
                        fontSize: 12,
                        color: colors.textSecondary,
                      }}
                    >
                      Logged out.
                    </div>
                  )}
                </div>
                <div style={{ cursor: 'pointer', padding: 4, marginLeft: 8 }}>
                  <GearIcon />
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 32px',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z" stroke={colors.border} strokeWidth="2" />
              <path d="M16 24h16M24 16v16" stroke={colors.border} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 1.5 }}>
            {copyMode === 'proposed'
              ? DOMAIN_SELECT.proposed.offlineNoAccounts
              : 'No accounts available.'}
          </p>
        </div>
      )}

      {/* Bottom links */}
      <div style={{ padding: '24px 24px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: colors.textSecondary, margin: '0 0 8px' }}>
          Don't see an account?
        </p>
        <p style={{ margin: '0 0 6px' }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: colors.brandTeal, cursor: 'pointer', textDecoration: 'underline' }}>
            Connect to another account
          </span>
        </p>
        <p style={{ fontSize: 14, color: colors.textSecondary, margin: '0 0 6px' }}>or</p>
        <p style={{ margin: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: colors.brandTeal, cursor: 'pointer', textDecoration: 'underline' }}>
            Log in with MobilePlus
          </span>
        </p>
      </div>
    </div>
  );
};

export default DomainSelectScreen;
