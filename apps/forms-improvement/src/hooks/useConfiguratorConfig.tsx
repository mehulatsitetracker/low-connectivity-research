import { SCREENS } from '../types';
import type { Variant } from '../types';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

export function useFormsConfig({
  screenIndex,
  variant,
  onScreenChange,
  onVariantChange,
}: {
  screenIndex: number;
  variant: Variant;
  onScreenChange: (idx: number) => void;
  onVariantChange: (v: Variant) => void;
}): ConfiguratorConfig {
  const currentScreen = SCREENS[screenIndex];

  const steps = SCREENS.map((s, i) => ({
    id: s.id,
    label: `1.${i + 1} — ${s.name}`,
  }));

  const categories: Category[] = [
    { id: 'main-path', label: 'Form Flow', icon: 'checkmark', steps },
  ];

  const flowNodes: FlowNode[] = SCREENS.map(s => ({
    id: s.id,
    label: s.name,
    category: 'Form Flow',
    scenarios: s.scenarios,
    nodeType: 'screen' as const,
  }));

  const flowEdges: FlowEdge[] = SCREENS.slice(0, -1).map((s, i) => ({
    from: s.id,
    to: SCREENS[i + 1].id,
  }));

  const handleStepSelect = (stepId: string) => {
    const idx = SCREENS.findIndex(s => s.id === stepId);
    if (idx >= 0) onScreenChange(idx);
  };

  const variantToggle = (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>
        Variant
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {currentScreen.scenarios.map(v => (
          <button
            key={v}
            onClick={() => onVariantChange(v)}
            style={{
              padding: '7px 10px', borderRadius: 6, fontSize: 12, textAlign: 'left',
              border: variant === v ? '1px solid #00847C' : '1px solid transparent',
              background: variant === v ? 'rgba(0,132,124,0.15)' : 'transparent',
              color: variant === v ? '#fff' : '#888',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: variant === v ? 500 : 400,
              textTransform: 'capitalize',
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );

  return {
    branding: {
      streamLabel: 'FORMS STREAM',
      title: currentScreen.name,
      description: `Now vs Improved — ${variant}`,
    },
    categories,
    reference: {
      label: 'Form flow map',
      flowNodes,
      flowEdges,
    },
    customControls: variantToggle,
    activeStepId: currentScreen.id,
    onStepSelect: handleStepSelect,
  };
}
