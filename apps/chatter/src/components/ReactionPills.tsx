import { colors } from '../theme';
import type { ReactionGroup } from '../types';

const CURRENT_USER_ID = 'current-user';

interface ReactionPillsProps {
  reactions: ReactionGroup[];
  onToggle: (emoji: string) => void;
}

export function ReactionPills({ reactions, onToggle }: ReactionPillsProps) {
  if (!reactions || reactions.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
      {reactions.map(r => {
        const mine = r.userIds.includes(CURRENT_USER_ID);
        const label = r.emoji === 'like' ? '❤️' : r.emoji;
        return (
          <button
            key={r.emoji}
            onClick={(e) => { e.stopPropagation(); onToggle(r.emoji); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 12,
              background: mine ? colors.brandTealLight : colors.surfaceAlt,
              border: `1px solid ${mine ? colors.brandTeal : colors.border}`,
              fontSize: 12, color: colors.textSecondary, cursor: 'pointer',
            }}
          >
            <span>{label}</span>
            <span style={{ fontWeight: 600 }}>{r.userIds.length}</span>
          </button>
        );
      })}
    </div>
  );
}
