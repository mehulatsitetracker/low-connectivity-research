import { MapPin, ExternalLink, ChevronRight, Image, CalendarClock, Clock } from 'lucide-react';
import { colors, radii } from '../theme';
import { TopBar } from '../components/TopBar';
import { FormsWidget } from '../components/FormsWidget';
import { AskSparkleButton } from '../components/AskSparkleButton';
import { JOB } from '../data/objects';

interface JobScreenProps {
  onAction: (action: string) => void;
}

export function JobScreen({ onAction }: JobScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background, minHeight: 0 }}>
      <TopBar title="Job" onBack={() => onAction('back')} />

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {/* Job Info */}
        <div style={{ padding: '14px 16px', background: colors.surface }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: colors.textPrimary }}>{JOB.id}</div>
          <div style={{ fontSize: 15, color: colors.textSecondary, marginTop: 2 }}>{JOB.templateName}</div>
        </div>

        {/* Map + Address side-by-side */}
        <div style={{ display: 'flex', gap: 14, background: colors.surface, borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: 14 }}>
          <div style={{ width: 150, height: 140, background: '#E8E8E8', flexShrink: 0, overflow: 'hidden' }}>
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #dce7f0 0%, #eef2ee 50%, #d8e2d8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={34} color={colors.textPrimary} fill={colors.textPrimary} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, paddingRight: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>{JOB.siteName}</div>
            <div style={{ fontSize: 14, color: colors.textPrimary }}>{JOB.address}</div>
            <div style={{ fontSize: 14, color: colors.textPrimary }}>{JOB.city}</div>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              border: `1px solid ${colors.border}`, borderRadius: radii.card, background: colors.surface,
              fontSize: 14, color: colors.textPrimary, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4,
              alignSelf: 'flex-start',
            }}>
              <ExternalLink size={15} color={colors.textPrimary} strokeWidth={2} />
              Start Directions
            </button>
          </div>
        </div>

        {/* Links */}
        {['View Job Details', 'Job Execution'].map(label => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}`,
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: 16, color: colors.brandTeal, fontWeight: 600 }}>{label}</span>
            <ChevronRight size={16} color={colors.brandTeal} strokeWidth={2.5} />
          </div>
        ))}

        {/* Schedule — not scheduled */}
        <div style={{
          margin: '12px 12px 0', padding: 16, background: colors.surface,
          borderRadius: radii.card, border: `1px solid ${colors.borderLight}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CalendarClock size={18} color={colors.textSecondary} />
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>
              SCHEDULE
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>
              This job has not been scheduled.
            </div>
            <AskSparkleButton onClick={() => onAction('ask-help')} />
          </div>
        </div>

        {/* My Timetracking — depends on schedule */}
        <div style={{
          margin: '12px 12px 0', padding: 16, background: colors.surface,
          borderRadius: radii.card, border: `1px solid ${colors.borderLight}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Clock size={18} color={colors.textSecondary} />
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>
              MY TIMETRACKING
            </span>
          </div>
          <div style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>
            This job has not been scheduled.
          </div>
        </div>

        {/* My Forms */}
        <div style={{ margin: '12px 12px 0' }}>
          <FormsWidget
            forms={[{ name: 'Site inspection', siteName: JOB.siteName, status: 'Not Started' }]}
            subtitleField="status"
            onSelect={() => onAction('go-form-detail')}
          />
        </div>

        {/* Photos & Files */}
        <div style={{
          margin: 12, padding: 16, background: colors.surface,
          borderRadius: radii.card, border: `1px solid ${colors.borderLight}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Image size={18} color={colors.textSecondary} />
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>
              PHOTOS &amp; FILES (0)
            </span>
          </div>
          <button style={{
            width: '100%', padding: '13px 0', borderRadius: radii.card, border: 'none',
            background: colors.brandTeal, color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Image size={18} color="#fff" />
            Add Photos &amp; Files
          </button>
        </div>
      </div>
    </div>
  );
}
