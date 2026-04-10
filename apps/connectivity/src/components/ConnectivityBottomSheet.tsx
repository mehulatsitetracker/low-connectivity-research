import React from 'react';

const colors = {
  surface: '#FFFFFF',
  border: '#DDDBDA',
  textPrimary: '#1D2D34',
  textSecondary: '#706E6B',
  textTertiary: '#AAADAE',
  warning: '#FFB75D',
  warningDark: '#844800',
  success: '#027E46',
};

const WARNING_LIGHT = '#FFF4E0';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ConnectivityBottomSheet: React.FC<Props> = ({ open, onClose }) => {

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51,
        background: colors.surface,
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease',
        maxHeight: '75%',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Handle */}
        <div style={{
          display: 'flex', justifyContent: 'center', padding: '10px 0 6px', flexShrink: 0,
        }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#D0D0D0' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px 12px', borderBottom: `1px solid ${colors.border}`, flexShrink: 0,
        }}>
          <span style={{
            fontSize: 17, fontWeight: 700, color: colors.textPrimary, fontFamily: 'system-ui',
          }}>Slow Connection</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Content — no cards, flat layout */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 24px' }}>
          {/* Large illustration */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 48, background: WARNING_LIGHT,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}>
              <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
                {/* Wifi waves */}
                <path d="M4 13C9 8 14 6 18 6C22 6 27 8 32 13" stroke={colors.warning} strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
                <path d="M9 18C12 15 15 13.5 18 13.5C21 13.5 24 15 27 18" stroke={colors.warning} strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
                <path d="M13.5 23C15 21.5 16.5 21 18 21C19.5 21 21 21.5 22.5 23" stroke={colors.warning} strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
                <circle cx="18" cy="28" r="2.5" fill={colors.warning}/>
                {/* Slow indicator — clock */}
                <circle cx="28" cy="28" r="7" fill={colors.surface} stroke={colors.warning} strokeWidth="1.5"/>
                <path d="M28 25V28.5L30 30" stroke={colors.warning} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{
              fontSize: 15, color: colors.textSecondary, fontFamily: 'system-ui',
              lineHeight: '22px', maxWidth: 280, margin: '0 auto',
            }}>Try moving to a better network area or switch to a different network</div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: colors.border, marginBottom: 18 }} />

          {/* Impact rows — flat, no card wrapper */}
          <div style={{
            fontSize: 13, fontWeight: 700, color: colors.textSecondary, marginBottom: 14,
            fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: 0.5,
          }}>What this means for you</div>

          <ImpactRow
            icon={<SyncIcon color={colors.warning} />}
            text="Saving and syncing your work will take longer"
          />
          <ImpactRow
            icon={<UploadIcon color={colors.warning} />}
            text="Photos and files may be slow to upload — they'll retry on their own"
          />
          <ImpactRow
            icon={<SaveIcon color={colors.success} />}
            text="Don't worry — your work is saved on this device first"
            last
          />
        </div>
      </div>
    </>
  );
};

/* ── Icons ── */

const SyncIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 9a6 6 0 0110.2-4.2M15 9a6 6 0 01-10.2 4.2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13.5 2.5v2.5H11M4.5 15.5V13H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UploadIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 12V4M9 4L6 7M9 4l3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 13v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SaveIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M14 16H4a1 1 0 01-1-1V3a1 1 0 011-1h7.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0115 5.414V15a1 1 0 01-1 1z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 16v-5a1 1 0 011-1h4a1 1 0 011 1v5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 2v3h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ImpactRow: React.FC<{ icon: React.ReactNode; text: string; last?: boolean }> = ({ icon, text, last }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: last ? 0 : 12 }}>
    <div style={{ width: 20, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>{icon}</div>
    <span style={{ fontSize: 13, color: '#706E6B', lineHeight: '20px', fontFamily: 'system-ui' }}>{text}</span>
  </div>
);
