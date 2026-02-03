// Playslot Brand Colors - Based on Logo
export const LightColors = {
  // Primary Brand Colors
  primary: '#4EC0D6',
  primaryDark: '#3AA5BA',
  primaryLight: '#6FD4E3',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundCard: '#FFFFFF',
  
  // Accent Colors
  accent: '#4EC0D6',
  accentLight: '#E0F7FA',
  
  // Text Colors
  text: '#30363D',
  textPrimary: '#30363D',
  textSecondary: '#6C757D',
  textMuted: '#ADB5BD',
  textLight: '#FFFFFF',
  
  // Status Colors
  success: '#4EC0D6',
  warning: '#FF9800',
  error: '#F44336',
  info: '#4EC0D6',
  
  // UI Colors
  border: '#DEE2E6',
  divider: '#E9ECEF',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Rating
  rating: '#FFB300',
};

export const DarkColors = {
  // Primary Brand Colors
  primary: '#4EC0D6',
  primaryDark: '#3AA5BA',
  primaryLight: '#6FD4E3',
  
  // Background Colors
  background: '#1A1D23',
  backgroundSecondary: '#242830',
  backgroundCard: '#2C3038',
  
  // Accent Colors
  accent: '#4EC0D6',
  accentLight: '#1F3A40',
  
  // Text Colors
  text: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#B8C5D3',
  textMuted: '#8B98A8',
  textLight: '#FFFFFF',
  
  // Status Colors
  success: '#4EC0D6',
  warning: '#FF9800',
  error: '#F44336',
  info: '#4EC0D6',
  
  // UI Colors
  border: '#3D444D',
  divider: '#2C3038',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
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

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
};

export const Animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};