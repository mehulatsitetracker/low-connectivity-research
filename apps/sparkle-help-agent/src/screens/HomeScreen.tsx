import { Bell, User, Star, Clock, Building2, ClipboardCheck, ClipboardList, CalendarOff, Calendar } from 'lucide-react';
import { colors, radii } from '../theme';
import { SearchBar } from '../components/SearchBar';
import { AskSparkleButton } from '../components/AskSparkleButton';
import { FORMS, SITE, JOB } from '../data/objects';

interface HomeScreenProps {
  onAction: (action: string) => void;
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      margin: '0 12px 12px', padding: 16, background: colors.surface,
      borderRadius: radii.card, border: `1px solid ${colors.borderLight}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
        textTransform: 'uppercase', color: colors.textPrimary,
      }}>
        {icon}
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function ItemRow({ iconBg, icon, title, subtitle, onClick }: {
  iconBg: string; icon: React.ReactNode; title: string; subtitle: string; onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 12,
        border: `1px solid ${colors.borderLight}`, borderRadius: radii.card,
        cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 8, background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontSize: 13, color: colors.textSecondary }}>{subtitle}</div>
      </div>
    </div>
  );
}

export function HomeScreen({ onAction }: HomeScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background, minHeight: 0 }}>
      {/* Header with brand */}
      <div style={{
        background: colors.topBar, padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, letterSpacing: 1.5 }}>SITETRACKER</div>
          <div style={{ color: '#ccc', fontSize: 13 }}>[Org Name]</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <Bell size={24} color="currentColor" strokeWidth={1.5} />
          </button>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={18} color={colors.topBar} fill={colors.topBar} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <SearchBar placeholder="Search..." />

        <SectionCard icon={<Calendar size={16} color={colors.textSecondary} />} title="CALENDAR">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, padding: '12px 4px' }}>
            <CalendarOff size={40} color={colors.textTertiary} strokeWidth={1.5} />
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>
              You have not been added as a resource
            </div>
            <div style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.45 }}>
              Please ask your Sitetracker Administrator to add you as a resource so you can be assigned to jobs.
            </div>
            <div style={{ marginTop: 2 }}>
              <AskSparkleButton onClick={() => onAction('ask-help')} />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={<Star size={16} color={colors.textSecondary} fill={colors.textSecondary} />} title="MY FAVORITES (1)">
          <ItemRow
            iconBg={colors.brandBlue}
            icon={<Building2 size={22} color="#fff" />}
            title={SITE.name}
            subtitle={`Site Type: ${SITE.type}`}
            onClick={() => onAction('go-site')}
          />
        </SectionCard>

        <SectionCard icon={<ClipboardList size={16} color={colors.textSecondary} />} title={`MY FORMS (${FORMS.length})`}>
          {FORMS.map(form => (
            <ItemRow
              key={form.name}
              iconBg={colors.brandBlue}
              icon={<ClipboardCheck size={22} color="#fff" />}
              title={form.name}
              subtitle={`Site: ${form.siteName}`}
              onClick={() => onAction('go-forms')}
            />
          ))}
        </SectionCard>

        <SectionCard icon={<Clock size={16} color={colors.textSecondary} />} title="RECENTLY VIEWED (8)">
          <ItemRow
            iconBg={colors.brandBlue}
            icon={<ClipboardCheck size={22} color="#fff" />}
            title={FORMS[0].name}
            subtitle={`Site: ${FORMS[0].siteName}`}
            onClick={() => onAction('go-forms')}
          />
          <ItemRow
            iconBg={colors.brandTeal}
            icon={<ClipboardCheck size={22} color="#fff" />}
            title={JOB.id}
            subtitle={`Job Template: ${JOB.templateName}`}
            onClick={() => onAction('go-job')}
          />
          <ItemRow
            iconBg={colors.brandBlue}
            icon={<Building2 size={22} color="#fff" />}
            title={SITE.name}
            subtitle={`Site Type: ${SITE.type}`}
            onClick={() => onAction('go-site')}
          />
        </SectionCard>
      </div>
    </div>
  );
}
