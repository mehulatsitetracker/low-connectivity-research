import { useEffect } from 'react';
import { colors } from '../theme';

interface ToastProps {
  message: string;
  tone?: 'error' | 'info';
  onDismiss: () => void;
}

export function Toast({ message, tone = 'info', onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2400);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div style={{
      position: 'absolute', bottom: 80, left: 16, right: 16,
      background: tone === 'error' ? colors.error : colors.textPrimary,
      color: '#fff', padding: '10px 14px', borderRadius: 8,
      fontSize: 14, textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 20,
    }}>
      {message}
    </div>
  );
}
