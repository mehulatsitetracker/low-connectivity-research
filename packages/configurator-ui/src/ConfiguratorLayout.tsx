import React from 'react';
import { theme } from './theme';
import { ConfiguratorSidebar } from './ConfiguratorSidebar';
import { FlowDiagram } from './FlowDiagram';
import { ViewToggle } from './ViewToggle';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import type { ConfiguratorConfig, ViewMode } from './types';

interface ConfiguratorLayoutProps {
  config: ConfiguratorConfig;
  children: React.ReactNode; // Phone simulator
}

export function ConfiguratorLayout({ config, children }: ConfiguratorLayoutProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('phone');
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [showReference, setShowReference] = React.useState(false);

  const hasDiagram = !!config.reference && config.reference.flowNodes.length > 0;

  const handleReferenceClick = () => {
    if (showReference) {
      setShowReference(false);
      setViewMode('phone');
    } else {
      setShowReference(true);
      setViewMode('diagram');
    }
  };

  const handleNodeClick = (nodeId: string) => {
    config.onStepSelect(nodeId);
    setViewMode('side-by-side');
    setShowReference(true);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'diagram' || mode === 'side-by-side') {
      setShowReference(true);
    } else {
      setShowReference(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: theme.colors.bg,
        overflow: 'hidden' as const,
        fontFamily: theme.font.family,
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? theme.spacing.sidebarWidth : 0,
          transition: `width ${theme.transition.normal}`,
          overflow: 'hidden' as const,
          flexShrink: 0,
          position: 'relative' as const,
        }}
      >
        <ConfiguratorSidebar
          config={config}
          isReferenceActive={showReference}
          onReferenceClick={handleReferenceClick}
        />
      </div>

      {/* Sidebar collapse toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'absolute' as const,
          left: sidebarOpen ? theme.spacing.sidebarWidth - 12 : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 24,
          height: 48,
          background: theme.colors.collapseBtn,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: sidebarOpen ? '0 6px 6px 0' : '0 6px 6px 0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          transition: `left ${theme.transition.normal}`,
          padding: 0,
        }}
      >
        {sidebarOpen ? (
          <ChevronLeftIcon size={14} color={theme.colors.textSecondary} />
        ) : (
          <ChevronRightIcon size={14} color={theme.colors.textSecondary} />
        )}
      </button>

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          position: 'relative' as const,
          display: 'flex',
          overflow: 'hidden' as const,
        }}
      >
        <ViewToggle mode={viewMode} onChange={handleViewModeChange} hasDiagram={hasDiagram} />

        {/* Phone view */}
        {(viewMode === 'phone' || viewMode === 'side-by-side') && (
          <div
            style={{
              flex: viewMode === 'side-by-side' ? '0 0 auto' : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              overflow: 'auto' as const,
            }}
          >
            {children}
          </div>
        )}

        {/* Diagram view */}
        {(viewMode === 'diagram' || viewMode === 'side-by-side') && hasDiagram && (
          <div
            style={{
              flex: 1,
              borderLeft: viewMode === 'side-by-side' ? `1px solid ${theme.colors.border}` : 'none',
              overflow: 'auto' as const,
              background: theme.colors.bg,
            }}
          >
            <FlowDiagram
              nodes={config.reference!.flowNodes}
              edges={config.reference!.flowEdges}
              activeNodeId={config.activeStepId}
              onNodeClick={handleNodeClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
