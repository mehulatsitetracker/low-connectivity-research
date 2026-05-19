import { MessageSquare } from 'lucide-react';
import { colors } from '../theme';

interface MessageIconButtonProps {
  unreadCount?: number;
  onClick: () => void;
}

export function MessageIconButton({ unreadCount = 0, onClick }: MessageIconButtonProps) {
  const display = unreadCount > 99 ? '99+' : unreadCount;
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
      padding: 4, display: 'flex', alignItems: 'center', position: 'relative',
    }}>
      <MessageSquare size={22} />
      {unreadCount > 0 && (
        <div style={{
          position: 'absolute',
          top: -2, right: -4,
          minWidth: 18, height: 18, padding: '0 5px',
          borderRadius: 9, background: colors.error,
          color: '#fff', fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1.5px solid ${colors.topBar}`,
        }}>
          {display}
        </div>
      )}
    </button>
  );
}
