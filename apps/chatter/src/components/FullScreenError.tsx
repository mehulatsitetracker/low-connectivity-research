import { CloudOff, RefreshCw } from 'lucide-react';
import { colors } from '../theme';

interface FullScreenErrorProps {
  icon?: React.ReactNode;
  title: string;
  subtext?: string;
  onRetry: () => void;
  retryLabel?: string;
}

export function FullScreenError({
  icon,
  title,
  subtext,
  onRetry,
  retryLabel = 'Try again',
}: FullScreenErrorProps) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12,
      color: colors.textSecondary, textAlign: 'center',
    }}>
      {icon ?? <CloudOff size={56} color={colors.textTertiary} strokeWidth={1.5} />}
      <div style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>{title}</div>
      {subtext && <div style={{ fontSize: 14, maxWidth: 280 }}>{subtext}</div>}
      <button onClick={onRetry} style={{
        marginTop: 8, padding: '10px 20px', borderRadius: 6,
        background: colors.brandTeal, color: '#fff', border: 'none',
        fontWeight: 600, fontSize: 15, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <RefreshCw size={16} /> {retryLabel}
      </button>
    </div>
  );
}
