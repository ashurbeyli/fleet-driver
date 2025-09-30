import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

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

  // Only call onComplete when we reach the required length, not on every change
  const previousLengthRef = useRef<number>(0);
  
  useEffect(() => {
    if (value.length === length && onComplete && previousLengthRef.current < length) {
      onComplete(value);
    }
    previousLengthRef.current = value.length;
  }, [value, length, onComplete]);

  const handleTextChange = useCallback((text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d$/.test(text)) {
      return;
    }
    
    const newValue = value.split('');
    
    // Pad array to correct length if needed
    while (newValue.length < length) {
      newValue.push('');
    }
    
    newValue[index] = text;
    const newOtp = newValue.join('').replace(/[^\d]/g, '').slice(0, length);
    
    onChangeText(newOtp);

    // Auto-focus next input only if we added a digit
    if (text && index < length - 1) {
      // Small delay to ensure state is updated before focusing
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
  }, [value, length, onChangeText]);

  const handleKeyPress = useCallback((key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [value]);

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

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

// Calculate responsive input size
const getInputSize = () => {
  const containerPadding = SPACING.xl * 2; // Form padding
  const availableWidth = screenWidth > 480 ? 480 : screenWidth - containerPadding - (SPACING.xl * 2);
  const totalGaps = 5 * 8; // 5 gaps of 8px
  const inputWidth = Math.floor((availableWidth - totalGaps) / 6);
  const inputSize = Math.min(Math.max(inputWidth, 40), 56); // Between 40 and 56
  return inputSize;
};

const inputSize = getInputSize();

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  input: {
    width: inputSize,
    height: inputSize,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    borderRadius: DESIGN.borderRadius.md,
    backgroundColor: COLORS.surface,
    fontSize: Platform.OS === 'web' ? TYPOGRAPHY.sizes.xl : Math.min(TYPOGRAPHY.sizes.xl, inputSize * 0.5),
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    ...DESIGN.shadows.sm,
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
        transition: 'all 0.2s ease',
        cursor: 'text' as any,
      },
    }),
  },
  inputFocused: {
    borderColor: COLORS.secondary,
    ...Platform.select({
      web: {
        boxShadow: `0 0 0 3px ${COLORS.secondary}20`,
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
