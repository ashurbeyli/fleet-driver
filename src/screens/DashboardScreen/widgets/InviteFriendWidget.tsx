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

interface InviteFriendWidgetProps {
  onInvitePress?: () => void;
}

const InviteFriendWidget: React.FC<InviteFriendWidgetProps> = ({ onInvitePress }) => {
  const navigation = useNavigation<DashboardNavigationProp>();

  // Mock data - will be replaced with real implementation later
  const mockInviteData = {
    totalInvites: 3,
    totalEarnings: 45,
    pendingInvites: 1,
    nextReward: 10, // Next reward amount
  };

  const handleInvitePress = () => {
    // TODO: Navigate to invite screen when implemented
    console.log('Navigate to invite friends screen');
    onInvitePress?.();
  };

  return (
    <TouchableOpacity style={styles.widget} onPress={handleInvitePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="people" size={16} color="#10B981" />
        </View>
        <Text style={styles.title}>Invite</Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={14} color={COLORS.text.tertiary} />
        </View>
      </View>
      
      <View style={styles.inviteInfo}>
        <Text style={styles.earningsText}>${mockInviteData.totalEarnings}</Text>
        <Text style={styles.invitesText}>{mockInviteData.totalInvites} friends</Text>
      </View>

      <View style={styles.rewardContainer}>
        <Ionicons name="gift" size={12} color="#F39C12" />
        <Text style={styles.rewardText}>+${mockInviteData.nextReward}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  widget: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.sm,
    flex: 1,
    marginHorizontal: SPACING.xs,
    ...DESIGN.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
  inviteInfo: {
    marginBottom: SPACING.xs,
  },
  earningsText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  invitesText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: DESIGN.borderRadius.sm,
  },
  rewardText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: '#F39C12',
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: 4,
  },
});

export default InviteFriendWidget;
