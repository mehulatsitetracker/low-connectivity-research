import React from 'react';

const TEAL = '#00847C';

export const Fab: React.FC = () => (
  <div style={{
    position: 'absolute', bottom: 70, right: 16,
    width: 52, height: 52, borderRadius: 26,
    background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)', cursor: 'pointer',
  }}>
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 3V19M3 11H19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  </div>
);
