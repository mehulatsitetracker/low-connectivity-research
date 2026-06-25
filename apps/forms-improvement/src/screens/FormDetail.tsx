import { useEffect, useRef, useState } from 'react';
import type { Variant, NetworkStatus } from '../types';
import { C, TopBar, Pill, Icons, IconBtn, spinKeyframes } from './_bits';
import type { SectionIndex, FieldsMap } from './Section';
import { sectionCounts } from './Section';
import { ToCSheet } from './SectionPicker';

interface SectionRow {
  number: number;
  name: string;
  completed: number;
  total: number;
}

interface Props {
  variant: Variant;
  submitted: boolean;
  submitError: boolean;
  missingCount: number;
  fields: FieldsMap;
  savingKeys: Set<string>;
  retryingKeys?: Set<string>;
  networkStatus: NetworkStatus;
  openToCRequest?: number;
  onBack: () => void;
  onOpenSection: (i: SectionIndex, fieldKey?: string) => void;
  onFieldRetry?: (key: string) => void;
}

export function FormDetail({
  variant, submitted, submitError, missingCount, fields, savingKeys,
  retryingKeys = new Set(),
  networkStatus, openToCRequest = 0,
  onBack, onOpenSection, onFieldRetry,
}: Props) {
  const isImproved = variant === 'improved';
  const [tocOpen, setTocOpen] = useState(false);
  const openToC = () => setTocOpen(true);
  const closeToC = () => setTocOpen(false);
  const jumpFromToC = (i: SectionIndex, fieldKey?: string) => {
    setTocOpen(false);
    onOpenSection(i, fieldKey);
  };

  // External nudge — open the ToC only when openToCRequest changes during this
  // mount, not on a fresh remount with the same persisted value.
  const lastSeenToCRequest = useRef(openToCRequest);
  useEffect(() => {
    if (openToCRequest !== lastSeenToCRequest.current) {
      lastSeenToCRequest.current = openToCRequest;
      if (openToCRequest > 0) setTocOpen(true);
    }
  }, [openToCRequest]);

  const sections: SectionRow[] = ([0, 1, 2] as const).map(i => {
    const c = sectionCounts(i, fields, savingKeys);
    return {
      number: i + 1,
      name: ['General', 'Inspection Checklist', 'Safety Checks'][i],
      completed: c.done,
      total: c.total,
    };
  });

  const totalDone    = sections.reduce((a, s) => a + s.completed, 0);
  const totalPending = sections.reduce((a, s) => a + (s.total - s.completed), 0);
  const userFilledAny = Object.keys(fields).length > 0;
  const inProgress = userFilledAny || submitted;

  const changedCount = Object.keys(fields).length;
  // Draft pill only shows when there are user-modified fields AND the form
  // hasn't been submitted yet. Post-submit (syncing/synced/error) the draft
  // is no longer just-on-device, so the indicator goes away.
  const showDraftPill = isImproved && changedCount > 0 && !submitted;
  const isOffline = networkStatus === 'offline';

  return (
    <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', background: C.background }}>
      {spinKeyframes}
      <TopBar
        title=""
        dark={false}
        onBack={onBack}
        trailing={<IconBtn title="More">{Icons.more()}</IconBtn>}
      />

      <div style={{ padding: '16px 16px 10px', background: C.surface, borderBottom: `1px solid ${C.borderLight}`, flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.textPrimary, lineHeight: 1.35, marginBottom: 6 }}>
          Site Check-Out Form from Template ID:<br />a0gf6000000ZOUMAA4
        </div>
        <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 8 }}>WeWork Prestige Central</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Pill tone={inProgress ? 'amber' : 'gray'}>
            {inProgress ? 'In progress' : 'Not started'}
          </Pill>
          {showDraftPill && (
            isOffline
              ? <SavedWaitingChip />
              : <DraftChip count={changedCount} />
          )}
        </div>
      </div>

      {isImproved && (
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.borderLight}`, flexShrink: 0 }}>
          <button
            onClick={openToC}
            style={{
              width: '100%', padding: '14px 16px',
              background: 'transparent', color: C.brandTealDeep,
              border: 'none',
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              textAlign: 'left',
            }}
          >
            <span>Table of Contents</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: C.textSecondary, fontWeight: 500 }}>
                {totalPending} pending · {totalDone} done
              </span>
              {Icons.chevronRight(C.brandTealDeep, 16)}
            </span>
          </button>
          {submitError && (
            <div style={{ padding: '0 14px 12px' }}>
              <InlineMissingFields missing={missingCount} />
            </div>
          )}
        </div>
      )}

      <div style={{
        flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        padding: 12, display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          background: C.surface, borderRadius: 8,
          border: `1px solid ${C.borderLight}`,
          overflow: 'hidden', flexShrink: 0,
        }}>
          {sections.map((s, i) => (
            <SectionRow
              key={s.number}
              row={s}
              isLast={i === sections.length - 1}
              onOpen={() => onOpenSection((s.number - 1) as SectionIndex)}
            />
          ))}
        </div>
      </div>

      {isImproved && tocOpen && (
        <>
          <div
            onClick={closeToC}
            style={{ position: 'absolute', inset: 0, background: C.overlay, zIndex: 10, cursor: 'pointer' }}
          />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 11, display: 'flex', flexDirection: 'column' }}>
            <ToCSheet
              fields={fields}
              retryingKeys={retryingKeys}
              onClose={closeToC}
              onJump={jumpFromToC}
              onFieldRetry={onFieldRetry}
            />
          </div>
        </>
      )}
    </div>
  );
}

function DraftChip({ count }: { count: number }) {
  return (
    <span
      aria-label={`Draft kept on device with ${count} change${count === 1 ? '' : 's'}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '2px 8px', borderRadius: 4,
        background: C.brandTealLight, color: C.brandTealDeep,
        fontSize: 10, fontWeight: 700, letterSpacing: '0.4px',
        textTransform: 'uppercase',
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: C.brandTealDeep,
      }} />
      Draft · {count} change{count === 1 ? '' : 's'}
    </span>
  );
}

