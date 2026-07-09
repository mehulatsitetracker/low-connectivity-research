import { Plus } from 'lucide-react';
import { colors, spacing } from '../theme';

interface FabProps {
  onClick: () => void;
}

export function Fab({ onClick }: FabProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Quick actions"
      style={{
        position: 'absolute',
        right: 20,
        bottom: spacing.bottomNavHeight + 24,
        width: 60,
        height: 60,
        borderRadius: '50%',
        border: 'none',
        background: colors.brandTeal,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        zIndex: 10,
      }}
    >
      <Plus size={30} color="#fff" strokeWidth={2.5} />
    </button>
  );
}
