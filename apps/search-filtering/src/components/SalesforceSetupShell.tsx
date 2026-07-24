import { useState } from 'react';
import type React from 'react';
import { Search, HelpCircle, Settings, Bell, Star, Plus, ChevronDown } from 'lucide-react';
import { sf } from '../adminTheme';

/** Simplified Salesforce cloud mark. */
function SalesforceCloud() {
  return (
    <svg width="34" height="24" viewBox="0 0 34 24" aria-label="Salesforce" role="img">
      <path
        fill={sf.cloud}
        d="M14 4.2a5.6 5.6 0 0 1 9.1 1.2 6.7 6.7 0 0 1 2.8-.6 6.6 6.6 0 0 1 1.2 13.1c-.4.07-.8.1-1.2.1H8.4A6.4 6.4 0 0 1 6 5.6a5.9 5.9 0 0 1 2.6.6A5.6 5.6 0 0 1 14 4.2Z"
      />
    </svg>
  );
}

/** App-launcher waffle (3×3 dots). */
function Waffle() {
  const dots = [0, 1, 2];
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-label="App Launcher" role="img" style={{ cursor: 'pointer' }}>
      {dots.map((r) => dots.map((c) => (
        <circle key={`${r}-${c}`} cx={2 + c * 7} cy={2 + r * 7} r="1.6" fill="#747474" />
      )))}
    </svg>
  );
}

/** Small upload-to-cloud glyph. */
function CloudUp() {
  return (
    <svg width="19" height="15" viewBox="0 0 20 15" aria-hidden="true">
      <path d="M15.5 12H5a4 4 0 0 1-.6-7.95A5 5 0 0 1 14 4.2a3.8 3.8 0 0 1 1.5 7.8Z" fill="none" stroke="#5c5c5c" strokeWidth="1.3" />
      <path d="M10 10V5.5M8 7.3 10 5.3l2 2" fill="none" stroke="#5c5c5c" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const rightIcon: React.CSSProperties = { color: '#5c5c5c', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' };

/** Left Setup tree — mirrors the "Custom Metadata Types" node under Custom Code. */
function SetupSidebar() {
  const [term, setTerm] = useState('meta');
  return (
    <div
      style={{
        width: 258,
        flexShrink: 0,
        background: '#fff',
        borderRight: `1px solid ${sf.borderLight}`,
        overflowY: 'auto',
        padding: '14px 12px',
        fontSize: 13,
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8, background: '#fff',
          border: `1px solid ${sf.border}`, borderRadius: sf.radius, padding: '6px 10px', marginBottom: 16,
        }}
      >
        <Search size={13} color={sf.textMuted} />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          aria-label="Quick Find"
          style={{ border: 'none', outline: 'none', fontSize: 13, width: '100%', color: sf.text, fontFamily: sf.font }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: sf.text, fontWeight: 400, marginBottom: 8 }}>
        <ChevronDown size={13} color={sf.textMuted} />
        <span>Custom Code</span>
      </div>

      <div
        style={{
          marginLeft: 12,
          padding: '7px 10px',
          background: sf.treeActiveBg,
          borderLeft: `3px solid ${sf.treeActiveBar}`,
          borderRadius: '0 3px 3px 0',
          color: sf.text,
        }}
      >
        Custom <mark style={{ background: sf.searchHighlight, color: 'inherit', padding: 0 }}>Meta</mark>data Types
      </div>

      <div style={{ marginTop: 22, fontSize: 12, color: sf.textMuted, lineHeight: 1.5 }}>
        Didn't find what you're looking for?<br />
        Try using <span style={{ color: sf.link }}>Global Search.</span>
      </div>
    </div>
  );
}

/**
 * Classic Salesforce Setup chrome: Lightning global header + Setup context nav +
 * the left Setup tree + a scrollable main content region.
 */
export const SalesforceSetupShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      background: sf.pageBg,
      fontFamily: sf.font,
      color: sf.text,
    }}
  >
    {/* ── Global header ────────────────────────────────────────── */}
    <div
      style={{
        height: 50,
        background: sf.headerBg,
        borderBottom: `1px solid ${sf.borderLight}`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 16px',
        flexShrink: 0,
      }}
    >
      <SalesforceCloud />

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 9, background: '#fff',
            border: `1px solid ${sf.border}`, borderRadius: 22, padding: '6px 16px', width: 'min(600px, 58%)',
          }}
        >
          <Search size={15} color={sf.textMuted} />
          <span style={{ fontSize: 13, color: sf.textMuted }}>Search Setup</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <span style={{ ...rightIcon, gap: 2 }}><Star size={17} /><ChevronDown size={12} /></span>
        <span style={rightIcon}><Plus size={17} /></span>
        <span style={rightIcon}><CloudUp /></span>
        <span style={rightIcon}><HelpCircle size={17} /></span>
        <span style={{ ...rightIcon, color: sf.brand }}><Settings size={17} /></span>
        <span style={{ ...rightIcon, position: 'relative' }}>
          <Bell size={17} />
          <span
            style={{
              position: 'absolute', top: -7, right: -9, background: sf.required, color: '#fff',
              fontSize: 9, fontWeight: 700, lineHeight: '14px', minWidth: 15, height: 15,
              textAlign: 'center', borderRadius: 8, padding: '0 3px',
            }}
          >
            13
          </span>
        </span>
        <span
          style={{
            width: 28, height: 28, borderRadius: '50%', background: '#7cb5c9',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600,
          }}
        >
          MK
        </span>
      </div>
    </div>

    {/* ── Setup context nav ────────────────────────────────────── */}
    <div
      style={{
        background: sf.headerBg,
        borderBottom: `1px solid ${sf.borderLight}`,
        flexShrink: 0,
        boxShadow: '0 2px 3px rgba(0,0,0,0.05)',
        zIndex: 1,
      }}
    >
      <div style={{ height: 3, background: 'linear-gradient(90deg,#0b5cab,#1b96ff)' }} />
      <div style={{ height: 44, display: 'flex', alignItems: 'center', gap: 22, padding: '0 16px' }}>
        <Waffle />
        <span style={{ fontWeight: 700, fontSize: 15 }}>Setup</span>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 22, fontSize: 13, height: 44 }}>
          <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: sf.text, borderBottom: `3px solid ${sf.brand}` }}>
            Home
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: sf.textWeak, cursor: 'pointer' }}>
            Object Manager <ChevronDown size={13} />
          </span>
        </div>
      </div>
    </div>

    {/* ── Body: Setup tree + content ───────────────────────────── */}
    <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
      <SetupSidebar />
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto', background: '#fff', position: 'relative' }}>
        {/* right-edge collapse tab (decorative) */}
        <div
          style={{
            position: 'absolute', top: 300, right: 0, width: 16, height: 42,
            background: '#0b5cab', borderRadius: '4px 0 0 4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10,
          }}
        >
          ◀
        </div>
        {children}
      </div>
    </div>
  </div>
);
