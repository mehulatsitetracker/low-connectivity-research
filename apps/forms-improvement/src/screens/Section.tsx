import { useEffect, useRef } from 'react';
import type { Variant, NetworkStatus } from '../types';
import { C, TopBar, PrimaryButton, Icons, spinKeyframes, RetryChip } from './_bits';
import {
  TextValueField, DateTimeField, ConfirmationToggleField,
  PhotoField, SignatureField, YesNoNAField, TextBarcodeField,
} from './_fields';
import type { FieldState } from './_fields';

export type SectionIndex = 0 | 1 | 2;
export type FieldsMap = Record<string, boolean | 'yes' | 'no' | 'na'>;

const NAMES = ['General', 'Inspection Checklist', 'Safety Checks'] as const;

// Field keys per section — kept in one place so FormDetail can count completion too.
export const SECTION_KEYS: ReadonlyArray<readonly string[]> = [
  ['s1-site-details', 's1-time', 's1-confirmation', 's1-photo', 's1-signature'],
  ['s2-date', 's2-charger', 's2-equipment', 's2-technician'],
  ['s3-grounding', 's3-electrical', 's3-emergency', 's3-warning', 's3-photo', 's3-signature'],
];

// Always-prefilled keys (loaded from the parent record, not user-entered).
export const PREFILLED = new Set(['s1-site-details', 's2-technician']);

export function isComplete(key: string, fields: FieldsMap): boolean {
  if (PREFILLED.has(key)) return true;
  const v = fields[key];
  return v === true || v === 'yes' || v === 'no' || v === 'na';
}

export function sectionCounts(idx: SectionIndex, fields: FieldsMap, savingKeys: Set<string> = new Set()) {
  const keys = SECTION_KEYS[idx];
  // A saving field is in flight — not yet "done" from the server's perspective.
  const done = keys.filter(k => isComplete(k, fields) && !savingKeys.has(k)).length;
  const saving = keys.filter(k => savingKeys.has(k)).length;
  return { done, total: keys.length, saving };
}

interface Props {
  variant: Variant;
  sectionIndex: SectionIndex;
  fields: FieldsMap;
  savingKeys: Set<string>;
  retryingKeys?: Set<string>;
  networkStatus?: NetworkStatus;
  focusedKey?: string;
  focusNonce?: number;
  setField: (key: string, value: boolean | 'yes' | 'no' | 'na') => void;
  onBack: () => void;
  onNext: () => void;
  onOpenToC: () => void;
  onFieldRetry?: (key: string) => void;
  disabled?: boolean;
}

