import { Sparkles } from 'lucide-react';
import { colors, radii } from '../theme';
import { useHelpAgentButtonVisible } from '../help-agent-context';

interface AskSparkleButtonProps {
  onClick: () => void;
  label?: string;
  /** 'light' sits on a dark banner; 'default' sits on a light surface. */
  tone?: 'default' | 'light';
}

/**
 * Contextual "Help Agent" affordance — dropped next to a blocker so the user
 * can jump straight into the Help agent's screen-context flow for that problem.
 * Hidden when the Developer Settings toggle turns it off.
 */
export function AskSparkleButton({ onClick, label = 'Help Agent', tone = 'default' }: AskSparkleButtonProps) {
  const visible = useHelpAgentButtonVisible();
  if (!visible) return null;

  const light = tone === 'light';
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 13px', borderRadius: radii.pill,
        border: `1px solid ${light ? 'rgba(255,255,255,0.4)' : colors.brandTeal}`,
        background: light ? 'rgba(255,255,255,0.12)' : colors.brandTealLight,
        color: light ? '#fff' : colors.brandTeal,
        fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >
      <Sparkles size={15} color={light ? '#fff' : colors.brandTeal} />
      {label}
    </button>
  );
}
