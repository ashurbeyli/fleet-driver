// App configuration
export const APP_CONFIG = {
  name: 'Fleet Driver',
  version: '1.0.0',
  description: 'Taxi park fleet driver management app',
};

// Colors - Dark gray with subtle yellow accents
export const COLORS = {
  primary: '#2C3E50', // Dark slate gray (main brand color)
  primaryLight: '#34495E',
  primaryDark: '#1A252F',
  secondary: '#F39C12', // Subtle yellow accent
  secondaryLight: '#F5B041',
  secondaryDark: '#D68910',
  success: '#10B981', // Modern emerald
  successLight: '#34D399',
  warning: '#F39C12', // Subtle amber
  warningLight: '#F5B041',
  error: '#EF4444', // Modern red
  errorLight: '#F87171',
  background: '#F8F9FA', // Very light gray
  backgroundDark: '#ECF0F1', // Light cool gray
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: {
    primary: '#2C3E50', // Dark slate gray
    secondary: '#7F8C8D',
    tertiary: '#95A5A6',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  shadow: 'rgba(44, 62, 80, 0.08)', // Dark gray shadow
  shadowDark: 'rgba(44, 62, 80, 0.15)',
  accent: '#F39C12', // Yellow accent for highlights
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Typography
export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Design tokens
export const DESIGN = {
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: COLORS.shadowDark,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  gradients: {
    primary: ['#2C3E50', '#34495E'],
    secondary: ['#F39C12', '#F5B041'],
    success: ['#10B981', '#34D399'],
    surface: ['#FFFFFF', '#F8F9FA'],
  },
};

// Platform specific values
export const PLATFORM = {
  isWeb: typeof window !== 'undefined',
  isIOS: false, // Will be set dynamically
  isAndroid: false, // Will be set dynamically
};
