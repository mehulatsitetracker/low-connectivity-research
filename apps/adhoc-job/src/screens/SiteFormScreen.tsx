import type React from 'react';
import { colors, radii } from '../theme';
import { TopBar } from '../components/TopBar';
import { JOBS } from '../data/jobs';

interface Props {
  mode: 'check-in' | 'check-out';
  jobId: string;
  onOpenForm: () => void;
  onBack: () => void;
}

export const SiteFormScreen: React.FC<Props> = ({ mode, jobId, onOpenForm, onBack }) => {
  const job = JOBS.find(j => j.id === jobId) || JOBS[0];
  const title = mode === 'check-in' ? 'Site Check-In' : 'Site Check-Out';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: colors.background }}>
      <TopBar title={title} onBack={onBack} rightIcons={['paperclip']} />

      <div style={{ flex: 1, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: colors.textPrimary, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>{job.siteName}</div>
        <div style={{
          display: 'inline-block', padding: '3px 8px', background: colors.surfaceAlt,
          borderRadius: radii.standard, fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
          color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 16,
        }}>
          NOT STARTED
        </div>

        <button
          onClick={onOpenForm}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: 14, background: colors.surface,
            border: `1px solid ${colors.border}`, borderRadius: radii.card,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 2 }}>Section 1</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>General</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: colors.textSecondary }}>0/1</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.brandTeal}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </div>
        </button>
      </div>
    </div>
  );
};
