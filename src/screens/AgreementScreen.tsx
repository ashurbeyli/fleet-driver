import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { agreementsApi, usersApi, type AgreementResponse, type AgreeResponse, type ConfirmAgreementResponse, type UserMeResponse } from '../api';
import { authService } from '../services/authService';
import { OtpModal, AppHeader } from '../components';
import { useLanguage } from '../contexts/LanguageContext';

const AgreementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const [agreement, setAgreement] = useState<AgreementResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isAgreeing, setIsAgreeing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isAgreed, setIsAgreed] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const userResponse = await usersApi.getUserMe();
      setIsAgreed(userResponse.isAgreed);
      
      // Sync with storage if different
      const driver = await authService.getDriver();
      if (driver && (
        driver.id !== userResponse.id ||
        driver.phone !== userResponse.phone ||
        driver.name !== userResponse.name ||
        driver.parkName !== userResponse.parkName ||
        driver.isVerified !== userResponse.isVerified ||
        driver.isAgreed !== userResponse.isAgreed
      )) {
        await authService.updateDriverData({
          id: userResponse.id,
          phone: userResponse.phone,
          name: userResponse.name,
          parkName: userResponse.parkName,
          isVerified: userResponse.isVerified,
          isAgreed: userResponse.isAgreed,
        });
        console.log('Updated driver data in storage with latest user info');
      }
      
      // Load agreement content regardless of status
      await loadAgreement();
    } catch (error) {
      console.error('Failed to check user status:', error);
      // Still try to load agreement content
      await loadAgreement();
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const loadAgreement = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const agreementData = await agreementsApi.getLatestAgreement();
      setAgreement(agreementData);
    } catch (error) {
      console.error('Failed to load agreement:', error);
      setError(t.agreement.failedToLoad);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgree = async () => {
    try {
      setIsAgreeing(true);
      setError(null);
      const response: AgreeResponse = await agreementsApi.agreeToAgreement();
      
      console.log('OTP sent for agreement:', response);
      
      // Show OTP modal
      setShowOtpModal(true);
    } catch (error) {
      console.error('Failed to send agreement OTP:', error);
      setError(t.agreement.failedToSendCode);
    } finally {
      setIsAgreeing(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      setOtpError(null);
      const response: ConfirmAgreementResponse = await agreementsApi.confirmAgreement(otp);
      
      console.log('Agreement confirmed successfully:', response);
      console.log('Agreed at:', response.agreedAt);
      
      // Refresh user data to get the latest information
      const userResponse = await usersApi.getUserMe();
      await authService.updateDriverData({
        id: userResponse.id,
        phone: userResponse.phone,
        name: userResponse.name,
        parkName: userResponse.parkName,
        isVerified: userResponse.isVerified,
        isAgreed: userResponse.isAgreed,
      });
      
      // Update local state
      setIsAgreed(true);
      
      // Close modal and navigate back to dashboard
      setShowOtpModal(false);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to confirm agreement:', error);
      setOtpError(t.agreement.invalidCode);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtpError(null);
      await agreementsApi.agreeToAgreement();
      console.log('OTP resent for agreement');
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      setOtpError(t.agreement.failedToResend);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return t.agreement.unknownDate;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showBack showSupport={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>{t.agreement.loading}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={COLORS.error} />
            <Text style={styles.errorTitle}>{t.agreement.errorLoading}</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadAgreement}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>{t.common.tryAgain}</Text>
            </TouchableOpacity>
          </View>
        ) : agreement ? (
          <>
            {/* Agreement Header - Outside Card */}
            <View style={styles.agreementHeader}>
              <View style={styles.agreementIconContainer}>
                <Ionicons name="document-text" size={48} color={COLORS.primary} />
              </View>
              <Text style={styles.agreementTitle}>{agreement.title}</Text>
            </View>

            {/* Last Updated Info - Simple Style (always show) */}
            <View style={styles.lastUpdatedContainer}>
              <Ionicons name="time-outline" size={16} color={COLORS.text.secondary} />
              <Text style={styles.lastUpdatedText}>
                {t.agreement.lastUpdated} {formatDate(agreement.updatedAt)}
              </Text>
            </View>

            {/* Agreement Content Card */}
            <View style={styles.agreementCard}>
              {/* Content Header */}
              <View style={styles.contentHeader}>
                <Text style={styles.contentTitle}>{t.agreement.contentTitle}</Text>
                <Text style={styles.contentSubtitle}>
                  {t.agreement.contentSubtitle}
                </Text>
              </View>

              {/* Content Toggle */}
              <TouchableOpacity
                style={styles.contentToggle}
                onPress={() => setIsContentExpanded(!isContentExpanded)}
                activeOpacity={0.7}
              >
                <View style={styles.contentToggleHeader}>
                  <View style={styles.contentToggleLeft}>
                    <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.contentToggleText}>
                      {isContentExpanded ? t.agreement.hideFull : t.agreement.readFull}
                    </Text>
                  </View>
                  <Ionicons 
                    name={isContentExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.primary} 
                  />
                </View>
                
                {/* Preview Content */}
                <View style={styles.contentPreview}>
                  <Text style={styles.contentPreviewText} numberOfLines={3}>
                    {agreement.text}
                  </Text>
                  {!isContentExpanded && (
                    <View style={styles.contentPreviewOverlay}>
                      <Text style={styles.contentPreviewHint}>
                        {t.agreement.tapToRead}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* Full Content - Expandable */}
              {isContentExpanded && (
                <View style={styles.fullContent}>
                  <Text style={styles.agreementText}>{agreement.text}</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                {isAgreed ? (
                  // Already agreed - show green disabled button style
                  <TouchableOpacity
                    style={styles.agreedButton}
                    disabled={true}
                    activeOpacity={1}
                  >
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.surface} />
                    <Text style={styles.agreedButtonText}>
                      {t.agreement.alreadyAgreed}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  // Not agreed - show action buttons
                  <>
                    <TouchableOpacity
                      style={[styles.agreeButton, isAgreeing && styles.agreeButtonDisabled]}
                      onPress={handleAgree}
                      activeOpacity={0.7}
                      disabled={isAgreeing}
                    >
                      {isAgreeing ? (
                        <ActivityIndicator size="small" color={COLORS.surface} />
                      ) : (
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.surface} />
                      )}
                      <Text style={styles.agreeButtonText}>
                        {isAgreeing ? t.agreement.accepting : t.agreement.iAgree}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={() => navigation.goBack()}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.declineButtonText}>{t.agreement.cancel}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* OTP Modal */}
      <OtpModal
        visible={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerify}
        onResend={handleResendOtp}
        error={otpError}
        isLoading={isAgreeing}
        maxLength={6}
      />
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
  // Agreement Header - Outside Card
  agreementHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  agreementIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...DESIGN.shadows.md,
  },
  agreementTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  // Agreement Content Card
  agreementCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xl,
    ...DESIGN.shadows.md,
  },
  contentHeader: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  contentTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  contentSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  termsContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  termsTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  termNumber: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    marginRight: SPACING.sm,
    minWidth: 20,
  },
  termText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.sizes.sm * 1.4,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  agreeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: DESIGN.borderRadius.lg,
    gap: SPACING.sm,
  },
  agreeButtonDisabled: {
    backgroundColor: COLORS.text.tertiary,
    opacity: 0.7,
  },
  agreeButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
  },
  declineButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: DESIGN.borderRadius.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  declineButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: DESIGN.borderRadius.lg,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
  },
  // Agreement Content
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: DESIGN.borderRadius.md,
  },
  lastUpdatedText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  // Content Toggle Styles
  contentToggle: {
    marginBottom: SPACING.lg,
  },
  contentToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  contentToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contentToggleText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  contentPreview: {
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: DESIGN.borderRadius.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  contentPreviewText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
    lineHeight: TYPOGRAPHY.sizes.md * 1.6,
  },
  contentPreviewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: DESIGN.borderRadius.md,
    borderBottomRightRadius: DESIGN.borderRadius.md,
    alignItems: 'center',
  },
  contentPreviewHint: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.primary,
  },
  fullContent: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  agreementContent: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  agreementText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
    lineHeight: TYPOGRAPHY.sizes.md * 1.6,
    textAlign: 'left',
  },
  // Agreed State Styles - Green Disabled Button
  agreedButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: DESIGN.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    ...DESIGN.shadows.sm,
  },
  agreedButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
    textAlign: 'center',
  },
});

export default AgreementScreen;
