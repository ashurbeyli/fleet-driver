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
import { Button, Header } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';

interface RouteParams {
  message?: string;
  withdrawalId?: string;
}

const WithdrawErrorScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as RouteParams;
  
  const { message } = params;
  const errorMessage = message || 'The withdrawal request failed. This could be due to a bank error or internal failure. Please try again later.';

  const handleGoBack = () => {
    // Navigate to Dashboard (TabNavigator) and then to Withdraw tab
    navigation.navigate('Dashboard', { screen: 'Withdraw' });
  };

  const handleTryAgain = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="close-circle" size={80} color="#EF4444" />
          </View>
        </View>

        {/* Error Title */}
        <Text style={styles.title}>Withdrawal Failed</Text>
        <Text style={styles.subtitle}>
          {errorMessage}
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Try Again"
            onPress={handleTryAgain}
            variant="primary"
            size="medium"
            style={styles.button}
          />
          <Button
            title="Back to Withdraw"
            onPress={handleGoBack}
            variant="outline"
            size="medium"
            style={styles.button}
          />
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
    paddingTop: Platform.OS === 'web' ? 100 : 80,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    lineHeight: TYPOGRAPHY.sizes.md * 1.5,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  button: {
    width: '100%',
  },
});

export default WithdrawErrorScreen;

