import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  error?: string;
  helpText?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  maxLength?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  returnKeyType,
  error,
  helpText,
  keyboardType = 'default',
  maxLength,
  style,
  inputStyle,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        isFocused && !error && styles.inputFocused,
        error && styles.inputError,
        disabled && styles.inputDisabled,
      ]}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...Platform.select({
            web: {
              autoComplete: keyboardType === 'email-address' ? 'email' : 'off',
            },
          })}
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    minHeight: 56,
    ...DESIGN.shadows.sm,
    ...Platform.select({
      web: {
        outline: 'none',
        outlineStyle: 'none',
      },
    }),
  },
  inputFocused: {
    borderColor: '#3B82F6', // Blue color for focus state
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  inputDisabled: {
    backgroundColor: COLORS.backgroundDark,
    borderColor: COLORS.borderLight,
    opacity: 0.7,
  },
  input: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.primary,
    paddingVertical: 0,
    fontWeight: TYPOGRAPHY.weights.medium,
    ...Platform.select({
      web: {
        outline: 'none',
      },
    }),
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  helpText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
    lineHeight: TYPOGRAPHY.sizes.sm * TYPOGRAPHY.lineHeights.relaxed,
    fontWeight: TYPOGRAPHY.weights.normal,
  },
});

export default Input;
