import { ClipboardList, ClipboardCheck } from 'lucide-react';
import { colors, radii } from '../theme';
import type { FormItem } from '../types';

interface FormsWidgetProps {
  title?: string;
  forms: FormItem[];
  subtitleField?: 'site' | 'status';
  onSelect?: (form: FormItem) => void;
}

export function FormsWidget({ title = 'MY FORMS', forms, subtitleField = 'site', onSelect }: FormsWidgetProps) {
  return (
    <div style={{ padding: 16, background: colors.surface, borderRadius: radii.card, border: `1px solid ${colors.borderLight}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <ClipboardList size={18} color={colors.textSecondary} />
        <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>
          {title} ({forms.length})
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {forms.map((form, i) => (
          <div
            key={i}
            onClick={() => onSelect?.(form)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 12,
              border: `1px solid ${colors.borderLight}`, borderRadius: radii.card,
              cursor: onSelect ? 'pointer' : 'default', background: colors.surface,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 8, background: colors.brandBlue,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ClipboardCheck size={22} color="#fff" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {form.name}
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary }}>
                {subtitleField === 'site' ? <>Site: {form.siteName}</> : <>Status: {form.status}</>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
