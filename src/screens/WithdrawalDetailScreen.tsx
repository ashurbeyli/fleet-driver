import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Animated,
  Alert,
  Clipboard,
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
  const scrollViewRef = useRef<ScrollView>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const scrollY = useRef(0);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (withdrawalId) {
      loadWithdrawalDetails();
    }
  }, [withdrawalId]);

  // Shimmer animation for skeleton loaders
  useEffect(() => {
    if (isLoading) {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    }
  }, [isLoading, shimmerAnim]);

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

  const handleRefresh = () => {
    void loadWithdrawalDetails();
  };

  // Web-specific pull-to-refresh similar to WithdrawScreen
  const handleWebScroll = (e: any) => {
    if (Platform.OS !== 'web') return;
    const scrollTop = e.nativeEvent?.contentOffset?.y || 0;
    scrollY.current = scrollTop;
    if (scrollTop > 0 && pullDistance > 0) {
      setPullDistance(0);
      isPulling.current = false;
    }
  };

  const handleWebTouchStart = (e: any) => {
    if (Platform.OS !== 'web') return;
    const touch = e.nativeEvent?.touches?.[0] || e.touches?.[0];
    if (touch && scrollY.current === 0) {
      startY.current = touch.clientY || touch.pageY || 0;
      isPulling.current = true;
    }
  };

  const handleWebTouchMove = (e: any) => {
    if (Platform.OS !== 'web' || !isPulling.current) return;
    const touch = e.nativeEvent?.touches?.[0] || e.touches?.[0];
    if (!touch) return;
    const currentY = touch.clientY || touch.pageY || 0;
    if (scrollY.current === 0 && currentY > startY.current) {
      const distance = Math.min(currentY - startY.current, 80);
      setPullDistance(distance);
    } else if (currentY <= startY.current) {
      setPullDistance(0);
      isPulling.current = false;
    }
  };

  const handleWebTouchEnd = () => {
    if (Platform.OS !== 'web') return;
    if (isPulling.current && pullDistance > 40) {
      handleRefresh();
    }
    setTimeout(() => {
      setPullDistance(0);
      isPulling.current = false;
    }, 200);
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

  const handleCopyPaymentReferenceId = async () => {
    if (!withdrawal?.paymentReferenceId) return;
    
    try {
      Clipboard.setString(withdrawal.paymentReferenceId);
      Alert.alert(t.common.success, language === 'tr' ? 'Ödeme Referans ID kopyalandı' : 'Payment Reference ID copied');
    } catch (error) {
      console.error('Failed to copy payment reference ID:', error);
      Alert.alert(t.common.error, language === 'tr' ? 'Kopyalama başarısız' : 'Failed to copy');
    }
  };


  if (error && !isLoading) {
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
            onPress={() => {
              void loadWithdrawalDetails();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>{t.common.tryAgain}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = withdrawal ? getStatusInfo(withdrawal.status) : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <AppHeader title={t.withdrawalDetails.title} showBack />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        onScroll={handleWebScroll}
        scrollEventThrottle={16}
        onTouchStart={handleWebTouchStart}
        onTouchMove={handleWebTouchMove}
        onTouchEnd={handleWebTouchEnd}
      >
        {/* Web pull-to-refresh indicator */}
        {Platform.OS === 'web' && pullDistance > 0 && (
          <View style={[styles.webRefreshIndicator, { height: pullDistance }]}>
            {pullDistance > 40 ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons
                name="arrow-down"
                size={20}
                color={COLORS.primary}
                style={{ transform: [{ rotate: '0deg' }] }}
              />
            )}
          </View>
        )}
        {/* Status Header */}
        <View style={styles.statusHeader}>
          {isLoading || !withdrawal ? (
            <>
              <Animated.View 
                style={[
                  styles.skeletonBadge, 
                  { opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }) }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.skeletonAmount, 
                  { opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }) }
                ]} 
              />
            </>
          ) : statusInfo ? (
            <>
              <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
                <Ionicons name={statusInfo.icon} size={24} color={statusInfo.color} />
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                  {statusInfo.text}
                </Text>
              </View>
              <Text style={styles.amountHeader}>₺{withdrawal.amount.toFixed(2)}</Text>
            </>
          ) : null}
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
            {isLoading || !withdrawal ? (
              <Animated.View 
                style={[
                  styles.skeletonValue, 
                  { opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }) }
                ]} 
              />
            ) : (
              <Text style={styles.detailValue}>₺{withdrawal.amount.toFixed(2)}</Text>
            )}
          </View>
          <View style={styles.detailDivider} />

          {/* Commission */}
          {(!withdrawal || withdrawal.commission !== undefined) && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="cash-outline" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawalDetails.commissionFee}</Text>
                </View>
                {isLoading || !withdrawal ? (
                  <Animated.View 
                    style={[
                      styles.skeletonValue, 
                      { opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }) }
                    ]} 
                  />
                ) : (
                  <Text style={styles.detailValue}>₺{withdrawal.commission.toFixed(2)}</Text>
                )}
              </View>
              <View style={styles.detailDivider} />
            </>
          )}

          {/* Receiver Name */}
          {(!withdrawal || withdrawal.receiverName) && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="person" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawal.receiverName}</Text>
                </View>
                {isLoading || !withdrawal || !withdrawal.receiverName ? (
                  <Animated.View 
                    style={[
                      styles.skeletonValue, 
                      { opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }) }
                    ]} 
                  />
                ) : (
                  <Text style={styles.detailValue}>{withdrawal.receiverName}</Text>
                )}
              </View>
              <View style={styles.detailDivider} />
            </>
          )}

          {/* IBAN */}
          {(!withdrawal || withdrawal.maskedIBAN) && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="card" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>{t.withdrawal.iban}</Text>
                </View>
                {isLoading || !withdrawal || !withdrawal.maskedIBAN ? (
                  <Animated.View 
                    style={[
                      styles.skeletonValue, 
                      { opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }) }
                    ]} 
                  />
                ) : (
                  <Text style={styles.detailValue}>{withdrawal.maskedIBAN}</Text>
                )}
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
            {isLoading || !withdrawal ? (
              <Animated.View 
                style={[
                  styles.skeletonValue, 
                  { opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }) }
                ]} 
              />
            ) : (
              <Text style={styles.detailValue}>{formatDate(withdrawal.createdAt)}</Text>
            )}
          </View>
          <View style={styles.detailDivider} />

          {/* Payment Reference ID */}
          {(!withdrawal || withdrawal.paymentReferenceId) && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="document-text-outline" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.detailLabel}>
                    {language === 'tr' ? 'Ödeme Referans ID' : 'Payment Reference ID'}
                  </Text>
                </View>
                {isLoading || !withdrawal ? (
                  <Animated.View 
                    style={[
                      styles.skeletonValue, 
                      { opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }) }
                    ]} 
                  />
                ) : (
                  <TouchableOpacity
                    onPress={handleCopyPaymentReferenceId}
                    style={styles.copyButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
                      {withdrawal.paymentReferenceId}
                    </Text>
                    <Ionicons name="copy-outline" size={18} color={COLORS.primary} style={styles.copyIcon} />
                  </TouchableOpacity>
                )}
              </View>
              {!isLoading && withdrawal?.failureReason ? <View style={styles.detailDivider} /> : null}
            </>
          )}

          {/* Failure Reason */}
          {!isLoading && withdrawal?.failureReason && (
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
    paddingTop: Platform.OS === 'web' ? 30 : SPACING.lg,
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
  webRefreshIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
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
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: SPACING.xs,
  },
  copyIcon: {
    marginLeft: SPACING.xs,
  },
  // Skeleton styles - matching actual content dimensions to prevent reflow
  skeletonBadge: {
    width: 120,
    minHeight: 40, // Match statusBadge padding + icon/text height
    backgroundColor: COLORS.borderLight,
    borderRadius: DESIGN.borderRadius.full,
    marginBottom: SPACING.sm,
  },
  skeletonAmount: {
    width: 150,
    height: TYPOGRAPHY.sizes.xxl * 1.2, // Match amountHeader line height
    backgroundColor: COLORS.borderLight,
    borderRadius: DESIGN.borderRadius.sm,
  },
  skeletonValue: {
    width: 150,
    height: TYPOGRAPHY.sizes.md * 1.2, // Match detailValue line height
    backgroundColor: COLORS.borderLight,
    borderRadius: DESIGN.borderRadius.sm,
  },
});

export default WithdrawalDetailScreen;

