import { ChevronRight, Image, RefreshCw, Plus, ClipboardList } from 'lucide-react';
import { colors, radii } from '../theme';
import { TopBar } from '../components/TopBar';
import { Banner } from '../components/Banner';
import { PROJECT } from '../data/objects';

interface ProjectScreenProps {
  onAction: (action: string) => void;
}

export function ProjectScreen({ onAction }: ProjectScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background, minHeight: 0 }}>
      <TopBar title={PROJECT.id} onBack={() => onAction('back')} />

      {/* Upload-in-progress — an in-flight state, not a failure, so no help
          affordance here. The user asks the Help Agent proactively if it drags. */}
      <Banner variant="uploading" flush>
        Uploading files: 0/1
      </Banner>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {/* Project info */}
        <div style={{ padding: '14px 16px', background: colors.surface }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: colors.textPrimary }}>{PROJECT.id}</div>
          <div style={{ fontSize: 15, color: colors.textSecondary, marginTop: 2 }}>{PROJECT.name}</div>
        </div>

        <div style={{ padding: '0 16px 14px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}` }}>
          <div style={{ fontSize: 14, color: colors.textTertiary }}>Project Status: {PROJECT.status}</div>
          <div style={{ fontSize: 14, color: colors.textTertiary, marginTop: 4 }}>Project Template: {PROJECT.templateName}</div>
        </div>

        {/* Links */}
        {['Manage Project Schedule', 'View Project Details'].map(label => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}`,
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: 16, color: colors.brandTeal, fontWeight: 600 }}>{label}</span>
            <ChevronRight size={16} color={colors.brandTeal} strokeWidth={2.5} />
          </div>
        ))}

        {/* Forms (empty) */}
        <div style={{
          margin: '12px 12px 0', padding: 16, background: colors.surface,
          borderRadius: radii.card, border: `1px solid ${colors.borderLight}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ClipboardList size={18} color={colors.textSecondary} />
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>
              FORMS (0)
            </span>
          </div>
          <button style={{
            width: '100%', padding: '13px 0', borderRadius: radii.card, border: 'none',
            background: colors.brandTeal, color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Add new form
          </button>
        </div>

        {/* Photos & Files — one queued photo with a sync badge */}
        <div style={{
          margin: 12, padding: 16, background: colors.surface,
          borderRadius: radii.card, border: `1px solid ${colors.borderLight}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Image size={18} color={colors.textSecondary} />
              <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>
                PHOTOS &amp; FILES (1)
              </span>
            </div>
            <button aria-label="Add photo" style={{
              width: 30, height: 30, borderRadius: 6, border: `1px solid ${colors.brandTeal}`,
              background: colors.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Plus size={18} color={colors.brandTeal} strokeWidth={2.5} />
            </button>
          </div>

          <div style={{ position: 'relative', width: 84, height: 84 }}>
            <div style={{
              width: 84, height: 84, borderRadius: radii.card,
              background: 'linear-gradient(135deg, #cdd6d0 0%, #e5e9e4 50%, #c8d0cb 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}>
              <Image size={30} color={colors.textTertiary} />
            </div>
            {/* Sync badge — file is queued, not yet uploaded */}
            <div style={{
              position: 'absolute', bottom: 4, left: 4,
              width: 24, height: 24, borderRadius: '50%', background: 'rgba(29,45,52,0.82)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <style>{'@keyframes sparkle-spin { to { transform: rotate(360deg); } }'}</style>
              <RefreshCw size={13} color="#fff" strokeWidth={2.5} style={{ animation: 'sparkle-spin 1s linear infinite' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
