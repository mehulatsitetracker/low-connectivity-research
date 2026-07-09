import { CircleCheck, CloudCheck } from 'lucide-react';
import { colors, radii } from '../theme';
import { TopBar } from '../components/TopBar';
import { Banner } from '../components/Banner';
import { AskSparkleButton } from '../components/AskSparkleButton';
import { FORM_DETAIL } from '../data/objects';

interface FormDetailScreenProps {
  onAction: (action: string) => void;
}

export function FormDetailScreen({ onAction }: FormDetailScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background, minHeight: 0 }}>
      <TopBar title="" onBack={() => onAction('back')} showActions={false} />

      {/* Document-generation blocker */}
      <Banner variant="warning" flush trailing={<AskSparkleButton onClick={() => onAction('ask-help')} />}>
        Document generation unavailable. Template is missing or no permission available. Contact your admin.
      </Banner>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {/* Form title + record + status */}
        <div style={{ padding: '16px 16px 12px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}` }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: colors.textPrimary, lineHeight: 1.3 }}>
            {FORM_DETAIL.name}
          </div>
          <div style={{ fontSize: 15, color: colors.textSecondary, marginTop: 6 }}>{FORM_DETAIL.siteName}</div>
          <div style={{ marginTop: 12 }}>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: radii.pill,
              border: `1px solid ${colors.statusGreen}`, color: colors.statusGreen,
              fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
              background: '#EEF8EE',
            }}>
              {FORM_DETAIL.status}
            </span>
          </div>
        </div>

        {/* Section list */}
        <div style={{ padding: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: 14,
            background: colors.surface, border: `1px solid ${colors.borderLight}`, borderRadius: radii.card,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            <CircleCheck size={22} color={colors.statusGreen} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>Section 1</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{FORM_DETAIL.section}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CloudCheck size={20} color={colors.textSecondary} />
              <span style={{ fontSize: 13, color: colors.textSecondary }}>1/1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
