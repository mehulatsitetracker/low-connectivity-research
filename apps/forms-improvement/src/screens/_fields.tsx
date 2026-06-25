import type React from 'react';
import { C, Icons, AccentCard, Toggle, Spinner } from './_bits';

export type FieldState = 'required' | 'saving' | 'complete' | 'error';

const stateMeta = (s: FieldState) => ({
  required: { tone: 'amber' as const, color: C.pendingDeep, label: 'required' },
  saving:   { tone: 'amber' as const, color: C.pendingDeep, label: 'Saving…' },
  complete: { tone: 'green' as const, color: C.complete,    label: 'Complete' },
  error:    { tone: 'red'   as const, color: C.error,       label: 'Error' },
}[s]);

interface FieldCardProps {
  label: string;
  state: FieldState;
  statusOverride?: string;
  children?: React.ReactNode;
  required?: boolean;
  trailing?: React.ReactNode;
}

export function FieldCard({ label, state, statusOverride, children, required = true, trailing }: FieldCardProps) {
  const m = stateMeta(state);
  return (
    <AccentCard tone={m.tone}>
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, lineHeight: 1.35 }}>
              {required && <span style={{ color: C.error, marginRight: 4 }}>*</span>}
              {label}
            </div>
            <div style={{
              fontSize: 12, color: m.color, marginTop: 4,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {state === 'saving' && <Spinner size={11} color={m.color} />}
              {statusOverride ?? m.label}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {trailing}
            <span style={{ color: C.textTertiary }}>{Icons.more()}</span>
          </div>
        </div>
        {children && <div style={{ marginTop: 12 }}>{children}</div>}
      </div>
    </AccentCard>
  );
}

// ---- Specific field renderers ----

export function TextValueField({ label, state, value }: { label: string; state: FieldState; value: string }) {
  return (
    <FieldCard label={label} state={state}>
      <div style={{ fontSize: 14, color: C.textPrimary }}>{value}</div>
    </FieldCard>
  );
}

export function DateTimeField({
  label, state, onFill,
}: { label: string; state: FieldState; onFill?: () => void }) {
  const filled = state === 'complete';
  return (
    <FieldCard label={label} state={state}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Chip onClick={onFill} yellow>Now</Chip>
        <Chip onClick={onFill} icon={filled ? undefined : Icons.calendar(C.textPrimary, 13)}>
          {filled ? '22/06/2026' : 'Add Date'}
        </Chip>
        <Chip onClick={onFill} icon={filled ? undefined : Icons.clock(C.textPrimary, 13)}>
          {filled ? '3:03 PM' : 'Add Time'}
        </Chip>
      </div>
    </FieldCard>
  );
}

export function ConfirmationToggleField({
  label, state, on, onToggle,
}: { label: string; state: FieldState; on: boolean; onToggle?: () => void }) {
  return (
    <FieldCard
      label={label}
      state={state}
      statusOverride={state === 'required' ? 'Confirmation required' : undefined}
    >
      <div
        onClick={onToggle}
        style={{ display: 'inline-block', cursor: onToggle ? 'pointer' : 'default' }}
      >
        <Toggle on={on} />
      </div>
    </FieldCard>
  );
}

