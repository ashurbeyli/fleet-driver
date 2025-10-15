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
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { bonusesApi } from '../api';
import type { Bonus, BonusesResponse } from '../api';

const BonusScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bonusesData, setBonusesData] = useState<BonusesResponse | null>(null);

  useEffect(() => {
    fetchBonuses();
  }, []);

  const fetchBonuses = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const response = await bonusesApi.getBonuses();
      setBonusesData(response);
    } catch (err) {
      console.error('Error fetching bonuses:', err);
      setError('Failed to load bonuses. Please try again.');
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const onRefresh = () => {
    fetchBonuses(true);
  };

  const handleClaimBonus = async (bonus: Bonus, bonusIndex: number) => {
    if (!bonusesData || bonus.isClaimed) return;
    
    // Check if bonus has an ID, if not, we can't claim it
    if (!bonus.id) {
      Alert.alert(
        'Claim Failed',
        'This bonus cannot be claimed. Missing bonus ID.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      const response = await bonusesApi.claimBonus(bonus.id);
      
      if (response.success) {
        // Update the local state with the new data
        setBonusesData(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            unclaimedBonusCount: response.unclaimedBonusCount,
            unclaimedBonusTotalAmount: response.unclaimedBonusTotalAmount,
            bonuses: prev.bonuses.map((b, index) => 
              index === bonusIndex ? { ...b, isClaimed: true } : b
            )
          };
        });
        
        Alert.alert(
          'Bonus Claimed!',
          `Successfully claimed $${response.claimedAmount} bonus!`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Claim Failed',
          response.message || 'Failed to claim bonus. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error claiming bonus:', error);
      Alert.alert(
        'Claim Failed',
        'Failed to claim bonus. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor={COLORS.backgroundDark} />
        <Header showBackButton={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading bonuses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor={COLORS.backgroundDark} />
        <Header showBackButton={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchBonuses()}
            style={styles.retryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={COLORS.backgroundDark} />
      <Header showBackButton={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Ionicons name="ticket" size={20} color="#F39C12" />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>
                {bonusesData?.unclaimedBonusCount || 0}
              </Text>
              <Text style={styles.summaryLabel}>Unclaimed</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="gift" size={20} color="#10B981" />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>
                ${bonusesData?.unclaimedBonusTotalAmount || 0}
              </Text>
              <Text style={styles.summaryLabel}>Bonus</Text>
            </View>
          </View>
        </View>

        {/* Bonuses */}
        <View style={styles.bonusesSection}>
          <Text style={styles.sectionTitle}>Bonuses</Text>
          {bonusesData?.bonuses && bonusesData.bonuses.length > 0 ? (
            bonusesData.bonuses.map((bonus, index) => (
              <View key={bonus.id || index} style={styles.couponCard}>
                <View style={styles.couponHeader}>
                  <View style={styles.couponInfo}>
                    <Text style={styles.couponTitle}>{bonus.title}</Text>
                    <Text style={styles.couponDescription}>{bonus.subtitle}</Text>
                    <Text style={styles.couponMeta}>
                      Achieved {formatDate(bonus.achievedAt)}
                    </Text>
                  </View>
                  <View style={styles.couponAmountContainer}>
                    <Text style={styles.couponAmount}>${bonus.bonusAmount}</Text>
                  </View>
                </View>
                <View style={styles.couponFooter}>
                  {bonus.isClaimed ? (
                    <View style={styles.claimedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.claimedText}>Claimed</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleClaimBonus(bonus, index)}
                      style={styles.claimButton}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="download" size={16} color="#fff" />
                      <Text style={styles.claimButtonText}>Claim</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="gift-outline" size={48} color={COLORS.text.secondary} />
              <Text style={styles.emptyStateText}>No bonuses available</Text>
              <Text style={styles.emptyStateSubtext}>
                Complete challenges and referrals to earn bonuses
              </Text>
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
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: DESIGN.borderRadius.md,
    marginTop: SPACING.md,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#fff',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});

export default BonusScreen;
