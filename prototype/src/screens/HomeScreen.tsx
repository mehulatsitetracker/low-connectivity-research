import React from 'react';
import { BottomTabBar } from '../components/BottomTabBar';
import { Fab } from '../components/Fab';

const TEAL = '#00847C';
const DARK = '#1D2D34';
const BORDER = '#DDDBDA';
const TEXT2 = '#706E6B';

/* ── mock data ── */
const favorites = [
  { id: 'fav1', title: '10 Executive Drive', subtitle: 'Site Type: Warehouse' },
];

const forms = [
  { id: 'f1', title: 'OSHA Compliant 4.2', subtitle: 'Site: Mahwah - 100 Corporate Drive' },
  { id: 'f2', title: 'OSHA Compliant 4.6', subtitle: 'Site: Mahwah - 100 Corporate Drive' },
  { id: 'f3', title: 'OSHA Compliant SSI 4.3', subtitle: 'Site: Mahwah - 100 Corporate Drive' },
  { id: 'f4', title: 'OSHA Compliant 4.5', subtitle: 'Site: Mahwah - 100 Corporate Drive' },
];

const recentlyViewed = [
  { id: 'r1', title: 'OSHA Compliant 4.2', subtitle: 'Site: Mahwah - 100 Corporate Drive' },
  { id: 'r2', title: 'Cable Pull - Segment A', subtitle: 'Job Type: Installation' },
];

interface Props {
  banner?: React.ReactNode;
  onItemPress?: (id: string) => void;
}

export const HomeScreen: React.FC<Props> = ({ banner, onItemPress }) => {
  return (
    <div style={{ flex: 1, background: '#F7F8F7', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Dark header */}
      <div style={{
        background: DARK, padding: '12px 16px 14px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'system-ui', letterSpacing: 1.5 }}>SITETR▲CKER</div>
          <div style={{ fontSize: 12, color: '#AAADAE', fontFamily: 'system-ui', marginTop: 1 }}>[Org Name]</div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Bell icon */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C7.2 2 5 4.2 5 7V11L3 14H17L15 11V7C15 4.2 12.8 2 10 2Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8 14V15C8 16.1 8.9 17 10 17C11.1 17 12 16.1 12 15V14" stroke="#fff" strokeWidth="1.5"/>
          </svg>
          {/* Profile icon */}
          <div style={{
            width: 28, height: 28, borderRadius: 14, background: '#3A4F56',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5" r="3" stroke="#fff" strokeWidth="1.3"/>
              <path d="M2 13C2 10.2 4.2 8.5 7 8.5C9.8 8.5 12 10.2 12 13" stroke="#fff" strokeWidth="1.3"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Banner slot */}
      {banner}

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        {/* Search bar */}
        <div style={{
          margin: '12px 0', padding: '10px 14px', background: '#fff',
          border: `1px solid ${BORDER}`, borderRadius: 4,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke={TEXT2} strokeWidth="1.5"/>
            <path d="M11 11L14 14" stroke={TEXT2} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 14, color: TEXT2, fontFamily: 'system-ui' }}>Search...</span>
        </div>

        {/* MY FAVORITES */}
        <SectionCard
          icon={<StarIcon />}
          title={`MY FAVORITES (${favorites.length})`}
        >
          {favorites.map(f => (
            <ItemCard key={f.id} icon={<SiteIcon />} title={f.title} subtitle={f.subtitle} onPress={() => onItemPress?.(f.id)} />
          ))}
        </SectionCard>

        {/* MY FORMS */}
        <SectionCard
          icon={<ClipboardIcon color={TEXT2} />}
          title={`MY FORMS (${forms.length})`}
        >
          {forms.map(f => (
            <ItemCard key={f.id} icon={<FormIcon />} title={f.title} subtitle={f.subtitle} onPress={() => onItemPress?.(f.id)} />
          ))}
        </SectionCard>

        {/* RECENTLY VIEWED */}
        <SectionCard
          icon={<ClockIcon />}
          title={`RECENTLY VIEWED (${recentlyViewed.length})`}
        >
          {recentlyViewed.map(r => (
            <ItemCard key={r.id} icon={<FormIcon />} title={r.title} subtitle={r.subtitle} onPress={() => onItemPress?.(r.id)} />
          ))}
        </SectionCard>
      </div>

      <Fab />
      <BottomTabBar active="home" />
    </div>
  );
};

/* ── Section card wrapper ── */
const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div style={{
    background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 4,
    padding: 14, marginBottom: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      {icon}
      <span style={{ fontSize: 12, fontWeight: 700, color: DARK, fontFamily: 'system-ui', letterSpacing: 0.5 }}>{title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {children}
    </div>
  </div>
);

/* ── Item card inside sections ── */
const ItemCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; onPress?: () => void }> = ({ icon, title, subtitle, onPress }) => (
  <div onClick={onPress} style={{
    display: 'flex', alignItems: 'center', gap: 12, padding: 10,
    border: `1px solid ${BORDER}`, borderRadius: 4, cursor: 'pointer',
  }}>
    {icon}
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: DARK, fontFamily: 'system-ui' }}>{title}</div>
      <div style={{ fontSize: 12, color: TEXT2, fontFamily: 'system-ui', marginTop: 1 }}>{subtitle}</div>
    </div>
  </div>
);

/* ── Icons ── */
const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 1L11.5 6L17 7L13 11L14 17L9 14L4 17L5 11L1 7L6.5 6L9 1Z" stroke={TEXT2} strokeWidth="1.3" fill="none"/>
  </svg>
);

const ClipboardIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="3" y="2" width="12" height="14" rx="1.5" stroke={color} strokeWidth="1.3"/>
    <path d="M6 2V1H12V2" stroke={color} strokeWidth="1.3"/>
    <path d="M6 7H12M6 10H12M6 13H9" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7" stroke={TEXT2} strokeWidth="1.3"/>
    <path d="M9 5V9L12 11" stroke={TEXT2} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SiteIcon = () => (
  <div style={{
    width: 40, height: 40, borderRadius: 4, background: '#E8F4FC',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="14" rx="1" stroke="#2A7DE1" strokeWidth="1.5"/>
      <path d="M6 8H8V10H6ZM6 12H8V14H6ZM10 8H14V10H10ZM10 12H14V14H10Z" fill="#2A7DE1" opacity="0.5"/>
      <path d="M2 4L10 1L18 4" stroke="#2A7DE1" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  </div>
);

const FormIcon = () => (
  <div style={{
    width: 40, height: 40, borderRadius: 4, background: '#E0EDFA',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="2" width="14" height="16" rx="1.5" fill="#2A7DE1" opacity="0.2"/>
      <rect x="3" y="2" width="14" height="16" rx="1.5" stroke="#2A7DE1" strokeWidth="1.3"/>
      <path d="M7 8L9 10L13 6" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 13H13" stroke="#2A7DE1" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  </div>
);
