import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { authService, Driver } from '../services/authService';
import { usersApi, type BalanceResponse } from '../api';

const DashboardScreen: React.FC = () => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  // Load driver data and balance on mount
  useEffect(() => {
    loadDriverData();
    loadBalance();
  }, []);

  const loadDriverData = async () => {
    try {
      const driverData = await authService.getDriver();
      setDriver(driverData);
    } catch (error) {
      console.error('Failed to load driver data:', error);
    }
  };

  const loadBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const balanceData = await usersApi.getBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to load balance:', error);
      // Show error alert
      if (Platform.OS === 'web') {
        console.error('Failed to load balance data');
      } else {
        Alert.alert('Error', 'Failed to load balance data. Please try again.');
      }
    } finally {
      setIsLoadingBalance(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Cards */}
        <View style={styles.balanceSection}>
          <Text style={styles.sectionTitle}>Your Balance</Text>
          
          {isLoadingBalance ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading balance...</Text>
            </View>
          ) : balance ? (
            <View style={styles.balanceCardsContainer}>
              {/* Total Balance Card */}
              <View style={[styles.balanceCard, styles.totalBalanceCard]}>
                <View style={styles.balanceCardHeader}>
                  <Text style={styles.balanceCardIcon}>💰</Text>
                  <Text style={styles.balanceCardTitle}>Total Balance</Text>
                </View>
                <Text style={styles.balanceCardValue}>
                  ${balance.totalBalance.toFixed(2)}
                </Text>
              </View>

              {/* Withdrawable Balance Card */}
              <View style={[styles.balanceCard, styles.withdrawableCard]}>
                <View style={styles.balanceCardHeader}>
                  <Text style={styles.balanceCardIcon}>✅</Text>
                  <Text style={styles.balanceCardTitle}>Withdrawable</Text>
                </View>
                <Text style={styles.balanceCardValue}>
                  ${balance.withdrawableBalance.toFixed(2)}
                </Text>
              </View>

              {/* Blocked Balance Card */}
              <View style={[styles.balanceCard, styles.blockedCard]}>
                <View style={styles.balanceCardHeader}>
                  <Text style={styles.balanceCardIcon}>🔒</Text>
                  <Text style={styles.balanceCardTitle}>Blocked</Text>
                </View>
                <Text style={styles.balanceCardValue}>
                  ${balance.blockedBalance.toFixed(2)}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load balance</Text>
              <TouchableOpacity onPress={loadBalance} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Dashboard Coming Soon</Text>
          <Text style={styles.cardDescription}>
            We're building amazing features for you!
          </Text>
          
          <View style={styles.featuresList}>
            {[
              { icon: '📍', title: 'Live Trip Tracking', desc: 'Real-time navigation' },
              { icon: '📊', title: 'Analytics', desc: 'View your performance' },
              { icon: '💵', title: 'Earnings', desc: 'Track your income' },
              { icon: '⭐', title: 'Ratings', desc: 'Customer feedback' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>
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
  // Balance Section
  balanceSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  balanceCardsContainer: {
    gap: SPACING.md,
  },
  balanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    ...DESIGN.shadows.md,
  },
  totalBalanceCard: {
    backgroundColor: COLORS.primary,
  },
  withdrawableCard: {
    backgroundColor: '#4CAF50',
  },
  blockedCard: {
    backgroundColor: '#FF9800',
  },
  balanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  balanceCardIcon: {
    fontSize: 24,
    marginRight: SPACING.xs,
  },
  balanceCardTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceCardValue: {
    fontSize: TYPOGRAPHY.sizes.xxxl || 32,
    fontWeight: TYPOGRAPHY.weights.extrabold,
    color: COLORS.surface,
  },
  loadingContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.error,
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: DESIGN.borderRadius.lg,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
  },
  // Main Content Card
  mainCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xl,
    ...DESIGN.shadows.md,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xl,
  },
  featuresList: {
    marginTop: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  placeholderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xxl * 1.5,
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    ...DESIGN.shadows.lg,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  placeholderTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.sizes.md * TYPOGRAPHY.lineHeights.relaxed,
    marginBottom: SPACING.xl,
    fontWeight: TYPOGRAPHY.weights.normal,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
});

export default DashboardScreen;

