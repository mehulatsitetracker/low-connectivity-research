import { useEffect, useRef, useState } from 'react';
import { colors, radii } from '../theme';

interface SaveFilterModalProps {
  open: boolean;
  initialName?: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function SaveFilterModal({
  open,
  initialName = '',
  onSave,
  onCancel,
}: SaveFilterModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (!open) return;
    setName(initialName);
    const timer = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(timer);
  }, [open, initialName]);

  if (!open) return null;

  const trimmed = name.trim();
  const canSave = trimmed.length > 0;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div
        onClick={onCancel}
        style={{ position: 'absolute', inset: 0, background: colors.overlay }}
      />
      <div
        role="dialog"
        aria-labelledby="save-filter-title"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 320,
          background: colors.surface,
          borderRadius: radii.modal,
          padding: '20px 20px 16px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
        }}
      >
        <div
          id="save-filter-title"
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: colors.textPrimary,
            marginBottom: 16,
          }}
        >
          Save Filter
        </div>

        <label
          htmlFor="filter-name-input"
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: colors.textSecondary,
            marginBottom: 6,
          }}
        >
          Filter Name
        </label>
        <input
          id="filter-name-input"
          ref={inputRef}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && canSave) onSave(trimmed);
          }}
          placeholder="e.g. Unassigned downtown"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${colors.border}`,
            borderRadius: radii.input,
            fontSize: 15,
            color: colors.textPrimary,
            background: colors.surface,
            marginBottom: 20,
            outline: 'none',
          }}
        />

        <button
          type="button"
          disabled={!canSave}
          onClick={() => onSave(trimmed)}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: radii.pill,
            border: 'none',
            background: canSave ? colors.brandTeal : colors.border,
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            cursor: canSave ? 'pointer' : 'default',
            marginBottom: 10,
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: radii.pill,
            border: `1px solid ${colors.border}`,
            background: colors.surface,
            color: colors.textPrimary,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
