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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Button, OtpInputCard, Header } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { RootStackParamList } from '../types';
import { authApi } from '../api';
import { authService } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

type OtpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Otp'>;
type OtpScreenRouteProp = RouteProp<RootStackParamList, 'Otp'>;

const OtpScreen: React.FC = () => {
  const navigation = useNavigation<OtpScreenNavigationProp>();
  const route = useRoute<OtpScreenRouteProp>();
  const { t } = useLanguage();
  
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
      setError(t.validation.otpInvalidLength);
      return;
    }

    if (!parkId) {
      setError(t.loginOtp.parkInfoMissing);
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
          driver: response.driver,
        });
        
        console.log('Authentication successful! Data saved to storage.');
        
        // Navigate to dashboard
        navigation.navigate('Dashboard');
      } else {
        setError(response.message || t.loginOtp.invalidCode);
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError(t.loginOtp.verificationFailed);
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
    } catch (error) {
      console.error('Resend OTP failed:', error);
      setError(t.loginOtp.resendFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >


        {/* OTP Input Card */}
        <View style={styles.otpContainer}>
          <OtpInputCard
            phoneNumber={phoneNumber}
            onComplete={handleOtpComplete}
            onResend={handleResendOtp}
            error={error}
            disabled={isLoading}
            resendTimer={resendTimer}
            length={6}
          />
          
          {/* Loading Overlay */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>{t.otp.verifying}</Text>
            </View>
          )}
        </View>
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
    paddingTop: Platform.OS === 'web' ? 100 : 80, // More padding for web to avoid overlap
  },
  otpContainer: {
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: DESIGN.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: SPACING.xs,
  },
});

export default OtpScreen;
