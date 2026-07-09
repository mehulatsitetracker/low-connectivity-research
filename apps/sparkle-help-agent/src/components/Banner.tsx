import type { ReactNode } from 'react';
import { TriangleAlert, OctagonAlert, RefreshCw } from 'lucide-react';
import { colors, radii } from '../theme';

type BannerVariant = 'warning' | 'danger' | 'uploading';

interface BannerProps {
  variant: BannerVariant;
  children: ReactNode;
  /** Trailing slot (e.g. a Help Agent button). */
  trailing?: ReactNode;
  /** Center the text (danger inventory notice). */
  centered?: boolean;
  /** Edge-to-edge (no radius) — for banners that sit flush under a header. */
  flush?: boolean;
}

const VARIANTS: Record<BannerVariant, { bg: string; fg: string; border?: string }> = {
  warning: { bg: colors.warningBg, fg: colors.warningText },
  danger: { bg: colors.errorBg, fg: colors.error, border: colors.error },
  uploading: { bg: colors.topBar, fg: '#fff' },
};

export function Banner({ variant, children, trailing, centered = false, flush = false }: BannerProps) {
  const v = VARIANTS[variant];
  const Icon = variant === 'danger' ? OctagonAlert : variant === 'uploading' ? RefreshCw : TriangleAlert;
  const spinning = variant === 'uploading';

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        background: v.bg,
        color: v.fg,
        border: v.border ? `1px solid ${v.border}` : 'none',
        borderRadius: flush ? 0 : radii.card,
      }}
    >
      {spinning && (
        <style>{'@keyframes sparkle-spin { to { transform: rotate(360deg); } }'}</style>
      )}
      <Icon
        size={18}
        color={v.fg}
        strokeWidth={2}
        style={spinning ? { animation: 'sparkle-spin 1s linear infinite', flexShrink: 0 } : { flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: 1.4, fontWeight: 500, textAlign: centered ? 'center' : 'left' }}>
        {children}
      </div>
      {trailing}
    </div>
  );
}
