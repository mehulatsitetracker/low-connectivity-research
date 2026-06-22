import { ThumbsUp, Reply, Copy, Trash2 } from 'lucide-react';
import { colors } from '../theme';

interface MessageContextMenuProps {
  messageId: string;
  isOwn: boolean;
  inThread?: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

const Item = ({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%', padding: '12px 16px', border: 'none',
    background: 'none', cursor: 'pointer', textAlign: 'left',
    color: danger ? colors.error : colors.textPrimary, fontSize: 15,
  }}>{icon}{label}</button>
);

export function MessageContextMenu({
  messageId, isOwn, inThread, onClose, onAction,
}: MessageContextMenuProps) {
  const dispatch = (a: string) => { onAction(a); onClose(); };
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: colors.overlay, zIndex: 30,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: colors.surface, borderRadius: '12px 12px 0 0',
        zIndex: 31, paddingBottom: 8,
      }}>
        <Item icon={<ThumbsUp size={18} />} label="Like" onClick={() => dispatch(`toggle-like:${messageId}`)} />
        {!inThread && <Item icon={<Reply size={18} />} label="Reply in thread" onClick={() => dispatch(`reply-thread:${messageId}`)} />}
        <Item icon={<Copy size={18} />} label="Copy text" onClick={() => dispatch(`copy-message:${messageId}`)} />
        {isOwn && <Item icon={<Trash2 size={18} />} label="Delete" onClick={() => dispatch(`delete-message:${messageId}`)} danger />}
      </div>
    </>
  );
}
