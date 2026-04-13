import { FileText, Plus, Check } from 'lucide-react';
import { colors, radii } from '../theme';

interface FormItem {
  name: string;
  status: string;
  siteName?: string;
}

interface FormsWidgetProps {
  forms: FormItem[];
  showAddButton?: boolean;
}

export function FormsWidget({ forms, showAddButton }: FormsWidgetProps) {
  return (
    <div style={{ padding: 16, background: colors.surface, borderRadius: radii.card, border: `1px solid ${colors.borderLight}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={18} color={colors.textSecondary} fill={colors.textSecondary} />
          <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>MY FORMS ({forms.length})</span>
        </div>
        {showAddButton && (
          <div style={{
            width: 28, height: 28, borderRadius: 6, border: `1px solid ${colors.brandTeal}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Plus size={14} color={colors.brandTeal} strokeWidth={2} />
          </div>
        )}
      </div>
      {forms.map((form, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
          borderBottom: i < forms.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 6, background: colors.brandTealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Check size={18} color={colors.brandTeal} strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.name}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>
              Status: <span style={{ fontStyle: 'italic' }}>{form.status}</span>
              {form.siteName && <> &middot; {form.siteName}</>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
