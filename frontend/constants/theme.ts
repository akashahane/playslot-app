// Playslot Brand Colors - Grayscale Palette with Teal Accent
export const LightColors = {
  // Primary Brand Colors (From Logo - Keep Teal)
  primary: '#4EC0D6',
  primaryDark: '#3AA5BA',
  primaryLight: '#6FD4E3',
  
  // Background Colors (Grayscale Palette)
  background: '#f8f9fa',         // Bright Snow - Main background
  backgroundSecondary: '#e9ecef', // Platinum - Secondary areas
  backgroundCard: '#FFFFFF',      // Pure white for cards
  
  // Accent Colors
  accent: '#4EC0D6',
  accentLight: '#E0F7FA',
  
  // Text Colors (Grayscale Palette)
  text: '#212529',               // Carbon Black - Primary text
  textPrimary: '#343a40',        // Gunmetal - Headings
  textSecondary: '#6c757d',      // Slate Grey - Secondary text
  textMuted: '#adb5bd',          // Pale Slate 2 - Muted text
  textLight: '#FFFFFF',          // White on dark backgrounds
  
  // Status Colors
  success: '#4EC0D6',
  warning: '#FF9800',
  error: '#F44336',
  info: '#4EC0D6',
  
  // UI Colors (Grayscale Palette)
  border: '#dee2e6',             // Alabaster Grey - Borders
  divider: '#e9ecef',            // Platinum - Dividers
  shadow: '#000000',
  overlay: 'rgba(33, 37, 41, 0.5)',
  
  // Rating
  rating: '#FFB300',
};

export const DarkColors = {
  // Primary Brand Colors (From Logo - Keep Teal)
  primary: '#4EC0D6',
  primaryDark: '#3AA5BA',
  primaryLight: '#6FD4E3',
  
  // Background Colors (Dark Grayscale)
  background: '#212529',         // Carbon Black - Main background
  backgroundSecondary: '#343a40', // Gunmetal - Secondary areas
  backgroundCard: '#495057',     // Iron Grey - Cards
  
  // Accent Colors
  accent: '#4EC0D6',
  accentLight: '#1F3A40',
  
  // Text Colors (Dark Grayscale)
  text: '#f8f9fa',               // Bright Snow - Primary text
  textPrimary: '#FFFFFF',        // Pure White - Headings
  textSecondary: '#ced4da',      // Pale Slate - Secondary text
  textMuted: '#adb5bd',          // Pale Slate 2 - Muted text
  textLight: '#FFFFFF',          // White
  
  // Status Colors
  success: '#4EC0D6',
  warning: '#FF9800',
  error: '#F44336',
  info: '#4EC0D6',
  
  // UI Colors (Dark Grayscale)
  border: '#495057',             // Iron Grey - Borders
  divider: '#343a40',            // Gunmetal - Dividers
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