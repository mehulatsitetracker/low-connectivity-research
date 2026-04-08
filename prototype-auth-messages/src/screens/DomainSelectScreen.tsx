import React from 'react';
import type { ScreenProps } from '../types';
import { DOMAIN_SELECT } from '../data/messages';

const MOCK_ACCOUNTS = [
  { id: '1', name: 'Production - Acme Corp', domain: 'acme.my.sitetracker.com' },
  { id: '2', name: 'Sandbox - Acme Corp', domain: 'acme--sandbox.my.sitetracker.com' },
  { id: '3', name: 'Training Environment', domain: 'acme--training.my.sitetracker.com' },
];

const ChevronRight = () => (
  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
    <path d="M1 1L7 7L1 13" stroke="#C7C7CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="#007AFF" strokeWidth="1.5" />
    <path d="M8 7V11" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.75" fill="#007AFF" />
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
        background: '#fff',
        fontFamily: '-apple-system, SF Pro, system-ui, sans-serif',
      }}
    >
      {/* Offline banner */}
      {isOffline && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            background: '#E8F0FE',
            borderBottom: '1px solid #D2E3FC',
          }}
        >
          <InfoIcon />
          <span style={{ fontSize: 13, color: '#22333B', lineHeight: 1.4 }}>
            {copy.offlineBanner}
          </span>
        </div>
      )}

      {/* Header area */}
      <div style={{ padding: '40px 24px 16px' }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#22333B',
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {copy.title}
        </h1>

        {copyMode === 'proposed' && copy.helpText && (
          <p style={{ fontSize: 14, color: '#666', margin: '8px 0 0', lineHeight: 1.5 }}>
            {copy.helpText}
          </p>
        )}
      </div>

      {/* Account list */}
      {showAccounts ? (
        <div style={{ flex: 1, padding: '0 24px' }}>
          {MOCK_ACCOUNTS.map((account, i) => (
            <div
              key={account.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 0',
                borderBottom: i < MOCK_ACCOUNTS.length - 1 ? '1px solid #E5E5EA' : 'none',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#22333B' }}>
                  {account.name}
                </div>
                <div style={{ fontSize: 13, color: '#999', marginTop: 2 }}>
                  {account.domain}
                </div>
              </div>
              <ChevronRight />
            </div>
          ))}
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
              <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z" stroke="#C7C7CC" strokeWidth="2" />
              <path d="M16 24h16M24 16v16" stroke="#C7C7CC" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 1.5 }}>
            {copyMode === 'proposed'
              ? DOMAIN_SELECT.proposed.offlineNoAccounts
              : 'No accounts available.'}
          </p>
        </div>
      )}

      {/* Admin link - proposed only */}
      {copyMode === 'proposed' && copy.adminLink && showAccounts && (
        <div style={{ padding: '16px 24px 32px', textAlign: 'center' }}>
          <span style={{ fontSize: 14, color: '#007AFF', cursor: 'pointer' }}>
            {copy.adminLink}
          </span>
        </div>
      )}
    </div>
  );
};

export default DomainSelectScreen;
