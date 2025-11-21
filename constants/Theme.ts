// App Theme Color Palette
export const COLORS = {
  primary: '#0052CC', // Transit Blue (Primary)
  secondary: '#2684FF', // Light Blue
  background: '#F5F7FA', // Soft Gray
  text: '#1A1A1A', // Dark Gray
  accent: '#FFAB00', // Amber (Highlights)
  white: '#FFFFFF',
  lightGray: '#E8EBED',
  mediumGray: '#8B9199',
  error: '#DE350B',
  success: '#00875A',

  // Line Colors (Transit specific)
  lineRed: '#D11241',
  lineBlue: '#0072CE',
  lineYellow: '#FFD100',
  lineOrange: '#D45D00',
  lineGreen: '#00B140',
  lineSilver: '#919D9D',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  h4: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};
