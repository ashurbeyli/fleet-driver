import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../../../constants';
import { RootStackParamList } from '../../../types';
import { invitationsApi, type Invitation } from '../../../api';

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface InviteFriendWidgetProps {
  onInvitePress?: () => void;
  refreshKey?: number;
}

const InviteFriendWidget: React.FC<InviteFriendWidgetProps> = ({ onInvitePress, refreshKey }) => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInvitations = async () => {
    try {
      setIsLoading(true);
      const data = await invitationsApi.getInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Failed to load invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, [refreshKey]);

  useFocusEffect(
    React.useCallback(() => {
      loadInvitations();
    }, [])
  );

  // Calculate statistics from invitations
  const totalInvites = invitations.length;
  const totalEarnings = invitations.reduce((sum, inv) => sum + inv.totalBonusesEarned, 0);
  const completedInvites = invitations.filter(inv => inv.isCompleted).length;
  const registeredInvites = invitations.filter(inv => inv.isRegistered).length;

  const handleInvitePress = () => {
    navigation.navigate('InviteFriend');
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
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : (
        <>
          <View style={styles.inviteInfo}>
            <Text style={styles.earningsText}>${totalEarnings}</Text>
            <Text style={styles.invitesText}>{totalInvites} friends</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="person-add" size={12} color="#10B981" />
              <Text style={styles.statText}>{registeredInvites} joined</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={12} color="#F39C12" />
              <Text style={styles.statText}>{completedInvites} completed</Text>
            </View>
          </View>
        </>
      )}
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
  loadingContainer: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: DESIGN.borderRadius.sm,
  },
  statText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: 4,
  },
});

export default InviteFriendWidget;
