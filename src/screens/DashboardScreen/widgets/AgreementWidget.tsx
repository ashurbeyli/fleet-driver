import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../../../constants';

const AgreementWidget: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.agreementWidget}>
      <View style={styles.agreementContent}>
        <View style={styles.agreementIconContainer}>
          <Ionicons name="warning" size={24} color="#FF9800" />
        </View>
        <View style={styles.agreementTextContainer}>
          <Text style={styles.agreementTitle}>Agreement Required</Text>
          <Text style={styles.agreementMessage}>
            Please review and approve the agreement to continue using the service.
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.agreementButton}
        onPress={() => navigation.navigate('Agreement')}
        activeOpacity={0.7}
      >
        <Text style={styles.agreementButtonText}>Review Agreement</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  agreementWidget: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    ...DESIGN.shadows.sm,
  },
  agreementContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  agreementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  agreementTextContainer: {
    flex: 1,
  },
  agreementTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  agreementMessage: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.sizes.sm * 1.4,
  },
  agreementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: DESIGN.borderRadius.md,
  },
  agreementButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
    marginRight: SPACING.xs,
  },
});

export default AgreementWidget;
