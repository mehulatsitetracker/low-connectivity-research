import { SCREENS } from '../types';
import type { Variant, EdgeCases } from '../types';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

const EDGE_CASE_DEFS: Array<{
  key: keyof EdgeCases;
  label: string;
  description: string;
}> = [
  {
    key: 'offline',
    label: 'Offline mode',
    description: 'Network pill → Offline. Sync stalls in Retrying. Submit queues.',
  },
  {
    key: 'syncError',
    label: 'Sync error on submit',
    description: 'Submit ends in Action needed. s3-emergency rejected by server.',
  },
  {
    key: 'photoRetry',
    label: 'Some fields retrying',
    description: 'Banner + ToC RETRYING badge & Retry on photo, barcode, and other fields.',
  },
  {
    key: 'relaunchStates',
    label: 'Draft recovery + Session expired',
    description: 'Resume your draft? card on list. Session expired on next API touch.',
  },
];

export function useFormsConfig({
  screenIndex,
  variant,
  edgeCases,
  onScreenChange,
  onVariantChange,
  onEdgeCasesChange,
}: {
  screenIndex: number;
  variant: Variant;
  edgeCases: EdgeCases;
  onScreenChange: (idx: number) => void;
  onVariantChange: (v: Variant) => void;
  onEdgeCasesChange: (e: EdgeCases) => void;
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

  const activeEdgeCount = EDGE_CASE_DEFS.filter(d => edgeCases[d.key]).length;
  const toggleEdgeCase = (k: keyof EdgeCases) =>
    onEdgeCasesChange({ ...edgeCases, [k]: !edgeCases[k] });
  const resetEdgeCases = () =>
    onEdgeCasesChange({ offline: false, syncError: false, photoRetry: false, relaunchStates: false });

  const customControls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Variant */}
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

      {/* Edge cases */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#666' }}>
              Edge cases
            </span>
            {activeEdgeCount > 0 && (
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: '#1A1A1A', background: '#FFB75D',
                padding: '1px 5px', borderRadius: 8,
              }}>{activeEdgeCount}</span>
            )}
          </div>
          {activeEdgeCount > 0 && (
            <button
              onClick={resetEdgeCases}
              style={{
                background: 'transparent', border: '1px solid #333',
                color: '#888', fontSize: 9, padding: '2px 6px', borderRadius: 4,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >Reset</button>
          )}
        </div>
        <div style={{ fontSize: 10, color: '#555', marginBottom: 8, lineHeight: 1.4 }}>
          All off = happy flow. Toggle to trigger.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {EDGE_CASE_DEFS.map(d => (
            <EdgeCaseRow
              key={d.key}
              label={d.label}
              description={d.description}
              on={edgeCases[d.key]}
              onToggle={() => toggleEdgeCase(d.key)}
            />
          ))}
        </div>
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
    customControls,
    activeStepId: currentScreen.id,
    onStepSelect: handleStepSelect,
  };
}

function EdgeCaseRow({
  label, description, on, onToggle,
}: {
  label: string;
  description: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '8px 10px', borderRadius: 6, textAlign: 'left',
        background: on ? 'rgba(255,183,93,0.12)' : 'transparent',
        border: on ? '1px solid rgba(255,183,93,0.6)' : '1px solid transparent',
        cursor: 'pointer', fontFamily: 'inherit',
      }}
    >
      <span style={{
        width: 32, height: 18, borderRadius: 9, flexShrink: 0,
        background: on ? '#FFB75D' : '#444',
        position: 'relative', transition: 'background 150ms', marginTop: 1,
      }}>
        <span style={{
          position: 'absolute', top: 2, left: on ? 16 : 2,
          width: 14, height: 14, borderRadius: '50%', background: '#fff',
          transition: 'left 150ms',
        }} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: 'block', fontSize: 11.5, fontWeight: 600,
          color: on ? '#fff' : '#bbb', lineHeight: 1.3,
        }}>{label}</span>
        <span style={{
          display: 'block', fontSize: 10, color: '#666',
          lineHeight: 1.35, marginTop: 2,
        }}>{description}</span>
      </span>
    </button>
  );
}
