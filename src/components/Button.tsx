import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyleCombined}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: DESIGN.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...DESIGN.shadows.sm,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary, // Use dark gray for primary buttons
    ...Platform.select({
      web: {
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
      },
    }),
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    ...Platform.select({
      web: {
        background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryDark} 100%)`,
      },
    }),
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    ...Platform.select({
      web: {
        background: 'transparent',
      },
    }),
  },
  // Sizes
  small: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 40,
  },
  medium: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xl,
    minHeight: 56,
  },
  // States
  disabled: {
    opacity: 0.6,
    ...Platform.select({
      web: {
        cursor: 'not-allowed' as any,
      },
    }),
  },
  // Text styles
  text: {
    fontWeight: TYPOGRAPHY.weights.semibold,
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.text.inverse,
  },
  secondaryText: {
    color: COLORS.text.inverse,
  },
  outlineText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  smallText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    lineHeight: TYPOGRAPHY.sizes.sm * TYPOGRAPHY.lineHeights.tight,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.sizes.md,
    lineHeight: TYPOGRAPHY.sizes.md * TYPOGRAPHY.lineHeights.tight,
  },
  largeText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    lineHeight: TYPOGRAPHY.sizes.lg * TYPOGRAPHY.lineHeights.tight,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button;
