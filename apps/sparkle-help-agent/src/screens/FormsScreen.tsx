import { ClipboardCheck } from 'lucide-react';
import { colors, radii } from '../theme';
import { TopBar } from '../components/TopBar';
import { SearchBar } from '../components/SearchBar';
import { FORMS } from '../data/objects';

interface FormsScreenProps {
  onAction: (action: string) => void;
}

const statusColor = (status: string) => {
  if (status === 'Completed') return colors.statusGreen;
  if (status === 'In Progress') return colors.statusBlue;
  return colors.textTertiary;
};

export function FormsScreen({ onAction }: FormsScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background, minHeight: 0 }}>
      <TopBar title="My Forms" onBack={() => onAction('back')} showActions={false} />

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <SearchBar placeholder="Search forms" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px 16px' }}>
          {FORMS.map(form => (
            <div key={form.name} onClick={() => onAction('go-form-detail')} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 14,
              background: colors.surface, border: `1px solid ${colors.borderLight}`,
              borderRadius: radii.card, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8, background: colors.brandBlue,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <ClipboardCheck size={22} color="#fff" strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{form.name}</div>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>Site: {form.siteName}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(form.status) }} />
                <span style={{ fontSize: 12, color: colors.textSecondary }}>{form.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
