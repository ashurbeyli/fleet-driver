import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, AppHeader } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface RouteParams {
  withdrawalId: string;
  amount: number;
  receiverName: string;
  maskedIBAN: string;
}

const WithdrawSuccessScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as RouteParams;
  const { t } = useLanguage();
  
  const { amount, receiverName, maskedIBAN } = params || {};
  // Ensure amount is a number (handle cases where it might come from URL as string)
  const amountNumber = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
  const amountInDollars = amountNumber.toFixed(2);
  
  // Provide fallback values for safety
  const displayReceiverName = receiverName || '';
  const displayMaskedIBAN = maskedIBAN || '';

  const handleGoBack = () => {
    // Navigate to Dashboard (TabNavigator) and then to Withdraw tab
    navigation.navigate('Dashboard', { screen: 'Withdraw' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <AppHeader title={t.withdrawalSuccess.title} showBack />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          </View>
        </View>

        {/* Success Title */}
        <Text style={styles.title}>{t.withdrawalSuccess.title}</Text>
        <Text style={styles.subtitle}>
          {t.withdrawalSuccess.subtitle}
        </Text>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t.withdrawalSuccess.amountSent}</Text>
            <Text style={styles.detailValue}>₺{amountInDollars}</Text>
          </View>
          
          <View style={styles.detailDivider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t.withdrawalSuccess.receiverName}</Text>
            <Text style={styles.detailValue}>{displayReceiverName}</Text>
          </View>
          
          <View style={styles.detailDivider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t.withdrawalSuccess.iban}</Text>
            <Text style={styles.detailValue}>{displayMaskedIBAN}</Text>
          </View>
        </View>

        {/* Info Message */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={16} color={COLORS.text.secondary} />
          <Text style={styles.infoText}>
            {t.withdrawal.balanceUpdateInfo}
          </Text>
        </View>

        {/* Action Button */}
        <Button
          title={t.withdrawal.backToWithdraw}
          onPress={handleGoBack}
          variant="primary"
          size="large"
          style={styles.button}
        />
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
    paddingTop: Platform.OS === 'web' ? 60 : 50,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    lineHeight: TYPOGRAPHY.sizes.md * 1.5,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    width: '100%',
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
    textAlign: 'right',
    flex: 1,
    marginLeft: SPACING.md,
  },
  detailDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    width: '100%',
    gap: SPACING.sm,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.sizes.sm * 1.4,
  },
  button: {
    width: '100%',
    marginTop: SPACING.sm,
  },
});

export default WithdrawSuccessScreen;

