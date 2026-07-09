import { ListChecks, X, Sparkles } from 'lucide-react';
import { colors, radii, spacing } from '../theme';
import { QUICK_ACTION_GROUPS } from '../data/objects';

interface QuickActionsOverlayProps {
  onSelect: (action: string) => void;
  onClose: () => void;
}

export function QuickActionsOverlay({ onSelect, onClose }: QuickActionsOverlayProps) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      background: 'linear-gradient(180deg, rgba(180,180,180,0.6) 0%, rgba(255,255,255,0.92) 22%, rgba(255,255,255,0.97) 100%)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
    }}>
      {/* Bottom padding places the close button exactly where the Fab sits */}
      <div style={{ padding: `0 24px ${spacing.bottomNavHeight + 24}px` }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <ListChecks size={22} color={colors.textSecondary} strokeWidth={2} />
          <span style={{ fontSize: 22, fontWeight: 700, color: colors.textPrimary }}>Quick actions</span>
        </div>
        <div style={{ height: 1, background: colors.border, marginBottom: 14 }} />

        {/* Action groups */}
        {QUICK_ACTION_GROUPS.map((group, gi) => (
          <div key={gi}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {group.map(action => (
                <button
                  key={action}
                  onClick={() => onSelect(action)}
                  style={{
                    padding: '14px 16px', textAlign: 'left',
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: radii.card, fontSize: 16, color: colors.textPrimary,
                    cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
            {gi < QUICK_ACTION_GROUPS.length - 1 && (
              <div style={{ height: 1, background: colors.border, margin: '14px 0' }} />
            )}
          </div>
        ))}

        {/* Help Agent + close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
          <button
            onClick={() => onSelect('Help Agent')}
            style={{
              flex: 1, padding: '14px 0', borderRadius: radii.card, border: 'none',
              background: colors.brandTeal, color: '#fff', fontSize: 16, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Sparkles size={18} color="#fff" />
            Help Agent
          </button>
          <button
            onClick={onClose}
            aria-label="Close quick actions"
            style={{
              width: 60, height: 60, borderRadius: '50%', border: 'none',
              background: '#4A4F52', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.25)', flexShrink: 0,
              marginRight: -4,
            }}
          >
            <X size={26} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
