import { colors } from '../theme';

interface HelpAgentToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
}

/**
 * Sidebar switch (Developer Settings) that shows or hides the contextual
 * "Help Agent" button across every blocker screen.
 */
export function HelpAgentToggle({ checked, onChange }: HelpAgentToggleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: 13, color: '#4A4A4A' }}>Show “Help Agent” button</span>
      <button
        role="switch"
        aria-checked={checked}
        aria-label="Show Help Agent button"
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative', width: 40, height: 22, flexShrink: 0,
          borderRadius: 11, border: 'none', cursor: 'pointer', padding: 0,
          background: checked ? colors.brandTeal : '#C4C7C5',
          transition: 'background 0.15s ease',
        }}
      >
        <span
          style={{
            position: 'absolute', top: 2, left: checked ? 20 : 2,
            width: 18, height: 18, borderRadius: '50%', background: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.25)', transition: 'left 0.15s ease',
          }}
        />
      </button>
    </div>
  );
}
