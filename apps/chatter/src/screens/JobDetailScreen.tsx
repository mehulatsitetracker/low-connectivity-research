import { ChevronLeft, Star, MoreVertical, MapPin, ExternalLink, ChevronRight, FileText, UserPlus, Play, ChevronDown } from 'lucide-react';
import { colors, radii } from '../theme';
import { BottomNav } from '../components/BottomNav';
import { FormsWidget } from '../components/FormsWidget';
import { MessageIconButton } from '../components/MessageIconButton';
import { JOBS } from '../data/objects';
import type { ActiveTab } from '../types';

interface JobDetailScreenProps {
  jobId: string;
  activeTab: ActiveTab;
  onAction: (action: string) => void;
  unreadCount?: number;
}

const JOB_FORMS = [
  { name: 'Safety Inspection', status: 'Not Started' },
  { name: 'Equipment Checklist', status: 'Not Started' },
  { name: 'Daily Report', status: 'Not Started' },
];

export function JobDetailScreen({ jobId, activeTab, onAction, unreadCount = 0 }: JobDetailScreenProps) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: colors.background }}>
      {/* TopBar — centered title like adhoc-job */}
      <div style={{
        height: 44, background: colors.topBar,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 40 }}>
          <button onClick={() => onAction('back')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <ChevronLeft size={18} color="#fff" strokeWidth={2} />
          </button>
        </div>
        <div style={{ fontWeight: 600, fontSize: 17, color: '#fff', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          Job
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MessageIconButton unreadCount={unreadCount} onClick={() => onAction('open-chat')} />
          <Star size={22} color="#fff" strokeWidth={1.5} style={{ opacity: 0.8 }} />
          <MoreVertical size={22} color="#fff" fill="#fff" style={{ opacity: 0.8 }} />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Job Info */}
        <div style={{ padding: '12px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}` }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: colors.textPrimary }}>{job.id}</div>
          <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>{job.templateName}</div>
        </div>

        {/* Map + Address side-by-side */}
        <div style={{ display: 'flex', padding: 12, gap: 12, background: colors.surface, borderBottom: `1px solid ${colors.borderLight}` }}>
          <div style={{
            width: 140, height: 130, borderRadius: radii.card, background: '#E8E8E8', flexShrink: 0, overflow: 'hidden',
          }}>
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #d4e4d4 0%, #e8e8e8 50%, #d0d8d0 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={32} color={colors.textPrimary} fill={colors.textPrimary} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>{job.siteName}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>{job.address}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>{job.city}</div>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              border: `1px solid ${colors.border}`, borderRadius: radii.button, background: colors.surface,
              fontSize: 13, color: colors.textPrimary, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4,
            }}>
              <ExternalLink size={14} color={colors.textPrimary} strokeWidth={2} />
              Start Directions
            </button>
          </div>
        </div>

        {/* Links */}
        {['View Job Details', 'Job Execution'].map(label => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}`,
          }}>
            <span style={{ fontSize: 15, color: colors.brandTeal, fontWeight: 500 }}>{label}</span>
            <ChevronRight size={14} color={colors.brandTeal} strokeWidth={2} />
          </div>
        ))}

        {/* Time Tracking Card */}
        <div style={{ margin: '10px 12px', padding: 16, background: colors.surface, borderRadius: radii.card, border: `1px solid ${colors.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} color={colors.textSecondary} fill={colors.textSecondary} />
              <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>MY TIME TRACKING</span>
            </div>
            <span style={{ fontSize: 13, color: colors.brandTeal, fontWeight: 500 }}>View time entries</span>
          </div>

          {/* Check-in button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: colors.textSecondary }}>Are you on site?</span>
          </div>
          <button style={{
            width: '100%', padding: '12px 0', borderRadius: radii.pill,
            border: 'none', background: colors.brandTeal, color: '#fff',
            fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14,
          }}>
            <UserPlus size={18} color="#fff" strokeWidth={2} />
            Yes - Check into site
          </button>

          {/* Job Status */}
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Job status</div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0', borderBottom: `1px solid ${colors.borderLight}`, marginBottom: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.statusBlue }} />
              <span style={{ fontSize: 15, color: colors.textPrimary }}>{job.status}</span>
            </div>
            <ChevronDown size={12} color={colors.textSecondary} strokeWidth={2} />
          </div>

          {/* Timer */}
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>Time tracking</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              color: colors.textPrimary, fontSize: 14,
            }}>
              <Play size={16} color={colors.textPrimary} fill={colors.textPrimary} />
              Start
            </button>
            <span style={{ fontSize: 28, fontWeight: 300, fontVariantNumeric: 'tabular-nums', color: colors.textPrimary }}>
              00:00:00
            </span>
          </div>
        </div>

        {/* My Forms Card */}
        <div style={{ margin: '0 12px 12px' }}>
          <FormsWidget forms={JOB_FORMS} />
        </div>

      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
