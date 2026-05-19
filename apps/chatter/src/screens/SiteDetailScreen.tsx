import { ChevronLeft, Star, MoreVertical, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { colors, radii } from '../theme';
import { BottomNav } from '../components/BottomNav';
import { FormsWidget } from '../components/FormsWidget';
import { MessageIconButton } from '../components/MessageIconButton';
import { SITES } from '../data/objects';
import type { ActiveTab } from '../types';

interface SiteDetailScreenProps {
  siteId: string;
  activeTab: ActiveTab;
  onAction: (action: string) => void;
  unreadCount?: number;
}

export function SiteDetailScreen({ siteId, activeTab, onAction, unreadCount = 0 }: SiteDetailScreenProps) {
  const site = SITES.find(s => s.id === siteId);
  if (!site) return null;

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
        <div style={{ fontWeight: 600, fontSize: 17, color: '#fff', position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {site.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MessageIconButton unreadCount={unreadCount} onClick={() => onAction('open-chat')} />
          <Star size={22} color="#fff" strokeWidth={1.5} style={{ opacity: 0.8 }} />
          <MoreVertical size={22} color="#fff" fill="#fff" style={{ opacity: 0.8 }} />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Site info */}
        <div style={{ padding: '12px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}` }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: colors.textPrimary }}>{site.name}</div>
          <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>{site.type || 'Site'}</div>
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
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>{site.name}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>{site.county !== '--' ? site.county : ''}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>{site.city || 'CA'}</div>
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
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}`,
        }}>
          <span style={{ fontSize: 15, color: colors.brandTeal, fontWeight: 500 }}>View Site Details</span>
          <ChevronRight size={14} color={colors.brandTeal} strokeWidth={2} />
        </div>

        {/* Forms */}
        <div style={{ margin: '10px 12px' }}>
          <FormsWidget
            showAddButton
            forms={[
              { name: 'Site Inspection - Checklist', status: 'Not Started', siteName: site.name },
              { name: 'Site Inspection - Compliance', status: 'Not Started', siteName: site.name },
              { name: 'Environmental Assessment', status: 'Not Started', siteName: site.name },
              { name: 'Template2-Result Form', status: 'Not Started', siteName: site.name },
            ]}
          />
        </div>

      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
