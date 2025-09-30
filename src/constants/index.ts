// App configuration
export const APP_CONFIG = {
  name: 'Fleet Driver',
  version: '1.0.0',
  description: 'Taxi park fleet driver management app',
};

// Colors
export const COLORS = {
  primary: '#6366F1', // Modern indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#8B5CF6', // Modern purple
  secondaryLight: '#A78BFA',
  secondaryDark: '#7C3AED',
  success: '#10B981', // Modern emerald
  successLight: '#34D399',
  warning: '#F59E0B', // Modern amber
  warningLight: '#FBBF24',
  error: '#EF4444', // Modern red
  errorLight: '#F87171',
  background: '#FAFAFA',
  backgroundDark: '#F4F4F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: {
    primary: '#111827', // Darker for better contrast
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
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
    primary: ['#6366F1', '#8B5CF6'],
    secondary: ['#8B5CF6', '#A78BFA'],
    success: ['#10B981', '#34D399'],
    surface: ['#FFFFFF', '#F8FAFC'],
  },
};

// Platform specific values
export const PLATFORM = {
  isWeb: typeof window !== 'undefined',
  isIOS: false, // Will be set dynamically
  isAndroid: false, // Will be set dynamically
};
