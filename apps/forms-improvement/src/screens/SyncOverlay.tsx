import { C, Icons, IconBtn, Spinner, spinKeyframes } from './_bits';

export type SyncStatus = 'idle' | 'syncing' | 'error';

export interface ErroredForm {
  id: string;
  title: string;
  site: string;
}

export function SyncStatusBanner({
  status, errorCount, onClickError,
}: {
  status: SyncStatus;
  errorCount: number;
  onClickError: () => void;
}) {
  if (status === 'idle') return null;
  return (
    <>
      {spinKeyframes}
      {status === 'syncing'
        ? <SyncingRow />
        : <ErrorRow count={errorCount} onClick={onClickError} />}
    </>
  );
}

function SyncingRow() {
  return (
    <div style={{
      background: C.brandTealLight, padding: '8px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: `1px solid ${C.brandTeal}33`, flexShrink: 0,
    }}>
      <Spinner size={12} color={C.brandTealDeep} />
      <div style={{ fontSize: 12, color: C.brandTealDeep, fontWeight: 600, flex: 1 }}>
        Form is syncing…
      </div>
      <div style={{ fontSize: 11, color: C.brandTealDeep, opacity: 0.7 }}>1 of 3</div>
    </div>
  );
}

function ErrorRow({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.errorBg, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1px solid ${C.error}33`, flexShrink: 0,
        width: '100%', textAlign: 'left',
        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
      }}
    >
      <span style={{ color: C.error, fontSize: 14, fontWeight: 700 }}>⚠</span>
      <div style={{ fontSize: 12, color: C.error, fontWeight: 600, flex: 1, lineHeight: 1.35 }}>
        Sync failed — {count} form{count === 1 ? '' : 's'} need{count === 1 ? 's' : ''} your attention.
        <span style={{ display: 'block', fontWeight: 500, marginTop: 2, opacity: 0.9 }}>
          Tap to review
        </span>
      </div>
      {Icons.chevronRight(C.error, 14)}
    </button>
  );
}

export function ErrorFormsSheet({
  forms, onClose, onOpenForm,
}: {
  forms: ErroredForm[];
  onClose: () => void;
  onOpenForm: (id: string) => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: C.overlay, zIndex: 20, cursor: 'pointer' }}
      />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 21,
        background: C.surface, borderRadius: '14px 14px 0 0',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        maxHeight: '70%',
      }}>
        <div style={{
          padding: '14px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: `1px solid ${C.borderLight}`,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Sync failed</div>
            <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2 }}>
              {forms.length} form{forms.length === 1 ? '' : 's'} need{forms.length === 1 ? 's' : ''} your attention
            </div>
          </div>
          <IconBtn onClick={onClose}>{Icons.close()}</IconBtn>
        </div>
        <div style={{ overflowY: 'auto', minHeight: 0, padding: '4px 0' }}>
          {forms.map(f => (
            <button
              key={f.id}
              onClick={() => onOpenForm(f.id)}
              style={{
                width: '100%', textAlign: 'left',
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: `1px solid ${C.borderLight}`, border: 'none',
                borderLeft: 'none', borderRight: 'none', borderTop: 'none',
                background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.error, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, lineHeight: 1.3 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{f.site}</div>
              </div>
              {Icons.chevronRight(C.textTertiary, 14)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
