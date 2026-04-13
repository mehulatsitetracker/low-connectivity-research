import React from 'react';
import { SCENARIOS } from '../data/scenarios';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

function ScenarioPicker({
  scenarioIndex,
  onScenarioChange,
}: {
  scenarioIndex: number;
  onScenarioChange: (idx: number) => void;
}) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '1.2px',
        textTransform: 'uppercase', color: '#666', marginBottom: 6,
      }}>
        Scenario
      </div>
      <select
        value={scenarioIndex}
        onChange={(e) => onScenarioChange(Number(e.target.value))}
        style={{
          width: '100%', padding: '8px 10px', borderRadius: 6,
          background: '#1e1e1e', border: '1px solid #333', color: '#fff',
          fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
        }}
      >
        {SCENARIOS.map((s, i) => (
          <option key={s.id} value={i}>{s.name}</option>
        ))}
      </select>
    </div>
  );
}

export function useConfiguratorConfig({
  scenarioIndex,
  onScenarioChange,
  onLoadSnapshot,
}: {
  scenarioIndex: number;
  onScenarioChange: (idx: number) => void;
  onLoadSnapshot: (stepIdx: number) => void;
}): { configuratorConfig: ConfiguratorConfig } {
  const scenario = SCENARIOS[scenarioIndex];
  const subScenario = scenario.subScenarios[0];
  const steps = subScenario.steps;

  const [activeStepIdx, setActiveStepIdx] = React.useState(0);

  const stepIds = steps.map((_, i) => `step-${i}`);

  const numberedSteps = steps.map((step, i) => ({
    id: stepIds[i],
    label: `${scenarioIndex + 1}.${i} — ${step.label}`,
  }));

  const categories: Category[] = [
    {
      id: 'main-path',
      label: 'Main Path',
      icon: 'checkmark',
      steps: numberedSteps,
    },
  ];

  const flowNodes: FlowNode[] = numberedSteps.map((step, i) => ({
    id: step.id,
    label: steps[i].label,
    category: 'Main Path',
    row: 0,
  }));

  const flowEdges: FlowEdge[] = numberedSteps.slice(0, -1).map((_, i) => ({
    from: stepIds[i],
    to: stepIds[i + 1],
  }));

  const handleStepSelect = (stepId: string) => {
    const idx = stepIds.indexOf(stepId);
    if (idx >= 0) {
      setActiveStepIdx(idx);
      onLoadSnapshot(idx);
    }
  };

  const configuratorConfig: ConfiguratorConfig = {
    branding: {
      streamLabel: 'Chatter',
      title: scenario.name,
      description: scenario.description,
    },
    categories,
    reference: {
      label: 'User flow map',
      flowNodes,
      flowEdges,
    },
    customControls: (
      <ScenarioPicker
        scenarioIndex={scenarioIndex}
        onScenarioChange={onScenarioChange}
      />
    ),
    activeStepId: stepIds[activeStepIdx] || 'step-0',
    onStepSelect: handleStepSelect,
  };

  return { configuratorConfig };
}
