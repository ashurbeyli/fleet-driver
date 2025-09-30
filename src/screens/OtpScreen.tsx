import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, OtpInput } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { RootStackParamList } from '../types';
import { authApi } from '../api';
import { authService } from '../services/authService';

type OtpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Otp'>;
type OtpScreenRouteProp = RouteProp<RootStackParamList, 'Otp'>;

const OtpScreen: React.FC = () => {
  const navigation = useNavigation<OtpScreenNavigationProp>();
  const route = useRoute<OtpScreenRouteProp>();
  
  // Get data from route params
  const phoneNumber = route.params?.phoneNumber || '';
  const parkName = route.params?.parkName || '';
  const parkId = route.params?.parkId || '';
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(0);

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Start resend timer when component mounts
  useEffect(() => {
    setResendTimer(60); // 60 seconds
  }, []);

  const handleOtpChange = (text: string) => {
    setOtp(text);
    setError(''); // Clear error when user types
  };

  const handleOtpComplete = (completedOtp: string) => {
    // Don't auto-verify, just clear error
    // User will click the verify button when ready
    if (completedOtp.length === 6) {
      setError('');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    if (!parkId) {
      setError('Park information is missing. Please go back and login again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with real API call
      // const response = await authApi.verifyOtp(phoneNumber, parkId, otp);
      
      // Mock successful response for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        isValid: true,
        message: 'OTP verified successfully',
        accessToken: 'mock-access-token-12345',
        refreshToken: 'mock-refresh-token-67890',
        driver: {
          id: 'driver-123',
          contractorProfileId: 'contractor-456',
          phone: phoneNumber,
          name: 'Test Driver',
          parkId: parkId,
          parkName: parkName,
          status: 1,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isAgreed: true,
          agreedAt: new Date().toISOString(),
        },
        parkId: parkId,
      };
      
      if (mockResponse.isValid) {
        // Save authentication data to storage (works on both web and mobile)
        await authService.saveAuthData({
          accessToken: mockResponse.accessToken,
          refreshToken: mockResponse.refreshToken,
          driver: mockResponse.driver,
          parkId: mockResponse.parkId,
        });
        
        console.log('Authentication successful! Data saved to storage.');
        
        // Show success message with driver name
        Alert.alert(
          'Success', 
          mockResponse.message || `Welcome ${mockResponse.driver.name}! You're now logged in.`
        );
        
        // Navigate to dashboard
        navigation.navigate('Dashboard');
      } else {
        setError(mockResponse.message || 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError('Verification failed. Please check your code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    setError('');

    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOtp('');
      setResendTimer(60);
      // TODO: Implement resend OTP API call
      console.log('Resending OTP to:', phoneNumber);
      Alert.alert('Success', 'Verification code sent successfully!');
    } catch (error) {
      console.error('Resend OTP failed:', error);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Phone number is already complete with country code, e.g., +994704220692
  // No formatting needed

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.subtitle}>Enter Verification Code</Text>
            <Text style={styles.description}>
              We've sent a 6-digit verification code to:
            </Text>
            <Text style={styles.phoneDisplay}>{phoneNumber}</Text>
            <Text style={styles.parkInfo}>Park: {parkName}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.otpContainer}>
              <Text style={styles.otpLabel}>Verification Code</Text>
              <OtpInput
                length={6}
                value={otp}
                onChangeText={handleOtpChange}
                onComplete={handleOtpComplete}
                error={error}
                disabled={isLoading}
              />
              <Text style={styles.otpHelpText}>
                Enter the 6-digit code sent to your phone number
              </Text>
            </View>

            <Button
              title="Verify Code"
              onPress={handleVerifyOtp}
              variant="primary"
              size="large"
              disabled={otp.length !== 6 || isLoading}
              style={styles.verifyButton}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive the code?
              </Text>
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={resendTimer > 0 || isLoading}
                style={[
                  styles.resendButton,
                  (resendTimer > 0 || isLoading) && styles.resendButtonDisabled,
                ]}
              >
                <Text style={[
                  styles.resendButtonText,
                  (resendTimer > 0 || isLoading) && styles.resendButtonTextDisabled,
                ]}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>← Back to Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 Fleet Driver. All Rights Reserved.</Text>
            <View style={styles.footerLinks}>
              <Text style={styles.footerLink}>Terms of Use</Text>
              <Text style={styles.footerLink}>Privacy Policy</Text>
              <Text style={styles.footerLink}>Contact Us</Text>
            </View>
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
    marginBottom: SPACING.md,
  },
  phoneDisplay: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  parkInfo: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.weights.medium,
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
  otpContainer: {
    marginBottom: SPACING.xl,
  },
  otpLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  otpHelpText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.sizes.sm * TYPOGRAPHY.lineHeights.relaxed,
    fontWeight: TYPOGRAPHY.weights.normal,
  },
  verifyButton: {
    marginBottom: SPACING.xl,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  resendText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  resendButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: DESIGN.borderRadius.md,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: COLORS.backgroundDark,
        },
      },
    }),
  },
  resendButtonDisabled: {
    opacity: 0.5,
    ...Platform.select({
      web: {
        cursor: 'not-allowed' as any,
      },
    }),
  },
  resendButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  resendButtonTextDisabled: {
    color: COLORS.text.tertiary,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'opacity 0.2s ease',
        '&:hover': {
          opacity: 0.7,
        },
      },
    }),
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.weights.medium,
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

export default OtpScreen;
