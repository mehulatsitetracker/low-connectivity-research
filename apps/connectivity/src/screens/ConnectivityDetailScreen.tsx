import React from 'react';

/* ── sitetracker-mobile design tokens ── */
const colors = {
  topBar: '#1D2D34',
  background: '#F7F8F7',
  surface: '#FFFFFF',
  border: '#DDDBDA',
  textPrimary: '#1D2D34',
  textSecondary: '#706E6B',
  textTertiary: '#AAADAE',
  brandTeal: '#00847C',
  warning: '#FFB75D',
  warningDark: '#844800',
  success: '#027E46',
  successBg: '#D9FFDF',
};

const display: Record<'slow' | 'very-slow', { label: string; tip: string }> = {
  slow: {
    label: 'Slow Connection',
    tip: 'Your connection is slower than usual. Saving records and syncing data may take a bit longer. Try moving to an area with better signal.',
  },
  'very-slow': {
    label: 'Very Slow Connection',
    tip: 'Your connection is very weak. Uploads and syncs may fail or be delayed significantly. Consider switching to Wi-Fi or moving to a location with stronger signal. Your work is saved locally and will sync when the connection improves.',
  },
};

const mock: Record<'slow' | 'very-slow', { latency: number; mbps: number; conn: string }> = {
  slow: { latency: 1500, mbps: 2, conn: 'Cellular' },
  'very-slow': { latency: 4000, mbps: 0.5, conn: 'Cellular' },
};

interface Props {
  onBack: () => void;
  quality: 'slow' | 'very-slow';
  banner?: React.ReactNode;
}

export const ConnectivityDetailScreen: React.FC<Props> = ({ onBack, quality, banner }) => {
  const d = display[quality];
  const m = mock[quality];

  return (
    <div style={{ flex: 1, background: colors.background, display: 'flex', flexDirection: 'column' }}>
      {/* Nav bar — dark, matches other screen headers */}
      <div style={{
        height: 44, background: colors.topBar, display: 'flex', alignItems: 'center',
        padding: '0 12px', flexShrink: 0, justifyContent: 'space-between',
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 500, fontFamily: 'system-ui' }}>Back</span>
        </button>
        <span style={{
          position: 'absolute', left: 0, right: 0, textAlign: 'center',
          fontWeight: 600, fontSize: 17, color: '#fff', fontFamily: 'system-ui',
          pointerEvents: 'none',
        }}>Connection Status</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Sticky banner — below nav bar */}
      {banner}

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {/* Speed card — sitetracker card style */}
        <div style={{
          background: colors.surface, borderRadius: 4, border: `1px solid ${colors.border}`,
          padding: 20, marginBottom: 12, textAlign: 'center',
        }}>
          <div style={{
            fontSize: 14, fontWeight: 700, color: colors.warning,
            fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: 0.5,
            marginBottom: 8,
          }}>{d.label}</div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: colors.textPrimary, fontFamily: 'system-ui' }}>~{m.mbps}</span>
            <span style={{ fontSize: 14, color: colors.textSecondary, fontWeight: 600, fontFamily: 'system-ui', marginLeft: 4 }}>Mbps</span>
          </div>
          <div style={{ fontSize: 13, color: colors.textTertiary, fontFamily: 'system-ui' }}>
            Latency: {m.latency} ms
          </div>
          <div style={{ fontSize: 13, color: colors.textTertiary, fontFamily: 'system-ui', marginTop: 2 }}>
            Connection: {m.conn}
          </div>
        </div>

        {/* Guidance card — body text style */}
        <div style={{
          background: colors.surface, borderRadius: 4, border: `1px solid ${colors.border}`,
          padding: 16, marginBottom: 12,
        }}>
          <span style={{
            fontSize: 14, color: colors.textSecondary, lineHeight: '22px', fontFamily: 'system-ui',
          }}>{d.tip}</span>
        </div>

        {/* Impact section — sitetracker card */}
        <div style={{
          background: colors.surface, borderRadius: 4, border: `1px solid ${colors.border}`,
          padding: 16,
        }}>
          <div style={{
            fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 14,
            fontFamily: 'system-ui',
          }}>What this means for you</div>

          <ImpactRow
            icon={<SyncIcon color={colors.warning} />}
            text={quality === 'slow'
              ? 'Syncing may be slower than usual'
              : 'Syncing may fail or be significantly delayed'}
          />
          <ImpactRow
            icon={<UploadIcon color={colors.warning} />}
            text={quality === 'slow'
              ? 'Uploads may take longer to complete'
              : 'Uploads may fail — they will retry automatically'}
          />
          <ImpactRow
            icon={<SaveIcon color={colors.success} />}
            text="Your work is always saved locally first"
          />
        </div>
      </div>
    </div>
  );
};

/* ── Inline SVG icons (matching sitetracker icon style) ── */

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

const ImpactRow: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
    <div style={{ width: 20, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>{icon}</div>
    <span style={{ fontSize: 14, color: colors.textSecondary, lineHeight: '22px', fontFamily: 'system-ui' }}>{text}</span>
  </div>
);
