import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { withdrawalsApi, type WithdrawalDetailResponse, WithdrawalStatus } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import { RootStackParamList } from '../types';

type WithdrawalDetailScreenRouteProp = RouteProp<RootStackParamList, 'WithdrawalDetail'>;

const WithdrawalDetailScreen: React.FC = () => {
  const route = useRoute<WithdrawalDetailScreenRouteProp>();
  const { t, language } = useLanguage();
  const { withdrawalId } = route.params || {};

  const [withdrawal, setWithdrawal] = useState<WithdrawalDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (withdrawalId) {
      loadWithdrawalDetails();
    }
  }, [withdrawalId]);

  const loadWithdrawalDetails = async () => {
    if (!withdrawalId) return;

    try {
      setIsLoading(true);
      setError(null);
      const details = await withdrawalsApi.getWithdrawalById(withdrawalId);
      setWithdrawal(details);
    } catch (err: any) {
      console.error('Failed to load withdrawal details:', err);
      setError(err?.message || 'Failed to load withdrawal details');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: number) => {
    switch (status) {
      case WithdrawalStatus.Pending:
        return { text: t.withdrawalStatus.pending, color: '#F39C12', icon: 'time' as const };
      case WithdrawalStatus.MoneySent:
        return { text: t.withdrawalStatus.completed, color: '#10B981', icon: 'checkmark-circle' as const };
      case WithdrawalStatus.AwaitingOtpVerification:
        return { text: t.withdrawalStatus.pending, color: '#F39C12', icon: 'time' as const };
      case WithdrawalStatus.Failed:
      case WithdrawalStatus.FailedOtp:
        return { text: t.withdrawalStatus.failed, color: '#EF4444', icon: 'close-circle' as const };
      default:
        return { text: t.withdrawalStatus.unknown, color: COLORS.text.secondary, icon: 'help-circle' as const };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <AppHeader title={t.withdrawalDetails.title} showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>{t.common.loading}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !withdrawal) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <AppHeader title={t.withdrawalDetails.title} showBack />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={COLORS.error} />
          <Text style={styles.errorTitle}>{t.common.error}</Text>
          <Text style={styles.errorMessage}>{error || 'Withdrawal not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadWithdrawalDetails}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>{t.common.tryAgain}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo(withdrawal.status);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <AppHeader title={t.withdrawalDetails.title} showBack />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
            <Ionicons name={statusInfo.icon} size={24} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
          <Text style={styles.amountHeader}>₺{withdrawal.amount.toFixed(2)}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>{t.withdrawal.details}</Text>

          {/* Amount */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="cash" size={18} color={COLORS.text.secondary} />
              <Text style={styles.detailLabel}>{t.withdrawal.amount}</Text>
            </View>
            <Text style={styles.detailValue}>₺{withdrawal.amount.toFixed(2)}</Text>
          </View>
          <View style={styles.detailDivider} />

          {/* Receiver Name */}
          {withdrawal.receiverName && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="person" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawal.receiverName}</Text>
                </View>
                <Text style={styles.detailValue}>{withdrawal.receiverName}</Text>
              </View>
              <View style={styles.detailDivider} />
            </>
          )}

          {/* IBAN */}
          {withdrawal.maskedIBAN && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="card" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawal.iban}</Text>
                </View>
                <Text style={styles.detailValue}>{withdrawal.maskedIBAN}</Text>
              </View>
              <View style={styles.detailDivider} />
            </>
          )}

          {/* Status Description */}
          {withdrawal.statusDescription && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="information-circle" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawal.status}</Text>
                </View>
                <Text style={styles.detailValue}>{withdrawal.statusDescription}</Text>
              </View>
              <View style={styles.detailDivider} />
            </>
          )}

          {/* Explanation */}
          {withdrawal.explanation && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="document-text" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawal.explanation}</Text>
                </View>
                <Text style={styles.detailValue}>{withdrawal.explanation}</Text>
              </View>
              <View style={styles.detailDivider} />
            </>
          )}

          {/* Created At */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="calendar" size={18} color={COLORS.text.secondary} />
              <Text style={styles.detailLabel}>{t.withdrawal.createdAt}</Text>
            </View>
            <Text style={styles.detailValue}>{formatDate(withdrawal.createdAt)}</Text>
          </View>
          <View style={styles.detailDivider} />

          {/* Updated At */}
          {withdrawal.updatedAt && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="time" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawal.updatedAt}</Text>
                </View>
                <Text style={styles.detailValue}>{formatDate(withdrawal.updatedAt)}</Text>
              </View>
              <View style={styles.detailDivider} />
            </>
          )}

          {/* Yandex Transaction ID */}
          {withdrawal.yandexTransactionId && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="receipt" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawal.yandexTransactionId}</Text>
                </View>
                <Text style={styles.detailValue}>{withdrawal.yandexTransactionId}</Text>
              </View>
              <View style={styles.detailDivider} />
            </>
          )}

          {/* Bank Transaction Ref No */}
          {withdrawal.bankTransactionRefNo && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="business" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawal.bankTransactionRefNo}</Text>
                </View>
                <Text style={styles.detailValue}>{withdrawal.bankTransactionRefNo}</Text>
              </View>
              <View style={styles.detailDivider} />
            </>
          )}

          {/* Bank Payment No */}
          {withdrawal.bankPaymentNo && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="card" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawal.bankPaymentNo}</Text>
                </View>
                <Text style={styles.detailValue}>{withdrawal.bankPaymentNo}</Text>
              </View>
              <View style={styles.detailDivider} />
            </>
          )}

          {/* Failure Reason */}
          {withdrawal.failureReason && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="warning" size={18} color={COLORS.error} />
                  <Text style={[styles.detailLabel, { color: COLORS.error }]}>
                    {t.withdrawal.failureReason}
                  </Text>
                </View>
                <Text style={[styles.detailValue, { color: COLORS.error }]}>
                  {withdrawal.failureReason}
                </Text>
              </View>
            </>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: DESIGN.borderRadius.lg,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.surface,
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: DESIGN.borderRadius.full,
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  statusText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  amountHeader: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    ...DESIGN.shadows.md,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.xs,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    flex: 1,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    textAlign: 'right',
    flex: 1,
  },
  detailDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
  },
});

export default WithdrawalDetailScreen;

