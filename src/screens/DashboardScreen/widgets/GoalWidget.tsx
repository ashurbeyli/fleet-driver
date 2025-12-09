import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../../../constants';
import { challengesApi, type Challenge } from '../../../api';
import { useConfig } from '../../../contexts/ConfigContext';
import { useLanguage } from '../../../contexts/LanguageContext';

type TabParamList = {
  Home: undefined;
  Bonuses: undefined;
  Challenges: { openTab?: 'rankings' | 'challenges' } | undefined;
  Withdraw: undefined;
  Menu: undefined;
};

type GoalWidgetNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;

interface GoalWidgetProps {
  onGoalPress?: () => void;
}

const GoalWidget: React.FC<GoalWidgetProps> = ({ onGoalPress }) => {
  const navigation = useNavigation<GoalWidgetNavigationProp>();
  const { features } = useConfig();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!features.challengesComingSoon) {
      fetchChallenge();
    } else {
      setIsLoading(false);
    }
  }, [features.challengesComingSoon]);

  const fetchChallenge = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const challenges = await challengesApi.getChallenges();
      
      // Get the first active challenge
      if (challenges && challenges.length > 0) {
        setChallenge(challenges[0]);
      } else {
        setChallenge(null);
      }
    } catch (err) {
      console.error('Failed to fetch challenge:', err);
      setError('Failed to load challenge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalPress = () => {
    // Force navigation by going to Home first, then Challenges
    navigation.navigate('Home');
    setTimeout(() => {
      navigation.navigate('Challenges', { openTab: 'challenges' });
    }, 100);
    onGoalPress?.();
  };

  const formatTimeLeft = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Coming Soon state
  if (features.challengesComingSoon) {
    return (
      <View style={styles.widget}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="flag-outline" size={20} color={COLORS.text.secondary} />
          </View>
          <Text style={styles.title}>{t.challenges.goals}</Text>
        </View>
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonText}>{t.challenges.comingSoon}</Text>
        </View>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.widget}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <TouchableOpacity style={styles.widget} onPress={fetchChallenge} activeOpacity={0.7}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText}>Tap to retry</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // No challenge state
  if (!challenge || !challenge.currentLevel) {
    return null; // Don't show the widget if there's no active challenge
  }

  const currentLevel = challenge.currentLevel;
  const progressPercentage = currentLevel.progressPercentage;
  const timeRemaining = formatTimeLeft(challenge.timeLeftSeconds);

  return (
    <TouchableOpacity style={styles.widget} onPress={handleGoalPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="flag" size={20} color="#F39C12" />
        </View>
        <Text style={styles.title}>{challenge.title}</Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={16} color={COLORS.text.tertiary} />
        </View>
      </View>
      
      <View style={styles.challengeInfo}>
        <View style={styles.milestoneContainer}>
          <Text style={styles.milestoneText}>
            {currentLevel.title}
          </Text>
          <Text style={styles.progressText}>
            {challenge.driverRideCount}/{currentLevel.rideCountThreshold} completed
          </Text>
        </View>
        
        <View style={styles.bonusContainer}>
          <Text style={styles.bonusLabel}>Bonus:</Text>
          <Text style={styles.bonusAmount}>₺{currentLevel.bonusAmount.toFixed(0)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${Math.min(progressPercentage, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressPercentage}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      <View style={styles.remainingContainer}>
        <View style={styles.remainingInfo}>
          <Ionicons name="car" size={16} color={COLORS.primary} />
          <Text style={styles.remainingText}>
            {currentLevel.ridesRemaining} more rides to go
          </Text>
        </View>
        <View style={styles.timeInfo}>
          <Ionicons name="time" size={16} color={COLORS.text.secondary} />
          <Text style={styles.timeText}>
            {timeRemaining} left
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  widget: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  retryText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    flex: 1,
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  milestoneContainer: {
    flex: 1,
  },
  milestoneText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  progressText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
  },
  bonusContainer: {
    alignItems: 'flex-end',
  },
  bonusLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    marginBottom: 2,
  },
  bonusAmount: {
    fontSize: TYPOGRAPHY.sizes.lg,
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
    backgroundColor: '#F39C12',
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
  comingSoonContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  comingSoonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.secondary,
  },
});

export default GoalWidget;
