import type React from 'react';
import { colors, radii } from '../theme';
import { JOBS, JOB_FORMS } from '../data/jobs';
import { TopBar } from '../components/TopBar';
import { StatusPicker, STATUS_DOT_COLORS } from '../components/StatusPicker';
import type { JobStatus, TimerState, ConfigOptions } from '../types';

interface Props {
  jobId: string;
  jobStatus: JobStatus;
  isCheckedIn: boolean;
  timerState: TimerState;
  timerDisplay: number;
  lastCheckIn: string;
  crewAvailable: string;
  showStatusPicker: boolean;
  config: ConfigOptions;
  hasCheckedOutToday: boolean;
  onAction: (action: string) => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export const JobDetailScreen: React.FC<Props> = ({
  jobId, jobStatus, isCheckedIn, timerState, timerDisplay,
  lastCheckIn, crewAvailable, showStatusPicker, config,
  hasCheckedOutToday, onAction,
}) => {
  const job = JOBS.find(j => j.id === jobId) || JOBS[0];
  const isCaptured = timerState === 'captured';
  const isRunning = timerState === 'running';
  const isPaused = timerState === 'paused';

  // Gating: must be checked in to change status or start timer (when site check-in is enabled)
  const isGated = config.siteCheckInEnabled && !isCheckedIn;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: colors.background, position: 'relative' }}>
      <TopBar title="Job" onBack={() => onAction('back')} rightIcons={['star', 'cloud']} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Job Info */}
        <div style={{ padding: '12px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}` }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: colors.textPrimary }}>{job.id}</div>
          <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>{job.templateName}</div>
        </div>

        {/* Map + Address */}
        <div style={{ display: 'flex', padding: 12, gap: 12, background: colors.surface, borderBottom: `1px solid ${colors.borderLight}` }}>
          <div style={{ width: 140, height: 130, borderRadius: radii.card, background: '#E8E8E8', flexShrink: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #d4e4d4 0%, #e8e8e8 50%, #d0d8d0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="36" viewBox="0 0 24 32" fill={colors.textPrimary}>
                <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>{job.siteName}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>{job.address}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>{job.city}</div>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              border: `1px solid ${colors.border}`, borderRadius: radii.button, background: colors.surface,
              fontSize: 13, color: colors.textPrimary, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
              Start Directions
            </button>
          </div>
        </div>

        {/* Links */}
        {['View Job Details', 'Job Execution'].map(label => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}`,
          }}>
            <span style={{ fontSize: 15, color: colors.brandTeal, fontWeight: 500 }}>{label}</span>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1l6 6-6 6" stroke={colors.brandTeal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}

        {/* Time Tracking Section */}
        <div style={{ margin: '10px 12px', padding: 16, background: colors.surface, borderRadius: radii.card, border: `1px solid ${colors.borderLight}` }}>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={colors.textSecondary}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 9V3.5L18.5 9H13z"/></svg>
              <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>MY TIME TRACKING</span>
            </div>
            <span style={{ fontSize: 13, color: colors.brandTeal, fontWeight: 500, cursor: 'pointer' }}>View time entries</span>
          </div>

          {/* Check-in/out — only when site check-in is enabled */}
          {config.siteCheckInEnabled && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: colors.textSecondary }}>Are you on site?</span>
                <span style={{ fontSize: 12, color: colors.textTertiary }}>
                  {lastCheckIn ? `Last check-in ${lastCheckIn}` : ''}
                </span>
              </div>

              {/* Checked out for today (single check-in mode) */}
              {!config.allowMultipleCheckIn && hasCheckedOutToday && !isCheckedIn ? (
                <div style={{
                  width: '100%', padding: '12px 0', borderRadius: radii.pill,
                  border: `1px solid ${colors.border}`, background: colors.surfaceAlt,
                  color: colors.textTertiary, fontSize: 15, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Checked out for today
                </div>
              ) : (
                <button
                  onClick={() => onAction(isCheckedIn ? 'check-out' : 'check-in')}
                  style={{
                    width: '100%', padding: '12px 0', borderRadius: radii.pill,
                    border: isCheckedIn ? `1px solid ${colors.border}` : 'none',
                    background: isCheckedIn ? colors.surface : colors.brandTeal,
                    color: isCheckedIn ? colors.textPrimary : '#fff',
                    fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isCheckedIn ? colors.textPrimary : '#fff'} strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 11h-6"/>
                    {!isCheckedIn && <path d="M20 8v6"/>}
                  </svg>
                  {isCheckedIn ? 'No - Long press to check out' : 'Yes - Check into site'}
                </button>
              )}
            </>
          )}

          {/* Crew available */}
          {crewAvailable && (
            <button
              onClick={() => onAction('open-crew-list')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', marginBottom: 12, padding: 0 }}
            >
              <div style={{ fontSize: 12, color: colors.textSecondary }}>Crew available</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary }}>{crewAvailable}</div>
            </button>
          )}

          {/* Gated notice */}
          {isGated && (
            <div style={{
              padding: '10px 14px', borderRadius: radii.card, background: '#FFF8E1',
              border: '1px solid #FFE082', marginBottom: 14, fontSize: 13, color: '#795548',
            }}>
              Check in to site to change job status or start tracking time.
            </div>
          )}

          {/* Job Status */}
          <div style={{ fontSize: 12, color: isGated ? colors.textTertiary : colors.textSecondary, marginBottom: 4 }}>Job status</div>
          <button
            onClick={() => !isGated && onAction('open-status-picker')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
              padding: '10px 0', border: 'none', borderBottom: `1px solid ${colors.borderLight}`,
              background: 'none', cursor: isGated ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: isGated ? colors.textTertiary : (STATUS_DOT_COLORS[jobStatus] || colors.textTertiary) }} />
              <span style={{ fontSize: 15, color: isGated ? colors.textTertiary : colors.textPrimary }}>{jobStatus}</span>
            </div>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1l5 5 5-5" stroke={isGated ? colors.textTertiary : colors.textSecondary} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Timer — only when time tracking is enabled */}
          {config.timeTrackingEnabled && (
            <>
              <div style={{ fontSize: 12, color: isGated ? colors.textTertiary : colors.textSecondary, marginBottom: 6 }}>Time tracking</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {isCaptured ? (
                  <span style={{ fontSize: 14, color: colors.textTertiary }}>Time captured</span>
                ) : (
                  <button
                    onClick={() => !isGated && onAction(isRunning ? 'pause-timer' : 'start-timer')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'none', border: 'none',
                      cursor: isGated ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      color: isGated ? colors.textTertiary : colors.textPrimary,
                      fontSize: 14,
                    }}
                  >
                    {isRunning ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={isGated ? colors.textTertiary : colors.textPrimary}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={isGated ? colors.textTertiary : colors.textPrimary}><path d="M8 5v14l11-7z"/></svg>
                    )}
                    {isRunning ? 'Pause' : isPaused ? 'Resume' : 'Start'}
                  </button>
                )}
                <span style={{
                  fontSize: 28, fontWeight: 300, fontVariantNumeric: 'tabular-nums',
                  color: (isCaptured || isGated) ? colors.textTertiary : colors.textPrimary,
                }}>
                  {formatTime(timerDisplay)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* My Forms */}
        <div style={{ margin: '0 12px 12px', padding: 16, background: colors.surface, borderRadius: radii.card, border: `1px solid ${colors.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={colors.textSecondary}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 9V3.5L18.5 9H13z"/></svg>
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>MY FORMS ({JOB_FORMS.length})</span>
          </div>
          {JOB_FORMS.map(form => (
            <div key={form.name} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderBottom: `1px solid ${colors.borderLight}`,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: colors.brandTealLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={colors.brandTeal}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{form.name}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>Status: <span style={{ fontStyle: 'italic' }}>{form.status}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Picker overlay */}
      {showStatusPicker && (
        <StatusPicker
          currentStatus={jobStatus}
          onSelect={(s: JobStatus) => onAction(`set-status:${s}`)}
          onClose={() => onAction('close-status-picker')}
        />
      )}
    </div>
  );
};
