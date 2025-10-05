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

  // Mock data - will be replaced with real implementation later
  const mockBonusData = {
    totalEarnings: 450,
    availableBonus: 120,
    completedChallenges: 3,
    activeChallenges: 2,
    challenges: [
      {
        id: '1',
        title: 'Weekend Warrior',
        description: 'Complete 20 rides this weekend',
        progress: 15,
        target: 20,
        reward: 50,
        timeLeft: '2 days',
        status: 'active',
      },
      {
        id: '2',
        title: 'Early Bird',
        description: 'Complete 10 rides before 8 AM',
        progress: 7,
        target: 10,
        reward: 30,
        timeLeft: '5 days',
        status: 'active',
      },
      {
        id: '3',
        title: 'Perfect Week',
        description: 'Complete 50 rides in 7 days',
        progress: 50,
        target: 50,
        reward: 100,
        timeLeft: 'Completed',
        status: 'completed',
      },
    ],
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderChallengeCard = (challenge: any) => {
    const progressPercentage = (challenge.progress / challenge.target) * 100;
    const isCompleted = challenge.status === 'completed';

    return (
      <View key={challenge.id} style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
          </View>
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardAmount}>${challenge.reward}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: isCompleted ? '#10B981' : COLORS.secondary,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {challenge.progress}/{challenge.target}
          </Text>
        </View>

        <View style={styles.challengeFooter}>
          <View style={styles.timeContainer}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'time'}
              size={16}
              color={isCompleted ? '#10B981' : COLORS.text.tertiary}
            />
            <Text
              style={[
                styles.timeText,
                { color: isCompleted ? '#10B981' : COLORS.text.tertiary },
              ]}
            >
              {challenge.timeLeft}
            </Text>
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
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
          <Text style={styles.loadingText}>Loading bonuses...</Text>
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
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="trophy" size={24} color="#F39C12" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Total Earnings</Text>
              <Text style={styles.summaryValue}>${mockBonusData.totalEarnings}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="gift" size={24} color="#10B981" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Available Bonus</Text>
              <Text style={styles.summaryValue}>${mockBonusData.availableBonus}</Text>
            </View>
          </View>
        </View>

        {/* Challenge Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockBonusData.completedChallenges}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockBonusData.activeChallenges}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>

        {/* Challenges List */}
        <View style={styles.challengesSection}>
          <Text style={styles.sectionTitle}>Challenges</Text>
          {mockBonusData.challenges.map(renderChallengeCard)}
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
    marginBottom: SPACING.xl,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  statsSection: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  statNumber: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  challengesSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  challengeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  challengeInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  challengeTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.sizes.sm * 1.4,
  },
  rewardContainer: {
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: DESIGN.borderRadius.md,
  },
  rewardAmount: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.secondary,
  },
  progressContainer: {
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    textAlign: 'right',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: 4,
  },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: DESIGN.borderRadius.sm,
  },
  completedText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#10B981',
  },
});

export default BonusScreen;
