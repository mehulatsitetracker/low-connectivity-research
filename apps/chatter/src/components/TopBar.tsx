import { colors, spacing } from '../theme';
import { ChevronLeft, ChevronDown, Bell, Star, MoreVertical, Plus } from 'lucide-react';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  showBell?: boolean;
  hasUnread?: boolean;
  onBellClick?: () => void;
  showProfile?: boolean;
  showStar?: boolean;
  showMore?: boolean;
  showPlus?: boolean;
  showDropdown?: boolean;
}

export function TopBar({
  title,
  onBack,
  showBell,
  hasUnread,
  onBellClick,
  showProfile,
  showStar,
  showMore,
  showPlus,
  showDropdown,
}: TopBarProps) {
  return (
    <div style={{
      height: spacing.headerHeight,
      background: colors.topBar,
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      color: '#fff',
      fontSize: 17,
      fontWeight: 600,
      flexShrink: 0,
      gap: 8,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
          padding: 4, display: 'flex', alignItems: 'center',
        }}>
          <ChevronLeft size={24} />
        </button>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        {showDropdown && <ChevronDown size={16} />}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        {showStar && <Star size={22} color="#fff" style={{ opacity: 0.8 }} />}
        {showPlus && <Plus size={22} color="#fff" style={{ opacity: 0.8 }} />}
        {showMore && <MoreVertical size={22} color="#fff" style={{ opacity: 0.8 }} />}
        {showBell && (
          <button onClick={onBellClick} style={{
            background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
            padding: 4, display: 'flex', alignItems: 'center', position: 'relative',
          }}>
            <Bell size={22} />
            {hasUnread && (
              <div style={{
                position: 'absolute', top: 2, right: 2, width: 8, height: 8,
                borderRadius: '50%', background: colors.error, border: '1.5px solid ' + colors.topBar,
              }} />
            )}
          </button>
        )}
        {showProfile && (
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={colors.topBar}>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
