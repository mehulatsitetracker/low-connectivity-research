import type React from 'react';
import { colors, radii } from '../theme';
import { JOBS } from '../data/jobs';
import { BottomNav } from '../components/BottomNav';
import { STATUS_DOT_COLORS } from '../components/StatusPicker';
import type { JobStatus } from '../types';

interface Props {
  jobStatuses: Record<string, JobStatus>;
  onSelectJob: (jobId: string) => void;
}

export const JobListScreen: React.FC<Props> = ({ jobStatuses, onSelectJob }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: colors.background }}>
    {/* Header */}
    <div style={{
      height: 44,
      background: colors.topBar,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 12px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9l8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: 17 }}>Jobs</span>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1l5 5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    </div>

    {/* Content */}
    <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        background: colors.surface,
        borderRadius: radii.input,
        border: `1px solid ${colors.border}`,
        marginBottom: 12,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <span style={{ color: colors.textTertiary, fontSize: 15 }}>Search...</span>
      </div>

      {/* Job cards */}
      {JOBS.map(job => {
        const liveStatus = jobStatuses[job.id] || 'Scheduled';
        const dotColor = STATUS_DOT_COLORS[liveStatus] || colors.textTertiary;
        return (
          <button
            key={job.id}
            onClick={() => onSelectJob(job.id)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radii.card,
              padding: '14px 16px',
              marginBottom: 10,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16, color: colors.textPrimary, marginBottom: 4 }}>
              {job.id}
            </div>
            <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 2 }}>
              Job template: {job.templateName}
            </div>
            <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 2 }}>
              Site: {job.siteName}
            </div>
            <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              Job status:
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
                {liveStatus}
              </span>
            </div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>
              Priority: <span style={{ color: job.priority === 'High' ? colors.priorityHigh : job.priority === 'Low' ? colors.textTertiary : colors.priorityMedium, fontWeight: 600 }}>{job.priority}</span>
            </div>
          </button>
        );
      })}
    </div>

    <BottomNav activeTab="menu" />
  </div>
);