export function PhotoField({
  label, state, minRequired = 1, retrying = false, onAdd, onRetry,
}: {
  label: string; state: FieldState; minRequired?: number;
  retrying?: boolean; onAdd?: () => void; onRetry?: () => void;
}) {
  const trailing = Icons.info();
  const statusBase = state === 'required' ? `Minimum Upload (${minRequired}) required` : undefined;
  const status = retrying ? 'Upload retrying…' : statusBase;

  return (
    <FieldCard
      label={label}
      state={retrying ? 'saving' : state}
      statusOverride={status}
      trailing={trailing}
    >
      {state === 'complete' && !retrying && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <AddTile onClick={onAdd} />
          <div style={{ flex: 1 }} />
          <div style={{
            width: 56, height: 56, borderRadius: 6, overflow: 'hidden',
            border: `1px solid ${C.borderLight}`,
            background: 'linear-gradient(135deg, #5C6770 0%, #3E4750 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {Icons.photo('#fff', 24)}
          </div>
          <CountBadge count={1} />
        </div>
      )}
      {state === 'complete' && retrying && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 6, overflow: 'hidden',
            border: `1.5px dashed ${C.pendingDeep}`,
            background: 'linear-gradient(135deg, #5C6770 0%, #3E4750 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            {Icons.photo('#fff', 24)}
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Spinner size={16} color="#fff" />
            </div>
          </div>
          <div style={{ flex: 1, fontSize: 12, color: C.pendingDeep, fontWeight: 600 }}>
            1 photo failed to upload
          </div>
          <button
            onClick={onRetry}
            aria-label="Retry photo upload"
            style={{
              padding: '6px 12px', background: C.pendingDeep, color: '#fff',
              border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
            }}
          >Retry</button>
        </div>
      )}
      {state !== 'complete' && (
        <button
          onClick={onAdd}
          style={{
            width: '100%', padding: '12px 14px', background: C.brandTeal, color: '#fff',
            border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600,
            fontFamily: 'inherit', cursor: onAdd ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {Icons.camera('#fff', 16)} Add Photos
        </button>
      )}
    </FieldCard>
  );
}

export function SignatureField({
  label, state, onSign,
}: { label: string; state: FieldState; onSign?: () => void }) {
  return (
    <FieldCard
      label={label}
      state={state}
      statusOverride={state === 'required' ? 'Signature required' : undefined}
    >
      {state === 'complete' ? (
        <div style={{
          border: `1px solid ${C.borderLight}`, borderRadius: 6,
          padding: '10px 12px', position: 'relative', overflow: 'hidden', minHeight: 72,
        }}>
          <div style={{
            position: 'absolute', inset: 0, padding: 8, lineHeight: 1.35,
            color: '#C8C8C8', fontSize: 10, fontFamily: 'monospace',
            overflow: 'hidden', userSelect: 'none',
          }}>
            CI-004681 Sitetracker 22/06/2026 3:03 PM · CI-004681 Sitetracker 22/06/2026 3:03 PM · CI-004681
            Sitetracker · CI-004681 22/06/2026 · Sitetracker 3:03 PM CI-004681
          </div>
          <div style={{
            position: 'relative', fontFamily: 'cursive', fontSize: 36, fontWeight: 700,
            color: C.textPrimary, textAlign: 'center', letterSpacing: '0.05em',
          }}>JR</div>
        </div>
      ) : (
        <button
          onClick={onSign}
          style={{
            width: '100%', padding: '14px 12px', background: C.surface,
            border: `1px solid ${C.border}`, borderRadius: 6,
            color: C.brandTeal, fontSize: 14, fontWeight: 600,
            fontFamily: 'inherit', cursor: onSign ? 'pointer' : 'default',
          }}
        >Tap to Sign</button>
      )}
    </FieldCard>
  );
}

export function YesNoNAField({
  label, state, value, onSelect,
}: {
  label: string; state: FieldState;
  value?: 'yes' | 'no' | 'na';
  onSelect?: (v: 'yes' | 'no' | 'na') => void;
}) {
  const cell = (key: 'yes' | 'no' | 'na', content: React.ReactNode) => {
    const selected = value === key;
    const isYes = key === 'yes';
    const isNo  = key === 'no';
    let bg: string = C.surface;
    let fg: string = C.textTertiary;
    let border = `1px solid ${C.border}`;
    if (selected && isYes) { bg = '#4CAF50'; fg = '#fff'; border = 'none'; }
    else if (selected && isNo) { bg = '#D45550'; fg = '#fff'; border = 'none'; }
    else if (selected && key === 'na') { bg = '#ECECEE'; fg = C.textPrimary; }

    return (
      <button
        key={key}
        onClick={() => onSelect?.(key)}
        style={{
          flex: 1, height: 44, borderRadius: 6, background: bg, color: fg, border,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: onSelect ? 'pointer' : 'default', fontFamily: 'inherit',
        }}
      >
        {key === 'na' ? content : (
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: selected ? 'rgba(255,255,255,0.25)' : '#D5D7DA',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: selected ? '#fff' : C.textTertiary,
          }}>
            {isYes
              ? Icons.check(selected ? '#fff' : C.textTertiary, 13)
              : Icons.close(selected ? '#fff' : C.textTertiary, 13)}
          </div>
        )}
      </button>
    );
  };

  return (
    <FieldCard label={label} state={state} statusOverride={state === 'required' ? 'required' : undefined}>
      <div style={{ display: 'flex', gap: 8 }}>
        {cell('yes', Icons.check('#fff', 14))}
        {cell('no',  Icons.close('#fff', 14))}
        {cell('na',  <span style={{ fontSize: 11, fontWeight: 700 }}>N/A</span>)}
      </div>
    </FieldCard>
  );
}

export function TextBarcodeField({
  label, state, value, onFill,
}: { label: string; state: FieldState; value?: string; onFill?: () => void }) {
  return (
    <FieldCard label={label} state={state}>
      <div
        onClick={onFill}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, cursor: onFill ? 'pointer' : 'default',
        }}
      >
        <span style={{ fontSize: 14, color: value ? C.textPrimary : C.textTertiary }}>
          {value ?? 'Scan or enter code'}
        </span>
        {Icons.barcode(C.textPrimary, 28)}
      </div>
    </FieldCard>
  );
}

// ---- Small helpers ----

function Chip({
  children, yellow, icon, onClick,
}: { children: React.ReactNode; yellow?: boolean; icon?: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: '0 0 auto', minWidth: 60, padding: '8px 12px',
        borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        background: yellow ? '#FFF6BF' : C.surface,
        color: C.textPrimary,
        border: yellow ? `1px solid #F0D850` : `1px solid ${C.border}`,
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function AddTile({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 56, height: 56, borderRadius: 6,
        border: `1.5px solid ${C.brandTeal}`, background: C.surface,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.brandTeal, fontSize: 24, fontWeight: 300,
        cursor: onClick ? 'pointer' : 'default', fontFamily: 'inherit',
      }}
    >+</button>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        {Icons.camera(C.brandTeal, 18)}
        <div style={{
          position: 'absolute', top: -4, right: -6,
          minWidth: 14, height: 14, borderRadius: 7, background: C.brandTealDeep,
          color: '#fff', fontSize: 9, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
        }}>{count}</div>
      </div>
    </div>
  );
}
