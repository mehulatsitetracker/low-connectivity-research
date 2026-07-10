import { SCREENS } from '../types';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

const MAIN_PATH_INDICES = [0, 1, 2, 3];

export function useConfiguratorConfig({
  screenIndex,
  onScreenChange,
}: {
  screenIndex: number;
  onScreenChange: (idx: number) => void;
}): { configuratorConfig: ConfiguratorConfig } {
  const currentScreen = SCREENS[screenIndex];

  const mainPathSteps = MAIN_PATH_INDICES.map((idx, i) => ({
    id: `screen-${idx}`,
    label: `1.${i} — ${SCREENS[idx].name}`,
  }));

  const categories: Category[] = [
    { id: 'main-path', label: 'List Screens', icon: 'grid', steps: mainPathSteps },
  ];

  const flowNodes: FlowNode[] = MAIN_PATH_INDICES.map(idx => ({
    id: `screen-${idx}`,
    label: SCREENS[idx].name,
    category: 'List Screens',
    nodeType: 'screen' as const,
  }));

  const flowEdges: FlowEdge[] = MAIN_PATH_INDICES.slice(0, -1).map((idx, i) => ({
    from: `screen-${idx}`,
    to: `screen-${MAIN_PATH_INDICES[i + 1]}`,
  }));

  const handleStepSelect = (stepId: string) => {
    const idx = parseInt(stepId.replace('screen-', ''));
    if (idx >= 0 && idx < SCREENS.length) onScreenChange(idx);
  };

  const configuratorConfig: ConfiguratorConfig = {
    branding: {
      streamLabel: 'SEARCH & FILTERING',
      title: currentScreen.name,
      description: 'Explore search and filter patterns across list screens',
    },
    categories,
    reference: {
      label: 'Screen map',
      flowNodes,
      flowEdges,
    },
    activeStepId: `screen-${screenIndex}`,
    onStepSelect: handleStepSelect,
  };

  return { configuratorConfig };
}
