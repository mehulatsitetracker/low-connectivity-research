import type React from 'react';
import { colors } from '../theme';

interface Props {
  title: string;
  onBack?: () => void;
  rightIcons?: ('star' | 'cloud' | 'paperclip' | 'plus')[];
  variant?: 'dark' | 'light';
}

export const TopBar: React.FC<Props> = ({ title, onBack, rightIcons = [], variant = 'dark' }) => {
  const isDark = variant === 'dark';
  const bg = isDark ? colors.topBar : colors.surface;
  const fg = isDark ? '#fff' : colors.textPrimary;

  return (
    <div style={{
      height: 44,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 12px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 40 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9l8 8" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      <div style={{ fontWeight: 600, fontSize: 17, color: fg, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {rightIcons.map(icon => (
          <span key={icon} style={{ color: fg, opacity: 0.8, display: 'flex' }}>
            {icon === 'star' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
            {icon === 'cloud' && <svg width="22" height="22" viewBox="0 0 24 24" fill={fg}><path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>}
            {icon === 'paperclip' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.brandTeal} strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>}
            {icon === 'plus' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>}
          </span>
        ))}
      </div>
    </div>
  );
};
