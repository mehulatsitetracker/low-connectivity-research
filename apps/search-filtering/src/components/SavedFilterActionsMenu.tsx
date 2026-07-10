import { colors } from '../theme';

interface SavedFilterActionsMenuProps {
  hasCurrentFilters: boolean;
  onRename: () => void;
  onReplace: () => void;
  onDelete: () => void;
  onClose: () => void;
}

function MenuItem({
  label,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '14px 16px',
        border: 'none',
        background: 'none',
        cursor: disabled ? 'default' : 'pointer',
        textAlign: 'left',
        fontSize: 15,
        color: disabled ? colors.textTertiary : danger ? colors.error : colors.textPrimary,
      }}
    >
      {label}
    </button>
  );
}

export function SavedFilterActionsMenu({
  hasCurrentFilters,
  onRename,
  onReplace,
  onDelete,
  onClose,
}: SavedFilterActionsMenuProps) {
  const dispatch = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: colors.overlay,
          zIndex: 105,
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.surface,
        borderRadius: '12px 12px 0 0',
        zIndex: 106,
        paddingBottom: 8,
        overflow: 'hidden',
      }}>
        <MenuItem label="Rename" onClick={() => dispatch(onRename)} />
        <MenuItem
          label="Replace with Current Filters"
          onClick={() => dispatch(onReplace)}
          disabled={!hasCurrentFilters}
        />
        <div style={{ borderTop: `1px solid ${colors.borderLight}` }}>
          <MenuItem label="Delete" onClick={() => dispatch(onDelete)} danger />
        </div>
      </div>
    </>
  );
}
