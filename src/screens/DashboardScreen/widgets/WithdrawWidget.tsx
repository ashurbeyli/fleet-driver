import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
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
                  <Text style={styles.balanceLabel}>{t.withdrawal.blocked}</Text>
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
                  <Text style={styles.balanceLabel}>{t.withdrawal.blocked}</Text>
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
  balanceLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.secondary,
    marginBottom: 4,
    textAlign: 'center',
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
});

export default WithdrawWidget;

