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

interface BonusWidgetProps {
  onBonusPress?: () => void;
}

const BonusWidget: React.FC<BonusWidgetProps> = ({ onBonusPress }) => {
  const navigation = useNavigation<DashboardNavigationProp>();

  // Mock data - will be replaced with real implementation later
  const mockBonusData = {
    currentRides: 77,
    targetRides: 100,
    ridesRemaining: 23,
    bonusAmount: 150,
    timeRemaining: '5 days', // Optional: time left to complete
  };

  const handleBonusPress = () => {
    // TODO: Navigate to bonus/milestones screen when implemented
    console.log('Navigate to bonus screen');
    onBonusPress?.();
  };

  const progressPercentage = (mockBonusData.currentRides / mockBonusData.targetRides) * 100;

  return (
    <TouchableOpacity style={styles.widget} onPress={handleBonusPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="gift" size={20} color="#F39C12" />
        </View>
        <Text style={styles.title}>Bonus Challenge</Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={16} color={COLORS.text.tertiary} />
        </View>
      </View>
      
      <View style={styles.challengeInfo}>
        <View style={styles.milestoneContainer}>
          <Text style={styles.milestoneText}>
            Complete {mockBonusData.targetRides} rides
          </Text>
          <Text style={styles.progressText}>
            {mockBonusData.currentRides}/{mockBonusData.targetRides} completed
          </Text>
        </View>
        
        <View style={styles.bonusContainer}>
          <Text style={styles.bonusLabel}>Bonus:</Text>
          <Text style={styles.bonusAmount}>${mockBonusData.bonusAmount}</Text>
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
            {mockBonusData.ridesRemaining} more rides to go
          </Text>
        </View>
        {mockBonusData.timeRemaining && (
          <View style={styles.timeInfo}>
            <Ionicons name="time" size={16} color={COLORS.text.secondary} />
            <Text style={styles.timeText}>
              {mockBonusData.timeRemaining} left
            </Text>
          </View>
        )}
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
});

export default BonusWidget;
