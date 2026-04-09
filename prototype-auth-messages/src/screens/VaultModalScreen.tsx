import React from 'react';
import type { ScreenProps } from '../types';
import { VAULT_MODAL } from '../data/messages';
import { colors, radii, typography } from '../theme';

interface ModalButton {
  label: string;
  bold?: boolean;
}

const IOSModal: React.FC<{
  title: string;
  message: string;
  buttons: ModalButton[];
}> = ({ title, message, buttons }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: colors.overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
      zIndex: 10,
    }}
  >
    <div
      style={{
        background: colors.surface,
        borderRadius: radii.modal,
        width: '100%',
        maxWidth: 270,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '20px 16px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
          {message}
        </div>
      </div>
      <div
        style={{
          borderTop: `0.5px solid ${colors.border}`,
          display: buttons.length <= 2 ? 'flex' : 'block',
        }}
      >
        {buttons.map((btn, i) => (
          <div
            key={btn.label}
            style={{
              flex: buttons.length <= 2 ? 1 : undefined,
              padding: '12px 0',
              textAlign: 'center',
              fontSize: 17,
              color: colors.brandTeal,
              fontWeight: btn.bold ? 600 : 400,
              cursor: 'pointer',
              borderLeft: buttons.length <= 2 && i > 0 ? `0.5px solid ${colors.border}` : 'none',
              borderTop: buttons.length > 2 && i > 0 ? `0.5px solid ${colors.border}` : 'none',
            }}
          >
            {btn.label}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProposedModal: React.FC<{
  icon?: React.ReactNode;
  title: string;
  message: string;
  buttons: ModalButton[];
}> = ({ icon, title, message, buttons }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: colors.overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      zIndex: 10,
    }}
  >
    <div
      style={{
        background: colors.surface,
        borderRadius: radii.modal,
        width: '100%',
        maxWidth: 300,
        overflow: 'hidden',
        padding: '28px 24px 20px',
        textAlign: 'center',
      }}
    >
      {icon && <div style={{ marginBottom: 16 }}>{icon}</div>}
      <div style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 24 }}>
        {message}
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {buttons.map((btn) => (
          <div
            key={btn.label}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: radii.button,
              fontSize: 16,
              fontWeight: btn.bold ? 600 : 400,
              color: btn.bold ? '#fff' : colors.brandTeal,
              background: btn.bold ? colors.brandTeal : 'transparent',
              border: btn.bold ? 'none' : `1px solid ${colors.brandTeal}`,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            {btn.label}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FaceIdIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="2" y="2" width="36" height="36" rx="8" stroke={colors.brandTeal} strokeWidth="2" />
    <circle cx="14" cy="16" r="1.5" fill={colors.brandTeal} />
    <circle cx="26" cy="16" r="1.5" fill={colors.brandTeal} />
    <path d="M14 26c2 3 10 3 12 0" stroke={colors.brandTeal} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 16v5h2" stroke={colors.brandTeal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarningIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M20 4L2 36h36L20 4z" stroke="#FF9500" strokeWidth="2" strokeLinejoin="round" />
    <path d="M20 16v8" stroke="#FF9500" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="20" cy="30" r="1.5" fill="#FF9500" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" stroke="#FF3B30" strokeWidth="2" />
    <path d="M14 14l12 12M26 14L14 26" stroke="#FF3B30" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const VaultModalScreen: React.FC<ScreenProps> = ({ scenario, copyMode }) => {
  const copy = copyMode === 'current' ? VAULT_MODAL.current : VAULT_MODAL.proposed;

  const renderCurrentMode = () => {
    switch (scenario) {
      case 'happy':
        return <IOSModal title="Save Password" message={copy.savePrompt} buttons={[{ label: 'Not Now' }, { label: 'Save Password', bold: true }]} />;
      case 'device-not-secure':
        return <IOSModal title="Device Not Secure" message={copy.deviceNotSecure} buttons={[{ label: 'OK', bold: true }]} />;
      case 'biometric-cancelled':
        return copy.cancelled ? <IOSModal title="Cancelled" message={copy.cancelled} buttons={[{ label: 'OK', bold: true }]} /> : null;
      case 'biometric-error':
        return <IOSModal title="Error" message={copy.error} buttons={[{ label: 'OK', bold: true }]} />;
      default:
        return null;
    }
  };

  const renderProposedMode = () => {
    switch (scenario) {
      case 'happy':
        return <ProposedModal icon={<FaceIdIcon />} title="Save Password?" message={copy.savePrompt} buttons={[{ label: 'Not Now' }, { label: 'Save', bold: true }]} />;
      case 'device-not-secure':
        return <ProposedModal icon={<WarningIcon />} title="Set Up Device Security" message={copy.deviceNotSecure} buttons={[{ label: 'Later' }, { label: 'Open Settings', bold: true }]} />;
      case 'biometric-cancelled':
        return <ProposedModal icon={<FaceIdIcon />} title="Password Not Saved" message={copy.cancelled} buttons={[{ label: 'OK', bold: true }]} />;
      case 'biometric-error':
        return <ProposedModal icon={<ErrorIcon />} title="Couldn't Save Password" message={copy.error} buttons={[{ label: 'Skip' }, { label: 'Try Again', bold: true }]} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        background: colors.background,
        fontFamily: typography.fontFamily,
      }}
    >
      {/* Faded background content to simulate what's behind the modal */}
      <div style={{ opacity: 0.3, padding: '60px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: colors.textPrimary, marginBottom: 12 }}>
          Welcome to Sitetracker
        </div>
        <div style={{ height: 8, background: colors.border, borderRadius: radii.standard, marginBottom: 10, width: '80%' }} />
        <div style={{ height: 8, background: colors.border, borderRadius: radii.standard, marginBottom: 10, width: '60%' }} />
        <div style={{ height: 8, background: colors.border, borderRadius: radii.standard, width: '70%' }} />
      </div>

      {/* Modal overlay */}
      {copyMode === 'current' ? renderCurrentMode() : renderProposedMode()}
    </div>
  );
};

export default VaultModalScreen;
