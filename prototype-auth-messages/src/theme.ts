// Sitetracker Design Tokens — matches the prototype app styling
export const colors = {
  // Core brand
  topBar: '#1D2D34',
  brandTeal: '#00847C',
  brandTealLight: '#D6F5F3',

  // Backgrounds
  background: '#F7F8F7',
  surface: '#FFFFFF',

  // Text
  textPrimary: '#1D2D34',
  textSecondary: '#706E6B',
  textTertiary: '#AAADAE',

  // Borders & dividers
  border: '#DDDBDA',

  // Status
  error: '#E53935',
  errorLight: '#FFF5F5',
  success: '#027E46',
  successLight: '#4CAF50',
  warning: '#FFB75D',
  warningDark: '#844800',
  warningLight: '#FFF4E0',

  // Offline
  offlineBg: '#E0E0E0',
  offlineText: '#555555',

  // Salesforce (intentionally kept as SF brand)
  sfBlue: '#0070D2',

  // Overlay
  overlay: 'rgba(0,0,0,0.4)',
};

export const radii = {
  standard: 4,
  modal: 12,
  bottomSheet: '12px 12px 0 0',
  button: 4,
};

export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro', system-ui, sans-serif",
  logo: {
    text: 'SITETR\u25B2CKER',
    fontSize: 18,
    fontWeight: 800 as const,
    letterSpacing: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700 as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};

export const spacing = {
  headerHeight: 44,
  cardPadding: 14,
  contentPadding: 16,
};
