import type React from 'react';
import { colors, radii } from '../theme';

interface Props {
  onConfirm: () => void;
  onPreviewOnly: () => void;
  onClose: () => void;
}

export const DirectionsDialog: React.FC<Props> = ({ onConfirm, onPreviewOnly, onClose }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}
  >
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: colors.overlay }} />
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 320,
        background: colors.surface,
        borderRadius: radii.modal,
        padding: '22px 20px 20px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 28,
          height: 28,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: colors.textSecondary,
          fontSize: 22,
          lineHeight: 1,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'inherit',
        }}
      >
        &times;
      </button>
      <div style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginBottom: 6, textAlign: 'center' }}>
        Heading to site?
      </div>
      <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 18, textAlign: 'center', lineHeight: 1.4 }}>
        We'll mark you as en route.
      </div>
      <button
        onClick={onConfirm}
        style={{
          width: '100%',
          padding: '12px 0',
          borderRadius: radii.pill,
          border: 'none',
          background: colors.brandTeal,
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: 10,
        }}
      >
        Yes, I'm on my way
      </button>
      <button
        onClick={onPreviewOnly}
        style={{
          width: '100%',
          padding: '12px 0',
          borderRadius: radii.pill,
          border: `1px solid ${colors.border}`,
          background: colors.surface,
          color: colors.textPrimary,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Just checking the route
      </button>
    </div>
  </div>
);
