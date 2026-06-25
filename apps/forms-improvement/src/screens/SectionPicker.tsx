import type { Variant } from '../types';
import { C, Icons, IconBtn } from './_bits';
import { Section } from './Section';
import type { SectionIndex, FieldsMap } from './Section';
import { isComplete } from './Section';

type Tone = 'green' | 'amber' | 'red';

interface ToCEntry {
  key: string;
  text: string;
  warning?: boolean;
}

interface ToCSectionDef {
  name: string;
  entries: ToCEntry[];
}

const TOC: ToCSectionDef[] = [
  {
    name: 'General',
    entries: [
      { key: 's1-site-details',  text: 'Site details' },
      { key: 's1-time',          text: 'Time' },
      { key: 's1-confirmation',  text: 'Hope you have completed the inspection form!' },
      { key: 's1-photo',         text: 'Photo (min 1)' },
      { key: 's1-signature',     text: 'Signature' },
    ],
  },
  {
    name: 'Inspection Checklist',
    entries: [
      { key: 's2-date',       text: 'Date of Maintenance' },
      { key: 's2-charger',    text: 'Charger ID / Serial' },
      { key: 's2-equipment',  text: 'Equipment serial number', warning: true },
      { key: 's2-technician', text: 'Maintenance technician' },
    ],
  },
  {
    name: 'Safety Checks',
    entries: [
      { key: 's3-grounding',   text: 'Grounding checks' },
      { key: 's3-electrical',  text: 'Electrical safety tests' },
      { key: 's3-emergency',   text: 'Emergency stop button functionality' },
      { key: 's3-warning',     text: 'Warning label visibility' },
      { key: 's3-photo',       text: 'Safety photos' },
      { key: 's3-signature',   text: 'Sign out' },
    ],
  },
];

function toneFor(key: string, fields: FieldsMap): Tone {
  // Demo: a 'no' on Emergency stop is treated as a blocking error.
  if (key === 's3-emergency' && fields[key] === 'no') return 'red';
  return isComplete(key, fields) ? 'green' : 'amber';
}

interface Props {
  variant: Variant;
  currentSection: SectionIndex;
  fields: FieldsMap;
  savingKeys: Set<string>;
  onClose: () => void;
  onJump: (i: SectionIndex) => void;
}

