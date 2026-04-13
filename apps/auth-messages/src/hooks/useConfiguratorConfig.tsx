import { SCREENS, type NetworkState, type UserContext, type CopyMode } from '../types';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

// Happy-path screen indices (main auth flow)
const MAIN_PATH_INDICES = [0, 1, 2, 3, 4, 5, 6]; // reset → domain → login → vault → success → auth-loading → sync
const EDGE_CASE_INDICES = [7, 8, 9, 10]; // access-modal, biometric, logout, deep-link

function NetworkButtons({
  networkState,
  onNetworkChange,
}: {
  networkState: NetworkState;
  onNetworkChange: (n: NetworkState) => void;
}) {
  const states: { id: NetworkState; label: string; icon: string }[] = [
    { id: 'good', label: 'Good', icon: '🟢' },
    { id: 'slow', label: 'Slow 3G', icon: '🟡' },
    { id: 'offline', label: 'Offline', icon: '🔴' },
  ];
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>
        Network
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {states.map(s => (
          <button
            key={s.id}
            onClick={() => onNetworkChange(s.id)}
            style={{
              flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 11,
              border: networkState === s.id ? '1px solid #00847C' : '1px solid #333',
              background: networkState === s.id ? 'rgba(0,132,124,0.15)' : '#1e1e1e',
              color: networkState === s.id ? '#00847C' : '#999',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CopyModeToggle({
  copyMode,
  onCopyModeChange,
}: {
  copyMode: CopyMode;
  onCopyModeChange: (m: CopyMode) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>
        Copy Mode
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {(['current', 'proposed'] as CopyMode[]).map(m => (
          <button
            key={m}
            onClick={() => onCopyModeChange(m)}
            style={{
              flex: 1, padding: '6px 8px', borderRadius: 6, fontSize: 12,
              border: copyMode === m ? '1px solid #00847C' : '1px solid #333',
              background: copyMode === m ? 'rgba(0,132,124,0.15)' : '#1e1e1e',
              color: copyMode === m ? (m === 'current' ? '#e57373' : '#81c784') : '#999',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', fontWeight: 500,
            }}
          >
            {m === 'current' ? 'Current' : 'Proposed'}
          </button>
        ))}
      </div>
    </div>
  );
}

function UserContextToggle({
  userContext,
  onUserContextChange,
}: {
  userContext: UserContext;
  onUserContextChange: (u: UserContext) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>
        User
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {(['returning', 'first-time'] as UserContext[]).map(u => (
          <button
            key={u}
            onClick={() => onUserContextChange(u)}
            style={{
              flex: 1, padding: '6px 8px', borderRadius: 6, fontSize: 12,
              border: userContext === u ? '1px solid #00847C' : '1px solid #333',
              background: userContext === u ? 'rgba(0,132,124,0.15)' : '#1e1e1e',
              color: userContext === u ? '#00847C' : '#999',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', fontWeight: 500,
            }}
          >
            {u === 'returning' ? 'Returning' : 'First-time'}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScenarioButtons({
  screenIndex,
  scenario,
  onScenarioChange,
}: {
  screenIndex: number;
  scenario: string;
  onScenarioChange: (s: string) => void;
}) {
  const screen = SCREENS[screenIndex];
  if (screen.scenarios.length <= 1) return null;

  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>
        Scenario
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {screen.scenarios.map(s => (
          <button
            key={s}
            onClick={() => onScenarioChange(s)}
            style={{
              padding: '7px 10px', borderRadius: 6, fontSize: 12, textAlign: 'left',
              border: scenario === s ? '1px solid #00847C' : '1px solid transparent',
              background: scenario === s ? 'rgba(0,132,124,0.15)' : 'transparent',
              color: scenario === s ? '#fff' : '#888',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: scenario === s ? 500 : 400,
              transition: 'all 0.15s',
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export function useAuthConfiguratorConfig({
  screenIndex,
  networkState,
  userContext,
  copyMode,
  scenario,
  onScreenChange,
  onNetworkChange,
  onUserContextChange,
  onCopyModeChange,
  onScenarioChange,
}: {
  screenIndex: number;
  networkState: NetworkState;
  userContext: UserContext;
  copyMode: CopyMode;
  scenario: string;
  onScreenChange: (idx: number) => void;
  onNetworkChange: (n: NetworkState) => void;
  onUserContextChange: (u: UserContext) => void;
  onCopyModeChange: (m: CopyMode) => void;
  onScenarioChange: (s: string) => void;
}): ConfiguratorConfig {
  const currentScreen = SCREENS[screenIndex];

  // Build steps from SCREENS
  const mainPathSteps = MAIN_PATH_INDICES.map((idx, i) => ({
    id: `screen-${idx}`,
    label: `1.${i} — ${SCREENS[idx].name}`,
  }));

  const edgeCaseSteps = EDGE_CASE_INDICES.map((idx, i) => ({
    id: `screen-${idx}`,
    label: `1.${MAIN_PATH_INDICES.length + i} — ${SCREENS[idx].name}`,
  }));

  const categories: Category[] = [
    { id: 'main-path', label: 'Main Path', icon: 'checkmark', steps: mainPathSteps },
    { id: 'edge-cases', label: 'Edge Cases', icon: 'warning', steps: edgeCaseSteps },
  ];

  // Flow diagram — include scenarios per screen
  const flowNodes: FlowNode[] = [
    ...MAIN_PATH_INDICES.map(idx => ({
      id: `screen-${idx}`,
      label: SCREENS[idx].name,
      category: 'Main Path',
      scenarios: SCREENS[idx].scenarios,
      nodeType: 'screen' as const,
    })),
    ...EDGE_CASE_INDICES.map(idx => ({
      id: `screen-${idx}`,
      label: SCREENS[idx].name,
      category: 'Edge Cases',
      scenarios: SCREENS[idx].scenarios,
      nodeType: 'screen' as const,
    })),
  ];

  const flowEdges: FlowEdge[] = [
    ...MAIN_PATH_INDICES.slice(0, -1).map((idx, i) => ({
      from: `screen-${idx}`,
      to: `screen-${MAIN_PATH_INDICES[i + 1]}`,
    })),
  ];

  const handleStepSelect = (stepId: string) => {
    const idx = parseInt(stepId.replace('screen-', ''));
    if (idx >= 0 && idx < SCREENS.length) {
      onScreenChange(idx);
    }
  };

  return {
    branding: {
      streamLabel: 'Auth Flow',
      title: `${screenIndex + 1} of ${SCREENS.length}: ${currentScreen.name}`,
      description: `${currentScreen.scenarios.length} scenarios available`,
    },
    categories,
    reference: {
      label: 'User flow map',
      flowNodes,
      flowEdges,
    },
    customControls: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CopyModeToggle copyMode={copyMode} onCopyModeChange={onCopyModeChange} />
        <NetworkButtons networkState={networkState} onNetworkChange={onNetworkChange} />
        <UserContextToggle userContext={userContext} onUserContextChange={onUserContextChange} />
        <ScenarioButtons screenIndex={screenIndex} scenario={scenario} onScenarioChange={onScenarioChange} />
      </div>
    ),
    activeStepId: `screen-${screenIndex}`,
    onStepSelect: handleStepSelect,
  };
}
