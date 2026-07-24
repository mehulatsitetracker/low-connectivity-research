import { SCREENS, VARIANTS, VARIANT_LABELS } from '../types';
import type { ScreenId, Variant } from '../types';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

const ADMIN_SCREEN: ScreenId = 'admin-search-indexing';

export function useConfiguratorConfig({
  activeScreen,
  variant,
  onScreenSelect,
  onVariantChange,
}: {
  activeScreen: ScreenId;
  variant: Variant;
  onScreenSelect: (screen: ScreenId) => void;
  onVariantChange: (v: Variant) => void;
}): { configuratorConfig: ConfiguratorConfig } {
  const isAdmin = activeScreen === ADMIN_SCREEN;

  const categories: Category[] = [
    {
      id: 'mobile',
      label: 'Mobile — List Screens',
      icon: 'grid',
      steps: SCREENS.map((s, i) => ({ id: s.id, label: `1.${i} — ${s.name}` })),
    },
    {
      id: 'admin',
      label: 'Admin — Web (Setup)',
      icon: 'branch',
      steps: [{ id: ADMIN_SCREEN, label: 'Search Indexing' }],
    },
  ];

  // Flow diagram covers the mobile list screens only; the admin page is not part
  // of the field-user flow, so it has no diagram node (nothing highlights there).
  const flowNodes: FlowNode[] = SCREENS.map(s => ({
    id: s.id,
    label: s.name,
    category: 'List Screens',
    nodeType: 'screen' as const,
    scenarios: VARIANTS,
  }));

  const flowEdges: FlowEdge[] = SCREENS.slice(0, -1).map((s, i) => ({
    from: s.id,
    to: SCREENS[i + 1].id,
  }));

  // 'menu' isn't a configurator step — highlight Home while the menu is open.
  const activeStepId: string = activeScreen === 'menu' ? 'home' : activeScreen;

  const customControls = isAdmin ? (
    <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>
      Salesforce Setup (web / admin). Configure which object fields are indexed
      for mobile global search and offered as list-view filters. Toggles and the
      New form are interactive.
    </div>
  ) : (
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
      title: isAdmin ? 'Search Indexing' : (SCREENS.find(s => s.id === activeStepId)?.name ?? 'Home'),
      description: isAdmin
        ? 'Admin / web-side setup for search & filters'
        : `${VARIANT_LABELS[variant]} filters — compare presentations`,
    },
    categories,
    reference: {
      label: 'Screen map',
      flowNodes,
      flowEdges,
    },
    customControls,
    activeStepId,
    onStepSelect: (stepId: string) => onScreenSelect(stepId as ScreenId),
  };

  return { configuratorConfig };
}
