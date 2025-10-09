import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { leaderboardsApi } from '../api';
import type { LeaderboardEntry, LeaderboardCompetition, LeaderboardsResponse } from '../api';

const { width: screenWidth } = Dimensions.get('window');

const RankingsScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardsData, setLeaderboardsData] = useState<LeaderboardsResponse | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const renderSeparator = (key: string) => {
    return (
      <View key={key} style={styles.separatorRow}>
        <Text style={styles.separatorText}>...</Text>
      </View>
    );
  };

  const renderLeaderboardEntry = (entry: LeaderboardEntry) => {
    if (!entry) {
      console.warn('renderLeaderboardEntry: entry is undefined');
      return null;
    }
    
    const change = entry.change ?? 0;
    const rankChangeIcon = change > 0 ? 'trending-up' : change < 0 ? 'trending-down' : 'remove';
    const rankChangeColor = change > 0 ? '#10B981' : change < 0 ? '#EF4444' : COLORS.text.tertiary;

    return (
      <View
        key={`${entry.rank}-${entry.name}`}
        style={[
          styles.driverRow,
          entry.isMe && styles.currentUserRow
        ]}
      >
        <View style={styles.rankColumn}>
          <Text style={[styles.rankText, entry.isMe && styles.currentUserText]}>
            {entry.rank}
          </Text>
          {entry.rank <= 3 && (
            <Ionicons
              name={getRankIcon(entry.rank)}
              size={12}
              color={getRankColor(entry.rank)}
              style={styles.rankBadge}
            />
          )}
        </View>

        <Text style={[styles.driverName, entry.isMe && styles.currentUserText]}>
          {entry.isMe ? 'You' : entry.name}
        </Text>

        <View style={styles.driverStats}>
          <Text style={[styles.ordersText, entry.isMe && styles.currentUserText]}>
            {entry.orders} orders
          </Text>
          {change !== 0 && (
            <View style={styles.rankChangeIndicator}>
              <Ionicons
                name={rankChangeIcon}
                size={12}
                color={rankChangeColor}
              />
              <Text style={[styles.rankChangeValue, { color: rankChangeColor }]}>
                {Math.abs(change)}
              </Text>
            </View>
          )}
          {change === 0 && (
            <View style={styles.rankChangeIndicator}>
              <Ionicons name="remove" size={12} color={COLORS.text.tertiary} />
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderLeaderboardContent = (competition: LeaderboardCompetition) => {
    const entries = competition.data;
    
    if (!entries || entries.length === 0) {
      return (
        <View key={competition.competitionId} style={styles.monthContent}>
          <View style={styles.leaderboardSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.sectionTitle}>Leaderboard</Text>
              <Text style={styles.monthText}>({competition.competitionTitle})</Text>
            </View>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No leaderboard data available</Text>
            </View>
          </View>
        </View>
      );
    }
    
    const currentUserEntry = entries.find(entry => entry.isMe);
    const top3Entries = entries.filter(entry => entry.rank <= 3);
    const last3Entries = entries.slice(-3); // Get last 3 entries including current user
    const isUserInTop3 = currentUserEntry && currentUserEntry.rank <= 3;
    const isUserRank4 = currentUserEntry && currentUserEntry.rank === 4;
    const isUserInLast3 = currentUserEntry && currentUserEntry.rank >= entries[entries.length - 3].rank;
    const isUserLastPosition = currentUserEntry && currentUserEntry.rank === entries[entries.length - 1].rank;
    const isUser4thFromLast = currentUserEntry && currentUserEntry.rank === entries[entries.length - 4].rank;

    return (
      <View key={competition.competitionId} style={styles.monthContent}>
        {/* Competition Leaderboard */}
        <View style={styles.leaderboardSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <Text style={styles.monthText}>({competition.competitionTitle})</Text>
          </View>
          <View style={styles.leaderboardCard}>
            <View style={styles.leaderboardHeader}>
              <Text style={styles.headerText}>Rank</Text>
              <Text style={[styles.headerText, styles.nameHeader]}>Driver</Text>
              <Text style={styles.headerText}>Orders</Text>
            </View>
            
            {/* Top 3 entries */}
            {top3Entries.map(renderLeaderboardEntry)}
            
            {/* Separator after top 3 if user is in top 3 OR if user is in last 3 */}
            {(isUserInTop3 || isUserInLast3) && last3Entries.length > 0 && renderSeparator('separator-top3')}
            
            {/* Separator before current user if they're not in top 3 AND not rank 4 AND not in last 3 */}
            {currentUserEntry && currentUserEntry.rank > 3 && !isUserRank4 && !isUserInLast3 && renderSeparator('separator-1')}
            
            {/* Current user if not in top 3 AND not in last 3 */}
            {currentUserEntry && currentUserEntry.rank > 3 && !isUserInLast3 && renderLeaderboardEntry(currentUserEntry)}
            
            {/* Separator after current user before last 3 entries (only if user is not in last 3 AND not 4th from last) */}
            {currentUserEntry && currentUserEntry.rank > 3 && last3Entries.length > 0 && !isUserInLast3 && !isUser4thFromLast && renderSeparator('separator-2')}
            
            {/* Last 3 entries with dynamic positioning */}
            {last3Entries
              .sort((a, b) => a.rank - b.rank) // Sort by rank to maintain proper order
              .map(renderLeaderboardEntry)}
          </View>
        </View>
      </View>
    );
  };

  const fetchLeaderboards = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const response = await leaderboardsApi.getLeaderboards();
      setLeaderboardsData(response);
    } catch (err) {
      console.error('Error fetching leaderboards:', err);
      setError('Failed to load leaderboards. Please try again.');
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const onRefresh = () => {
    fetchLeaderboards(true);
  };

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  useEffect(() => {
    // Scroll to current competition on mount
    if (scrollViewRef.current && leaderboardsData && leaderboardsData.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: currentMonthIndex * screenWidth,
          animated: false,
        });
      }, 100);
    }
  }, [leaderboardsData, currentMonthIndex]);

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
        {isLoading ? (
          <View style={styles.emptyState}>
            <Ionicons name="hourglass-outline" size={48} color={COLORS.text.secondary} />
            <Text style={styles.emptyStateText}>Loading leaderboards...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={48} color={COLORS.text.secondary} />
            <Text style={styles.emptyStateText}>{error}</Text>
            <TouchableOpacity
              onPress={() => fetchLeaderboards()}
              style={styles.retryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : leaderboardsData && leaderboardsData.length > 0 ? (
          <>
            {/* Swipeable Competition Content */}
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleMonthScroll}
              style={styles.monthScrollView}
              contentContainerStyle={styles.monthScrollContent}
            >
              {leaderboardsData.map(renderLeaderboardContent)}
            </ScrollView>
            
            {/* Competition Dots - Top Right */}
            <View style={styles.dotsContainer}>
              {leaderboardsData.map((_, index) => (
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
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={48} color={COLORS.text.secondary} />
            <Text style={styles.emptyStateText}>No competitions available</Text>
            <Text style={styles.emptyStateSubtext}>
              Check back later for new competitions
            </Text>
          </View>
        )}
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

export default RankingsScreen;

