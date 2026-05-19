import { MessageCircle, Sparkles, Image as ImageIcon, AtSign, Pencil } from 'lucide-react';
import { colors } from '../theme';

interface EmptyChatProps {
  onAction: (action: string) => void;
}

const Chip = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button onClick={onClick} style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 999,
    background: colors.brandTealLight, color: colors.brandTeal,
    border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  }}>{icon}{label}</button>
);

export function EmptyChat({ onAction }: EmptyChatProps) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12,
      textAlign: 'center',
    }}>
      <div style={{ position: 'relative', marginBottom: 4 }}>
        <MessageCircle size={64} color={colors.brandTeal} strokeWidth={1.5} />
        <Sparkles size={20} color={colors.brandTeal} style={{ position: 'absolute', top: -4, right: -10 }} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>No messages yet</div>
      <div style={{ fontSize: 14, color: colors.textSecondary, maxWidth: 260 }}>
        Be the first to update the team.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
        <Chip icon={<Pencil size={14} />} label="Post update" onClick={() => onAction('empty-post-update')} />
        <Chip icon={<ImageIcon size={14} />} label="Attach photo" onClick={() => onAction('empty-attach-photo')} />
        <Chip icon={<AtSign size={14} />} label="@mention" onClick={() => onAction('empty-mention')} />
      </div>
    </div>
  );
}
