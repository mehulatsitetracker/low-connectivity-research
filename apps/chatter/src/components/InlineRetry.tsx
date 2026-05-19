import { AlertCircle, RefreshCw } from 'lucide-react';
import { colors } from '../theme';

interface InlineRetryProps {
  message: string;
  onRetry: () => void;
}

export function InlineRetry({ message, onRetry }: InlineRetryProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 14px', background: '#FFF4F4',
      border: `1px solid ${colors.error}`, borderRadius: 6,
      fontSize: 13, color: colors.error, margin: '6px 0',
    }}>
      <AlertCircle size={16} />
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onRetry} style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'none', border: 'none', cursor: 'pointer',
        color: colors.error, fontWeight: 600, fontSize: 13,
      }}>
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );
}
