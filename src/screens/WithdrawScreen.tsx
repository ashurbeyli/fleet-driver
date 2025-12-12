import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Button, Input, AppHeader } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { usersApi, withdrawalsApi, type BalanceResponse, type WithdrawalHistoryItem } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';

const WithdrawScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const { withdrawalSettings, isLoading: isConfigLoading } = useConfig();
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [amountError, setAmountError] = useState<string>('');
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBlockedBalanceTooltip, setShowBlockedBalanceTooltip] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const scrollY = useRef(0);

  useEffect(() => {
    loadBalance();
    loadWithdrawalHistory();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadBalance();
      loadWithdrawalHistory();
    }, [])
  );

  const loadBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const balanceData = await usersApi.getBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const loadWithdrawalHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const history = await withdrawalsApi.getWithdrawalHistory(1, 10);
      setWithdrawalHistory(history);
    } catch (error) {
      console.error('Failed to load withdrawal history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadBalance(), loadWithdrawalHistory()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Web-specific pull-to-refresh using scroll events
  const handleWebScroll = (e: any) => {
    if (Platform.OS !== 'web') return;
    
    const scrollTop = e.nativeEvent?.contentOffset?.y || 0;
    scrollY.current = scrollTop;
    
    // Reset pull distance when scrolled away from top
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
    
    // Only allow pull-to-refresh when at the top
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
    
    // Reset
    setTimeout(() => {
      setPullDistance(0);
      isPulling.current = false;
    }, 200);
  };

  // Helper function to get status display info
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0: // Pending
        return { text: t.withdrawalStatus.pending, color: '#F39C12', icon: 'time' as const };
      case 1: // MoneySent (Completed)
        return { text: t.withdrawalStatus.completed, color: '#10B981', icon: 'checkmark-circle' as const };
      case 2: // AwaitingOtpVerification
        return { text: t.withdrawalStatus.pending, color: '#F39C12', icon: 'time' as const };
      case 3: // Failed
        return { text: t.withdrawalStatus.failed, color: '#EF4444', icon: 'close-circle' as const };
      case 4: // FailedOtp
        return { text: t.withdrawalStatus.failed, color: '#EF4444', icon: 'close-circle' as const };
      default:
        return { text: t.withdrawalStatus.unknown, color: COLORS.text.secondary, icon: 'help-circle' as const };
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const handleCustomAmountChange = (amount: string) => {
    // Only allow numbers, comma, or dot - filter out any other characters
    const filteredAmount = amount.replace(/[^0-9,.]/g, '');
    
    // Normalize comma to dot for decimal separator (iOS locale issue)
    // Replace all commas with dots, then ensure only one decimal point
    let normalizedAmount = filteredAmount.replace(/,/g, '.');
    
    // Ensure only one decimal point (keep the first one)
    const parts = normalizedAmount.split('.');
    if (parts.length > 2) {
      normalizedAmount = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setCustomAmount(normalizedAmount);
    
    // Validate amount
    const numAmount = parseFloat(normalizedAmount);
    if (normalizedAmount && !isNaN(numAmount)) {
      const roundedAmount = Math.round(numAmount * 100) / 100;
      const minimumAmount = withdrawalSettings?.minimumAmount ?? 0;
      const maximumAmount = withdrawalSettings?.maximumAmount ?? 0;
      
      // Check minimum amount
      if (minimumAmount > 0 && roundedAmount < minimumAmount) {
        setAmountError(t.validation.amountMinimumWithdrawal(minimumAmount.toFixed(2)));
      } else if (maximumAmount > 0 && roundedAmount > maximumAmount) {
        // Check maximum amount
        setAmountError(t.validation.amountMaximumWithdrawal(maximumAmount.toFixed(2)));
      } else if (balance) {
        // Check daily withdrawal limit
        const remainingLimit = balance.remainingWithdrawalLimit;
        if (remainingLimit !== undefined && remainingLimit > 0 && roundedAmount > remainingLimit) {
          setAmountError(t.validation.amountExceedsDailyLimit(remainingLimit.toFixed(2)));
        } else {
          // Round to 2 decimal places to avoid floating point precision issues
          const roundedBalance = Math.round(balance.withdrawableBalance * 100) / 100;
          
          if (roundedAmount > roundedBalance) {
            setAmountError(t.validation.amountExceeded);
          } else {
            setAmountError('');
          }
        }
      } else {
        setAmountError('');
      }
    } else if (normalizedAmount === '') {
      setAmountError('');
    } else {
      setAmountError(t.validation.amountInvalid);
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(customAmount);
    
    // Validation
    if (!customAmount || isNaN(amount)) {
      Alert.alert(t.common.error, t.validation.amountInvalid);
      return;
    }
    
    if (!balance) {
      Alert.alert('Error', 'Balance information not available');
      return;
    }

    // Use same rounded comparison as validation
    const roundedAmount = Math.round(amount * 100) / 100;
    const roundedBalance = Math.round(balance.withdrawableBalance * 100) / 100;
    const minimumAmount = withdrawalSettings?.minimumAmount ?? 0;
    const maximumAmount = withdrawalSettings?.maximumAmount ?? 0;
    
    // Check minimum amount
    if (minimumAmount > 0 && roundedAmount < minimumAmount) {
      Alert.alert(t.common.error, t.validation.amountMinimumWithdrawal(minimumAmount.toFixed(2)));
      return;
    }
    
    // Check maximum amount
    if (maximumAmount > 0 && roundedAmount > maximumAmount) {
      Alert.alert(t.common.error, t.validation.amountMaximumWithdrawal(maximumAmount.toFixed(2)));
      return;
    }
    
    // Check daily withdrawal limit
    const remainingLimit = balance.remainingWithdrawalLimit;
    if (remainingLimit !== undefined && remainingLimit > 0 && roundedAmount > remainingLimit) {
      Alert.alert(t.common.error, t.validation.amountExceedsDailyLimit(remainingLimit.toFixed(2)));
      return;
    }
    
    if (roundedAmount > roundedBalance) {
      Alert.alert('Insufficient Balance', `You don't have enough balance for this withdrawal. Available: ₺${balance.withdrawableBalance.toFixed(2)}`);
      return;
    }

    if (amountError) {
      return; // Don't proceed if there's an error
    }

    // Navigate to withdraw details screen
    navigation.navigate('WithdrawDetails', { amount: customAmount });
  };

  const handleHistoryItemPress = (withdrawalId: string) => {
    navigation.navigate('WithdrawalDetail', { withdrawalId });
  };

  const renderHistoryItem = (item: WithdrawalHistoryItem) => {
    const statusInfo = getStatusInfo(item.status);
    const amountInDollars = item.amount;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.historyItem}
        onPress={() => handleHistoryItemPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.historyIconContainer}>
          <Ionicons name="card" size={16} color={COLORS.primary} />
        </View>
        <View style={styles.historyContent}>
          <Text style={styles.historyAmount}>₺{amountInDollars.toFixed(2)}</Text>
          <Text style={styles.historyMethod}>{item.receiverName || t.ui.bankTransfer}</Text>
          <Text style={styles.historyDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.historyStatus}>
          <Ionicons name={statusInfo.icon} size={14} color={statusInfo.color} />
          <Text style={[styles.historyStatusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} style={styles.historyChevron} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <AppHeader showBack={false} />
      {showBlockedBalanceTooltip && (
        <TouchableWithoutFeedback onPress={() => setShowBlockedBalanceTooltip(false)}>
          <View style={styles.tooltipOverlay} />
        </TouchableWithoutFeedback>
      )}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS === 'web' && pullDistance > 0 && { paddingTop: pullDistance }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          Platform.OS !== 'web' ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          ) : undefined
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
        {/* Balance Cards */}
        <View style={styles.balanceSection}>
          <Text style={styles.sectionTitle}>{t.dashboard.yourBalance}</Text>
          
          <View style={styles.balanceCardsRow}>
            {isLoadingBalance ? (
              <>
                {/* Loading Placeholder Cards */}
                <View style={styles.balanceCard}>
                  <View style={styles.balanceIconCircle}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.total}</Text>
                  <Text style={styles.balanceValue}>--</Text>
                </View>
                <View style={styles.balanceCard}>
                  <View style={styles.balanceIconCircle}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.available}</Text>
                  <Text style={styles.balanceValue}>--</Text>
                </View>
                <View style={styles.balanceCard}>
                  <View style={styles.balanceIconCircle}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.blocked}</Text>
                  <Text style={styles.balanceValue}>--</Text>
                </View>
              </>
            ) : balance ? (
              <>
                {/* Total Balance Card */}
          <View style={styles.balanceCard}>
                  <View style={styles.balanceIconCircle}>
                    <Ionicons name="wallet" size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.total}</Text>
                  <Text style={styles.balanceValue}>
                    ₺{balance.totalBalance.toFixed(2)}
                  </Text>
            </View>

                {/* Withdrawable Balance Card */}
                <View style={styles.balanceCard}>
                  <View style={styles.balanceIconCircle}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.available}</Text>
                  <Text style={styles.balanceValue}>
                    ₺{balance.withdrawableBalance.toFixed(2)}
                  </Text>
          </View>

                {/* Blocked Balance Card */}
          <View style={styles.balanceCard}>
                  <View style={styles.balanceIconCircle}>
                    <Ionicons name="lock-closed" size={20} color="#FF9800" />
                  </View>
                  <View style={styles.balanceLabelContainer}>
                    <Text style={styles.balanceLabel}>{t.withdrawal.blocked}</Text>
                    <View style={styles.infoIconContainer}>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          setShowBlockedBalanceTooltip(!showBlockedBalanceTooltip);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="information-circle-outline" size={16} color={COLORS.text.secondary} />
                      </TouchableOpacity>
                      {showBlockedBalanceTooltip && (
                        <View style={styles.tooltip} onStartShouldSetResponder={() => true}>
                          <View style={styles.tooltipArrow} />
                          <Text style={styles.tooltipText}>{t.withdrawal.blockedBalanceInfo}</Text>
                        </View>
                      )}
                    </View>
            </View>
                  <Text style={styles.balanceValue}>
                    ₺{balance.blockedBalance.toFixed(2)}
                  </Text>
            </View>
              </>
            ) : null}
          </View>
        </View>

        {/* Withdrawal Amount Section */}
        <View style={styles.withdrawalSection}>
          <Text style={styles.sectionTitle}>{t.withdrawalDetails.withdrawalAmount}</Text>
          
          {/* Amount Input */}
          <View style={styles.amountInputContainer}>
            <Text style={styles.amountLabel}>{t.withdrawal.enterAmount}</Text>
            <View style={[
              styles.amountInputWrapper,
              amountError && styles.amountInputWrapperError,
              (isLoadingBalance || isConfigLoading) && styles.amountInputWrapperDisabled,
            ]}>
              <Text style={styles.currencySymbol}>₺</Text>
              <View style={styles.amountInputInner}>
                <TextInput
                  style={styles.amountInputField}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.text.tertiary}
                  value={customAmount}
                  onChangeText={handleCustomAmountChange}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleWithdraw}
                  editable={!isLoadingBalance && !isConfigLoading}
                />
              </View>
            </View>
            {amountError && (
              <Text style={styles.amountErrorText}>{amountError}</Text>
            )}
          </View>

          {/* Withdrawal Button */}
          <Button
            title={t.common.continue}
            onPress={handleWithdraw}
            variant="primary"
            size="medium"
            style={styles.withdrawButton}
            disabled={!customAmount || !!amountError || isLoadingBalance || isConfigLoading}
          />
        </View>

        {/* Withdrawal History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>{t.withdrawal.recentWithdrawals}</Text>
          {isLoadingHistory ? (
            <>
              {/* Loading Placeholder Items */}
              {[1, 2, 3].map((index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyIconContainer}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyAmount}>--</Text>
                    <Text style={styles.historyMethod}>--</Text>
                    <Text style={styles.historyDate}>--</Text>
                  </View>
                  <View style={styles.historyStatus}>
                    <ActivityIndicator size="small" color={COLORS.text.tertiary} />
                  </View>
                </View>
              ))}
            </>
          ) : withdrawalHistory.length > 0 ? (
            withdrawalHistory.map(renderHistoryItem)
          ) : (
            <View style={styles.emptyHistoryContainer}>
              <Ionicons name="receipt-outline" size={48} color={COLORS.text.tertiary} />
              <Text style={styles.emptyHistoryText}>{t.withdrawal.noWithdrawalHistory}</Text>
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
    padding: SPACING.md,
    paddingTop: SPACING.md,
  },
  balanceSection: {
    marginBottom: SPACING.md,
  },
  balanceCardsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.md,
    padding: SPACING.sm,
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  balanceIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs / 2,
  },
  balanceLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs / 2,
    height: 16,
  },
  balanceLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  balanceValue: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  withdrawalSection: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: DESIGN.borderRadius.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickAmountButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quickAmountText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  quickAmountTextSelected: {
    color: COLORS.surface,
  },
  customAmountContainer: {
    marginBottom: SPACING.lg,
  },
  customAmountLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    borderRadius: DESIGN.borderRadius.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  customAmountText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    flex: 1,
  },
  amountInputContainer: {
    marginBottom: SPACING.md,
  },
  amountLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingVertical: SPACING.sm,
    ...DESIGN.shadows.sm,
  },
  currencySymbol: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginRight: SPACING.xs,
  },
  amountInputInner: {
    flex: 1,
  },
  amountInputField: {
    outlineWidth: 0,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.primary,
    paddingVertical: SPACING.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
    ...Platform.select({
      web: {
        outline: 'none',
      },
    }),
  },
  amountInputWrapperError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  amountInputWrapperDisabled: {
    backgroundColor: COLORS.backgroundDark,
    opacity: 0.7,
  },
  amountErrorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  withdrawButton: {
    marginTop: SPACING.sm,
  },
  historySection: {
    marginBottom: SPACING.md,
  },
  historyItem: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  historyIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  historyContent: {
    flex: 1,
  },
  historyAmount: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: 1,
  },
  historyMethod: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginBottom: 1,
  },
  historyDate: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
  },
  historyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyStatusText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: 4,
  },
  historyChevron: {
    marginLeft: SPACING.sm,
  },
  formFields: {
    gap: SPACING.md,
  },
  emptyHistoryContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHistoryText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.tertiary,
    marginTop: SPACING.md,
  },
  webRefreshIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    zIndex: 1000,
  },
  infoIconContainer: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    bottom: 23,
    right: -29,
    backgroundColor: '#2C3E50',
    borderRadius: DESIGN.borderRadius.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 150,
    maxWidth: 200,
    ...DESIGN.shadows.md,
    zIndex: 1000,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -6,
    right: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#2C3E50',
  },
  tooltipText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
  },
  tooltipOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});

export default WithdrawScreen;
