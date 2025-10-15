import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { challengesApi } from '../api';
import type { Challenge, ChallengesResponse } from '../api';

const GoalsScreen: React.FC = () => {
  const { width: contentWidth } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challengesData, setChallengesData] = useState<ChallengesResponse | null>(null);

  const fetchChallenges = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const response = await challengesApi.getChallenges();
      setChallengesData(response);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Failed to load goals. Please try again.');
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const onRefresh = () => {
    fetchChallenges(true);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const formatTimeLeft = (seconds: number) => {
    if (seconds <= 0) return 'Expired';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const renderChallengeCard = (challenge: Challenge, index: number) => {
    const { currentLevel } = challenge;
    const progressPercentage = currentLevel.progressPercentage;
    const isCompleted = currentLevel.ridesRemaining === 0;
    const remaining = currentLevel.ridesRemaining;
    const timeLeft = formatTimeLeft(challenge.timeLeftSeconds);

    return (
      <View key={index} style={styles.challengeCard}>
        {/* Header with icon and title */}
        <View style={styles.challengeHeader}>
          <View style={styles.challengeIconContainer}>
            <Ionicons name="gift" size={20} color="#F39C12" />
          </View>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
        </View>
        
        {/* Challenge info and bonus */}
        <View style={styles.challengeInfo}>
          <View style={styles.milestoneContainer}>
            <Text style={styles.milestoneText}>
              {challenge.subtitle}
            </Text>
            <Text style={styles.progressText}>
              {challenge.driverRideCount}/{currentLevel.rideCountThreshold} completed
            </Text>
          </View>
          
          <View style={styles.bonusContainer}>
            <Text style={styles.bonusLabel}>Bonus:</Text>
            <Text style={styles.bonusAmount}>${currentLevel.bonusAmount}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${Math.min(progressPercentage, 100)}%`,
                  backgroundColor: isCompleted ? '#10B981' : '#F39C12',
                }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>

        {/* Remaining info and time */}
        <View style={styles.remainingContainer}>
          <View style={styles.remainingInfo}>
            <Ionicons 
              name={isCompleted ? 'checkmark-circle' : 'car'} 
              size={16} 
              color={isCompleted ? '#10B981' : COLORS.primary} 
            />
            <Text style={styles.remainingText}>
              {isCompleted ? 'Challenge completed!' : `${remaining} more rides to go`}
            </Text>
          </View>
          {challenge.timeLeftSeconds > 0 && !isCompleted && (
            <View style={styles.timeInfo}>
              <Ionicons name="time" size={16} color={COLORS.text.secondary} />
              <Text style={styles.timeText}>
                {timeLeft} left
              </Text>
            </View>
          )}
        </View>

        {/* Description (HTML) */}
        {challenge.description && (
          <View style={styles.descriptionContainer}>
            <RenderHtml
              contentWidth={contentWidth - SPACING.md * 4}
              source={{ html: challenge.description }}
              tagsStyles={{
                body: {
                  color: COLORS.text.secondary,
                  fontSize: TYPOGRAPHY.sizes.sm,
                  lineHeight: TYPOGRAPHY.sizes.sm * 1.5,
                  margin: 0,
                  padding: 0,
                },
                p: {
                  marginTop: 0,
                  marginBottom: SPACING.xs,
                },
                strong: {
                  color: COLORS.text.primary,
                  fontWeight: '600',
                },
                b: {
                  color: COLORS.text.primary,
                  fontWeight: '600',
                },
              }}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
        {/* Goals List */}
        <View style={styles.challengesSection}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          {isLoading ? (
            <View style={styles.emptyState}>
              <Ionicons name="hourglass-outline" size={48} color={COLORS.text.secondary} />
              <Text style={styles.emptyStateText}>Loading goals...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyState}>
              <Ionicons name="alert-circle-outline" size={48} color={COLORS.text.secondary} />
              <Text style={styles.emptyStateText}>{error}</Text>
              <TouchableOpacity
                onPress={() => fetchChallenges()}
                style={styles.retryButton}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : challengesData && challengesData.length > 0 ? (
            challengesData.map(renderChallengeCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="flag-outline" size={48} color={COLORS.text.secondary} />
              <Text style={styles.emptyStateText}>No goals available</Text>
              <Text style={styles.emptyStateSubtext}>
                Check back later for new goals
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
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
  challengesSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  challengeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  challengeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  challengeTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    flex: 1,
  },
  challengeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  milestoneContainer: {
    flex: 1,
  },
  milestoneText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  progressText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
  },
  bonusContainer: {
    alignItems: 'flex-end',
  },
  bonusLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs,
  },
  bonusAmount: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#F39C12',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 4,
    marginRight: SPACING.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.secondary,
    minWidth: 30,
    textAlign: 'right',
  },
  remainingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: SPACING.xs,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  descriptionContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.backgroundDark,
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
    fontWeight: TYPOGRAPHY.weights.medium,
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

export default GoalsScreen;

