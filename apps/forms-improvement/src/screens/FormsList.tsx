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

export function FormsList({ variant, onOpenForm }: { variant: Variant; onOpenForm: () => void }) {
  const improved = variant === 'improved';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.background }}>
      <TopBar
        title={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>All {Icons.caretDown('#fff', 12)}</span>}
        onBack={() => {}}
        trailing={<IconBtn>{Icons.plus()}</IconBtn>}
      />
      <SearchBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ROWS.map((r, i) => <RowCard key={i} row={r} improved={improved} onOpen={onOpenForm} />)}
      </div>
      <BottomNav />
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
