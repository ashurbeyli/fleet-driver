import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, Input, UnifiedSelectBox } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

const CITIES = [
  { id: 'ankara', label: 'Ankara', value: 'ankara' },
  { id: 'istanbul', label: 'Istanbul', value: 'istanbul' },
  { id: 'izmir', label: 'İzmir', value: 'izmir' },
  { id: 'antalya', label: 'Antalya', value: 'antalya' },
  { id: 'mersin', label: 'Mersin', value: 'mersin' },
  { id: 'adana', label: 'Adana', value: 'adana' },
];

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<'phone' | 'verification'>('phone');
  const [verificationCode, setVerificationCode] = useState<string>('');

  const handlePhoneSubmit = async () => {
    if (!selectedCity) {
      Alert.alert('Error', 'Please select a city');
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('verification');
    }, 1500);
  };

  const handleVerificationSubmit = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess?.();
    }, 1500);
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Format as XXX XXX XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return cleaned;
  };

  const renderPhoneStep = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Fleet Driver</Text>
        <Text style={styles.subtitle}>Control Centre</Text>
        <Text style={styles.description}>
          Login to your account to continue
        </Text>
      </View>

      <View style={styles.form}>
        <UnifiedSelectBox
          label="Select your city"
          placeholder="Choose your working city"
          options={CITIES}
          selectedValue={selectedCity}
          onSelect={(option) => setSelectedCity(option.id)}
          helpText="Select the city where you work as a driver"
        />

        <Input
          label="Your phone number"
          placeholder="5XX XXX XXXX"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
          keyboardType="phone-pad"
          maxLength={11}
          helpText="Enter the phone number you use to log into your driver account. An SMS will be sent to verify your identity."
        />

        <Button
          title="Login"
          onPress={handlePhoneSubmit}
          variant="primary"
          size="large"
          disabled={!selectedCity || !phoneNumber}
          style={styles.submitButton}
        />
      </View>
    </View>
  );

  const renderVerificationStep = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your phone
        </Text>
        <Text style={styles.phoneDisplay}>+90 {phoneNumber}</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="SMS Code"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="numeric"
          maxLength={6}
          helpText="Verification code sent to your phone number. You can request a new code in 10:00 minutes."
        />

        <View style={styles.buttonRow}>
          <Button
            title="Resend Code"
            onPress={() => setStep('phone')}
            variant="outline"
            size="medium"
            style={styles.resendButton}
          />
          <Button
            title="Verify"
            onPress={handleVerificationSubmit}
            variant="primary"
            size="large"
            disabled={verificationCode.length !== 6}
            style={styles.verifyButton}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'phone' ? renderPhoneStep() : renderVerificationStep()}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Fleet Driver. All Rights Reserved.
          </Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Terms of Use</Text>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerLink}>Contact Us</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    ...Platform.select({
      web: {
        background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.backgroundDark} 100%)`,
      },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
    ...Platform.select({
      web: {
        position: 'relative',
        overflow: 'visible',
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.display,
    fontWeight: TYPOGRAPHY.weights.extrabold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    ...Platform.select({
      web: {
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
    }),
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.sizes.lg * TYPOGRAPHY.lineHeights.relaxed,
    fontWeight: TYPOGRAPHY.weights.normal,
  },
  form: {
    marginBottom: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xxl,
    ...DESIGN.shadows.md,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        overflow: 'visible',
        zIndex: 1,
      },
    }),
  },
  phoneDisplay: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: SPACING.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.lg,
  },
  resendButton: {
    flex: 0.4,
  },
  verifyButton: {
    flex: 0.55,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerLink: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary,
    marginHorizontal: SPACING.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'color 0.2s ease',
        '&:hover': {
          color: COLORS.primaryDark,
        },
      },
    }),
  },
});

export default LoginScreen;
