import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../../../constants';
import { RootStackParamList } from '../../../types';

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface RankingsWidgetProps {
  onRankingsPress?: () => void;
}

const RankingsWidget: React.FC<RankingsWidgetProps> = ({ onRankingsPress }) => {
  const navigation = useNavigation<DashboardNavigationProp>();

  // Mock data - will be replaced with real implementation later
  const mockRankingData = {
    currentPosition: 3,
    totalDrivers: 156,
    points: 2450,
    rankChange: '+2', // +2 means moved up 2 positions
  };

  const handleRankingsPress = () => {
    // TODO: Navigate to rankings screen when implemented
    console.log('Navigate to rankings screen');
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

  return (
    <TouchableOpacity style={styles.widget} onPress={handleRankingsPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getRankIcon(mockRankingData.currentPosition)} 
            size={20} 
            color={getRankColor(mockRankingData.currentPosition)} 
          />
        </View>
        <Text style={styles.title}>Driver Rankings</Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={16} color={COLORS.text.tertiary} />
        </View>
      </View>
      
      <View style={styles.rankingInfo}>
        <View style={styles.positionContainer}>
          <Text style={styles.positionNumber}>{mockRankingData.currentPosition}</Text>
          <Text style={styles.positionSuffix}>{getRankSuffix(mockRankingData.currentPosition)}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>
            out of {mockRankingData.totalDrivers} drivers
          </Text>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Points:</Text>
            <Text style={styles.pointsValue}>{mockRankingData.points.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {mockRankingData.rankChange && (
        <View style={styles.rankChangeContainer}>
          <Ionicons 
            name="trending-up" 
            size={14} 
            color="#10B981" 
          />
          <Text style={styles.rankChangeText}>
            Moved up {mockRankingData.rankChange.replace('+', '')} positions this week
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  widget: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    flex: 2, // Takes 2/3 of the space
    marginHorizontal: SPACING.xs,
    ...DESIGN.shadows.sm,
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
    backgroundColor: COLORS.backgroundDark,
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
  rankingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: SPACING.md,
  },
  positionNumber: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    lineHeight: TYPOGRAPHY.sizes.xxl,
  },
  positionSuffix: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    marginLeft: 2,
  },
  detailsContainer: {
    flex: 1,
  },
  detailsText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    marginRight: SPACING.xs,
  },
  pointsValue: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  rankChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: DESIGN.borderRadius.sm,
    marginTop: SPACING.xs,
  },
  rankChangeText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: '#10B981',
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: SPACING.xs,
  },
});

export default RankingsWidget;
