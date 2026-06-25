import { C, Icons } from './_bits';

export function SessionExpiredModal({
  onSignIn, onCancel,
}: {
  onSignIn: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div
        onClick={onCancel}
        style={{ position: 'absolute', inset: 0, background: C.overlay, zIndex: 30, cursor: 'pointer' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Session expired"
        style={{
          position: 'absolute', left: 16, right: 16, top: '38%',
          zIndex: 31, background: C.surface, borderRadius: 12,
          padding: 18, display: 'flex', flexDirection: 'column', gap: 12,
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ paddingTop: 2 }}>{Icons.warningTri()}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, lineHeight: 1.3 }}>
              Session expired
            </div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 6, lineHeight: 1.45 }}>
              You've been signed out. Your draft is safe on this device — sign in again to continue and sync.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px 12px',
              background: 'transparent', color: C.textSecondary,
              border: `1px solid ${C.border}`, borderRadius: 6,
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            }}
          >Not now</button>
          <button
            onClick={onSignIn}
            style={{
              flex: 1, padding: '10px 12px',
              background: C.brandTeal, color: '#fff', border: 'none',
              borderRadius: 6, fontSize: 14, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
            }}
          >Sign in</button>
        </div>
      </div>
    </>
  );
}
