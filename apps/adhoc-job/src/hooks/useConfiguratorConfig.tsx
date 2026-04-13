import React from 'react';
import { SCENARIOS } from '../data/scenarios';
import type { ConfigOptions } from '../types';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

interface Toggle {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  indent?: boolean;
}

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 36, height: 20, borderRadius: 10, border: 'none',
        background: on ? '#00847C' : '#555', cursor: 'pointer',
        position: 'relative', transition: 'background 0.2s',
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2, left: on ? 18 : 2,
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

function ToggleRow({ on, onChange, label, indent }: Toggle) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '4px 0', paddingLeft: indent ? 12 : 0,
    }}>
      <span style={{ fontSize: indent ? 10 : 11, color: '#aaa' }}>{label}</span>
      <ToggleSwitch on={on} onChange={onChange} />
    </div>
  );
}

function DeveloperSettingsContent({
  config,
  onConfigChange,
}: {
  config: ConfigOptions;
  onConfigChange: (c: ConfigOptions) => void;
}) {
  const update = (key: keyof ConfigOptions, value: boolean) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <ToggleRow on={config.siteCheckInEnabled} onChange={(v) => update('siteCheckInEnabled', v)} label="Site Check-In/Out" />
      {config.siteCheckInEnabled && (
        <>
          <ToggleRow on={config.checkInFormRequired} onChange={(v) => update('checkInFormRequired', v)} label="Require form" indent />
          <ToggleRow on={config.allowMultipleCheckIn} onChange={(v) => update('allowMultipleCheckIn', v)} label="Multiple check-in/out" indent />
        </>
      )}
      <ToggleRow on={config.timeTrackingEnabled} onChange={(v) => update('timeTrackingEnabled', v)} label="Time Tracking" />
    </div>
  );
}

function ScenarioPicker({
  scenarioIndex,
  subScenarioIndex,
  onScenarioChange,
  onSubScenarioChange,
}: {
  scenarioIndex: number;
  subScenarioIndex: number;
  onScenarioChange: (idx: number) => void;
  onSubScenarioChange: (idx: number) => void;
}) {
  const scenario = SCENARIOS[scenarioIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Scenario selector */}
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
            fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
            outline: 'none',
          }}
        >
          {SCENARIOS.map((s, i) => (
            <option key={s.id} value={i}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Sub-scenario buttons */}
      {scenario.subScenarios.length > 1 && (
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '1.2px',
            textTransform: 'uppercase', color: '#666', marginBottom: 6,
          }}>
            {scenario.id === 'multi-day' ? 'Day' : scenario.id === 'shift-handoff' ? 'Shift' : 'Role'}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {scenario.subScenarios.map((sub, i) => (
              <button
                key={sub.id}
                onClick={() => onSubScenarioChange(i)}
                style={{
                  flex: 1, padding: '6px 8px', borderRadius: 6,
                  border: i === subScenarioIndex ? '1px solid #00847C' : '1px solid #333',
                  background: i === subScenarioIndex ? 'rgba(0,132,124,0.15)' : '#1e1e1e',
                  color: i === subScenarioIndex ? '#00847C' : '#999',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'center',
                  transition: 'all 0.15s',
                }}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function useConfiguratorConfig({
  scenarioIndex,
  subScenarioIndex,
  config,
  onConfigChange,
  onScenarioChange,
  onSubScenarioChange,
  onLoadSnapshot,
}: {
  scenarioIndex: number;
  subScenarioIndex: number;
  config: ConfigOptions;
  onConfigChange: (c: ConfigOptions) => void;
  onScenarioChange: (idx: number) => void;
  onSubScenarioChange: (idx: number) => void;
  onLoadSnapshot: (stepIdx: number) => void;
}): { configuratorConfig: ConfiguratorConfig; currentStepIndex: number } {
  const scenario = SCENARIOS[scenarioIndex];
  const subScenario = scenario.subScenarios[subScenarioIndex];
  const steps = subScenario.steps;

  const [activeStepIdx, setActiveStepIdx] = React.useState(0);

  // Build step IDs and categories
  const stepIds = steps.map((_, i) => `step-${i}`);

  // Use hierarchical numbering based on scenario
  const numberedSteps = steps.map((step, i) => {
    const prefix = scenarioIndex + 1;
    return {
      id: stepIds[i],
      label: `${prefix}.${i} — ${step.label}`,
    };
  });

  const categories: Category[] = [
    {
      id: 'main-path',
      label: 'Main Path',
      icon: 'checkmark',
      steps: numberedSteps,
    },
  ];

  // Build flow nodes & edges
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
      streamLabel: 'Ad-Hoc Job',
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
        subScenarioIndex={subScenarioIndex}
        onScenarioChange={onScenarioChange}
        onSubScenarioChange={onSubScenarioChange}
      />
    ),
    developerSettings: (
      <DeveloperSettingsContent config={config} onConfigChange={onConfigChange} />
    ),
    activeStepId: stepIds[activeStepIdx] || 'step-0',
    onStepSelect: handleStepSelect,
  };

  return { configuratorConfig, currentStepIndex: activeStepIdx };
}
