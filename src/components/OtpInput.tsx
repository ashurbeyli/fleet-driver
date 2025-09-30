import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';

interface OtpInputProps {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  onComplete?: (otp: string) => void;
  error?: string;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChangeText,
  onComplete,
  error,
  disabled = false,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleTextChange = (text: string, index: number) => {
    const newValue = value.split('');
    
    // Only allow single digit
    if (text.length > 1) {
      text = text.slice(-1);
    }
    
    // Only allow numbers
    if (!/^\d*$/.test(text)) {
      return;
    }

    newValue[index] = text;
    const newOtp = newValue.join('').slice(0, length);
    onChangeText(newOtp);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const renderInput = (index: number) => {
    const digit = value[index] || '';
    const isFocused = focusedIndex === index;
    const hasError = !!error;

    return (
      <TextInput
        key={index}
        ref={(ref) => {
          if (ref) inputRefs.current[index] = ref;
        }}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        value={digit}
        onChangeText={(text) => handleTextChange(text, index)}
        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
        onFocus={() => handleFocus(index)}
        onBlur={handleBlur}
        keyboardType="numeric"
        maxLength={1}
        editable={!disabled}
        selectTextOnFocus
        textAlign="center"
        caretHidden={Platform.OS === 'web'}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        {Array.from({ length }, (_, index) => renderInput(index))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    borderRadius: DESIGN.borderRadius.md,
    backgroundColor: COLORS.surface,
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    ...DESIGN.shadows.sm,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        transition: 'all 0.2s ease',
        cursor: 'text',
      },
    }),
  },
  inputFocused: {
    borderColor: COLORS.primary,
    ...Platform.select({
      web: {
        boxShadow: `0 0 0 3px ${COLORS.primary}20`,
      },
    }),
  },
  inputError: {
    borderColor: COLORS.error,
    ...Platform.select({
      web: {
        boxShadow: `0 0 0 3px ${COLORS.error}20`,
      },
    }),
  },
  inputDisabled: {
    backgroundColor: COLORS.backgroundDark,
    borderColor: COLORS.borderLight,
    opacity: 0.7,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.sm,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.weights.medium,
  },
});

export default OtpInput;
