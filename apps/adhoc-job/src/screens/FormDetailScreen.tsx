import type React from 'react';
import { colors, radii } from '../theme';

interface Props {
  mode: 'check-in' | 'check-out';
  formToggle: boolean;
  onToggle: () => void;
  onBack: () => void;
  onClose: () => void;
}

export const FormDetailScreen: React.FC<Props> = ({ mode, formToggle, onToggle, onBack, onClose }) => {
  const isCheckIn = mode === 'check-in';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: colors.background }}>
      {/* Header */}
      <div style={{
        height: 44, display: 'flex', alignItems: 'center', padding: '0 12px',
        background: colors.surface, borderBottom: `1px solid ${colors.border}`, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9l8 8" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Section dropdown */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: `3px solid ${colors.warning}`,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: colors.textPrimary }}>General</span>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1l5 5 5-5" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ flex: 1, padding: 16 }}>
        {/* Form field card */}
        <div style={{
          background: colors.surface, borderRadius: radii.card,
          border: `1px solid ${colors.borderLight}`, padding: 16, marginBottom: 16,
          borderLeft: `3px solid ${colors.warning}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
                <span style={{ color: colors.error, marginRight: 2 }}>*</span>
                {isCheckIn ? 'Checked-In' : 'Site Clear'}
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                {isCheckIn ? 'Confirmation required' : 'Confirm no hazards on site'}
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={colors.textTertiary}>
              <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
            </svg>
          </div>

          {/* Toggle */}
          <button
            onClick={onToggle}
            style={{
              width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
              background: formToggle ? colors.brandTeal : '#ccc',
              position: 'relative', transition: 'background 0.2s', marginTop: 8,
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 2,
              left: formToggle ? 22 : 2,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </button>
        </div>

        {/* Signature area */}
        <div style={{
          background: colors.surface, borderRadius: radii.card,
          border: `1px solid ${colors.borderLight}`, padding: 16, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>Signature</div>
          <div style={{
            height: 80, border: `1px dashed ${colors.border}`, borderRadius: radii.standard,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: colors.textTertiary, fontSize: 13,
          }}>
            Tap to sign
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px 0', borderRadius: radii.button,
            background: colors.brandTeal, color: '#fff', fontSize: 16, fontWeight: 600,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
