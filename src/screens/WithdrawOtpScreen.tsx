import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, OtpInputCard, Header } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { authService } from '../services/authService';
import { withdrawalsApi, WithdrawalStatus } from '../api';
import { useLanguage } from '../contexts/LanguageContext';

interface RouteParams {
  withdrawalId: string;
  amount: number;
  receiverName: string;
  maskedIBAN: string;
}

const WithdrawOtpScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as RouteParams;
  
  const { withdrawalId, amount, receiverName, maskedIBAN } = params;
  const { t } = useLanguage();
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpKey, setOtpKey] = useState<number>(0); // Key to reset OTP input

  // Load driver phone number
  useEffect(() => {
    const loadPhoneNumber = async () => {
      try {
        const driver = await authService.getDriver();
        if (driver?.phone) {
          setPhoneNumber(driver.phone);
        }
      } catch (error) {
        console.error('Failed to load phone number:', error);
      }
    };
    loadPhoneNumber();
  }, []);

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
      setError(t.otp.verificationFailed);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await withdrawalsApi.verifyWithdrawalOtp(withdrawalId, codeToVerify);

      // Handle different status responses
      if (response.status === WithdrawalStatus.Pending || response.status === WithdrawalStatus.MoneySent) {
        // Status 0 (Pending) or Status 1 (MoneySent): Show success screen
        navigation.replace('WithdrawSuccess', {
          withdrawalId: response.withdrawalId,
          amount: response.amount,
          receiverName: receiverName,
          maskedIBAN: response.maskedIBAN,
        });
      } else if (response.status === WithdrawalStatus.FailedOtp) {
        // Status 4: OTP validation failed - show error on OTP screen
        setError(t.otp.invalidOtp);
        setOtp(''); // Clear OTP input
        setOtpKey(prev => prev + 1); // Reset OTP input component
      } else if (response.status === WithdrawalStatus.Failed) {
        // Status 3: Withdrawal failed - navigate to error screen
        navigation.replace('WithdrawError', {
          message: response.message || 'Withdrawal failed. Please try again.',
          withdrawalId: response.withdrawalId,
        });
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      // Check if it's a 400 Bad Request (likely invalid OTP)
      if (error?.message?.includes('400') || error?.message?.includes('Bad Request')) {
        setError(t.otp.invalidOtp);
        setOtp(''); // Clear OTP input
        setOtpKey(prev => prev + 1); // Reset OTP input component
      } else {
        setError(error?.message || t.otp.verificationFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement resend OTP API call for withdrawal
      // await withdrawalsApi.resendWithdrawalOtp(withdrawalId);
      
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOtp('');
      setResendTimer(60);
      Alert.alert(t.common.success, t.otp.resendSuccess);
    } catch (error) {
      console.error('Resend OTP failed:', error);
      setError(t.otp.resendFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const amountInDollars = amount.toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Withdrawal Info */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={36} color={COLORS.primary} />
          <Text style={styles.infoTitle}>{t.otp.verifyWithdrawal}</Text>
          <Text style={styles.infoText}>
            {t.otp.verificationMessage}
          </Text>
        </View>

        {/* Withdrawal Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t.withdrawal.amount}</Text>
            <Text style={styles.detailValue}>₺{amountInDollars}</Text>
          </View>
          
          <View style={styles.detailDivider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t.withdrawal.receiverName}</Text>
            <Text style={styles.detailValue}>{receiverName}</Text>
          </View>
          
          <View style={styles.detailDivider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t.withdrawal.iban}</Text>
            <Text style={styles.detailValue}>{maskedIBAN}</Text>
          </View>
        </View>

        {/* OTP Input Card */}
        <OtpInputCard
          key={otpKey}
          phoneNumber={phoneNumber}
          onComplete={handleOtpComplete}
          onResend={handleResendOtp}
          error={error}
          disabled={isLoading}
          resendTimer={resendTimer}
          length={6}
        />
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
    paddingTop: Platform.OS === 'web' ? 60 : 50,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.sizes.sm * 1.4,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
    textAlign: 'right',
    flex: 1,
    marginLeft: SPACING.md,
  },
  detailDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs / 2,
  },
});

export default WithdrawOtpScreen;

