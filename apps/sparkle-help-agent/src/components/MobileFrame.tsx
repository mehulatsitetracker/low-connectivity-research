import type React from 'react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    width: 390,
    height: 844,
    borderRadius: 40,
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    border: '6px solid #222',
    flexShrink: 0,
  }}>
    {/* Status bar */}
    <div style={{
      height: 54,
      background: '#f8f8f8',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: '0 24px 8px',
      fontSize: 14,
      fontWeight: 600,
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <svg width="16" height="12" viewBox="0 0 16 12"><path d="M1 8h2v4H1zM5 5h2v7H5zM9 2h2v10H9zM13 0h2v12h-2z" fill="#333"/></svg>
        <svg width="16" height="12" viewBox="0 0 24 16"><path d="M1 5.5A12.5 12.5 0 0112 1a12.5 12.5 0 0111 4.5M5 9.5A8 8 0 0112 6a8 8 0 017 3.5M9 13.5A4 4 0 0112 11a4 4 0 013 2.5" stroke="#333" fill="none" strokeWidth="2"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0" y="1" width="21" height="10" rx="2" stroke="#333" fill="none" strokeWidth="1.5"/><rect x="2" y="3" width="15" height="6" rx="1" fill="#333"/><rect x="22" y="4" width="2" height="4" rx="1" fill="#333"/></svg>
      </span>
    </div>
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {children}
    </div>
    {/* Home indicator */}
    <div style={{ height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ width: 134, height: 5, borderRadius: 3, background: '#ddd' }} />
    </div>
  </div>
);
