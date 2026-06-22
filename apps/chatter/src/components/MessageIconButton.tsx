import { MessageSquare } from 'lucide-react';
import { colors } from '../theme';

interface MessageIconButtonProps {
  unreadCount?: number;
  onClick: () => void;
}

export function MessageIconButton({ unreadCount = 0, onClick }: MessageIconButtonProps) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
      padding: 4, display: 'flex', alignItems: 'center', position: 'relative',
    }}>
      <MessageSquare size={22} />
      {unreadCount > 0 && (
        <div style={{
          position: 'absolute',
          top: 2, right: 0,
          width: 8, height: 8,
          borderRadius: '50%', background: colors.error,
          border: `1.5px solid ${colors.topBar}`,
        }} />
      )}
    </button>
  );
}
