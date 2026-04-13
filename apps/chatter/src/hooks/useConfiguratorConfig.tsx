import React from 'react';
import { SCENARIOS } from '../data/scenarios';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

// Build a global step ID: "s{scenarioIdx}-{stepIdx}"
function makeStepId(scenIdx: number, stepIdx: number) {
  return `s${scenIdx}-${stepIdx}`;
}

function parseStepId(id: string): { scenIdx: number; stepIdx: number } | null {
  const match = id.match(/^s(\d+)-(\d+)$/);
  if (!match) return null;
  return { scenIdx: Number(match[1]), stepIdx: Number(match[2]) };
}

const SCENARIO_ICONS: Record<string, 'checkmark' | 'branch' | 'warning' | 'grid'> = {
  'job-chat': 'checkmark',
  'site-chat': 'checkmark',
  'project-chat': 'checkmark',
  'notification-flow': 'branch',
};

export function useConfiguratorConfig({
  onLoadSnapshot,
}: {
  onLoadSnapshot: (scenIdx: number, stepIdx: number) => void;
}): { configuratorConfig: ConfiguratorConfig } {
  const [activeStepId, setActiveStepId] = React.useState(makeStepId(0, 0));

  // Build categories — one per scenario, with all steps
  const categories: Category[] = SCENARIOS.map((scenario, sIdx) => ({
    id: scenario.id,
    label: scenario.name,
    icon: SCENARIO_ICONS[scenario.id] || 'checkmark',
    steps: scenario.subScenarios[0].steps.map((step, stepIdx) => ({
      id: makeStepId(sIdx, stepIdx),
      label: `${sIdx + 1}.${stepIdx} — ${step.label}`,
    })),
  }));

  // Build flow nodes — all scenarios, each on its own row
  const flowNodes: FlowNode[] = SCENARIOS.flatMap((scenario, sIdx) =>
    scenario.subScenarios[0].steps.map((step, stepIdx) => ({
      id: makeStepId(sIdx, stepIdx),
      label: step.label,
      category: scenario.name,
      row: sIdx,
    }))
  );

  // Build flow edges — connect steps within each scenario
  const flowEdges: FlowEdge[] = SCENARIOS.flatMap((scenario, sIdx) => {
    const steps = scenario.subScenarios[0].steps;
    return steps.slice(0, -1).map((_, stepIdx) => ({
      from: makeStepId(sIdx, stepIdx),
      to: makeStepId(sIdx, stepIdx + 1),
    }));
  });

  const handleStepSelect = (stepId: string) => {
    const parsed = parseStepId(stepId);
    if (!parsed) return;
    setActiveStepId(stepId);
    onLoadSnapshot(parsed.scenIdx, parsed.stepIdx);
  };

  // Get current scenario info for branding
  const parsed = parseStepId(activeStepId);
  const currentScenario = parsed ? SCENARIOS[parsed.scenIdx] : SCENARIOS[0];

  const configuratorConfig: ConfiguratorConfig = {
    branding: {
      streamLabel: 'Chatter',
      title: currentScenario.name,
      description: currentScenario.description,
    },
    categories,
    reference: {
      label: 'All flows',
      flowNodes,
      flowEdges,
    },
    activeStepId,
    onStepSelect: handleStepSelect,
  };

  return { configuratorConfig };
}
