import type React from 'react';
import { colors } from '../theme';

export const C = colors;

export function TopBar({
  title, trailing, onBack, dark = true,
}: {
  title?: React.ReactNode;
  trailing?: React.ReactNode;
  onBack?: () => void;
  dark?: boolean;
}) {
  const bg = dark ? C.topBar : C.surface;
  const fg = dark ? '#fff' : C.textPrimary;
  return (
    <div style={{
      height: 44, background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 12px', flexShrink: 0, position: 'relative',
      borderBottom: dark ? 'none' : `1px solid ${C.borderLight}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, zIndex: 1 }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back" style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex',
          }}>
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9l8 8" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        fontSize: 15, fontWeight: 600, color: fg, maxWidth: 220,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, zIndex: 1 }}>{trailing}</div>
    </div>
  );
}

export function IconBtn({ children, onClick, title }: { children: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title} style={{
      background: 'none', border: 'none', cursor: onClick ? 'pointer' : 'default',
      padding: 0, color: 'inherit', display: 'flex', alignItems: 'center',
    }}>{children}</button>
  );
}

export const Icons = {
  plus: (color = '#fff') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
  ),
  more: (color = C.textSecondary) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color}><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>
  ),
  caretDown: (color = C.textSecondary, size = 12) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M6 9l6 6 6-6z"/></svg>
  ),
  chevronRight: (color = C.textTertiary, size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 6l6 6-6 6"/></svg>
  ),
  search: (color = C.textTertiary) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
  ),
  star: (color = '#fff') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  ),
  cloud: (color = '#fff') => (
    <svg width="22" height="20" viewBox="0 0 24 24" fill={color}><path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
  ),
  paperclip: (color = C.brandTeal) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
  ),
  warningTri: (color = '#9B5A02') => (
    <svg width="18" height="16" viewBox="0 0 24 22" fill={color}><path d="M12 0l12 22H0L12 0zm0 7v7m0 3v1.5" stroke="#fff" strokeWidth="0" fill={color}/><text x="12" y="17" fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle">!</text></svg>
  ),
  check: (color = '#fff', size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
  ),
  close: (color = C.textSecondary, size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
  ),
  upload: (color = '#fff', size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
  ),
  home: (color: string, size = 18) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg>
  ),
  map: (color: string, size = 18) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M1 6v15l7-3 8 3 7-3V3l-7 3-8-3-7 3zM8 3v15M16 6v15"/></svg>
  ),
  menu: (color: string, size = 18) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
  ),
  formIcon: (color = C.textSecondary, size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 3v3h6V3M9 12h6M9 16h4"/></svg>
  ),
  photo: (color = C.textSecondary, size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-5-5-8 8"/></svg>
  ),
  wrench: (color = C.textSecondary, size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14.7 6.3a4 4 0 105.5 5.5L21 11l-2-2-1 1-4-4 1-1-2-2-.5.5a4 4 0 00-5.5 5.5L3 14l4 4 7.7-7.7z"/></svg>
  ),
  checkCircle: (color = C.complete, size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="12" r="11"/>
      <path d="M7 12l3.5 3.5L17 9" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  errorCircle: (color = C.error, size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="12" r="11"/>
      <path d="M8 8l8 8M16 8L8 16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  cloudFilled: (color = C.brandTeal, size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 18" fill={color}><path d="M19.35 7.04A7.49 7.49 0 0012 1C9.11 1 6.6 2.64 5.35 5.04A5.994 5.994 0 000 11c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
  ),
  cloudOutline: (color = C.textTertiary, size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 18" fill="none" stroke={color} strokeWidth="1.6"><path d="M19.35 7.04A7.49 7.49 0 0012 1C9.11 1 6.6 2.64 5.35 5.04A5.994 5.994 0 000 11c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
  ),
  calendar: (color = C.textPrimary, size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
  ),
  clock: (color = C.textPrimary, size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
  ),
  barcode: (color = C.textPrimary, size = 26) => (
    <svg width={size} height={size} viewBox="0 0 32 26" fill="none" stroke={color} strokeWidth="2">
      <path d="M2 4V2h4M30 4V2h-4M2 22v2h4M30 22v2h-4" strokeLinecap="round"/>
      <path d="M7 8v10M10 8v10M13 8v10M17 8v10M20 8v10M24 8v10" strokeWidth="1.6"/>
    </svg>
  ),
  camera: (color = '#fff', size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M2 8h4l2-3h8l2 3h4v12H2V8z"/><circle cx="12" cy="13" r="4"/></svg>
  ),
  info: (color = C.brandTeal, size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 8.5h.01M12 11v6" strokeLinecap="round"/></svg>
  ),
};

export function BottomNav({ active = 'menu', onTab }: {
  active?: 'home' | 'map' | 'menu';
  onTab?: (t: 'home' | 'map' | 'menu') => void;
}) {
  const item = (key: 'home' | 'map' | 'menu', iconFn: (c: string, s?: number) => React.ReactNode, label: string) => {
    const isActive = active === key;
    const color = isActive ? C.navActive : C.navInactive;
    return (
      <button
        onClick={() => onTab?.(key)}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 3, padding: '8px 0', background: isActive ? C.navActiveBg : 'transparent',
          borderRadius: isActive ? 10 : 0, margin: isActive ? '4px' : 0,
          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        {iconFn(color, 18)}
        <span style={{ fontSize: 10, letterSpacing: '0.6px', color, fontWeight: 700 }}>
          {label}
        </span>
      </button>
    );
  };
  return (
    <div style={{
      display: 'flex', height: 56, background: C.surface,
      borderTop: `1px solid ${C.borderLight}`, flexShrink: 0,
    }}>
      {item('home', Icons.home, 'HOME')}
      {item('map',  Icons.map,  'MAP')}
      {item('menu', Icons.menu, 'MENU')}
    </div>
  );
}

export function Spinner({ size = 26, color = C.brandTeal }: { size?: number; color?: string }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2.5px solid ${color}22`, borderTopColor: color,
      animation: 'fi-spin 0.9s linear infinite',
    }} />
  );
}

