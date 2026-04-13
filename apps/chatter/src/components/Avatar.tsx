import { colors } from '../theme';

interface AvatarProps {
  initials: string;
  size?: number;
}

export function Avatar({ initials, size = 36 }: AvatarProps) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: colors.avatar,
      color: colors.avatarText,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.38,
      fontWeight: 600,
      flexShrink: 0,
      letterSpacing: 0.5,
    }}>
      {initials}
    </div>
  );
}
