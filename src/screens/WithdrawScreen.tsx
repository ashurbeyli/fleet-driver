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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header, Button } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';

const WithdrawScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Mock data - will be replaced with real implementation later
  const mockWithdrawData = {
    availableBalance: 1250.50,
    pendingWithdrawals: 150.00,
    totalEarnings: 1400.50,
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

  const handleQuickAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (amount: string) => {
    setCustomAmount(amount);
    setSelectedAmount(null);
  };

  const handleWithdraw = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount < mockWithdrawData.minWithdrawal) {
      Alert.alert('Invalid Amount', `Minimum withdrawal is $${mockWithdrawData.minWithdrawal}`);
      return;
    }
    
    if (amount > mockWithdrawData.availableBalance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough balance for this withdrawal');
      return;
    }

    Alert.alert(
      'Confirm Withdrawal',
      `Are you sure you want to withdraw $${amount.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // TODO: Implement withdrawal API call
            console.log('Withdrawing:', amount);
            Alert.alert('Success', 'Withdrawal request submitted successfully!');
          }
        },
      ]
    );
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
          <View style={styles.balanceCard}>
            <View style={styles.balanceIconContainer}>
              <Ionicons name="wallet" size={24} color="#10B981" />
            </View>
            <View style={styles.balanceContent}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceValue}>${mockWithdrawData.availableBalance.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.balanceCard}>
            <View style={styles.balanceIconContainer}>
              <Ionicons name="time" size={24} color="#F39C12" />
            </View>
            <View style={styles.balanceContent}>
              <Text style={styles.balanceLabel}>Pending</Text>
              <Text style={styles.balanceValue}>${mockWithdrawData.pendingWithdrawals.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Withdrawal Amount Section */}
        <View style={styles.withdrawalSection}>
          <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
          
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountsContainer}>
            {mockWithdrawData.quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickAmountButton,
                  selectedAmount === amount && styles.quickAmountButtonSelected,
                ]}
                onPress={() => handleQuickAmountSelect(amount)}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    selectedAmount === amount && styles.quickAmountTextSelected,
                  ]}
                >
                  ${amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input */}
          <View style={styles.customAmountContainer}>
            <Text style={styles.customAmountLabel}>Or enter custom amount:</Text>
            <View style={styles.customAmountInput}>
              <Text style={styles.currencySymbol}>$</Text>
              <Text style={styles.customAmountText}>
                {selectedAmount ? selectedAmount.toFixed(2) : customAmount || '0.00'}
              </Text>
            </View>
          </View>

          {/* Withdrawal Button */}
          <Button
            title="Withdraw Now"
            onPress={handleWithdraw}
            variant="primary"
            size="large"
            style={styles.withdrawButton}
            disabled={!selectedAmount && !customAmount}
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
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  balanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  balanceContent: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
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
  currencySymbol: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginRight: SPACING.xs,
  },
  customAmountText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    flex: 1,
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
});

export default WithdrawScreen;
