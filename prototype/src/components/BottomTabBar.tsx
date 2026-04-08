import React from 'react';

interface Props {
  active?: 'home' | 'map' | 'menu';
}

const TEAL = '#00847C';
const GRAY = '#706E6B';
const ACTIVE_BG = '#D6F5F3';

export const BottomTabBar: React.FC<Props> = ({ active = 'home' }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    height: 56, borderTop: '1px solid #DDDBDA', background: '#fff', flexShrink: 0,
  }}>
    <Tab label="HOME" active={active === 'home'} icon={
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 8L10 2L17 8V17H12V12H8V17H3V8Z" stroke={active === 'home' ? TEAL : GRAY} strokeWidth="1.5" fill={active === 'home' ? TEAL : 'none'} fillOpacity={active === 'home' ? 0.15 : 0} strokeLinejoin="round"/>
      </svg>
    } />
    <Tab label="MAP" active={active === 'map'} icon={
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M1 4L7 2L13 4L19 2V16L13 18L7 16L1 18V4Z" stroke={active === 'map' ? TEAL : GRAY} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7 2V16M13 4V18" stroke={active === 'map' ? TEAL : GRAY} strokeWidth="1.5"/>
      </svg>
    } />
    <Tab label="MENU" active={active === 'menu'} icon={
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5H17M3 10H17M3 15H17" stroke={active === 'menu' ? TEAL : GRAY} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    } />
  </div>
);

const Tab: React.FC<{ label: string; active: boolean; icon: React.ReactNode }> = ({ label, active, icon }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    padding: '6px 20px', borderRadius: 8,
    background: active ? ACTIVE_BG : 'transparent',
    cursor: 'pointer',
  }}>
    {icon}
    <span style={{
      fontSize: 10, fontWeight: 600, fontFamily: 'system-ui',
      color: active ? TEAL : GRAY, textTransform: 'uppercase', letterSpacing: 0.5,
    }}>{label}</span>
  </div>
);
