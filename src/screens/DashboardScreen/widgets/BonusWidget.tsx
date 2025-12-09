import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../../../constants';
import { useConfig } from '../../../contexts/ConfigContext';
import { useLanguage } from '../../../contexts/LanguageContext';

interface BonusWidgetProps {
  onBonusPress?: () => void;
}

const BonusWidget: React.FC<BonusWidgetProps> = ({ onBonusPress }) => {
  const { features } = useConfig();
  const { t } = useLanguage();

  // Only show if bonusesComingSoon is enabled
  if (!features.bonusesComingSoon) {
    return null;
  }

  return (
    <View style={styles.widget}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="gift-outline" size={20} color={COLORS.text.secondary} />
        </View>
        <Text style={styles.title}>{t.common.bonuses}</Text>
      </View>
      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonText}>{t.bonuses.comingSoon}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  widget: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    flex: 1,
  },
  comingSoonContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  comingSoonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.secondary,
  },
});

export default BonusWidget;

