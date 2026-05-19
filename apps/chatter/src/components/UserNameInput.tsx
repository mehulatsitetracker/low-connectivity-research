import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { colors } from '../theme';

interface UserNameInputProps {
  value: string;
  onChange: (name: string) => void;
}

export function UserNameInput({ value, onChange }: UserNameInputProps) {
  // Local state so typing feels snappy; commit on 400ms debounce.
  const [local, setLocal] = useState(value);

  // Sync external changes (rare in this prototype, but correct).
  useEffect(() => { setLocal(value); }, [value]);

  // Debounce commits so we don't dispatch on every keystroke.
  useEffect(() => {
    if (local === value) return;
    const t = setTimeout(() => onChange(local), 400);
    return () => clearTimeout(t);
  }, [local, value, onChange]);

  return (
    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.borderLight}` }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
        textTransform: 'uppercase', color: colors.textSecondary, marginBottom: 6,
      }}>
        Your name
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: colors.surface, border: `1px solid ${colors.border}`,
        borderRadius: 6, padding: '8px 10px',
      }}>
        <User size={16} color={colors.textTertiary} />
        <input
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="You"
          style={{
            flex: 1, border: 'none', outline: 'none', fontSize: 14,
            background: 'transparent', color: colors.textPrimary,
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
