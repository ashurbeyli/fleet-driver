import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { authService } from '../services/authService';
import OtpInputCard from './OtpInputCard';

interface OtpModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  resendTimer?: number;
  maxLength?: number;
}

const OtpModal: React.FC<OtpModalProps> = ({
  visible,
  onClose,
  onVerify,
  onResend,
  isLoading = false,
  error = null,
  resendTimer = 0,
  maxLength = 6,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  // Get phone number from storage when modal opens
  useEffect(() => {
    if (visible) {
      const getPhoneNumber = async () => {
        try {
          const driver = await authService.getDriver();
          if (driver?.phone) {
            setPhoneNumber(driver.phone);
          }
        } catch (error) {
          console.error('Failed to get phone number:', error);
        }
      };
      getPhoneNumber();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Verify Agreement</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <OtpInputCard
              phoneNumber={phoneNumber}
              onComplete={onVerify}
              onResend={onResend}
              error={error}
              disabled={isLoading}
              resendTimer={resendTimer}
              length={maxLength}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 120, // Move modal down to avoid overlapping buttons
    paddingHorizontal: SPACING.lg,
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    width: '100%',
    maxWidth: 380, // Slightly smaller max width
    maxHeight: '80%',
    ...DESIGN.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    padding: SPACING.lg,
  },
  // Info Card
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    ...DESIGN.shadows.sm,
  },
  infoIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
});

export default OtpModal;
