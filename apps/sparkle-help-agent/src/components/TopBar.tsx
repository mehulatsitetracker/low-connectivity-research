import { ChevronLeft, Star, MoreVertical } from 'lucide-react';
import { colors } from '../theme';

interface TopBarProps {
  title: string;
  onBack: () => void;
  showActions?: boolean;
}

export function TopBar({ title, onBack, showActions = true }: TopBarProps) {
  return (
    <div style={{
      height: 44, background: colors.topBar,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 12px', flexShrink: 0, position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 40 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
          <ChevronLeft size={20} color="#fff" strokeWidth={2} />
        </button>
      </div>
      <div style={{
        fontWeight: 600, fontSize: 17, color: '#fff',
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {title}
      </div>
      {showActions ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Star size={22} color="#fff" strokeWidth={1.5} style={{ opacity: 0.8 }} />
          <MoreVertical size={22} color="#fff" fill="#fff" style={{ opacity: 0.8 }} />
        </div>
      ) : <div style={{ minWidth: 40 }} />}
    </div>
  );
}
