import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header, Button, Input, ConfirmationModal, AppHeader } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { withdrawalsApi, usersApi, type WithdrawalRequest, WithdrawalStatus, type WithdrawalCommissionResponse } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';

interface RouteParams {
  amount: string;
}

const WithdrawDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as RouteParams;
  const amount = parseFloat(params?.amount || '0');
  const { t } = useLanguage();
  const { withdrawalSettings } = useConfig();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBankDetails, setIsLoadingBankDetails] = useState(true);
  const [isLoadingCommission, setIsLoadingCommission] = useState(false);
  const [commissionData, setCommissionData] = useState<WithdrawalCommissionResponse | null>(null);
  const [receiverName, setReceiverName] = useState<string>('');
  const [receiverNameError, setReceiverNameError] = useState<string>('');
  const [iban, setIban] = useState<string>('');
  const [ibanError, setIbanError] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch bank details on mount
  useEffect(() => {
    loadBankDetails();
  }, []);

  // Fetch commission when amount is available
  useEffect(() => {
    if (amount > 0) {
      loadCommission();
    }
  }, [amount]);

  const loadBankDetails = async () => {
    try {
      setIsLoadingBankDetails(true);
      const bankDetails = await usersApi.getBankDetails();
      
      // Auto-fill inputs with bank details
      if (bankDetails.accountHolderName) {
        setReceiverName(bankDetails.accountHolderName);
      }
      if (bankDetails.iban) {
        setIban(bankDetails.iban);
      }
    } catch (error) {
      console.error('Failed to load bank details:', error);
      // Don't show error to user, just allow manual entry
    } finally {
      setIsLoadingBankDetails(false);
    }
  };

  const loadCommission = async () => {
    try {
      setIsLoadingCommission(true);
      const commission = await withdrawalsApi.getWithdrawalCommission(amount);
      setCommissionData(commission);
    } catch (error) {
      console.error('Failed to load commission:', error);
      // Don't show error to user, just allow proceeding without commission info
      setCommissionData(null);
    } finally {
      setIsLoadingCommission(false);
    }
  };

  // IBAN validation function
  const validateIBAN = (ibanValue: string): string => {
    if (!ibanValue || ibanValue.trim() === '') {
      return '';
    }

    // Remove spaces and convert to uppercase for validation
    const cleanedIban = ibanValue.replace(/\s/g, '').toUpperCase();

    // Check length - must be exactly 26 characters
    if (cleanedIban.length !== 26) {
      return t.validation.ibanInvalid;
    }

    // Check if it starts with "TR"
    if (!cleanedIban.startsWith('TR')) {
      return t.validation.ibanInvalid;
    }

    // Check if the remaining 24 characters are all numbers
    const remainingPart = cleanedIban.substring(2);
    const numbersOnlyRegex = /^[0-9]+$/;
    
    if (!numbersOnlyRegex.test(remainingPart)) {
      return t.validation.ibanInvalid;
    }

    return '';
  };

  // Receiver name validation function
  const validateReceiverName = (name: string): string => {
    if (!name || name.trim() === '') {
      return '';
    }

    if (name.trim().length < 2) {
      return t.validation.receiverNameMinLength;
    }

    return '';
  };

  const handleReceiverNameChange = (text: string) => {
    setReceiverName(text);
    // Validate in real-time
    const error = validateReceiverName(text);
    setReceiverNameError(error);
  };

  const handleIbanChange = (text: string) => {
    // Remove all spaces from the input
    const cleanedText = text.replace(/\s/g, '');
    setIban(cleanedText);
    const error = validateIBAN(cleanedText);
    setIbanError(error);
  };

  const handleSubmit = async () => {
    // Validation - set errors instead of showing alerts
    let hasError = false;

    if (!receiverName.trim()) {
      setReceiverNameError(t.validation.receiverNameRequired);
      hasError = true;
    } else if (receiverName.trim().length < 2) {
      setReceiverNameError(t.validation.receiverNameMinLength);
      hasError = true;
    } else if (receiverNameError) {
      // Receiver name validation error already set
      hasError = true;
    }

    if (!iban.trim()) {
      setIbanError(t.validation.ibanRequired);
      hasError = true;
    } else if (ibanError) {
      // IBAN validation error already set
      hasError = true;
    }

    // Don't proceed if there are validation errors
    if (hasError) {
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const getConfirmationMessage = (): string => {
    let message = t.withdrawalDetails.confirmMessage(amount.toFixed(2), receiverName);
    
    if (commissionData) {
      message += `\n\n${t.withdrawalDetails.commissionFee || 'Commission Fee'}: ₺${commissionData.commissionAmount.toFixed(2)}`;
    }
    
    return message;
  };

  const handleConfirmWithdrawal = async () => {
    setShowConfirmModal(false);
    
    // Proceed with withdrawal
    try {
      setIsSubmitting(true);

      // Normalize IBAN: remove spaces and convert to uppercase
      const normalizedIban = iban.replace(/\s/g, '').toUpperCase().trim();

      const withdrawalData: WithdrawalRequest = {
        amount: amount, // Send amount in Turkish Lira (decimal)
        iban: normalizedIban,
        accountHolderName: receiverName.trim(),
      };

      const response = await withdrawalsApi.createWithdrawal(withdrawalData);

      // Handle different status responses
      if (response.status === WithdrawalStatus.Pending || response.status === WithdrawalStatus.MoneySent) {
        // Status 0 (Pending) or Status 1 (MoneySent): Show success screen
        navigation.replace('WithdrawSuccess', {
          withdrawalId: response.withdrawalId,
          amount: response.amount,
          receiverName: receiverName.trim(),
          maskedIBAN: response.maskedIBAN,
        });
      } else if (response.status === WithdrawalStatus.AwaitingOtpVerification) {
        // Status 2: Awaiting OTP - show OTP screen
        navigation.replace('WithdrawOtp', {
          withdrawalId: response.withdrawalId,
          amount: response.amount,
          receiverName: receiverName.trim(),
          maskedIBAN: response.maskedIBAN,
        });
      } else if (response.status === WithdrawalStatus.Failed) {
        // Status 3: Failed - show error screen
        navigation.replace('WithdrawError', {
          message: response.message || 'Withdrawal failed. Please try again.',
          withdrawalId: response.withdrawalId,
        });
      }
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      // Show error screen on API error
      navigation.replace('WithdrawError', {
        message: error?.message || 'Failed to submit withdrawal request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <AppHeader title={t.withdrawal.confirmWithdrawal} showBack />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Summary */}
        <View style={styles.amountSummary}>
          <Ionicons name="cash-outline" size={24} color="#FFFFFF" />
          <Text style={styles.amountLabel}>{t.withdrawalDetails.withdrawalAmount}</Text>
          <Text style={styles.amountValue}>₺{amount.toFixed(2)}</Text>
        </View>

        {/* Bank Details Form */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.withdrawalDetails.bankDetails}</Text>
          </View>

          <View style={styles.formFields}>
            <Input
              inputStyle={styles.formInput}
              label={t.withdrawal.receiverName}
              placeholder={t.withdrawal.receiverName}
              value={receiverName}
              onChangeText={handleReceiverNameChange}
              error={receiverNameError}
              disabled={isLoadingBankDetails}
            />

            <Input
              label={t.withdrawal.iban}
              placeholder={t.withdrawal.iban}
              value={iban}
              onChangeText={handleIbanChange}
              error={ibanError}
              inputStyle={styles.formInput}
              disabled={isLoadingBankDetails}
            />
          </View>
        </View>

        {/* Submit Button */}
        <Button
          title={t.withdrawalDetails.confirmWithdrawal}
          onPress={handleSubmit}
          variant="primary"
          size="medium"
          style={styles.submitButton}
          loading={isSubmitting || isLoadingCommission}
          disabled={isSubmitting || isLoadingBankDetails || isLoadingCommission || !receiverName.trim() || !iban.trim() || !!ibanError || !!receiverNameError}
        />
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmModal}
        title={t.withdrawalDetails.confirmWithdrawal}
        message={getConfirmationMessage()}
        confirmText={t.common.confirm}
        cancelText={t.common.cancel}
        onConfirm={handleConfirmWithdrawal}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={isSubmitting}
      />
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
    padding: SPACING.md,
    paddingTop: SPACING.md,
  },
  amountSummary: {
    backgroundColor: COLORS.primary,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...DESIGN.shadows.md,
  },
  amountLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs / 2,
  },
  amountValue: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#FFFFFF',
  },
  formSection: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  formFields: {
    gap: SPACING.sm,
  },
  formInput: {
    outlineWidth: 0
  },
  submitButton: {
    marginTop: SPACING.sm,
  },
});

export default WithdrawDetailsScreen;
