import type { Variant } from '../types';
import type React from 'react';
import { C, TopBar, BottomNav, Pill, AccentCard, Spinner, Icons, IconBtn, spinKeyframes } from './_bits';

type Status = 'complete' | 'syncing' | 'not-started';

interface FormRow { title: string; site: string; status: Status }

interface Props {
  variant: Variant;
  onOpenForm: () => void;
  submitted: boolean;
}

export function JobWidget({ variant, onOpenForm, submitted }: Props) {
  const isImproved = variant === 'improved';

  // When the user submitted from form-detail (improved), one form on the widget is syncing.
  const rows: FormRow[] = isImproved && submitted
    ? [
        { title: 'Site Check-Out Form from Tem...',  site: 'WeWork Prestige Central', status: 'syncing'  },
        { title: 'Site inspection',                  site: 'WeWork Prestige Central', status: 'complete' },
        { title: 'Inspection',                       site: '',                        status: 'complete' },
      ]
    : [
        { title: 'Site inspection',                  site: 'WeWork Prestige Central', status: 'complete' },
        { title: 'Inspection',                       site: '',                        status: 'complete' },
        { title: 'Site Check-Out Form from Tem...',  site: 'WeWork Prestige Central', status: 'complete' },
      ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.background }}>
      {spinKeyframes}
      <TopBar
        title="J-006426"
        onBack={() => {}}
        trailing={
          <>
            <IconBtn>{Icons.star()}</IconBtn>
            <IconBtn>{Icons.cloud()}</IconBtn>
            <IconBtn>{Icons.plus()}</IconBtn>
          </>
        }
      />
      <div style={{
        padding: '12px 16px', background: C.surface,
        borderBottom: `1px solid ${C.borderLight}`,
        fontSize: 18, fontWeight: 700, color: C.textPrimary,
      }}>
        J-006426
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <WidgetCard
          icon={Icons.formIcon(C.textSecondary, 14)}
          title={`FORMS (${rows.length})`}
          trailing={<PlusButton />}
          footer={isImproved ? <LegendStrip rows={rows} /> : undefined}
        >
          {rows.map((r, i) => <FormRowItem key={i} row={r} improved={isImproved} onOpen={onOpenForm} />)}
        </WidgetCard>

        <WidgetCard icon={Icons.photo(C.textSecondary, 14)} title="PHOTOS & FILES (0)">
          <button style={{
            width: '100%', padding: '14px 16px', background: C.brandTeal, color: '#fff',
            border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {Icons.paperclip('#fff')} Add Photos & Files
          </button>
        </WidgetCard>

        <WidgetCard icon={Icons.wrench(C.textSecondary, 14)} title="INVENTORY">
          <LinkButton>{Icons.search(C.brandTeal)} Locate Inventory</LinkButton>
          <LinkButton>▭ Uninstall</LinkButton>
        </WidgetCard>
      </div>

      <BottomNav />
    </div>
  );
}

function WidgetCard({
  icon, title, trailing, footer, children,
}: {
  icon: React.ReactNode;
  title: string;
  trailing?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 6 }}>
      <div style={{
        padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `1px solid ${C.borderLight}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: C.textSecondary, fontSize: 11, fontWeight: 700, letterSpacing: '0.6px',
        }}>
          {icon}
          {title}
        </div>
        {trailing}
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
      {footer}
    </div>
  );
}

function PlusButton() {
  return (
    <span style={{
      width: 26, height: 26, borderRadius: 4, border: `1px solid ${C.border}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: C.textSecondary,
    }}>{Icons.plus(C.textSecondary)}</span>
  );
}

function LinkButton({ children }: { children: React.ReactNode }) {
  return (
    <button style={{
      width: '100%', padding: '12px', background: C.surface,
      border: `1px solid ${C.border}`, borderRadius: 6, color: C.brandTeal,
      fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>{children}</button>
  );
}

function FormRowItem({ row, improved, onOpen }: { row: FormRow; improved: boolean; onOpen: () => void }) {
  const tone = !improved
    ? 'none'
    : row.status === 'complete' ? 'green'
    : row.status === 'syncing'  ? 'amber'
    : 'none';

  return (
    <AccentCard tone={tone} onClick={onOpen} style={{ background: C.surfaceAlt }}>
      <div style={{
        padding: '10px 12px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', gap: 10,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>{row.title}</div>
          <div style={{ fontSize: 11, color: C.textSecondary }}>Site: {row.site || '—'}</div>
        </div>
        <StatusBadge status={row.status} improved={improved} />
      </div>
    </AccentCard>
  );
}

function StatusBadge({ status, improved }: { status: Status; improved: boolean }) {
  if (status === 'complete') return <Pill tone="green">Complete</Pill>;
  if (status === 'syncing' && improved) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <Spinner size={11} color={C.pendingDeep} />
        <Pill tone="amber">Syncing</Pill>
      </div>
    );
  }
  return <Pill tone="gray">Not started</Pill>;
}

function LegendStrip({ rows }: { rows: FormRow[] }) {
  const syncing = rows.filter(r => r.status === 'syncing').length;
  if (syncing === 0) return null;
  return (
    <div style={{
      padding: '8px 14px', borderTop: `1px solid ${C.borderLight}`,
      background: C.pendingBg, fontSize: 11, color: C.pendingDeep, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <Spinner size={10} color={C.pendingDeep} />
      {syncing} form{syncing === 1 ? '' : 's'} syncing · 1 photo retrying
    </div>
  );
}
