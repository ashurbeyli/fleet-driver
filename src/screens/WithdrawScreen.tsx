import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Header, Button, Input } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { usersApi, type BalanceResponse } from '../api';

const WithdrawScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [amountError, setAmountError] = useState<string>('');

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

  // Mock data - will be replaced with real implementation later
  const mockWithdrawData = {
    availableBalance: balance?.withdrawableBalance || 0,
    pendingWithdrawals: 150.00,
    totalEarnings: balance?.totalBalance || 0,
    withdrawalHistory: [
      {
        id: '1',
        amount: 200.00,
        date: '2024-01-15',
        status: 'completed',
        method: 'Bank Transfer',
      },
      {
        id: '2',
        amount: 150.00,
        date: '2024-01-10',
        status: 'completed',
        method: 'Bank Transfer',
      },
      {
        id: '3',
        amount: 100.00,
        date: '2024-01-05',
        status: 'pending',
        method: 'Bank Transfer',
      },
    ],
    quickAmounts: [50, 100, 200, 500],
    minWithdrawal: 25,
    maxWithdrawal: 1000,
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCustomAmountChange = (amount: string) => {
    setCustomAmount(amount);
    
    // Validate amount
    const numAmount = parseFloat(amount);
    if (amount && !isNaN(numAmount)) {
      if (numAmount <= 0) {
        setAmountError('Amount must be greater than 0');
      } else if (balance) {
        // Round to 2 decimal places to avoid floating point precision issues
        const roundedAmount = Math.round(numAmount * 100) / 100;
        const roundedBalance = Math.round(balance.withdrawableBalance * 100) / 100;
        
        if (roundedAmount > roundedBalance) {
          setAmountError(`Cannot exceed available balance of $${balance.withdrawableBalance.toFixed(2)}`);
        } else {
          setAmountError('');
        }
      } else {
        setAmountError('');
      }
    } else if (amount === '') {
      setAmountError('');
    } else {
      setAmountError('Please enter a valid amount');
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(customAmount);
    
    // Validation
    if (!amount || amount <= 0 || isNaN(amount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    if (!balance) {
      Alert.alert('Error', 'Balance information not available');
      return;
    }

    // Use same rounded comparison as validation
    const roundedAmount = Math.round(amount * 100) / 100;
    const roundedBalance = Math.round(balance.withdrawableBalance * 100) / 100;
    
    if (roundedAmount > roundedBalance) {
      Alert.alert('Insufficient Balance', `You don't have enough balance for this withdrawal. Available: $${balance.withdrawableBalance.toFixed(2)}`);
      return;
    }

    if (amountError) {
      return; // Don't proceed if there's an error
    }

    // Navigate to withdraw details screen
    navigation.navigate('WithdrawDetails', { amount: customAmount });
  };

  const renderHistoryItem = (item: any) => {
    const statusColor = item.status === 'completed' ? '#10B981' : '#F39C12';
    const statusIcon = item.status === 'completed' ? 'checkmark-circle' : 'time';

    return (
      <View key={item.id} style={styles.historyItem}>
        <View style={styles.historyIconContainer}>
          <Ionicons name="card" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.historyContent}>
          <Text style={styles.historyAmount}>${item.amount.toFixed(2)}</Text>
          <Text style={styles.historyMethod}>{item.method}</Text>
          <Text style={styles.historyDate}>{item.date}</Text>
        </View>
        <View style={styles.historyStatus}>
          <Ionicons name={statusIcon} size={16} color={statusColor} />
          <Text style={[styles.historyStatusText, { color: statusColor }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading withdrawal options...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Cards */}
        <View style={styles.balanceSection}>
          <Text style={styles.sectionTitle}>Your Balance</Text>
          
          {balance ? (
            <View style={styles.balanceCardsRow}>
              {/* Total Balance Card */}
              <View style={styles.balanceCard}>
                <View style={styles.balanceIconCircle}>
                  <Ionicons name="wallet" size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.balanceLabel}>Total</Text>
                <Text style={styles.balanceValue}>
                  ${balance.totalBalance.toFixed(2)}
                </Text>
              </View>

              {/* Withdrawable Balance Card */}
              <View style={styles.balanceCard}>
                <View style={styles.balanceIconCircle}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.balanceLabel}>Available</Text>
                <Text style={styles.balanceValue}>
                  ${balance.withdrawableBalance.toFixed(2)}
                </Text>
              </View>

              {/* Blocked Balance Card */}
              <View style={styles.balanceCard}>
                <View style={styles.balanceIconCircle}>
                  <Ionicons name="lock-closed" size={24} color="#FF9800" />
                </View>
                <Text style={styles.balanceLabel}>Blocked</Text>
                <Text style={styles.balanceValue}>
                  ${balance.blockedBalance.toFixed(2)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.loadingText}>Loading balance...</Text>
          )}
        </View>

        {/* Withdrawal Amount Section */}
        <View style={styles.withdrawalSection}>
          <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
          
          {/* Amount Input */}
          <View style={styles.amountInputContainer}>
            <Text style={styles.amountLabel}>Enter Amount</Text>
            <View style={[
              styles.amountInputWrapper,
              amountError && styles.amountInputWrapperError,
            ]}>
              <Text style={styles.currencySymbol}>$</Text>
              <View style={styles.amountInputInner}>
                <TextInput
                  style={styles.amountInputField}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.text.tertiary}
                  value={customAmount}
                  onChangeText={handleCustomAmountChange}
                  keyboardType="numeric"
                />
              </View>
            </View>
            {amountError && (
              <Text style={styles.amountErrorText}>{amountError}</Text>
            )}
          </View>

          {/* Withdrawal Button */}
          <Button
            title="Continue"
            onPress={handleWithdraw}
            variant="primary"
            size="large"
            style={styles.withdrawButton}
            disabled={!customAmount || !!amountError}
          />
        </View>

        {/* Withdrawal History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Withdrawals</Text>
          {mockWithdrawData.withdrawalHistory.map(renderHistoryItem)}
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
    paddingTop: Platform.OS === 'web' ? 100 : 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  balanceSection: {
    marginBottom: SPACING.xl,
  },
  balanceCardsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  balanceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundDark,
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
  withdrawalSection: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...DESIGN.shadows.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
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
    marginBottom: SPACING.lg,
  },
  amountLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
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
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    ...DESIGN.shadows.sm,
  },
  currencySymbol: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginRight: SPACING.sm,
  },
  amountInputInner: {
    flex: 1,
  },
  amountInputField: {
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
  amountErrorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  withdrawButton: {
    marginTop: SPACING.md,
  },
  historySection: {
    marginBottom: SPACING.xl,
  },
  historyItem: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  historyContent: {
    flex: 1,
  },
  historyAmount: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  historyMethod: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: 2,
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
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: 4,
  },
  formFields: {
    gap: SPACING.md,
  },
});

export default WithdrawScreen;