export function Section({
  variant, sectionIndex, fields, savingKeys,
  retryingKeys = new Set(),
  networkStatus = 'online',
  focusedKey, focusNonce = 0,
  setField, onBack, onNext, onOpenToC, onFieldRetry,
}: Props) {
  const isImproved = variant === 'improved';
  const isLast = sectionIndex === 2;
  const isOffline = networkStatus === 'offline';
  // Suppress retry indicators when offline — the OfflineBanner takes precedence.
  const effectiveRetryingKeys = isOffline ? new Set<string>() : retryingKeys;
  const specs = buildFields(sectionIndex, fields, savingKeys, effectiveRetryingKeys, setField, onFieldRetry);

  const { done, total, saving } = sectionCounts(sectionIndex, fields, savingKeys);
  const pending = total - done - saving;
  const allComplete = done === total;
  const hasSaving = saving > 0;

  const pill = !isImproved ? undefined
    : allComplete ? { tone: 'green' as const, text: 'Section complete' }
    : hasSaving   ? { tone: 'amber' as const, text: `Saving ${saving}…` }
    :               { tone: 'amber' as const, text: `${pending} pending` };

  const buttonLabel = isLast
    ? (isImproved ? 'Submit & sync' : 'Close')
    : `Next Section: ${NAMES[sectionIndex + 1]}`;
  const buttonIcon = isLast && isImproved ? Icons.upload() : undefined;

  // Retry chip is a feature of the batched/Improved model (and suppressed offline).
  const sectionRetryCount = isImproved
    ? SECTION_KEYS[sectionIndex].filter(k => effectiveRetryingKeys.has(k)).length
    : 0;

  // Field refs for ToC anchor-scroll + flash highlight.
  const fieldRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  useEffect(() => {
    if (!focusedKey) return;
    const el = fieldRefs.current.get(focusedKey);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.animation = 'none';
    // Force reflow so the animation can restart on each focus request.
    void el.offsetWidth;
    el.style.animation = 'fi-flash 1500ms ease-out';
  }, [focusedKey, focusNonce]);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: C.background }}>
      {spinKeyframes}
      <TopBar title="" dark={false} onBack={onBack} />

      <SectionHeaderBar
        name={NAMES[sectionIndex]}
        isImproved={isImproved}
        pill={pill}
        retryCount={sectionRetryCount}
        onOpenToC={onOpenToC}
      />

      <div style={{
        flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {specs.map((f, i) => (
          <div
            key={i}
            ref={el => { fieldRefs.current.set(f.fieldKey, el); }}
            style={{ borderRadius: 6 }}
          >
            {renderField(f, i)}
          </div>
        ))}

        <div style={{ marginTop: 8, flexShrink: 0 }}>
          <PrimaryButton onClick={onNext} iconRight={buttonIcon}>
            {buttonLabel}
          </PrimaryButton>
        </div>

        {isImproved && (
          <div style={{
            fontSize: 11.5, color: C.textSecondary, flexShrink: 0,
            textAlign: 'center', lineHeight: 1.5, padding: '4px 8px 16px',
          }}>
            {isLast
              ? 'Pressing Submit syncs the entire form once.'
              : 'Changes are kept on this device until you submit on the last section.'}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- field specs / rendering ----------

type FieldSpec =
  | { fieldKey: string; kind: 'text-value';   label: string; state: FieldState; value: string }
  | { fieldKey: string; kind: 'datetime';     label: string; state: FieldState; onFill?: () => void }
  | { fieldKey: string; kind: 'toggle';       label: string; state: FieldState; on: boolean; onToggle?: () => void }
  | { fieldKey: string; kind: 'text-barcode'; label: string; state: FieldState; value?: string; onFill?: () => void }
  | { fieldKey: string; kind: 'yes-no-na';    label: string; state: FieldState; value?: 'yes' | 'no' | 'na'; onSelect?: (v: 'yes' | 'no' | 'na') => void }
  | { fieldKey: string; kind: 'photo';        label: string; state: FieldState; minRequired?: number; retrying?: boolean; onAdd?: () => void; onRetry?: () => void }
  | { fieldKey: string; kind: 'signature';    label: string; state: FieldState; onSign?: () => void };

function buildFields(
  idx: SectionIndex, fields: FieldsMap, savingKeys: Set<string>,
  retryingKeys: Set<string>,
  setField: (k: string, v: boolean | 'yes' | 'no' | 'na') => void,
  onFieldRetry?: (k: string) => void,
): FieldSpec[] {
  const state = (k: string): FieldState => {
    if (savingKeys.has(k)) return 'saving';
    return isComplete(k, fields) ? 'complete' : 'required';
  };
  const ynaValue = (k: string): 'yes' | 'no' | 'na' | undefined => {
    const v = fields[k];
    return v === 'yes' || v === 'no' || v === 'na' ? v : undefined;
  };
  const isFilledOrSaving = (k: string) => fields[k] !== undefined || savingKeys.has(k);
  // Now variant locks a field while it's saving — passing undefined as the
  // handler drops clicks AND switches the cursor off pointer in _fields.tsx.
  const locked = (k: string) => savingKeys.has(k);
  const photoSpec = (key: string, label: string): FieldSpec => ({
    fieldKey: key, kind: 'photo', label,
    state: state(key), minRequired: 1,
    retrying: retryingKeys.has(key),
    onAdd: locked(key) ? undefined : () => setField(key, true),
    onRetry: onFieldRetry ? () => onFieldRetry(key) : undefined,
  });

  if (idx === 0) {
    return [
      { fieldKey: 's1-site-details', kind: 'text-value', label: 'Site details', state: 'complete', value: 'WeWork Prestige Central' },
      { fieldKey: 's1-time', kind: 'datetime', label: 'Time',
        state: state('s1-time'),
        onFill: locked('s1-time') ? undefined : () => setField('s1-time', true) },
      { fieldKey: 's1-confirmation', kind: 'toggle', label: 'Hope you have completed the inspection form!',
        state: state('s1-confirmation'),
        on: fields['s1-confirmation'] === true,
        onToggle: locked('s1-confirmation') ? undefined : () => setField('s1-confirmation', !(fields['s1-confirmation'] === true)) },
      photoSpec('s1-photo', 'Photo'),
      { fieldKey: 's1-signature', kind: 'signature', label: 'Signature',
        state: state('s1-signature'),
        onSign: locked('s1-signature') ? undefined : () => setField('s1-signature', true) },
    ];
  }

  if (idx === 1) {
    return [
      { fieldKey: 's2-date', kind: 'datetime', label: 'Date of Maintenance',
        state: state('s2-date'),
        onFill: locked('s2-date') ? undefined : () => setField('s2-date', true) },
      { fieldKey: 's2-charger', kind: 'text-barcode', label: 'Charger ID / Serial Number',
        state: state('s2-charger'),
        value: isFilledOrSaving('s2-charger') ? '29474920192' : undefined,
        onFill: locked('s2-charger') ? undefined : () => setField('s2-charger', true) },
      { fieldKey: 's2-equipment', kind: 'text-barcode', label: 'Equipment serial number',
        state: state('s2-equipment'),
        value: isFilledOrSaving('s2-equipment') ? 'CI-004681' : undefined,
        onFill: locked('s2-equipment') ? undefined : () => setField('s2-equipment', true) },
      { fieldKey: 's2-technician', kind: 'text-value', label: 'Maintenance technician',
        state: 'complete', value: 'Vishal Rathor' },
    ];
  }

  return [
    { fieldKey: 's3-grounding', kind: 'yes-no-na', label: 'Grounding checks.',
      state: state('s3-grounding'),
      value: ynaValue('s3-grounding'),
      onSelect: locked('s3-grounding') ? undefined : v => setField('s3-grounding', v) },
    { fieldKey: 's3-electrical', kind: 'yes-no-na', label: 'Electrical safety tests.',
      state: state('s3-electrical'),
      value: ynaValue('s3-electrical'),
      onSelect: locked('s3-electrical') ? undefined : v => setField('s3-electrical', v) },
    { fieldKey: 's3-emergency', kind: 'yes-no-na', label: 'Emergency stop button functionality.',
      state: state('s3-emergency'),
      value: ynaValue('s3-emergency'),
      onSelect: locked('s3-emergency') ? undefined : v => setField('s3-emergency', v) },
    { fieldKey: 's3-warning', kind: 'yes-no-na', label: 'Warning label visibility.',
      state: state('s3-warning'),
      value: ynaValue('s3-warning'),
      onSelect: locked('s3-warning') ? undefined : v => setField('s3-warning', v) },
    photoSpec('s3-photo', 'Safety Photos'),
    { fieldKey: 's3-signature', kind: 'signature', label: 'Sign Out',
      state: state('s3-signature'),
      onSign: locked('s3-signature') ? undefined : () => setField('s3-signature', true) },
  ];
}

function renderField(f: FieldSpec, key: number) {
  switch (f.kind) {
    case 'text-value':   return <TextValueField key={key} label={f.label} state={f.state} value={f.value} />;
    case 'datetime':     return <DateTimeField  key={key} label={f.label} state={f.state} onFill={f.onFill} />;
    case 'toggle':       return <ConfirmationToggleField key={key} label={f.label} state={f.state} on={f.on} onToggle={f.onToggle} />;
    case 'text-barcode': return <TextBarcodeField key={key} label={f.label} state={f.state} value={f.value} onFill={f.onFill} />;
    case 'yes-no-na':    return <YesNoNAField   key={key} label={f.label} state={f.state} value={f.value} onSelect={f.onSelect} />;
    case 'photo':        return <PhotoField     key={key} label={f.label} state={f.state} minRequired={f.minRequired} retrying={f.retrying} onAdd={f.onAdd} onRetry={f.onRetry} />;
    case 'signature':    return <SignatureField key={key} label={f.label} state={f.state} onSign={f.onSign} />;
  }
}

// Section header bar — tap-anywhere opens the picker / ToC overlay.
function SectionHeaderBar({
  name, isImproved, pill, retryCount, onOpenToC,
}: {
  name: string;
  isImproved: boolean;
  pill?: { tone: 'amber' | 'green'; text: string };
  retryCount: number;
  onOpenToC: () => void;
}) {
  const pillFg = pill?.tone === 'green' ? C.complete    : C.pendingDeep;
  const pillBg = pill?.tone === 'green' ? C.completeBg  : C.pendingBg;

  return (
    <button
      onClick={onOpenToC}
      aria-label="Open Table of Contents"
      style={{
        width: '100%', background: C.surface, padding: '12px 14px',
        borderBottom: `1px solid ${C.borderLight}`, borderTop: 'none',
        borderLeft: 'none', borderRight: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {isImproved && Icons.formIcon(C.textPrimary, 15)}
        <span style={{ fontSize: 14, fontWeight: isImproved ? 600 : 400, color: C.textPrimary }}>
          {name}
        </span>
        {pill && (
          <span style={{
            fontSize: 11, color: pillFg, background: pillBg,
            padding: '2px 6px', borderRadius: 4, fontWeight: 700,
          }}>{pill.text}</span>
        )}
        {retryCount > 0 && <RetryChip count={retryCount} />}
      </div>
      {Icons.caretDown(C.textSecondary, 14)}
    </button>
  );
}
