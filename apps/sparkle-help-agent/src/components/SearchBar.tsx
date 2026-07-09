import { colors, radii } from '../theme';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: radii.input,
      margin: '12px 16px',
    }}>
      <Search size={18} color={colors.textTertiary} />
      <span style={{ fontSize: 15, color: colors.textTertiary }}>{placeholder}</span>
    </div>
  );
}
