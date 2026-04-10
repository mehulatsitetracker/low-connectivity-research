import type React from 'react';
import { useState } from 'react';
import { colors, radii } from '../theme';
import { TopBar } from '../components/TopBar';
import { CREW_MEMBERS } from '../data/jobs';
import type { CrewMemberStatus } from '../types';

interface Props {
  crewStatuses: Record<string, CrewMemberStatus>;
  isLeader: boolean;
  onBack: () => void;
  onAction: (action: string) => void;
}

const STATUS_COLORS: Record<CrewMemberStatus, string> = {
  'Checked-In': colors.success,
  'En Route': colors.statusOrange,
  'Checked-Out': colors.textTertiary,
  'Not Started': colors.textTertiary,
};

export const CrewListScreen: React.FC<Props> = ({ crewStatuses, isLeader, onBack, onAction }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const toggleSelect = (name: string) => {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelected(next);
  };

  const applyStatus = (newStatus: CrewMemberStatus) => {
    for (const name of selected) {
      onAction(`crew-set-status:${name}:${newStatus}`);
    }
    setSelected(new Set());
    setShowStatusOptions(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: colors.background }}>
      <TopBar title="Crew Members" onBack={onBack} />

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}>
          {isLeader
            ? 'Select crew members to update their job status'
            : 'Crew members on this job'}
        </div>

        {CREW_MEMBERS.map((member) => {
          const status = crewStatuses[member.name] || 'Not Started';
          const isSelected = selected.has(member.name);

          return (
            <button
              key={member.name}
              onClick={isLeader ? () => toggleSelect(member.name) : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '14px 12px', background: colors.surface,
                border: `1px solid ${isSelected ? colors.brandTeal : colors.borderLight}`,
                borderRadius: radii.card, marginBottom: 8,
                cursor: isLeader ? 'pointer' : 'default',
                fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              {/* Checkbox — leader only */}
              {isLeader && (
                <div style={{
                  width: 22, height: 22, borderRadius: 4,
                  border: `2px solid ${isSelected ? colors.brandTeal : colors.border}`,
                  background: isSelected ? colors.brandTeal : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                  )}
                </div>
              )}

              {/* Status dot — member view */}
              {!isLeader && (
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: STATUS_COLORS[status], flexShrink: 0,
                }} />
              )}

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>{member.name}</span>
                  {member.isCurrentUser && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: colors.brandTeal,
                      background: colors.brandTealLight, padding: '2px 6px', borderRadius: 4,
                    }}>MY TIME</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: STATUS_COLORS[status], marginTop: 2 }}>
                  {status}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action button — leader only */}
      {isLeader && (
        <div style={{ padding: 16, background: colors.surface, borderTop: `1px solid ${colors.border}` }}>
          {showStatusOptions ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Set status for {selected.size} selected:</div>
              {(['En Route', 'Checked-In', 'Checked-Out'] as CrewMemberStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => applyStatus(s)}
                  style={{
                    width: '100%', padding: '12px 0', borderRadius: radii.button,
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    fontSize: 15, color: colors.textPrimary, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={() => selected.size > 0 && setShowStatusOptions(true)}
              disabled={selected.size === 0}
              style={{
                width: '100%', padding: '14px 0', borderRadius: radii.button,
                background: selected.size > 0 ? colors.brandTeal : colors.textTertiary,
                color: '#fff', fontSize: 16, fontWeight: 600, border: 'none',
                cursor: selected.size > 0 ? 'pointer' : 'default',
                fontFamily: 'inherit', opacity: selected.size > 0 ? 1 : 0.6,
              }}
            >
              Edit Job Status ({selected.size} selected)
            </button>
          )}
        </div>
      )}
    </div>
  );
};
