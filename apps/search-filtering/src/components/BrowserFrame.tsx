import type React from 'react';

/**
 * Desktop window surface for the admin / web-side prototype — the counterpart
 * to MobileFrame. Fills the available area; children scroll inside.
 */
export const BrowserFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: '100%',
      maxWidth: 1320,
      height: '100%',
      margin: '0 auto',
      borderRadius: 10,
      overflow: 'hidden',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 24px 70px rgba(0,0,0,0.35)',
      border: '1px solid #cfcfcf',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        flex: 1,
        minHeight: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      {children}
    </div>
  </div>
);
