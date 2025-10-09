import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { challengesApi } from '../api';
import type { Challenge, ChallengesResponse } from '../api';

const { width: screenWidth } = Dimensions.get('window');

const ChallengesScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challengesData, setChallengesData] = useState<ChallengesResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'rankings' | 'challenges'>('challenges');
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // Start with last month
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock months data - will be replaced with real implementation later
  const months = [
    { id: '2024-12', name: 'December 2024', year: 2024, month: 12 }, // Last month (active)
    { id: '2024-11', name: 'November 2024', year: 2024, month: 11 }, // Previous month
  ];

  // Mock ranking data - will be replaced with real implementation later
  const mockRankingData = {
    currentPosition: 7,
    previousPosition: 9,
    totalDrivers: 156,
    points: 2450,
    rankChange: '+2', // +2 means moved up 2 positions
  };

  // Mock leaderboard data - will be replaced with real implementation later
  const top3Drivers = [
    { id: '1', rank: 1, name: 'John Smith', orders: 342, rankChange: 0, isCurrentUser: false },
    { id: '2', rank: 2, name: 'Sarah Johnson', orders: 315, rankChange: 2, isCurrentUser: false },
    { id: '3', rank: 3, name: 'Mike Wilson', orders: 289, rankChange: -1, isCurrentUser: false },
  ];

  const currentUserDriver = {
    id: '7',
    rank: 7,
    name: 'You',
    orders: 230,
    rankChange: 2,
    isCurrentUser: true
  };

  const lastDriver = {
    id: '156',
    rank: 156,
    name: 'Ivy Walker',
    orders: 15,
    rankChange: 0,
    isCurrentUser: false
  };

  // Mock data - will be replaced with real implementation later
  const mockChallengesData = {
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

  const handleMonthScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentMonthIndex(index);
  };

  const scrollToMonth = (index: number) => {
    setCurrentMonthIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true,
    });
  };

  const renderDriverRow = (driver: any) => {
    const rankChangeIcon = driver.rankChange > 0 ? 'trending-up' : driver.rankChange < 0 ? 'trending-down' : 'remove';
    const rankChangeColor = driver.rankChange > 0 ? '#10B981' : driver.rankChange < 0 ? '#EF4444' : COLORS.text.tertiary;

    return (
      <View
        key={driver.id}
        style={[
          styles.driverRow,
          driver.isCurrentUser && styles.currentUserRow
        ]}
      >
        <View style={styles.rankColumn}>
          <Text style={[styles.rankText, driver.isCurrentUser && styles.currentUserText]}>
            {driver.rank}
          </Text>
          {driver.rank <= 3 && (
            <Ionicons
              name={getRankIcon(driver.rank)}
              size={12}
              color={getRankColor(driver.rank)}
              style={styles.rankBadge}
            />
          )}
        </View>

        <Text style={[styles.driverName, driver.isCurrentUser && styles.currentUserText]}>
          {driver.name}
        </Text>

        <View style={styles.driverStats}>
          <Text style={[styles.ordersText, driver.isCurrentUser && styles.currentUserText]}>
            {driver.orders} orders
          </Text>
          {driver.rankChange !== 0 && (
            <View style={styles.rankChangeIndicator}>
              <Ionicons
                name={rankChangeIcon}
                size={12}
                color={rankChangeColor}
              />
              <Text style={[styles.rankChangeValue, { color: rankChangeColor }]}>
                {Math.abs(driver.rankChange)}
              </Text>
            </View>
          )}
          {driver.rankChange === 0 && (
            <View style={styles.rankChangeIndicator}>
              <Ionicons name="remove" size={12} color={COLORS.text.tertiary} />
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderSeparator = (key: string) => {
    return (
      <View key={key} style={styles.separatorRow}>
        <Text style={styles.separatorText}>...</Text>
      </View>
    );
  };

  const renderMonthContent = (month: any) => {
    return (
      <View key={month.id} style={styles.monthContent}>
        {/* Drivers Leaderboard */}
        <View style={styles.leaderboardSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <Text style={styles.monthText}>({month.name})</Text>
          </View>
          <View style={styles.leaderboardCard}>
            <View style={styles.leaderboardHeader}>
              <Text style={styles.headerText}>Rank</Text>
              <Text style={[styles.headerText, styles.nameHeader]}>Driver</Text>
              <Text style={styles.headerText}>Orders</Text>
            </View>
            {/* Top 3 drivers */}
            {top3Drivers.map(renderDriverRow)}
            
            {/* Separator if current user is not in top 3 and not last */}
            {currentUserDriver.rank > 3 && currentUserDriver.rank < lastDriver.rank && renderSeparator('separator-1')}
            
            {/* Current user if not in top 3 and not last */}
            {currentUserDriver.rank > 3 && currentUserDriver.rank < lastDriver.rank && renderDriverRow(currentUserDriver)}
            
            {/* Separator before last driver if there's a gap */}
            {currentUserDriver.rank < lastDriver.rank - 1 && renderSeparator('separator-2')}
            {currentUserDriver.rank === 3 && lastDriver.rank > 4 && renderSeparator('separator-2')}
            
            {/* Last driver */}
            {renderDriverRow(lastDriver)}
          </View>
          
          {/* Month Dots - Top Right */}
          <View style={styles.dotsContainer}>
            {months.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  index === currentMonthIndex && styles.activeDot
                ]}
                onPress={() => scrollToMonth(index)}
                activeOpacity={0.7}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

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
      setError('Failed to load challenges. Please try again.');
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

  useEffect(() => {
    // Scroll to current month on mount
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: currentMonthIndex * screenWidth,
          animated: false,
        });
      }, 100);
    }
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
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={COLORS.backgroundDark} />
      <Header showBackButton={false} />
      
      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'challenges' && styles.activeTabButton]}
          onPress={() => setActiveTab('challenges')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="flag" 
            size={20} 
            color={activeTab === 'challenges' ? COLORS.primary : COLORS.text.tertiary} 
          />
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>
            Goals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'rankings' && styles.activeTabButton]}
          onPress={() => setActiveTab('rankings')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="trophy" 
            size={20} 
            color={activeTab === 'rankings' ? COLORS.primary : COLORS.text.tertiary} 
          />
          <Text style={[styles.tabText, activeTab === 'rankings' && styles.activeTabText]}>
            Rankings
          </Text>
        </TouchableOpacity>
      </View>

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
        {activeTab === 'rankings' ? (
          <>
            {/* Swipeable Month Content */}
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleMonthScroll}
              style={styles.monthScrollView}
              contentContainerStyle={styles.monthScrollContent}
            >
              {months.map(renderMonthContent)}
            </ScrollView>
          </>
        ) : (
          <>
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
              ) : challengesData?.challenges && challengesData.challenges.length > 0 ? (
                challengesData.challenges.map(renderChallengeCard)
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
          </>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: Platform.OS === 'web' ? 100 : 80,
    marginBottom: SPACING.md,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.xs,
    ...DESIGN.shadows.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: DESIGN.borderRadius.md,
    gap: SPACING.xs,
  },
  activeTabButton: {
    backgroundColor: COLORS.backgroundDark,
  },
  tabText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.tertiary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingTop: 0,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    paddingHorizontal: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.text.tertiary,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 12,
  },
  monthScrollView: {
    flex: 1,
  },
  monthScrollContent: {
    flexDirection: 'row',
  },
  monthContent: {
    width: screenWidth - (SPACING.lg * 2),
    paddingHorizontal: SPACING.md,
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
  leaderboardSection: {
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginRight: SPACING.xs,
  },
  monthText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  leaderboardCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginBottom: SPACING.sm,
  },
  headerText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
    width: 60,
  },
  nameHeader: {
    flex: 1,
    width: 'auto',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundDark,
  },
  currentUserRow: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginHorizontal: -SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: DESIGN.borderRadius.sm,
  },
  rankColumn: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginRight: 4,
  },
  rankBadge: {
    marginLeft: 2,
  },
  driverName: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
  },
  currentUserText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  driverStats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    justifyContent: 'flex-end',
  },
  ordersText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginRight: SPACING.xs,
  },
  rankChangeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 20,
  },
  rankChangeValue: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginLeft: 2,
  },
  separatorRow: {
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundDark,
  },
  separatorText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.text.tertiary,
    letterSpacing: 4,
  },
  challengesSection: {
    marginBottom: SPACING.xl,
  },
  challengeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  challengeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  challengeTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    flex: 1,
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

export default ChallengesScreen;