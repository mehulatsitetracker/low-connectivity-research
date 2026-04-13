import type { ConnectionQuality } from '../hooks/useNetworkSpeed';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

const STATES: { quality: ConnectionQuality; icon: string; label: string }[] = [
  { quality: 'good', icon: '🟢', label: 'Good' },
  { quality: 'slow', icon: '🟡', label: 'Slow network' },
  { quality: 'offline', icon: '🔴', label: 'Offline' },
];

function NetworkButtons({
  demoQuality,
  onQualityChange,
}: {
  demoQuality: ConnectionQuality | null;
  onQualityChange: (q: ConnectionQuality | null) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>
        Network
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {STATES.map(s => (
          <button
            key={s.quality}
            onClick={() => onQualityChange(demoQuality === s.quality ? null : s.quality)}
            style={{
              padding: '8px 12px', borderRadius: 6, fontSize: 12,
              border: demoQuality === s.quality ? '1px solid #00847C' : '1px solid #333',
              background: demoQuality === s.quality ? 'rgba(0,132,124,0.15)' : '#1e1e1e',
              color: demoQuality === s.quality ? '#00847C' : '#999',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', fontWeight: 500,
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type Screen = 'home' | 'job';

export function useConnectivityConfiguratorConfig({
  screen,
  demoQuality,
  onScreenChange,
  onQualityChange,
}: {
  screen: Screen;
  demoQuality: ConnectionQuality | null;
  onScreenChange: (s: Screen) => void;
  onQualityChange: (q: ConnectionQuality | null) => void;
}): ConfiguratorConfig {
  const steps = [
    { id: 'home', label: '1.0 — Home Screen' },
    { id: 'job', label: '1.1 — Job Detail' },
  ];

  const categories: Category[] = [
    { id: 'main-path', label: 'Main Path', icon: 'checkmark', steps },
  ];

  const flowNodes: FlowNode[] = [
    { id: 'home', label: 'Home Screen', category: 'Main Path' },
    { id: 'job', label: 'Job Detail', category: 'Main Path' },
  ];

  const flowEdges: FlowEdge[] = [{ from: 'home', to: 'job' }];

  return {
    branding: {
      streamLabel: 'Connectivity',
      title: 'Network Feedback',
      description: 'Low connectivity banners and bottom sheets for field workers.',
    },
    categories,
    reference: {
      label: 'User flow map',
      flowNodes,
      flowEdges,
    },
    customControls: (
      <NetworkButtons demoQuality={demoQuality} onQualityChange={onQualityChange} />
    ),
    activeStepId: screen,
    onStepSelect: (stepId) => onScreenChange(stepId as Screen),
  };
}
