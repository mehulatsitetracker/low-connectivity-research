import { theme } from './theme';
import type { BrandingConfig } from './types';

interface SidebarBrandingProps {
  branding: BrandingConfig;
}

export function SidebarBranding({ branding }: SidebarBrandingProps) {
  return (
    <div style={{ marginBottom: theme.spacing.sectionGap }}>
      {branding.logoSrc && (
        <img
          src={branding.logoSrc}
          alt="Logo"
          style={{
            height: 24,
            marginBottom: 12,
            display: 'block',
          }}
        />
      )}

      <div
        style={{
          height: 1,
          background: theme.colors.border,
          marginBottom: 20,
        }}
      />

      <div
        style={{
          fontSize: theme.font.sizeXs,
          fontWeight: theme.font.weightBold,
          letterSpacing: '1.5px',
          textTransform: 'uppercase' as const,
          color: theme.colors.categoryLabel,
          marginBottom: 6,
        }}
      >
        {branding.streamLabel}
      </div>

      <div
        style={{
          fontSize: theme.font.sizeXl,
          fontWeight: theme.font.weightBold,
          color: theme.colors.text,
          lineHeight: 1.3,
          marginBottom: 8,
        }}
      >
        {branding.title}
      </div>

      {branding.description && (
        <div
          style={{
            fontSize: theme.font.sizeSm,
            color: theme.colors.textSecondary,
            lineHeight: 1.5,
          }}
        >
          {branding.description}
        </div>
      )}
    </div>
  );
}
