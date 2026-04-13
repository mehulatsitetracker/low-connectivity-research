import React from 'react';
import { theme } from './theme';
import { SidebarBranding } from './SidebarBranding';
import { SidebarReference } from './SidebarReference';
import { SidebarCategory } from './SidebarCategory';
import { SidebarDeveloperSettings } from './SidebarDeveloperSettings';
import type { ConfiguratorConfig } from './types';

interface ConfiguratorSidebarProps {
  config: ConfiguratorConfig;
  isReferenceActive: boolean;
  onReferenceClick: () => void;
}

export function ConfiguratorSidebar({
  config,
  isReferenceActive,
  onReferenceClick,
}: ConfiguratorSidebarProps) {
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll active step into view
  React.useEffect(() => {
    if (activeRef.current && sidebarRef.current) {
      const container = sidebarRef.current;
      const element = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [config.activeStepId]);

  return (
    <div
      ref={sidebarRef}
      style={{
        width: theme.spacing.sidebarWidth,
        height: '100vh',
        background: theme.colors.surface,
        borderRight: `1px solid ${theme.colors.border}`,
        overflowY: 'auto' as const,
        overflowX: 'hidden' as const,
        padding: theme.spacing.sidebarPadding,
        boxSizing: 'border-box' as const,
        fontFamily: theme.font.family,
        flexShrink: 0,
      }}
    >
      <SidebarBranding branding={config.branding} />

      {config.customControls && (
        <div style={{ marginBottom: theme.spacing.sectionGap }}>
          {config.customControls}
        </div>
      )}

      {config.reference && (
        <SidebarReference
          reference={config.reference}
          isActive={isReferenceActive}
          onClick={onReferenceClick}
        />
      )}

      {config.categories.map((category) => (
        <div
          key={category.id}
          ref={
            category.steps.some((s) => s.id === config.activeStepId)
              ? activeRef
              : undefined
          }
        >
          <SidebarCategory
            category={category}
            activeStepId={config.activeStepId}
            onStepSelect={config.onStepSelect}
          />
        </div>
      ))}

      {config.developerSettings && (
        <SidebarDeveloperSettings>
          {config.developerSettings}
        </SidebarDeveloperSettings>
      )}
    </div>
  );
}
