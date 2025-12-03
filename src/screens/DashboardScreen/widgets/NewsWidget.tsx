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

interface NewsWidgetProps {
  onNewsPress?: () => void;
}

const NewsWidget: React.FC<NewsWidgetProps> = ({ onNewsPress }) => {
  const navigation = useNavigation<DashboardNavigationProp>();

  // Mock data - will be replaced with real implementation later
  const mockNewsData = {
    latestNews: {
      title: "New Bonus Program",
      summary: "Earn extra ₺5 per ride this weekend",
      time: "2h ago",
    },
    unreadCount: 3,
  };

  const handleNewsPress = () => {
    // TODO: Navigate to news screen when implemented
    console.log('Navigate to news screen');
    onNewsPress?.();
  };

  return (
    <TouchableOpacity style={styles.widget} onPress={handleNewsPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="newspaper" size={14} color="#3B82F6" />
        </View>
        <Text style={styles.title}>News</Text>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{mockNewsData.unreadCount}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {mockNewsData.latestNews.title}
        </Text>
        <Text style={styles.newsSummary} numberOfLines={2}>
          {mockNewsData.latestNews.summary}
        </Text>
        <Text style={styles.newsTime}>
          {mockNewsData.latestNews.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  widget: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.sm, // Nice padding
    flex: 1, // Takes 1/3 of the space (1 grid out of 3)
    marginHorizontal: SPACING.xs,
    ...DESIGN.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs, // Small margin
  },
  iconContainer: {
    width: 20, // Very small icon
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4, // Minimal margin
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xs, // Very small title
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    flex: 1,
  },
  badgeContainer: {
    marginRight: 2,
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.surface,
  },
  newsContent: {
    marginTop: 0, // No extra margin
  },
  newsTitle: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: 3, // Nice small margin
    lineHeight: TYPOGRAPHY.sizes.xs * 1.2,
  },
  newsSummary: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginBottom: 3, // Nice small margin
    lineHeight: TYPOGRAPHY.sizes.xs * 1.2,
  },
  newsTime: {
    fontSize: 10,
    color: COLORS.text.tertiary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
});

export default NewsWidget;
