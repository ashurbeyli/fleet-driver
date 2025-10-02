import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { authService, Driver } from '../services/authService';

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  functional: boolean;
  action?: string;
}

const MenuScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    try {
      setIsLoading(true);
      const driverData = await authService.getDriver();
      setDriver(driverData);
    } catch (error) {
      console.error('Failed to load driver data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    const confirmed = Platform.OS === 'web' 
      ? window.confirm('Are you sure you want to logout?')
      : await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Logout', style: 'destructive', onPress: () => resolve(true) },
            ]
          );
        });

    if (confirmed) {
      try {
        await authService.clearAuthData();
        navigation.navigate('Login');
      } catch (error) {
        console.error('Logout failed:', error);
        if (Platform.OS === 'web') {
          alert('Failed to logout. Please try again.');
        } else {
          Alert.alert('Error', 'Failed to logout. Please try again.');
        }
      }
    }
  };

  const handleMenuItemPress = (item: MenuItem) => {
    if (!item.functional) {
      const message = 'This feature is coming soon!';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Coming Soon', message);
      }
      return;
    }

    switch (item.action) {
      case 'profile':
        // Navigate to Profile screen (we'll use the old ProfileScreen as a detailed view)
        navigation.navigate('ProfileDetails');
        break;
      case 'agreement':
        // Navigate to Agreement screen
        navigation.navigate('Agreement');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

      const menuItems: MenuItem[] = [
        { id: '1', title: 'Profile', icon: 'person-circle-outline', functional: true, action: 'profile' },
        { id: '2', title: 'Agreement', icon: 'document-text-outline', functional: true, action: 'agreement' },
        { id: '3', title: 'Vehicles', icon: 'car-outline', functional: false },
        { id: '4', title: 'Ratings', icon: 'star-outline', functional: false },
        { id: '5', title: 'Invite a friend', icon: 'people-outline', functional: false },
        { id: '6', title: 'News', icon: 'newspaper-outline', functional: false },
        { id: '7', title: 'Logout', icon: 'log-out-outline', functional: true, action: 'logout' },
      ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {driver ? getInitials(driver.name) : 'FD'}
            </Text>
          </View>
          <Text style={styles.driverName}>{driver?.name || 'Driver'}</Text>
          <Text style={styles.driverPhone}>{driver?.phone || ''}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {driver?.isVerified ? 'Verified' : 'Not Verified'}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
                item.action === 'logout' && styles.logoutItem,
              ]}
              onPress={() => handleMenuItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[
                  styles.menuItemIconContainer,
                  item.action === 'logout' && styles.logoutIconContainer,
                ]}>
                  <Ionicons 
                    name={item.icon} 
                    size={24} 
                    color={item.action === 'logout' ? COLORS.error : COLORS.primary}
                  />
                </View>
                <Text style={[
                  styles.menuItemText,
                  item.action === 'logout' && styles.logoutText,
                ]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Fleet Driver v1.0.0</Text>
        </View>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...DESIGN.shadows.lg,
  },
  avatarLargeText: {
    fontSize: 36,
    fontWeight: TYPOGRAPHY.weights.extrabold,
    color: COLORS.surface,
  },
  driverName: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  driverPhone: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: DESIGN.borderRadius.full,
    ...DESIGN.shadows.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.sm,
    ...DESIGN.shadows.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  logoutItem: {
    marginTop: SPACING.xs,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: DESIGN.borderRadius.md,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  logoutIconContainer: {
    backgroundColor: '#FFEBEE',
  },
  menuItemText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  logoutText: {
    color: COLORS.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginBottom: 4,
  },
});

export default MenuScreen;

