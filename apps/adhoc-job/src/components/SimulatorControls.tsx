import type React from 'react';
import { SCENARIOS } from '../data/scenarios';
import type { ScreenId, ConfigOptions } from '../types';

interface Props {
  scenarioIndex: number;
  subScenarioIndex: number;
  currentScreen: ScreenId;
  currentJobId: string;
  config: ConfigOptions;
  currentDay: number;
  onConfigChange: (config: ConfigOptions) => void;
  onScenarioChange: (idx: number) => void;
  onSubScenarioChange: (idx: number) => void;
  onLoadSnapshot: (stepIdx: number) => void;
  onReset: () => void;
  onDayChange: (action: string) => void;
}

const sidebarStyle: React.CSSProperties = {
  position: 'fixed', top: 16, left: 16, zIndex: 100,
  background: '#1a1a1a', borderRadius: 12, padding: '16px',
  display: 'flex', flexDirection: 'column', gap: 14, width: 240,
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

const toggleRowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '4px 0',
};

const toggleLabelStyle: React.CSSProperties = {
  fontSize: 11, color: '#aaa',
};

const SCREEN_LABELS: Record<string, string> = {
  'job-list': 'Job List',
  'job-detail': 'Job Detail',
  'site-checkin': 'Site Check-In',
  'checkin-form': 'Check-In Form',
  'site-checkout': 'Site Check-Out',
  'checkout-form': 'Check-Out Form',
  'crew-list': 'Crew List',
};

const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void }> = ({ on, onChange }) => (
  <button
    onClick={() => onChange(!on)}
    style={{
      width: 36, height: 20, borderRadius: 10, border: 'none',
      background: on ? '#4CAF50' : '#555', cursor: 'pointer',
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

export const SimulatorControls: React.FC<Props> = ({
  scenarioIndex, subScenarioIndex, currentScreen, currentJobId,
  config, currentDay, onConfigChange,
  onScenarioChange, onSubScenarioChange, onLoadSnapshot, onReset, onDayChange,
}) => {
  const scenario = SCENARIOS[scenarioIndex];
  const subScenario = scenario.subScenarios[subScenarioIndex];
  const steps = subScenario.steps;

  const updateConfig = (key: keyof ConfigOptions, value: boolean) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div style={sidebarStyle}>
      {/* Title + Reset */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: 8 }}>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Ad-Hoc Job Flow</span>
        <button onClick={onReset} style={{
          padding: '3px 8px', borderRadius: 4, border: '1px solid #444',
          background: 'transparent', color: '#888', fontSize: 10, cursor: 'pointer', fontFamily: 'system-ui',
        }}>
          Reset
        </button>
      </div>

      {/* Current state */}
      <div>
        <div style={sectionLabelStyle}>Current</div>
        <div style={{ color: '#4CAF50', fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
          {SCREEN_LABELS[currentScreen] || currentScreen}
        </div>
        <div style={{ color: '#888', fontSize: 11 }}>{currentJobId}</div>
      </div>

      {/* Config toggles */}
      <div>
        <div style={sectionLabelStyle}>Modules</div>
        <div style={toggleRowStyle}>
          <span style={toggleLabelStyle}>Site Check-In/Out</span>
          <Toggle on={config.siteCheckInEnabled} onChange={(v) => updateConfig('siteCheckInEnabled', v)} />
        </div>
        {config.siteCheckInEnabled && (
          <>
            <div style={{ ...toggleRowStyle, paddingLeft: 12 }}>
              <span style={{ ...toggleLabelStyle, fontSize: 10 }}>Require form</span>
              <Toggle on={config.checkInFormRequired} onChange={(v) => updateConfig('checkInFormRequired', v)} />
            </div>
            <div style={{ ...toggleRowStyle, paddingLeft: 12 }}>
              <span style={{ ...toggleLabelStyle, fontSize: 10 }}>Multiple check-in/out</span>
              <Toggle on={config.allowMultipleCheckIn} onChange={(v) => updateConfig('allowMultipleCheckIn', v)} />
            </div>
          </>
        )}
        <div style={toggleRowStyle}>
          <span style={toggleLabelStyle}>Time Tracking</span>
          <Toggle on={config.timeTrackingEnabled} onChange={(v) => updateConfig('timeTrackingEnabled', v)} />
        </div>
      </div>

      {/* Day navigation — single check-in mode */}
      {config.siteCheckInEnabled && !config.allowMultipleCheckIn && (
        <div>
          <div style={sectionLabelStyle}>Day</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => onDayChange('prev-day')}
              disabled={currentDay <= 1}
              style={{ ...btnStyle(false), opacity: currentDay > 1 ? 1 : 0.3, padding: '4px 8px' }}
            >&larr;</button>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, flex: 1, textAlign: 'center' }}>Day {currentDay}</span>
            <button
              onClick={() => onDayChange('next-day')}
              style={{ ...btnStyle(false), padding: '4px 8px' }}
            >&rarr;</button>
          </div>
        </div>
      )}

      {/* Scenario picker */}
      <div>
        <div style={sectionLabelStyle}>Scenario</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SCENARIOS.map((s, i) => (
            <button key={s.id} onClick={() => onScenarioChange(i)} style={btnStyle(i === scenarioIndex)}>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-scenario */}
      <div>
        <div style={sectionLabelStyle}>
          {scenario.id === 'multiple-job' ? 'Job' : scenario.id === 'multi-day' ? 'Day' : scenario.id === 'shift-handoff' ? 'Shift' : 'Role'}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {scenario.subScenarios.map((sub, i) => (
            <button
              key={sub.id}
              onClick={() => onSubScenarioChange(i)}
              style={{
                ...btnStyle(i === subScenarioIndex),
                flex: '1 1 45%', textAlign: 'center',
                background: i === subScenarioIndex ? '#006400' : 'transparent',
                color: i === subScenarioIndex ? '#fff' : '#888',
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarks */}
      <div>
        <div style={sectionLabelStyle}>Jump to state</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => onLoadSnapshot(i)} style={btnStyle(false)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ fontSize: 10, color: '#555', borderTop: '1px solid #333', paddingTop: 8 }}>
        {scenario.description}
      </div>
    </div>
  );
};
