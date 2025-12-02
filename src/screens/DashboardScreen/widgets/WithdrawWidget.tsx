import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../../../constants';
import { usersApi, type BalanceResponse } from '../../../api';

const WithdrawWidget: React.FC = () => {
  const navigation = useNavigation<any>();
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBalance();
  }, []);

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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading balance...</Text>
      </View>
    );
  }

  if (!balance) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Balance</Text>
      </View>

      {/* Balance Cards Row */}
      <View style={styles.balanceCardsRow}>
        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceIconContainer}>
            <Ionicons name="wallet" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.balanceLabel}>Total</Text>
          <Text style={styles.balanceValue}>
            ${balance.totalBalance.toFixed(2)}
          </Text>
        </View>

        {/* Withdrawable Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceIconContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.balanceLabel}>Available</Text>
          <Text style={styles.balanceValue}>
            ${balance.withdrawableBalance.toFixed(2)}
          </Text>
        </View>

        {/* Blocked Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceIconContainer}>
            <Ionicons name="lock-closed" size={24} color="#FF9800" />
          </View>
          <Text style={styles.balanceLabel}>Blocked</Text>
          <Text style={styles.balanceValue}>
            ${balance.blockedBalance.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Withdraw Button */}
      <TouchableOpacity
        style={styles.withdrawButton}
        onPress={handleWithdraw}
        activeOpacity={0.8}
      >
        <Ionicons name="wallet" size={20} color="#FFFFFF" />
        <Text style={styles.withdrawButtonText}>Withdraw</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>
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
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
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
  withdrawButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
});

export default WithdrawWidget;

