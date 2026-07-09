import type { ReactNode } from 'react';
import { SCREENS } from '../types';
import type { ChatMode, Overlay, ScreenId } from '../types';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

/** Help Agent steps — each maps to an overlay and (for chat) a chat mode. */
const AGENT_STEPS: { id: string; label: string; overlay: Overlay; mode?: ChatMode }[] = [
  { id: 'quick-actions', label: 'FAB — Quick actions', overlay: 'quick-actions' },
  { id: 'chat', label: 'Help Agent chat sheet', overlay: 'chat', mode: 'greeting' },
  { id: 'chat-help', label: 'Screen-context help', overlay: 'chat', mode: 'help' },
];

export function useSparkleConfig({
  screenId,
  overlay,
  chatContext,
  chatMode,
  onScreenChange,
  onOverlayChange,
  onChatModeChange,
  developerSettings,
}: {
  screenId: ScreenId;
  overlay: Overlay;
  chatContext: string;
  chatMode: ChatMode;
  onScreenChange: (id: ScreenId) => void;
  onOverlayChange: (o: Overlay) => void;
  onChatModeChange: (m: ChatMode) => void;
  developerSettings?: ReactNode;
}): ConfiguratorConfig {
  const currentScreen = SCREENS.find(s => s.id === screenId)!;

  const categories: Category[] = [
    {
      id: 'main-path',
      label: 'Screens',
      icon: 'checkmark',
      steps: SCREENS.map((s, i) => ({ id: s.id, label: `1.${i} — ${s.name}` })),
    },
    {
      id: 'sparkle',
      label: 'Help Agent',
      icon: 'warning',
      steps: AGENT_STEPS.map((s, i) => ({ id: s.id, label: `2.${i} — ${s.label}` })),
    },
  ];

  const flowNodes: FlowNode[] = [
    ...SCREENS.map(s => ({
      id: s.id,
      label: s.name,
      category: 'Screens',
      nodeType: 'screen' as const,
    })),
    {
      id: 'quick-actions',
      label: 'Quick actions',
      category: 'Help Agent',
      scenarios: ['Create new job', 'Create RFI', 'Create new Form', 'Check In/Out', 'Log Time', 'Log new field assets', 'Help Agent'],
      nodeType: 'screen' as const,
    },
    {
      id: 'chat',
      label: 'Help Agent chat sheet',
      category: 'Help Agent',
      nodeType: 'screen' as const,
    },
    {
      id: 'chat-help',
      label: 'Screen-context help',
      category: 'Help Agent',
      nodeType: 'screen' as const,
    },
  ];

  const flowEdges: FlowEdge[] = [
    { from: 'home', to: 'site' },
    { from: 'home', to: 'forms' },
    { from: 'home', to: 'job' },
    { from: 'home', to: 'project' },
    { from: 'forms', to: 'form-detail' },
    { from: 'site', to: 'form-detail' },
    { from: 'home', to: 'quick-actions' },
    { from: 'quick-actions', to: 'chat' },
    { from: 'chat', to: 'chat-help' },
  ];

  const handleStepSelect = (stepId: string) => {
    const agentStep = AGENT_STEPS.find(s => s.id === stepId);
    if (agentStep) {
      if (agentStep.mode) onChatModeChange(agentStep.mode);
      onOverlayChange(agentStep.overlay);
      return;
    }
    onScreenChange(stepId as ScreenId);
  };

  // Active agent step reflects both the overlay and (for chat) the mode.
  const activeAgentStep = AGENT_STEPS.find(
    s => s.overlay === overlay && (s.overlay !== 'chat' || s.mode === chatMode),
  );
  const overlayLabel = activeAgentStep?.label;

  return {
    branding: {
      streamLabel: 'HELP AGENT',
      title: overlayLabel ?? currentScreen.name,
      description: overlay === 'chat'
        ? (chatMode === 'help'
            ? 'Help Agent receives the screen, app state & permission level'
            : `Chat context: ${chatContext}`)
        : 'FAB → Quick actions → chat sheet on every screen',
    },
    categories,
    reference: {
      label: 'User flow map',
      flowNodes,
      flowEdges,
    },
    activeStepId: overlay !== 'none' ? (activeAgentStep?.id ?? overlay) : screenId,
    onStepSelect: handleStepSelect,
    developerSettings,
  };
}
