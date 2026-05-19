import { Lock } from 'lucide-react';
import { colors } from '../theme';

interface ComposerBannerProps {
  message: string;
}

export function ComposerBanner({ message }: ComposerBannerProps) {
  return (
    <div style={{
      flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px 16px',
      background: colors.surfaceAlt,
      borderTop: `1px solid ${colors.border}`,
      color: colors.textSecondary, fontSize: 13,
    }}>
      <Lock size={16} color={colors.textTertiary} />
      {message}
    </div>
  );
}
