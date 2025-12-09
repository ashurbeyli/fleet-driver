import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { AppHeader } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import GoalsScreen from './GoalsScreen';
import RankingsScreen from './RankingsScreen';
import { useLanguage } from '../contexts/LanguageContext';

const ChallengesScreen: React.FC = () => {
  const { t } = useLanguage();
  const route = useRoute();
  const params = route.params as { openTab?: 'rankings' | 'challenges' } | undefined;
  const [activeTab, setActiveTab] = useState<'rankings' | 'challenges'>('challenges');

  useEffect(() => {
    if (params?.openTab) {
      setActiveTab(params.openTab);
    }
  }, [params?.openTab]);

  // Also listen to route changes
  useFocusEffect(
    React.useCallback(() => {
      const currentParams = route.params as { openTab?: 'rankings' | 'challenges' } | undefined;
      if (currentParams?.openTab) {
        setActiveTab(currentParams.openTab);
      }
    }, [route.params])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={COLORS.backgroundDark} />
      <AppHeader showBack={false} />
      
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
            {t.challenges.goals}
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
            {t.challenges.rankings}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render active screen */}
      <View style={styles.screenContainer}>
        {activeTab === 'challenges' ? <GoalsScreen /> : <RankingsScreen />}
            </View>
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
    marginTop: SPACING.md,
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
  screenContainer: {
    flex: 1,
  },
});

export default ChallengesScreen;
