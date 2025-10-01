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
import { Ionicons } from '@expo/vector-icons';
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
  const [resendTimer, setResendTimer] = useState<number>(60);

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

  const handleOtpChange = (text: string) => {
    setOtp(text);
    setError(''); // Clear error when user types
  };

  const handleOtpComplete = (completedOtp: string) => {
    // Auto-verify when 6 digits are entered
    if (completedOtp.length === 6) {
      setError('');
      setOtp(completedOtp);
      // Automatically trigger verification
      handleVerifyOtp(completedOtp);
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp;
    
    if (codeToVerify.length !== 6) {
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
      const response = await authApi.verifyOtp(phoneNumber, parkId, codeToVerify);
      
      if (response.isValid) {
        // Save authentication data to storage (works on both web and mobile)
        await authService.saveAuthData({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          driver: response.driver,
          parkId: response.parkId,
        });
        
        console.log('Authentication successful! Data saved to storage.');
        
        // Show success message with driver name
        Alert.alert(
          'Success', 
          response.message || `Welcome ${response.driver.name}! You're now logged in.`
        );
        
        // Navigate to dashboard
        navigation.navigate('Dashboard');
      } else {
        setError(response.message || 'Invalid verification code. Please try again.');
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>


        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="phone-portrait" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.infoTitle}>Code sent to</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          <View style={styles.parkBadge}>
            <Ionicons name="location" size={16} color={COLORS.text.secondary} />
            <Text style={styles.parkBadgeText}>{parkName}</Text>
          </View>
        </View>

        {/* OTP Input Card */}
        <View style={styles.otpCard}>
          <Text style={styles.otpLabel}>Enter 6-Digit Code</Text>
          <OtpInput
            length={6}
            value={otp}
            onChangeText={handleOtpChange}
            onComplete={handleOtpComplete}
            error={error}
            disabled={isLoading}
          />
          
          {/* Resend Timer */}
          <View style={styles.resendContainer}>
            {resendTimer > 0 ? (
              <Text style={styles.timerText}>
                Resend code in <Text style={styles.timerValue}>{resendTimer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>
          Didn't receive the code? Check your phone messages or try resending.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  // Back Button
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...DESIGN.shadows.sm,
  },
  // Info Card
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  infoIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  infoTitle: {
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
  parkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: DESIGN.borderRadius.full,
  },
  parkBadgeText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  // OTP Card
  otpCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...DESIGN.shadows.md,
  },
  otpLabel: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
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
    color: COLORS.primary,
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

export default OtpScreen;
