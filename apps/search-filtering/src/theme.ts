export const colors = {
  topBar: '#1D2D34',
  brandTeal: '#00847C',
  brandTealLight: '#D6F5F3',

  background: '#F7F8F7',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5F5',

  textPrimary: '#1D2D34',
  textSecondary: '#706E6B',
  textTertiary: '#AAADAE',
  textLink: '#00847C',

  border: '#DDDBDA',
  borderLight: '#EEEEEE',

  statusBlue: '#1976D2',
  statusGreen: '#4CAF50',
  statusYellow: '#FFC107',
  statusOrange: '#FF9800',

  error: '#E53935',
  success: '#027E46',
  warning: '#FFB75D',

  overlay: 'rgba(0,0,0,0.4)',

  navActive: '#00847C',
  navInactive: '#706E6B',
  navActiveBg: '#E8F5F3',

  avatar: '#B0B0B0',
  avatarText: '#FFFFFF',

  notificationUnread: '#F0FAF9',
  mentionText: '#00847C',
};

export const radii = {
  standard: 4,
  card: 8,
  modal: 12,
  button: 4,
  pill: 20,
  input: 8,
};

export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro', system-ui, sans-serif",
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
  bottomNavHeight: 56,
};
