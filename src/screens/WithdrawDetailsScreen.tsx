import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header, Button, Input } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { withdrawalsApi, type WithdrawalRequest } from '../api';

interface RouteParams {
  amount: string;
}

const WithdrawDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as RouteParams;
  const amount = parseFloat(params?.amount || '0');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiverName, setReceiverName] = useState<string>('');
  const [iban, setIban] = useState<string>('');

  const handleSubmit = async () => {
    // Validation
    if (!receiverName.trim()) {
      Alert.alert('Missing Information', 'Please enter receiver name');
      return;
    }

    if (!iban.trim()) {
      Alert.alert('Missing Information', 'Please enter IBAN');
      return;
    }

    Alert.alert(
      'Confirm Withdrawal',
      `Are you sure you want to withdraw $${amount.toFixed(2)} to ${receiverName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setIsSubmitting(true);

              const withdrawalData: WithdrawalRequest = {
                amount: Math.round(amount * 100), // Convert to cents
                receiverName: receiverName.trim(),
                receiverPhone: '', // Not required anymore
                receiverTaxNo: '', // Not required anymore
                iban: iban.trim(),
                explanation: '',
              };

              await withdrawalsApi.createWithdrawal(withdrawalData);

              Alert.alert('Success', 'Withdrawal request submitted successfully!', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate back to Withdraw screen
                    navigation.navigate('Withdraw');
                  },
                },
              ]);
            } catch (error) {
              console.error('Withdrawal error:', error);
              Alert.alert('Error', 'Failed to submit withdrawal request. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Summary */}
        <View style={styles.amountSummary}>
          <Ionicons name="cash-outline" size={32} color="#FFFFFF" />
          <Text style={styles.amountLabel}>Withdrawal Amount</Text>
          <Text style={styles.amountValue}>${amount.toFixed(2)}</Text>
        </View>

        {/* Bank Details Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Bank Details</Text>

          <View style={styles.formFields}>
            <Input
              label="Receiver Name"
              placeholder="Enter receiver name"
              value={receiverName}
              onChangeText={setReceiverName}
            />

            <Input
              label="IBAN"
              placeholder="Enter IBAN"
              value={iban}
              onChangeText={setIban}
            />
          </View>
        </View>

        {/* Submit Button */}
        <Button
          title={isSubmitting ? 'Processing...' : 'Confirm Withdrawal'}
          onPress={handleSubmit}
          variant="primary"
          size="large"
          style={styles.submitButton}
          disabled={isSubmitting || !receiverName.trim() || !iban.trim()}
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
    paddingTop: Platform.OS === 'web' ? 100 : 80,
  },
  amountSummary: {
    backgroundColor: COLORS.primary,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...DESIGN.shadows.md,
  },
  amountLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  amountValue: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#FFFFFF',
  },
  formSection: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    ...DESIGN.shadows.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  formFields: {
    gap: SPACING.md,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});

export default WithdrawDetailsScreen;
