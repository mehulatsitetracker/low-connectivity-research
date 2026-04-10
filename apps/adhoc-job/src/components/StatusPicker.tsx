import type React from 'react';
import { colors } from '../theme';
import type { JobStatus } from '../types';
import { JOB_STATUSES } from '../data/jobs';

interface Props {
  currentStatus: JobStatus;
  onSelect: (status: JobStatus) => void;
  onClose: () => void;
}

const STATUS_DOT_COLORS: Record<string, string> = {
  'Scheduled': colors.statusBlue,
  'In Progress': colors.statusGreen,
  'Ready for review': colors.statusYellow,
  'In Review': colors.statusOrange,
  'Review Complete': colors.statusGreen,
  'Completed': colors.statusGreen,
};

export const StatusPicker: React.FC<Props> = ({ currentStatus, onSelect, onClose }) => (
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  }}>
    {/* Overlay */}
    <div onClick={onClose} style={{
      position: 'absolute',
      inset: 0,
      background: colors.overlay,
    }} />
    {/* Sheet */}
    <div style={{
      position: 'relative',
      background: colors.surface,
      borderRadius: '16px 16px 0 0',
      padding: '20px 0 34px',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute',
        top: 16,
        right: 16,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 22,
        color: colors.textSecondary,
        lineHeight: 1,
      }}>
        &times;
      </button>
      {JOB_STATUSES.map(status => {
        const isSelected = status === currentStatus;
        return (
          <button
            key={status}
            onClick={() => onSelect(status as JobStatus)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '14px 20px',
              background: 'none',
              border: 'none',
              borderBottom: `1px solid ${colors.borderLight}`,
              cursor: 'pointer',
              fontSize: 16,
              color: colors.textPrimary,
              fontFamily: 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: STATUS_DOT_COLORS[status] || colors.textTertiary,
              }} />
              {status}
            </div>
            {isSelected && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.brandTeal}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export { STATUS_DOT_COLORS };
