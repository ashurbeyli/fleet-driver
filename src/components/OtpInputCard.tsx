import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface OtpInputCardProps {
  phoneNumber?: string;
  onComplete: (otp: string) => void;
  onResend?: () => void;
  error?: string | null;
  disabled?: boolean;
  resendTimer?: number;
  length?: number;
}

const OtpInputCard: React.FC<OtpInputCardProps> = ({
  phoneNumber,
  onComplete,
  onResend,
  error = null,
  disabled = false,
  resendTimer = 0,
  length = 6,
}) => {
  const { t } = useLanguage();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(resendTimer);
  const [hasCompleted, setHasCompleted] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Update timer when resendTimer prop changes
  useEffect(() => {
    setTimer(resendTimer);
  }, [resendTimer]);

  // Auto-verify when OTP is complete (only once)
  useEffect(() => {
    if (otp.length === length && !disabled && !hasCompleted) {
      setHasCompleted(true);
      onComplete(otp);
    }
  }, [otp, length, disabled, onComplete, hasCompleted]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length <= 1) {
      const newOtp = otp.split('');
      newOtp[index] = numericValue;
      const updatedOtp = newOtp.join('').slice(0, length);
      setOtp(updatedOtp);
      
      // Reset completion flag when OTP changes
      if (hasCompleted) {
        setHasCompleted(false);
      }

      // Auto-focus next input
      if (numericValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '').slice(0, length);
    setOtp(numericText);
    
    // Focus the last filled input or first empty input
    const focusIndex = Math.min(numericText.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = () => {
    if (timer > 0 || !onResend) return;
    onResend();
    setTimer(60); // Reset timer
    setOtp(''); // Clear OTP
    setHasCompleted(false); // Reset completion flag
    // Focus first input
    inputRefs.current[0]?.focus();
  };

  return (
    <View style={styles.otpCard}>
      {/* Phone Icon Section */}
      <View style={styles.phoneSection}>
        <View style={styles.phoneIconContainer}>
          <Ionicons name="phone-portrait" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.phoneLabel}>{t.otp.codeSentTo}</Text>
        <Text style={styles.phoneNumber}>{phoneNumber || t.otp.yourPhone}</Text>
      </View>
      
      {/* OTP Input */}
      <View style={styles.otpContainer}>
        {Array.from({ length }, (_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={[
              styles.otpInput,
              otp[index] ? styles.otpInputFilled : null,
              error ? styles.otpInputError : null,
            ]}
            value={otp[index] || ''}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
            editable={!disabled}
          />
        ))}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#E74C3C" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Resend Timer */}
      <View style={styles.resendContainer}>
        {timer > 0 ? (
          <Text style={styles.timerText}>
            {t.otp.resendCodeIn} <Text style={styles.timerValue}>{timer}s</Text>
          </Text>
        ) : (
          <TouchableOpacity
            onPress={handleResend}
            disabled={disabled || !onResend}
            activeOpacity={0.7}
          >
            <Text style={styles.resendLink}>{t.otp.resendCode}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Help Text */}
      <Text style={styles.helpText}>
        {t.otp.didntReceiveCode}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  otpCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...DESIGN.shadows.md,
  },
  // Phone Section
  phoneSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  phoneIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  phoneLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: 6,
    paddingHorizontal: SPACING.md,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: DESIGN.borderRadius.md,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    backgroundColor: COLORS.background,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  otpInputError: {
    borderColor: '#E74C3C',
    backgroundColor: 'rgba(231, 76, 60, 0.05)',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: '#E74C3C',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  timerText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  timerValue: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  resendLink: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.primary,
  },
  helpText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.weights.medium,
    lineHeight: TYPOGRAPHY.sizes.xs * 1.5,
  },
});

export default OtpInputCard;