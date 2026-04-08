import React from 'react';
import { SCREENS, type NetworkState, type UserContext, type CopyMode } from '../types';

interface Props {
  currentScreenIndex: number;
  networkState: NetworkState;
  userContext: UserContext;
  copyMode: CopyMode;
  scenario: string;
  onScreenChange: (index: number) => void;
  onNetworkChange: (n: NetworkState) => void;
  onUserContextChange: (u: UserContext) => void;
  onCopyModeChange: (c: CopyMode) => void;
  onScenarioChange: (s: string) => void;
}

const sidebarStyle: React.CSSProperties = {
  position: 'fixed', top: 16, left: 16, zIndex: 100,
  background: '#1a1a1a', borderRadius: 12, padding: '16px',
  display: 'flex', flexDirection: 'column', gap: 16, width: 240,
  maxHeight: 'calc(100vh - 32px)', overflowY: 'auto',
  fontFamily: 'system-ui',
};

const sectionLabelStyle: React.CSSProperties = {
  color: '#666', fontSize: 10, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4,
};

const btnStyle = (active: boolean): React.CSSProperties => ({
  padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', textAlign: 'left',
  background: active ? '#333' : 'transparent',
  color: active ? '#fff' : '#888',
  fontSize: 12, fontWeight: 500, fontFamily: 'system-ui',
  transition: 'all 0.15s',
});

const navBtnStyle: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 6, border: '1px solid #333',
  background: 'transparent', color: '#aaa', fontSize: 12,
  cursor: 'pointer', fontFamily: 'system-ui', fontWeight: 500,
};

const NETWORK_STATES: { value: NetworkState; icon: string; label: string }[] = [
  { value: 'good', icon: '\ud83d\udfe2', label: 'Good' },
  { value: 'slow', icon: '\ud83d\udfe1', label: 'Slow 3G' },
  { value: 'offline', icon: '\ud83d\udd34', label: 'Offline' },
];

export const SimulatorControls: React.FC<Props> = ({
  currentScreenIndex, networkState, userContext, copyMode, scenario,
  onScreenChange, onNetworkChange, onUserContextChange, onCopyModeChange, onScenarioChange,
}) => {
  const screen = SCREENS[currentScreenIndex];
  const total = SCREENS.length;

  return (
    <div style={sidebarStyle}>
      {/* Flow position */}
      <div>
        <div style={sectionLabelStyle}>Flow Position</div>
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          {currentScreenIndex + 1} of {total}: {screen.name}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={navBtnStyle} onClick={() => onScreenChange(Math.max(0, currentScreenIndex - 1))} disabled={currentScreenIndex === 0}>
            Prev
          </button>
          <button style={navBtnStyle} onClick={() => onScreenChange(Math.min(total - 1, currentScreenIndex + 1))} disabled={currentScreenIndex === total - 1}>
            Next
          </button>
          <button style={navBtnStyle} onClick={() => onScreenChange(0)}>
            Restart
          </button>
        </div>
      </div>

      {/* Screen list */}
      <div>
        <div style={sectionLabelStyle}>Screens</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SCREENS.map((s, i) => (
            <button key={s.id} onClick={() => onScreenChange(i)} style={btnStyle(i === currentScreenIndex)}>
              {i + 1}. {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Before / After toggle */}
      <div>
        <div style={sectionLabelStyle}>Copy Mode</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onCopyModeChange('current')} style={{
            ...btnStyle(copyMode === 'current'),
            flex: 1, textAlign: 'center',
            background: copyMode === 'current' ? '#8B0000' : 'transparent',
            color: copyMode === 'current' ? '#fff' : '#888',
          }}>
            Current
          </button>
          <button onClick={() => onCopyModeChange('proposed')} style={{
            ...btnStyle(copyMode === 'proposed'),
            flex: 1, textAlign: 'center',
            background: copyMode === 'proposed' ? '#006400' : 'transparent',
            color: copyMode === 'proposed' ? '#fff' : '#888',
          }}>
            Proposed
          </button>
        </div>
      </div>

      {/* Network state */}
      <div>
        <div style={sectionLabelStyle}>Network</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NETWORK_STATES.map(n => (
            <button key={n.value} onClick={() => onNetworkChange(n.value)} style={btnStyle(networkState === n.value)}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* User context */}
      <div>
        <div style={sectionLabelStyle}>User</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onUserContextChange('returning')} style={{ ...btnStyle(userContext === 'returning'), flex: 1, textAlign: 'center' }}>
            Returning
          </button>
          <button onClick={() => onUserContextChange('first-time')} style={{ ...btnStyle(userContext === 'first-time'), flex: 1, textAlign: 'center' }}>
            First-time
          </button>
        </div>
      </div>

      {/* Scenario picker */}
      <div>
        <div style={sectionLabelStyle}>Scenario</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {screen.scenarios.map(s => (
            <button key={s} onClick={() => onScenarioChange(s)} style={btnStyle(scenario === s)}>
              {s.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