export function SearchBar({ placeholder = 'Search forms' }: { placeholder?: string }) {
  return (
    <div style={{ padding: 12, background: C.surface, borderBottom: `1px solid ${C.borderLight}` }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px', background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: 8, color: C.textTertiary, fontSize: 14,
      }}>
        {Icons.search()}
        <span>{placeholder}</span>
      </div>
    </div>
  );
}

export function Pill({ tone, children }: { tone: 'green' | 'amber' | 'red' | 'gray' | 'teal'; children: React.ReactNode }) {
  const map = {
    green: { bg: C.completeBg, fg: C.complete },
    amber: { bg: C.pendingBg,  fg: C.pendingDeep },
    red:   { bg: C.errorBg,    fg: C.error },
    gray:  { bg: '#ECECEE',    fg: C.textSecondary },
    teal:  { bg: C.brandTealLight, fg: C.brandTealDeep },
  }[tone];
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      background: map.bg, color: map.fg,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase',
    }}>{children}</span>
  );
}

export type AccentTone = 'green' | 'amber' | 'red' | 'none';

export function AccentCard({
  tone = 'none', children, style, onClick,
}: { tone?: AccentTone; children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  const accent = { green: C.complete, amber: C.pending, red: C.error, none: 'transparent' }[tone];
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', background: C.surface, borderRadius: 6,
        border: `1px solid ${C.borderLight}`, overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        ...style,
      }}
    >
      {tone !== 'none' && (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 4, background: accent }} />
      )}
      <div style={{ paddingLeft: tone !== 'none' ? 12 : 0 }}>{children}</div>
    </div>
  );
}

export function Toggle({ on }: { on: boolean }) {
  return (
    <div style={{
      width: 44, height: 26, borderRadius: 13,
      background: on ? C.brandTeal : '#D5D7DA',
      position: 'relative', transition: 'background 150ms',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 22, height: 22, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        transition: 'left 150ms',
      }} />
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled, iconRight }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; iconRight?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', padding: '12px 16px',
        background: disabled ? '#9DC9C5' : C.brandTeal,
        color: '#fff', border: 'none', borderRadius: 6,
        fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}
    >
      <span>{children}</span>
      {iconRight}
    </button>
  );
}

export function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '11px 16px',
        background: 'transparent', color: C.textSecondary,
        border: `1px solid ${C.border}`, borderRadius: 6,
        fontSize: 14, fontFamily: 'inherit', cursor: 'pointer',
      }}
    >{children}</button>
  );
}

export const spinKeyframes = (
  <style>{`@keyframes fi-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes fi-shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }`}</style>
);
