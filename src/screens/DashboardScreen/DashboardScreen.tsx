import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../../constants';
import { authService, Driver } from '../../services/authService';
import { usersApi, type BalanceResponse, type UserMeResponse } from '../../api';
import { useConfig } from '../../contexts/ConfigContext';
import { AgreementWidget, VehicleWidget, RankingsWidget, GoalWidget, InviteFriendWidget } from './widgets';
// import { NewsWidget } from './widgets'; // Commented out - not implemented yet

const DashboardScreen: React.FC = () => {
  const { features } = useConfig();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load driver data and balance on mount
  useEffect(() => {
    loadDriverData();
    loadBalance();
  }, []);

  const loadDriverData = async () => {
    try {
      const driverData = await authService.getDriver();
      setDriver(driverData);
    } catch (error) {
      console.error('Failed to load driver data:', error);
    }
  };

  const loadBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const balanceData = await usersApi.getBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to load balance:', error);
      // Show error alert
      if (Platform.OS === 'web') {
        console.error('Failed to load balance data');
      } else {
        Alert.alert('Error', 'Failed to load balance data. Please try again.');
      }
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Fetch both balance and user data in parallel
      const [balanceData, userData] = await Promise.all([
        usersApi.getBalance(),
        usersApi.getUserMe()
      ]);
      
      // Update balance
      setBalance(balanceData);
      
      // Update driver data in storage and state
      await authService.updateDriverData({
        id: userData.id,
        phone: userData.phone,
        name: userData.name,
        parkName: userData.parkName,
        isVerified: userData.isVerified,
        isAgreed: userData.isAgreed,
      });
      
      // Reload driver data to update state
      const updatedDriver = await authService.getDriver();
      setDriver(updatedDriver);
      
      // Increment refresh key to trigger widget refresh
      setRefreshKey(prev => prev + 1);
      
    } catch (error) {
      console.error('Failed to refresh data:', error);
      // Still try to load balance as fallback
      try {
        await loadBalance();
      } catch (balanceError) {
        console.error('Failed to refresh balance:', balanceError);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        {/* Balance Cards */}
        <View style={styles.balanceSection}>
          <Text style={styles.sectionTitle}>Your Balance</Text>
          
          {isLoadingBalance ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading balance...</Text>
            </View>
          ) : balance ? (
            <View style={styles.balanceCardsRow}>
              {/* Total Balance Card */}
              <View style={styles.balanceCard}>
                <View style={styles.balanceIconContainer}>
                  <Ionicons name="wallet" size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.balanceLabel}>Total</Text>
                <Text style={styles.balanceValue}>
                  ${balance.totalBalance.toFixed(2)}
                </Text>
              </View>

              {/* Withdrawable Balance Card */}
              <View style={styles.balanceCard}>
                <View style={styles.balanceIconContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.balanceLabel}>Available</Text>
                <Text style={styles.balanceValue}>
                  ${balance.withdrawableBalance.toFixed(2)}
                </Text>
              </View>

              {/* Blocked Balance Card */}
              <View style={styles.balanceCard}>
                <View style={styles.balanceIconContainer}>
                  <Ionicons name="lock-closed" size={24} color="#FF9800" />
                </View>
                <Text style={styles.balanceLabel}>Blocked</Text>
                <Text style={styles.balanceValue}>
                  ${balance.blockedBalance.toFixed(2)}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load balance</Text>
              <TouchableOpacity onPress={loadBalance} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Agreement Widget - Only show if not agreed */}
        {driver && !driver.isAgreed && <AgreementWidget />}

        {/* Top Row - Vehicle and Rankings widgets side by side */}
        {(features.vehicle || features.rankings) && (
          <View style={styles.topRow}>
            {features.vehicle && <VehicleWidget />}
            {features.rankings && <RankingsWidget key={refreshKey} />}
          </View>
        )}

        {/* Goal Challenge Widget */}
        {features.challenges && <GoalWidget key={refreshKey} />}

        {/* Second Row: Invitations */}
        {features.invitations && (
          <View style={styles.secondRow}>
            {/* <NewsWidget /> */}
            <InviteFriendWidget refreshKey={refreshKey} />
          </View>
        )}
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
  },
  // Balance Section
  balanceSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  balanceCardsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginHorizontal: -2,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: 2,
    ...DESIGN.shadows.sm,
  },
  balanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  balanceLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.secondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  balanceValue: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.error,
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: DESIGN.borderRadius.lg,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
  },
  // Top Row Layout
  topRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  // Second Row Layout
  secondRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
});

export default DashboardScreen;

