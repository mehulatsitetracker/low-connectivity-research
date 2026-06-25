// Sitetracker Design Tokens — Forms Improvement prototype
// Mirrors apps/adhoc-job/src/theme.ts so visuals stay consistent across prototypes.
export const colors = {
  // Core brand
  topBar: '#1D2D34',
  brandTeal: '#00847C',
  brandTealLight: '#D6F5F3',
  brandTealDeep: '#006F68',

  // Backgrounds
  background: '#F7F8F7',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5F5',

  // Text
  textPrimary: '#1D2D34',
  textSecondary: '#706E6B',
  textTertiary: '#AAADAE',
  textLink: '#00847C',

  // Borders & dividers
  border: '#DDDBDA',
  borderLight: '#EEEEEE',

  // Status dots (shared with adhoc-job)
  statusBlue: '#1976D2',
  statusGreen: '#4CAF50',
  statusYellow: '#FFC107',
  statusOrange: '#FF9800',

  // Forms-specific state colors (PRD §5.3 field-state language)
  complete: '#027E46',
  completeBg: '#E0F2E9',
  pending: '#FF9800',
  pendingDeep: '#B47210',
  pendingBg: '#FFF1DA',
  error: '#E53935',
  errorBg: '#FCE5E4',
  warning: '#FFB75D',
  warningBg: '#FFF1CC',
  warningDeep: '#8C5A00',

  // Bottom nav
  navActive: '#00847C',
  navInactive: '#706E6B',
  navActiveBg: '#E8F5F3',

  overlay: 'rgba(0,0,0,0.45)',
};

export const radii = {
  standard: 4,
  card: 8,
  modal: 12,
  bottomSheet: '16px 16px 0 0',
  button: 4,
  pill: 20,
  input: 8,
};

export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro', system-ui, sans-serif",
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700 as const,
    letterSpacing: '0.6px',
    textTransform: 'uppercase' as const,
  },
};

export const spacing = {
  headerHeight: 44,
  cardPadding: 14,
  contentPadding: 16,
  bottomNavHeight: 56,
};
