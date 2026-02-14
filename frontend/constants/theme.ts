// Playslot Brand Colors - Custom Color Scheme with Logo Teal
export const LightColors = {
  // Primary Brand Colors (From Logo - Keep Teal)
  primary: '#4EC0D6',
  primaryDark: '#3AA5BA',
  primaryLight: '#6FD4E3',
  
  // Background Colors (Custom Scheme)
  background: '#FBF7EB',        // Cream/Beige
  backgroundSecondary: '#FFFFFF', // White
  backgroundCard: '#FFFFFF',     // White
  
  // Accent Colors
  accent: '#4EC0D6',
  accentLight: '#E0F7FA',
  
  // Text Colors (Custom Scheme)
  text: '#1A1A2E',              // Dark Navy
  textPrimary: '#1A1A2E',       // Dark Navy
  textSecondary: '#545454',      // Gray
  textMuted: '#8B8B8B',         // Lighter Gray
  textLight: '#FFFFFF',          // White
  
  // Status Colors
  success: '#4EC0D6',
  warning: '#FF9800',
  error: '#F44336',
  info: '#4EC0D6',
  
  // UI Colors
  border: '#D4D0C4',            // Light border based on cream
  divider: '#E8E4D8',           // Divider based on cream
  shadow: '#000000',
  overlay: 'rgba(26, 26, 46, 0.5)',
  
  // Rating
  rating: '#FFB300',
};

export const DarkColors = {
  // Primary Brand Colors (From Logo - Keep Teal)
  primary: '#4EC0D6',
  primaryDark: '#3AA5BA',
  primaryLight: '#6FD4E3',
  
  // Background Colors (Custom Scheme)
  background: '#1A1A2E',         // Dark Navy
  backgroundSecondary: '#252538', // Slightly lighter navy
  backgroundCard: '#2A2A3E',     // Card background
  
  // Accent Colors
  accent: '#4EC0D6',
  accentLight: '#1F3A40',
  
  // Text Colors (Custom Scheme)
  text: '#FFFFFF',               // White
  textPrimary: '#FFFFFF',        // White
  textSecondary: '#FBF7EB',      // Cream
  textMuted: '#9A9AA0',          // Muted gray
  textLight: '#FFFFFF',          // White
  
  // Status Colors
  success: '#4EC0D6',
  warning: '#FF9800',
  error: '#F44336',
  info: '#4EC0D6',
  
  // UI Colors
  border: '#3A3A4E',             // Dark border
  divider: '#2F2F42',            // Dark divider
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