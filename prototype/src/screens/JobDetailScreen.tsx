import React from 'react';
import { BottomTabBar } from '../components/BottomTabBar';
import { Fab } from '../components/Fab';

const DARK = '#1D2D34';
const TEAL = '#00847C';
const BORDER = '#DDDBDA';
const TEXT2 = '#706E6B';
const BG = '#F7F8F7';

interface Props {
  onBack: () => void;
  banner?: React.ReactNode;
}

export const JobDetailScreen: React.FC<Props> = ({ onBack, banner }) => {
  return (
    <div style={{ flex: 1, background: BG, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Nav bar — dark */}
      <div style={{
        height: 44, background: DARK, display: 'flex', alignItems: 'center',
        padding: '0 12px', flexShrink: 0, justifyContent: 'space-between',
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          display: 'flex', alignItems: 'center',
        }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 600, color: '#fff', fontFamily: 'system-ui' }}>Job</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Star */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z" stroke="#fff" strokeWidth="1.3" fill="none"/>
          </svg>
          {/* Three-dot menu */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="4" r="1.5" fill="#fff"/>
            <circle cx="10" cy="10" r="1.5" fill="#fff"/>
            <circle cx="10" cy="16" r="1.5" fill="#fff"/>
          </svg>
        </div>
      </div>

      {/* Banner slot */}
      {banner}

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Job header */}
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, background: '#fff' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: DARK, fontFamily: 'system-ui' }}>J-000234</div>
          <div style={{ fontSize: 14, color: TEXT2, fontFamily: 'system-ui', marginTop: 2 }}>Antena installation template</div>
        </div>

        {/* Map + Address */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, background: '#fff' }}>
          {/* Map placeholder */}
          <div style={{
            width: '42%', minHeight: 120, background: '#E8ECE8', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Fake map grid lines */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
              <div style={{ position: 'absolute', top: '25%', left: 0, right: 0, height: 1, background: '#888' }} />
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#888' }} />
              <div style={{ position: 'absolute', top: '75%', left: 0, right: 0, height: 1, background: '#888' }} />
              <div style={{ position: 'absolute', left: '25%', top: 0, bottom: 0, width: 1, background: '#888' }} />
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#888' }} />
              <div style={{ position: 'absolute', left: '75%', top: 0, bottom: 0, width: 1, background: '#888' }} />
            </div>
            {/* Pin */}
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" style={{ position: 'relative', zIndex: 1 }}>
              <path d="M14 0C6.3 0 0 6.3 0 14C0 24.5 14 36 14 36S28 24.5 28 14C28 6.3 21.7 0 14 0Z" fill={DARK}/>
              <circle cx="14" cy="14" r="5" fill="#fff"/>
            </svg>
          </div>
          {/* Address */}
          <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: DARK, fontFamily: 'system-ui' }}>PT - 100 PEARL STREET</div>
            <div style={{ fontSize: 13, color: TEXT2, fontFamily: 'system-ui', lineHeight: '18px' }}>
              100 Pearl Street<br/>Denver, Colorado 99999
            </div>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4,
              padding: '6px 14px', border: `1px solid ${BORDER}`, borderRadius: 4,
              background: '#fff', cursor: 'pointer', alignSelf: 'flex-start',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 9V13H5L12 6L8 2L1 9Z" stroke={DARK} strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M9 1L13 5" stroke={DARK} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 500, color: DARK, fontFamily: 'system-ui' }}>Start Directions</span>
            </button>
          </div>
        </div>

        {/* Action links */}
        <ActionLink label="View Job Details" />
        <ActionLink label="Job Execution" />

        {/* MY FORMS */}
        <div style={{ margin: '12px 16px' }}>
          <SectionCard icon={<ClipboardIcon />} title="MY FORMS (1)">
            <ItemCard
              icon={<FormCheckIcon />}
              title="Form Name"
              subtitle="Status: Form Status"
            />
          </SectionCard>
        </div>

        {/* PHOTOS & FILES */}
        <div style={{ margin: '0 16px 16px' }}>
          <SectionCard icon={<PhotoIcon />} title="PHOTOS & FILES (0)">
            <button style={{
              width: '100%', padding: '12px 0', borderRadius: 4, border: 'none',
              background: TEAL, color: '#fff', fontSize: 14, fontWeight: 600,
              fontFamily: 'system-ui', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#fff" strokeWidth="1.3"/>
                <circle cx="5.5" cy="7" r="1.5" stroke="#fff" strokeWidth="1"/>
                <path d="M1 11L5 8L8 10L11 7L15 11" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
              Add Photos & Files
            </button>
          </SectionCard>
        </div>

        {/* Spacer for FAB */}
        <div style={{ height: 40 }} />
      </div>

      <Fab />
      <BottomTabBar active="home" />
    </div>
  );
};

/* ── Action link row ── */
const ActionLink: React.FC<{ label: string }> = ({ label }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, background: '#fff',
    cursor: 'pointer',
  }}>
    <span style={{ fontSize: 15, fontWeight: 500, color: TEAL, fontFamily: 'system-ui' }}>{label}</span>
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
      <path d="M1 1L7 7L1 13" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

/* ── Section card ── */
const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div style={{
    background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 4, padding: 14,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      {icon}
      <span style={{ fontSize: 12, fontWeight: 700, color: DARK, fontFamily: 'system-ui', letterSpacing: 0.5 }}>{title}</span>
    </div>
    {children}
  </div>
);

/* ── Icons ── */
const ClipboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="3" y="2" width="12" height="14" rx="1.5" stroke={TEXT2} strokeWidth="1.3"/>
    <path d="M6 2V1H12V2" stroke={TEXT2} strokeWidth="1.3"/>
    <path d="M6 7H12M6 10H12M6 13H9" stroke={TEXT2} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const PhotoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="3" width="16" height="12" rx="1.5" stroke={TEXT2} strokeWidth="1.3"/>
    <circle cx="6" cy="8" r="2" stroke={TEXT2} strokeWidth="1.2"/>
    <path d="M1 13L5.5 9.5L8.5 11.5L12 8L17 12" stroke={TEXT2} strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
);

const FormCheckIcon = () => (
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

const ItemCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12, padding: 10,
    border: `1px solid ${BORDER}`, borderRadius: 4,
  }}>
    {icon}
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: DARK, fontFamily: 'system-ui' }}>{title}</div>
      <div style={{ fontSize: 12, color: TEXT2, fontFamily: 'system-ui', marginTop: 1 }}>{subtitle}</div>
    </div>
  </div>
);
