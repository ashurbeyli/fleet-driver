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
import { rankingApi, type RankingResponse } from '../../../api';

type TabParamList = {
  Home: undefined;
  Bonuses: undefined;
  Challenges: { openTab?: 'rankings' | 'challenges' } | undefined;
  Withdraw: undefined;
  Menu: undefined;
};

type RankingsWidgetNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;

interface RankingsWidgetProps {
  onRankingsPress?: () => void;
}

const RankingsWidget: React.FC<RankingsWidgetProps> = ({ onRankingsPress }) => {
  const navigation = useNavigation<RankingsWidgetNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [rankingData, setRankingData] = useState<RankingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await rankingApi.getRanking();
      setRankingData(data);
    } catch (err) {
      console.error('Failed to fetch ranking:', err);
      setError('Failed to load ranking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRankingsPress = () => {
    // Force navigation by going to Home first, then Challenges
    navigation.navigate('Home');
    setTimeout(() => {
      navigation.navigate('Challenges', { openTab: 'rankings' });
    }, 100);
    onRankingsPress?.();
  };

  const getRankIcon = (position: number) => {
    if (position === 1) return 'trophy';
    if (position === 2) return 'medal';
    if (position === 3) return 'ribbon';
    return 'trophy-outline';
  };

  const getRankColor = (position: number) => {
    if (position === 1) return '#FFD700'; // Gold
    if (position === 2) return '#C0C0C0'; // Silver
    if (position === 3) return '#CD7F32'; // Bronze
    return COLORS.primary;
  };

  const getRankSuffix = (position: number) => {
    if (position === 1) return 'st';
    if (position === 2) return 'nd';
    if (position === 3) return 'rd';
    return 'th';
  };

  // Loading state - show header with loading content
  if (isLoading) {
    return (
      <View style={styles.widget}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name="trophy-outline" 
              size={18} 
              color={COLORS.primary} 
            />
          </View>
          <Text style={styles.title}>Rank</Text>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={14} color={COLORS.text.tertiary} />
          </View>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Error state - show header with error content
  if (error) {
    return (
      <TouchableOpacity style={styles.widget} onPress={fetchRanking} activeOpacity={0.7}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name="trophy-outline" 
              size={18} 
              color={COLORS.primary} 
            />
          </View>
          <Text style={styles.title}>Rank</Text>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={14} color={COLORS.text.tertiary} />
          </View>
        </View>
        
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // No data state
  if (!rankingData) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.widget} onPress={handleRankingsPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getRankIcon(rankingData.currentPosition)} 
            size={18} 
            color={getRankColor(rankingData.currentPosition)} 
          />
        </View>
        <Text style={styles.title}>Rank</Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={14} color={COLORS.text.tertiary} />
        </View>
      </View>
      
      <View style={styles.rankContent}>
        <View style={styles.rankRow}>
          <Text style={[
            styles.positionNumber,
            rankingData.currentPosition >= 1000 && styles.positionNumberSmall
          ]}>
            {rankingData.currentPosition}
          </Text>
          <View style={styles.suffixContainer}>
            {rankingData.change !== 0 && (
              <Ionicons 
                name={rankingData.change > 0 ? "trending-up" : "trending-down"} 
                size={14} 
                color={rankingData.change > 0 ? "#10B981" : "#EF4444"} 
                style={styles.changeIcon}
              />
            )}
            <Text style={[
              styles.positionSuffix,
              rankingData.currentPosition >= 1000 && styles.positionSuffixSmall
            ]}>
              {getRankSuffix(rankingData.currentPosition)}
            </Text>
          </View>
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
    flex: 1,
    marginLeft: SPACING.xs,
    ...DESIGN.shadows.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
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
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.error,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    flex: 1,
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 2,
  },
  suffixContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 2,
  },
  changeIcon: {
    marginTop: 0,
  },
  positionNumber: {
    fontSize: 36,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
  },
  positionNumberSmall: {
    fontSize: 28,
  },
  positionSuffix: {
    fontSize: 16,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  positionSuffixSmall: {
    fontSize: 12,
  },
});

export default RankingsWidget;