export function SectionPicker({ variant, currentSection, fields, savingKeys, onClose, onJump }: Props) {
  const isImproved = variant === 'improved';
  const noop = () => {};

  return (
    <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Underlying section, rendered live so the dim reflects the user's actual progress. */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        pointerEvents: 'none',
      }}>
        <Section
          variant={variant}
          sectionIndex={currentSection}
          fields={fields}
          savingKeys={savingKeys}
          setField={noop}
          onBack={noop}
          onNext={noop}
          onOpenToC={noop}
        />
      </div>

      {/* Dim overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, background: C.overlay,
          zIndex: 1, cursor: 'pointer',
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        zIndex: 2, display: 'flex', flexDirection: 'column',
      }}>
        {isImproved
          ? <ToCSheet fields={fields} onClose={onClose} onJump={onJump} />
          : <FlatSheet currentSection={currentSection} onClose={onClose} onJump={onJump} />}
      </div>
    </div>
  );
}

// ---------- Flat sheet (now variant) ----------
// Updated per request: lists all 3 sections, no Cancel.
function FlatSheet({
  currentSection, onClose, onJump,
}: {
  currentSection: SectionIndex;
  onClose: () => void;
  onJump: (i: SectionIndex) => void;
}) {
  const sections = ['General', 'Inspection Checklist', 'Safety Checks'];
  return (
    <div style={{ background: C.surface, borderRadius: '12px 12px 0 0', flexShrink: 0 }}>
      <div style={{
        padding: '12px 16px', display: 'flex', justifyContent: 'flex-end',
        borderBottom: `1px solid ${C.borderLight}`,
      }}>
        <IconBtn onClick={onClose}>{Icons.close()}</IconBtn>
      </div>
      {sections.map((name, i) => (
        <button
          key={name}
          onClick={() => onJump(i as SectionIndex)}
          style={{
            width: '100%', textAlign: 'left',
            padding: '16px 18px', display: 'flex', justifyContent: 'space-between',
            borderBottom: `1px solid ${C.borderLight}`, borderTop: 'none',
            borderLeft: 'none', borderRight: 'none',
            background: 'transparent', fontSize: 15, color: C.textPrimary,
            fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          <span>{name}</span>
          {i === currentSection && Icons.check(C.complete, 18)}
        </button>
      ))}
    </div>
  );
}

// ---------- ToC sheet (improved variant) ----------
export function ToCSheet({
  fields, onClose, onJump,
}: {
  fields: FieldsMap;
  onClose: () => void;
  onJump: (i: SectionIndex) => void;
}) {
  return (
    <div style={{
      background: C.surface, borderRadius: '14px 14px 0 0',
      maxHeight: 540, display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{
        padding: '14px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `1px solid ${C.borderLight}`,
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Table of Contents</div>
          <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2 }}>Tap any item to jump to it</div>
        </div>
        <IconBtn onClick={onClose}>{Icons.close()}</IconBtn>
      </div>

      <div style={{ overflowY: 'auto', minHeight: 0, padding: '4px 0' }}>
        {TOC.map((s, i) => (
          <ToCSectionRow key={s.name} section={s} fields={fields} onJump={() => onJump(i as SectionIndex)} />
        ))}
      </div>

      <div style={{
        padding: '10px 16px', borderTop: `1px solid ${C.borderLight}`,
        display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, color: C.textSecondary, background: C.surfaceAlt,
      }}>
        <LegendDot tone="green" label="Complete" />
        <LegendDot tone="amber" label="Pending" />
        <LegendDot tone="red"   label="Error" />
      </div>
    </div>
  );
}

function ToCSectionRow({
  section, fields, onJump,
}: {
  section: ToCSectionDef;
  fields: FieldsMap;
  onJump: () => void;
}) {
  const tones = section.entries.map(e => toneFor(e.key, fields));
  const rollup: Tone = tones.includes('red') ? 'red' : tones.includes('amber') ? 'amber' : 'green';
  const totals = {
    done: tones.filter(t => t === 'green').length,
    total: tones.length,
  };

  return (
    <div>
      <div style={{
        padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: C.surfaceAlt, borderBottom: `1px solid ${C.borderLight}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Dot tone={rollup} />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, letterSpacing: '0.2px' }}>
            {section.name.toUpperCase()}
          </span>
        </div>
        <span style={{ fontSize: 11, color: C.textSecondary }}>{totals.done}/{totals.total}</span>
      </div>
      {section.entries.map((e, i) => {
        const tone = toneFor(e.key, fields);
        return (
          <button
            key={i}
            onClick={onJump}
            style={{
              width: '100%', textAlign: 'left',
              padding: '11px 16px 11px 32px', display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: `1px solid ${C.borderLight}`, borderTop: 'none',
              borderLeft: 'none', borderRight: 'none',
              background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <Dot tone={tone} />
            <div style={{ flex: 1, fontSize: 13, color: C.textPrimary, lineHeight: 1.4 }}>
              {e.text}
              {e.warning && (
                <span style={{
                  marginLeft: 8, fontSize: 10, fontWeight: 700,
                  color: C.warningDeep, background: C.warningBg,
                  padding: '1px 6px', borderRadius: 3, letterSpacing: '0.4px',
                }}>WARNING</span>
              )}
            </div>
            {Icons.chevronRight(C.textTertiary, 14)}
          </button>
        );
      })}
    </div>
  );
}

function Dot({ tone }: { tone: Tone }) {
  const color = { green: C.complete, amber: C.pending, red: C.error }[tone];
  return <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />;
}

function LegendDot({ tone, label }: { tone: Tone; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Dot tone={tone} /> <span>{label}</span>
    </div>
  );
}
