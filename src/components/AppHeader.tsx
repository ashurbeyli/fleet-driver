import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, DESIGN } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface AppHeaderProps {
  title?: string;
  showSupport?: boolean;
  onLogoPress?: () => void;
  onSupportPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showSupport = true,
  onLogoPress,
  onSupportPress,
  showBack,
  onBackPress,
}) => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const logoSource = require('../../assets/react-logo.png');
  const canGoBack = navigation.canGoBack();

  const shouldShowBack = showBack ?? canGoBack;

  const handleLogoPress = () => {
    if (onLogoPress) {
      onLogoPress();
    } else {
      // Navigate to Dashboard and ensure Home tab is selected
      (navigation as any).navigate('Dashboard', { screen: 'Home' });
    }
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      // If we can go back, use goBack, otherwise navigate to Dashboard as fallback
      if (canGoBack) {
        navigation.goBack();
      } else {
        // Fallback when there's no navigation history (e.g., after page refresh)
        navigation.navigate('Dashboard' as never);
      }
    }
  };

  const handleSupportPress = () => {
    if (onSupportPress) {
      onSupportPress();
    } else {
      navigation.navigate('Contact' as never);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <View style={styles.sideSlot}>
          {shouldShowBack ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={22} color="#2C3E50" />
              <Text style={styles.backText}>{t.common.back}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.8} onPress={handleLogoPress} style={styles.logoContainer}>
              <Image source={logoSource} style={styles.logoImage} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.spacer} />

        {showSupport ? (
          <TouchableOpacity
            style={styles.supportButton}
            activeOpacity={0.8}
            onPress={handleSupportPress}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#2C3E50" />
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
              </View>
            </View>
            <Text style={styles.supportText}>{`${t.contact.support} 24/7`}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.supportPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    ...DESIGN.shadows.sm,
    zIndex: 10,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    minHeight: 56,
  },
  sideSlot: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    padding: SPACING.xs,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: '#2C3E50',
  },
  logoImage: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  spacer: {
    flex: 1,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
  },
  iconContainer: {
    position: 'relative',
  },
  liveIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  supportText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: '#2C3E50',
  },
  supportPlaceholder: {
    width: 72, // keep layout balanced when support hidden
  },
});

export default AppHeader;

