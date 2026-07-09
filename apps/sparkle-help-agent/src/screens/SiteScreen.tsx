import { MapPin, ExternalLink, ChevronRight, Wrench } from 'lucide-react';
import { colors, radii } from '../theme';
import { TopBar } from '../components/TopBar';
import { FormsWidget } from '../components/FormsWidget';
import { AskSparkleButton } from '../components/AskSparkleButton';
import { SITE } from '../data/objects';

interface SiteScreenProps {
  onAction: (action: string) => void;
}

export function SiteScreen({ onAction }: SiteScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background, minHeight: 0 }}>
      <TopBar title="Site" onBack={() => onAction('back')} />

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {/* Site info */}
        <div style={{ padding: '14px 16px', background: colors.surface }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: colors.textPrimary }}>{SITE.name}</div>
          <div style={{ fontSize: 15, color: colors.textSecondary, marginTop: 2 }}>Site Type: {SITE.type}</div>
        </div>

        {/* Map + Address side-by-side */}
        <div style={{ display: 'flex', gap: 14, background: colors.surface, borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: 14 }}>
          <div style={{ width: 150, height: 140, background: '#E8E8E8', flexShrink: 0, overflow: 'hidden' }}>
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #d4e4d4 0%, #eef2ee 50%, #d0d8d0 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={34} color={colors.textPrimary} fill={colors.textPrimary} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, paddingRight: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>{SITE.name}</div>
            <div style={{ fontSize: 14, color: colors.textPrimary }}>{SITE.county}</div>
            <div style={{ fontSize: 14, color: colors.textPrimary }}>{SITE.city}</div>
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
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}`,
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: 16, color: colors.brandTeal, fontWeight: 600 }}>View Site Details</span>
          <ChevronRight size={16} color={colors.brandTeal} strokeWidth={2.5} />
        </div>

        {/* Forms on this site */}
        <div style={{ margin: '12px 12px 0' }}>
          <FormsWidget
            forms={[
              { name: 'Site Inspection - Checklist', siteName: SITE.name, status: 'Not Started' },
              { name: 'Site Inspection - Compliance', siteName: SITE.name, status: 'Not Started' },
              { name: 'Environmental Assessment', siteName: SITE.name, status: 'Not Started' },
            ]}
            subtitleField="status"
            onSelect={() => onAction('go-form-detail')}
          />
        </div>

        {/* Inventory — not enabled for this org */}
        <div style={{
          margin: 12, padding: 16, background: colors.surface,
          borderRadius: radii.card, border: `1px solid ${colors.error}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Wrench size={18} color={colors.textSecondary} />
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textPrimary }}>
              INVENTORY
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 14, color: colors.error, textAlign: 'center', lineHeight: 1.45 }}>
              Inventory Management is not enabled in your organization.
            </div>
            <AskSparkleButton onClick={() => onAction('ask-help')} />
          </div>
        </div>
      </div>
    </div>
  );
}
