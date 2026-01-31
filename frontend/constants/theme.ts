// Playslot Brand Colors - Based on Logo
export const Colors = {
  // Primary Brand Colors
  primary: '#4EC0D6',      // Teal from logo
  primaryDark: '#3AA5BA',  // Darker teal
  primaryLight: '#6FD4E3', // Lighter teal
  
  // Background Colors
  background: '#30363D',    // Dark grey from logo
  backgroundLight: '#FFFFFF',
  backgroundCard: '#3D444D',
  
  // Accent Colors
  accent: '#4EC0D6',
  accentLight: '#E0F7FA',   // Very light teal
  
  // Text Colors
  text: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#B8C5D3',
  textMuted: '#8B98A8',
  textDark: '#30363D',
  
  // Status Colors
  success: '#4EC0D6',
  warning: '#FF9800',
  error: '#F44336',
  info: '#4EC0D6',
  
  // UI Colors
  border: '#4A5460',
  divider: '#3D444D',
  shadow: '#000000',
  
  // Rating
  rating: '#FFB300',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
};

export const FontSizes = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  heading: 24,
  title: 28,
  hero: 32,
};

export const FontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: 'bold',
} as const;
