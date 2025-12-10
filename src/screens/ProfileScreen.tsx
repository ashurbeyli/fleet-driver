import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { authService, Driver } from '../services/authService';
import { usersApi, type UserInfoResponse } from '../api';
import { AppHeader } from '../components';
import { useLanguage } from '../contexts/LanguageContext';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);

  useEffect(() => {
    loadDriverData();
    loadUserInfo();
  }, []);

  // Refresh driver data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadDriverData();
    }, [])
  );

  const loadDriverData = async () => {
    try {
      // Load cached driver data immediately (fast, no loading indicator needed)
      const driverData = await authService.getDriver();
      setDriver(driverData);
    } catch (error) {
      console.error('Failed to load driver data:', error);
    }
  };

  const loadUserInfo = async () => {
    try {
      setIsLoadingUserInfo(true);
      // Fetch user info in the background
      const userInfoData = await usersApi.getUserInfo();
      setUserInfo(userInfoData);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      setIsLoadingUserInfo(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showBack showSupport={false} />
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
          <Text style={styles.driverName}>{driver?.name || t.profile.driver}</Text>
          <Text style={styles.driverPhone}>{driver?.phone || ''}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {driver?.isVerified ? t.menu.verified : t.menu.notVerified}
            </Text>
          </View>
        </View>

        {/* Profile Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.profile.profileDetails}</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t.profile.parkName}</Text>
            <Text style={styles.detailValue}>{driver?.parkName || '-'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t.profile.agreement}</Text>
            <Text style={styles.detailValue}>
              {driver?.isAgreed ? t.profile.agreed : t.profile.notAgreed}
            </Text>
          </View>

        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.profile.userInfo}</Text>
          
          {isLoadingUserInfo ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t.profile.loadingUserInfo}</Text>
            </View>
          ) : userInfo ? (
            <>
              {userInfo.hireDate && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t.profile.hireDate}</Text>
                  <Text style={styles.detailValue}>
                    {new Date(userInfo.hireDate).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {userInfo.phone && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t.profile.phone}</Text>
                  <Text style={styles.detailValue}>{userInfo.phone}</Text>
                </View>
              )}

              {userInfo.plateNumber && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t.profile.plateNumber}</Text>
                  <Text style={styles.detailValue}>{userInfo.plateNumber}</Text>
                </View>
              )}

              {userInfo.city && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t.profile.city}</Text>
                  <Text style={styles.detailValue}>{userInfo.city}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{t.profile.failedToLoadUserInfo}</Text>
            </View>
          )}
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>RidexGo v1.0.0</Text>
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
    paddingTop: SPACING.md,
  },
  loadingContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.error,
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...DESIGN.shadows.md,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    flex: 1,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginBottom: 4,
  },
});

export default ProfileScreen;

