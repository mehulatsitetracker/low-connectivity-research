import { SCREENS, VARIANTS, VARIANT_LABELS } from '../types';
import type { Variant } from '../types';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

const MAIN_PATH_INDICES = [0, 1, 2, 3];

export function useConfiguratorConfig({
  screenIndex,
  variant,
  onScreenChange,
  onVariantChange,
}: {
  screenIndex: number;
  variant: Variant;
  onScreenChange: (idx: number) => void;
  onVariantChange: (v: Variant) => void;
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
    scenarios: VARIANTS,
  }));

  const flowEdges: FlowEdge[] = MAIN_PATH_INDICES.slice(0, -1).map((idx, i) => ({
    from: `screen-${idx}`,
    to: `screen-${MAIN_PATH_INDICES[i + 1]}`,
  }));

  const handleStepSelect = (stepId: string) => {
    const idx = parseInt(stepId.replace('screen-', ''));
    if (idx >= 0 && idx < SCREENS.length) onScreenChange(idx);
  };

  const customControls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '1.2px',
          textTransform: 'uppercase', color: '#666', marginBottom: 6,
        }}>
          Filter presentation
        </div>
        <div style={{ fontSize: 10, color: '#555', marginBottom: 8, lineHeight: 1.4 }}>
          Compare full-page filters vs a peek bottom sheet.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {VARIANTS.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => onVariantChange(v)}
              style={{
                padding: '7px 10px', borderRadius: 6, fontSize: 12, textAlign: 'left',
                border: variant === v ? '1px solid #00847C' : '1px solid transparent',
                background: variant === v ? 'rgba(0,132,124,0.15)' : 'transparent',
                color: variant === v ? '#fff' : '#888',
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: variant === v ? 500 : 400,
              }}
            >
              {VARIANT_LABELS[v]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const configuratorConfig: ConfiguratorConfig = {
    branding: {
      streamLabel: 'SEARCH & FILTERING',
      title: currentScreen.name,
      description: `${VARIANT_LABELS[variant]} filters — compare presentations`,
    },
    categories,
    reference: {
      label: 'Screen map',
      flowNodes,
      flowEdges,
    },
    customControls,
    activeStepId: `screen-${screenIndex}`,
    onStepSelect: handleStepSelect,
  };

  return { configuratorConfig };
}
