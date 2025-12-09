import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../../../constants';
import { usersApi, type BalanceResponse } from '../../../api';
import { useConfig } from '../../../contexts/ConfigContext';
import { useLanguage } from '../../../contexts/LanguageContext';

interface WithdrawWidgetProps {
  isRefreshing?: boolean;
}

const WithdrawWidget: React.FC<WithdrawWidgetProps> = ({ isRefreshing = false }) => {
  const navigation = useNavigation<any>();
  const { features, isLoading: isConfigLoading } = useConfig();
  const { t } = useLanguage();
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBlockedBalanceTooltip, setShowBlockedBalanceTooltip] = useState(false);

  useEffect(() => {
    loadBalance();
  }, []);

  // Refresh balance when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadBalance();
    }, [])
  );

  // Refresh balance when parent is refreshing
  useEffect(() => {
    if (isRefreshing) {
      // Set loading state immediately when refresh starts
      setIsLoading(true);
      loadBalance();
    }
  }, [isRefreshing]);

  const loadBalance = async () => {
    try {
      setIsLoading(true);
      const balanceData = await usersApi.getBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = () => {
    navigation.navigate('Withdraw');
  };

  // Always render container to prevent reflow, but hide if withdrawal is disabled (after config loads)
  const shouldShow = isConfigLoading || features.withdrawal;

  return (
    <View style={[styles.container, !shouldShow && styles.containerHidden]}>
      {showBlockedBalanceTooltip && (
        <TouchableWithoutFeedback onPress={() => setShowBlockedBalanceTooltip(false)}>
          <View style={styles.tooltipOverlay} />
        </TouchableWithoutFeedback>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>{t.dashboard.yourBalance}</Text>
      </View>

      {/* Balance Cards Row */}
      <View style={styles.balanceCardsRow}>
        {(isLoading || isRefreshing) ? (
          <>
            {/* Loading Placeholder Cards */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceIconContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.total}</Text>
              <Text style={styles.balanceValue}>--</Text>
            </View>
            <View style={styles.balanceCard}>
              <View style={styles.balanceIconContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.available}</Text>
              <Text style={styles.balanceValue}>--</Text>
            </View>
            <View style={styles.balanceCard}>
              <View style={styles.balanceIconContainer}>
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
              <View style={styles.balanceIconContainer}>
                <Ionicons name="wallet" size={24} color={COLORS.primary} />
              </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.total}</Text>
              <Text style={styles.balanceValue}>
                ₺{balance.totalBalance.toFixed(2)}
              </Text>
            </View>

            {/* Withdrawable Balance Card */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.available}</Text>
              <Text style={styles.balanceValue}>
                ₺{balance.withdrawableBalance.toFixed(2)}
              </Text>
            </View>

            {/* Blocked Balance Card */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="lock-closed" size={24} color="#FF9800" />
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
        ) : (
          <>
            {/* Error Placeholder Cards - maintain layout even on error */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="wallet" size={24} color={COLORS.text.tertiary} />
              </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.total}</Text>
              <Text style={styles.balanceValue}>--</Text>
            </View>
            <View style={styles.balanceCard}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.text.tertiary} />
              </View>
                  <Text style={styles.balanceLabel}>{t.withdrawal.available}</Text>
              <Text style={styles.balanceValue}>--</Text>
            </View>
            <View style={styles.balanceCard}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="lock-closed" size={24} color={COLORS.text.tertiary} />
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
              <Text style={styles.balanceValue}>--</Text>
            </View>
          </>
        )}
      </View>

      {/* Withdraw Button - Always rendered to prevent reflow */}
      {shouldShow && (
        <TouchableOpacity
          style={[
            styles.withdrawButton,
            (isLoading || isRefreshing) && styles.withdrawButtonDisabled,
          ]}
          onPress={handleWithdraw}
          activeOpacity={0.8}
          disabled={isLoading || isRefreshing}
        >
          <Ionicons name="wallet" size={20} color="#FFFFFF" />
          <Text style={styles.withdrawButtonText}>{t.dashboard.withdraw}</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...DESIGN.shadows.md,
  },
  containerHidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  balanceCardsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  balanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
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
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: DESIGN.borderRadius.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    ...DESIGN.shadows.sm,
  },
  withdrawButtonDisabled: {
    opacity: 0.6,
  },
  withdrawButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
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

export default WithdrawWidget;

