import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';

const BonusScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [coupons, setCoupons] = useState<Array<{
    id: string;
    title: string;
    description: string;
    amount: number;
    issuedAt: string;
    claimed: boolean;
  }>>([
    {
      id: 'c1',
      title: 'Referral Bonus',
      description: 'Invite friend completed',
      amount: 25,
      issuedAt: '2025-09-12',
      claimed: false,
    },
    {
      id: 'c2',
      title: 'Challenge Reward',
      description: 'Perfect Week completed',
      amount: 100,
      issuedAt: '2025-09-05',
      claimed: true,
    },
    {
      id: 'c3',
      title: 'Weekend Warrior',
      description: '20 rides this weekend',
      amount: 50,
      issuedAt: '2025-09-01',
      claimed: false,
    },
  ]);

  // Mock summary data
  const unclaimedCount = coupons.filter(c => !c.claimed).length;
  const bonusAmount = 120; // This should come from API

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClaimCoupon = (couponId: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === couponId ? { ...c, claimed: true } : c))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Ionicons name="ticket" size={20} color="#F39C12" />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{unclaimedCount}</Text>
              <Text style={styles.summaryLabel}>Unclaimed</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="gift" size={20} color="#10B981" />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>${bonusAmount}</Text>
              <Text style={styles.summaryLabel}>Bonus</Text>
            </View>
          </View>
        </View>

        {/* Bonuses */}
        <View style={styles.bonusesSection}>
          <Text style={styles.sectionTitle}>Bonuses</Text>
          {coupons.map(coupon => (
            <View key={coupon.id} style={styles.couponCard}>
              <View style={styles.couponHeader}>
                <View style={styles.couponInfo}>
                  <Text style={styles.couponTitle}>{coupon.title}</Text>
                  <Text style={styles.couponDescription}>{coupon.description}</Text>
                  <Text style={styles.couponMeta}>Issued {coupon.issuedAt}</Text>
                </View>
                <View style={styles.couponAmountContainer}>
                  <Text style={styles.couponAmount}>${coupon.amount}</Text>
                </View>
              </View>
              <View style={styles.couponFooter}>
                {coupon.claimed ? (
                  <View style={styles.claimedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.claimedText}>Claimed</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleClaimCoupon(coupon.id)}
                    style={styles.claimButton}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="download" size={16} color="#fff" />
                    <Text style={styles.claimButtonText}>Claim</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
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
  summarySection: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    ...DESIGN.shadows.sm,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  bonusesSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  couponCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  couponInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  couponTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  couponDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  couponMeta: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
  },
  couponAmountContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: DESIGN.borderRadius.md,
  },
  couponAmount: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#10B981',
  },
  couponFooter: {
    alignItems: 'flex-end',
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: DESIGN.borderRadius.md,
  },
  claimButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#fff',
  },
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: DESIGN.borderRadius.sm,
  },
  claimedText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: '#10B981',
  },
});

export default BonusScreen;
