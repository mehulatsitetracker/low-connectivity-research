import { colors } from '../theme';

const FULL_SET = ['👍', '❤️', '😂', '🎉', '👀', '✅'];
const DISABLED_SET = ['❤️'];

interface ReactionStripProps {
  enabled: boolean;
  onPick: (emoji: string) => void;
}

export function ReactionStrip({ enabled, onPick }: ReactionStripProps) {
  const set = enabled ? FULL_SET : DISABLED_SET;
  return (
    <div style={{
      display: 'flex', gap: 6, padding: '8px 12px',
      borderBottom: `1px solid ${colors.borderLight}`,
    }}>
      {set.map(emoji => (
        <button
          key={emoji}
          onClick={() => onPick(emoji === '❤️' && !enabled ? 'like' : emoji)}
          style={{
            background: colors.surfaceAlt, border: 'none',
            width: 38, height: 38, borderRadius: 19,
            fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
