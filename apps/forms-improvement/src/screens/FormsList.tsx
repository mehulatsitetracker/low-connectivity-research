import type { Variant } from '../types';
import { C, TopBar, BottomNav, SearchBar, Pill, AccentCard, Icons, IconBtn } from './_bits';

type Status = 'not-started' | 'in-progress' | 'complete';

interface Row {
  title: string;
  site?: string;
  asset?: string;
  status: Status;
  assignee: string;
}

const ROWS: Row[] = [
  { title: 'Site Check-Out Form from Template ID: a0gf...', site: 'WeWork Prestige Central', asset: '--', status: 'not-started', assignee: 'Vishal Rathor' },
  { title: 'Site Check-Out Form from Template ID: a0gf...', site: 'WeWork Prestige Central', asset: '--', status: 'not-started', assignee: 'Vishal Rathor' },
  { title: 'Site Check-Out Form from Template ID: a0gf...', site: 'WeWork Prestige Central', asset: '--', status: 'complete',    assignee: 'Vishal Rathor' },
  { title: 'Inspection',                                    site: undefined,                  asset: '--', status: 'complete',    assignee: 'Vishal Rathor' },
];

interface Props {
  variant: Variant;
  onOpenForm: () => void;
  showDraftRecovery?: boolean;
  onResumeDraft?: () => void;
  onDiscardDraft?: () => void;
}

export function FormsList({
  variant, onOpenForm,
  showDraftRecovery = false, onResumeDraft, onDiscardDraft,
}: Props) {
  const improved = variant === 'improved';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.background }}>
      <TopBar
        title={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>All {Icons.caretDown('#fff', 12)}</span>}
        onBack={() => {}}
        trailing={<IconBtn title="New form">{Icons.plus()}</IconBtn>}
      />
      <SearchBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {showDraftRecovery && (
          <DraftRecoveryCard onResume={onResumeDraft} onDiscard={onDiscardDraft} />
        )}
        {ROWS.map((r, i) => <RowCard key={i} row={r} improved={improved} onOpen={onOpenForm} />)}
      </div>
      <BottomNav />
    </div>
  );
}

function DraftRecoveryCard({
  onResume, onDiscard,
}: { onResume?: () => void; onDiscard?: () => void }) {
  return (
    <div
      role="alertdialog"
      aria-label="Resume your draft"
      style={{
        background: C.brandTealLight,
        border: `1px solid ${C.brandTeal}55`,
        borderRadius: 8, padding: 14,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ paddingTop: 2 }}>{Icons.info(C.brandTealDeep, 18)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.brandTealDeep, lineHeight: 1.3 }}>
            Resume your draft?
          </div>
          <div style={{ fontSize: 12, color: C.textPrimary, marginTop: 4, lineHeight: 1.4 }}>
            Site Check-Out Form · 3 of 15 fields filled before you closed the app.
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onResume}
          style={{
            flex: 1, padding: '8px 12px',
            background: C.brandTeal, color: '#fff', border: 'none',
            borderRadius: 6, fontSize: 13, fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer',
          }}
        >Continue draft</button>
        <button
          onClick={onDiscard}
          style={{
            padding: '8px 12px',
            background: 'transparent', color: C.textSecondary,
            border: `1px solid ${C.border}`, borderRadius: 6,
            fontSize: 13, fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer',
          }}
        >Discard</button>
      </div>
    </div>
  );
}

function RowCard({ row, improved, onOpen }: { row: Row; improved: boolean; onOpen: () => void }) {
  const tone = improved
    ? (row.status === 'complete' ? 'green' : row.status === 'in-progress' ? 'amber' : 'none')
    : 'none';

  return (
    <AccentCard tone={tone} onClick={onOpen}>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, lineHeight: 1.3, flex: 1 }}>
            {row.title}
          </div>
          {improved && row.status === 'complete' && <Pill tone="green">Complete</Pill>}
          {improved && row.status === 'not-started' && <Pill tone="gray">Not started</Pill>}
        </div>
        <Line label="Site" value={row.site ?? ''} />
        <Line label="Field Asset" value={row.asset ?? '--'} />
        {!improved && <Line label="Status" value={statusText(row.status)} />}
        <Line label="Assigned to" value={row.assignee} />
      </div>
    </AccentCard>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ fontSize: 12, color: C.textSecondary }}>
      {label}: <span style={{ color: C.textPrimary }}>{value}</span>
    </div>
  );
}

function statusText(s: Status) {
  return s === 'complete' ? 'Complete' : s === 'in-progress' ? 'In Progress' : 'Not Started';
}