function SavedWaitingChip() {
  return (
    <span
      aria-label="Changes saved locally — waiting for connection to sync"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '2px 8px', borderRadius: 4,
        background: '#ECECEE', color: C.textSecondary,
        fontSize: 10, fontWeight: 700, letterSpacing: '0.4px',
        textTransform: 'uppercase',
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: C.textTertiary,
      }} />
      Saved · Will sync when online
    </span>
  );
}

function InlineMissingFields({ missing }: { missing: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', borderRadius: 6,
      background: C.errorBg, border: `1px solid ${C.error}33`,
    }}>
      <span style={{ color: C.error, fontSize: 13, fontWeight: 700 }}>⚠</span>
      <div style={{ fontSize: 12, color: C.error, fontWeight: 600, lineHeight: 1.35 }}>
        {missing} required field{missing === 1 ? '' : 's'} missing — open Table of Contents to jump to each one.
      </div>
    </div>
  );
}

function SectionRow({
  row, isLast, onOpen,
}: {
  row: SectionRow;
  isLast: boolean;
  onOpen: () => void;
}) {
  const isComplete = row.completed === row.total;
  const cloudColor = isComplete ? C.brandTeal : C.textTertiary;

  return (
    <div
      onClick={onOpen}
      style={{
        background: C.surface,
        borderBottom: isLast ? 'none' : `1px solid ${C.borderLight}`,
        padding: '14px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isComplete && Icons.checkCircle(C.complete, 16)}
          <span style={{
            fontSize: 11, color: C.textTertiary,
            letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600,
          }}>
            Section {row.number}
          </span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>{row.name}</div>
      </div>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
      }}>
        {isComplete ? Icons.cloudFilled(cloudColor, 18) : Icons.cloudOutline(cloudColor, 18)}
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: isComplete ? C.complete : C.textSecondary,
        }}>
          {row.completed}/{row.total}
        </span>
      </div>
    </div>
  );
}
