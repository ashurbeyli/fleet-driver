import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Clipboard,
  Modal,
  Animated,
  Linking,
  TextInput,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header, UnifiedSelectBox } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { RootStackParamList } from '../types';
import { invitationsApi, type InvitationPlatform, type Invitation, type SendInvitationRequest } from '../api';
import { authService } from '../services/authService';
import parksApi from '../api/parks';
import type { Park } from '../api/parks';

type InviteFriendScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'InviteFriend'>;

// InvitationPlatform interface is now imported from API

const InviteFriendScreen: React.FC = () => {
  const navigation = useNavigation<InviteFriendScreenNavigationProp>();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [platforms, setPlatforms] = useState<InvitationPlatform[]>([]);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteStep, setInviteStep] = useState<'park' | 'invite' | 'platforms'>('park');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [openingUrl, setOpeningUrl] = useState<string | null>(null);
  const [parkId, setParkId] = useState<string>('');
  const [parks, setParks] = useState<Park[]>([]);
  const [selectedPark, setSelectedPark] = useState<string>('');
  const [isLoadingParks, setIsLoadingParks] = useState(true);
  const [invitedPhone, setInvitedPhone] = useState<string>('+');
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handlePhoneChange = (text: string) => {
    // Ensure the phone number always starts with +
    if (text === '') {
      setInvitedPhone('+');
    } else if (!text.startsWith('+')) {
      setInvitedPhone('+' + text);
    } else {
      setInvitedPhone(text);
    }
  };

  useEffect(() => {
    loadInvitations();
    loadParks();
  }, []);

  useEffect(() => {
    if (selectedPark) {
      setParkId(selectedPark);
    }
  }, [selectedPark]);


  const loadInvitations = async () => {
    try {
      setIsLoadingInvitations(true);
      const response = await invitationsApi.getInvitations();
      setInvitations(response);
    } catch (error) {
      console.error('Failed to load invitations:', error);
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const response = await invitationsApi.getInvitations();
      setInvitations(response);
    } catch (error) {
      console.error('Failed to refresh invitations:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadParks = async () => {
    try {
      setIsLoadingParks(true);
      const parksData = await parksApi.getParks();
      setParks(parksData);
    } catch (error) {
      console.error('Failed to fetch parks:', error);
    } finally {
      setIsLoadingParks(false);
    }
  };

  const loadPlatforms = async (phoneNumber?: string) => {
    try {
      setIsLoadingPlatforms(true);
      
      if (!parkId) {
        console.warn('No park ID available');
        return;
      }

      // If phone number is provided, we'll need to update the API call
      // For now, using the existing API but we'll need to modify it
      const response = await invitationsApi.getInvitationPlatforms(parkId, phoneNumber);
      setPlatforms(response.platforms);
    } catch (error) {
      console.error('Failed to load platforms:', error);
    } finally {
      setIsLoadingPlatforms(false);
    }
  };

  const handleInviteButtonPress = () => {
    // Validate phone number and park selection
    if (!invitedPhone.trim() || invitedPhone.trim() === '+') {
      showToastNotification('Please enter a valid phone number', 'error');
      return;
    }

    if (!selectedPark) {
      showToastNotification('Please select a park', 'error');
      return;
    }

    // Open modal and load platforms with phone number
    setShowInviteModal(true);
    setInviteStep('platforms');
    loadPlatforms(invitedPhone.trim());
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    if (phone.length >= 4) {
      return `${phone.slice(0, 4)}****${phone.slice(-3)}`;
    }
    return phone;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const handleParkSelect = (parkId: string) => {
    setSelectedPark(parkId);
    setParkId(parkId);
  };

  const handlePlatformPress = async (platform: InvitationPlatform) => {
    try {
      // Validate phone number (must be more than just "+")
      if (!invitedPhone.trim() || invitedPhone.trim() === '+') {
        showToastNotification('Please enter a valid phone number', 'error');
        return;
      }

      // Show loading state for this specific platform
      setOpeningUrl(platform.id);
      showToastNotification(`Sending invitation via ${platform.name}...`, 'success');

      // Send invitation to API first
      const sendRequest: SendInvitationRequest = {
        invitedPhone: invitedPhone.trim(),
        platformId: platform.id,
      };

      const sendResponse = await invitationsApi.sendInvitation(sendRequest);
      
      if (!sendResponse.success) {
        throw new Error(sendResponse.message || 'Failed to send invitation');
      }

      // After successful API call, proceed with platform action
      if (platform.isCopyLink) {
        // Copy link to clipboard
        await Clipboard.setString(platform.url);
        showToastNotification('Invitation sent and link copied to clipboard!', 'success');
      } else {
        // Open platform with invitation URL
        const canOpen = await Linking.canOpenURL(platform.url);
        if (canOpen) {
          await Linking.openURL(platform.url);
          showToastNotification(`Invitation sent and ${platform.name} opened successfully!`, 'success');
        } else {
          showToastNotification(`Invitation sent but cannot open ${platform.name}. Please try again.`, 'error');
        }
      }

      // Refresh invitations list to show the new invitation
      loadInvitations();
      
    } catch (error) {
      console.error('Failed to send invitation:', error);
      showToastNotification('Failed to send invitation. Please try again.', 'error');
    } finally {
      setOpeningUrl(null);
    }
  };

  const getPlatformIcon = (iconName: string) => {
    // Use icon name directly from data
    return iconName as keyof typeof Ionicons.glyphMap;
  };

  const getPlatformColor = (platform: InvitationPlatform) => {
    // Use color from platform data, fallback to primary color
    return platform.color || COLORS.primary;
  };

  const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowToast(false);
      });
    }, 3000);
  };

  const getStatusColor = (invitation: Invitation) => {
    if (!invitation.isRegistered) return COLORS.text.tertiary;
    if (invitation.isCompleted) return '#4CAF50';
    return COLORS.primary;
  };

  const getStatusText = (invitation: Invitation) => {
    if (!invitation.isRegistered) return 'Pending';
    if (invitation.isCompleted) return 'Completed';
    return 'Active';
  };

  const renderPlatformItem = (platform: InvitationPlatform) => {
    const isOpening = openingUrl === platform.id;
    
    return (
      <TouchableOpacity
        key={platform.id}
        style={[styles.platformItem, isOpening && { opacity: 0.6 }]}
        onPress={() => handlePlatformPress(platform)}
        activeOpacity={0.7}
        disabled={isOpening}
      >
        <View style={styles.platformLeft}>
          <View style={[styles.platformIconContainer, { backgroundColor: getPlatformColor(platform) + '20' }]}>
            {isOpening ? (
              <ActivityIndicator size="small" color={getPlatformColor(platform)} />
            ) : (
              <Ionicons 
                name={getPlatformIcon(platform.icon)} 
                size={24} 
                color={getPlatformColor(platform)} 
              />
            )}
          </View>
          <Text style={styles.platformName}>{platform.name}</Text>
        </View>
        <View style={styles.platformRight}>
          {platform.isCopyLink ? (
            <Ionicons name="copy-outline" size={20} color={COLORS.text.tertiary} />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderInvitationItem = (invitation: Invitation) => (
    <View key={invitation.id} style={styles.invitationItem}>
      <View style={styles.invitationHeader}>
        <View style={styles.phoneContainer}>
          <Ionicons name="call" size={16} color={COLORS.text.secondary} />
          <Text style={styles.phoneText}>{formatPhoneNumber(invitation.phone)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invitation) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(invitation) }]}>
            {getStatusText(invitation)}
          </Text>
        </View>
      </View>
      
      <View style={styles.invitationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Invited:</Text>
          <Text style={styles.detailValue}>{formatDate(invitation.invitedAt)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Orders:</Text>
          <Text style={styles.detailValue}>{invitation.orders}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bonuses Earned:</Text>
          <Text style={[styles.detailValue, { color: COLORS.primary }]}>
            ₼{invitation.totalBonusesEarned}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor={COLORS.backgroundDark} />
        <Header />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Invite Form Card */}
        <View style={styles.inviteFormCard}>
          <View style={styles.inviteFormHeader}>
            <View style={styles.inviteFormIconContainer}>
              <Ionicons name="person-add" size={24} color={COLORS.surface} />
            </View>
            <Text style={styles.inviteFormTitle}>Invite a Friend</Text>
          </View>

          {/* Park Selector */}
          <View style={styles.formSelectBox}>
            <Text style={styles.formLabel}>Select Park</Text>
            <UnifiedSelectBox
              placeholder={
                isLoadingParks 
                  ? "Loading parks..." 
                  : parks.length === 0 
                    ? "No parks available" 
                    : "Select a park"
              }
              options={parks}
              selectedValue={selectedPark}
              onSelect={(option) => {
                handleParkSelect(option.id);
              }}
              disabled={isLoadingParks || parks.length === 0}
              buttonStyle={styles.compactSelectButton}
            />
          </View>

          {/* Phone Number Input */}
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Friend's Phone Number</Text>
            <TextInput
              style={styles.formTextInput}
              placeholder="Enter phone number"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={invitedPhone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Invite Button - Only show when both fields are filled */}
          {selectedPark && invitedPhone.trim() && invitedPhone.trim() !== '+' && (
            <TouchableOpacity 
              style={styles.inviteSubmitButton}
              onPress={handleInviteButtonPress}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={20} color={COLORS.surface} />
              <Text style={styles.inviteSubmitButtonText}>Send Invitation</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Invitations List */}
        <View style={styles.invitationsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Your Invitations</Text>
            <Text style={styles.invitationCount}>({invitations.length})</Text>
          </View>
          
          {isLoadingInvitations ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading invitations...</Text>
            </View>
          ) : invitations.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={COLORS.text.tertiary} />
              <Text style={styles.emptyStateTitle}>No Invitations Yet</Text>
              <Text style={styles.emptyStateText}>
                Use the quick invite options above to start inviting friends!
              </Text>
            </View>
          ) : (
            <View style={styles.invitationsList}>
              {invitations.map(renderInvitationItem)}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Invite Modal - Park Selection & Platforms */}
      <Modal
        visible={showInviteModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Invite a Friend</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowInviteModal(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalDescription}>
              Choose your preferred platform to share the invitation:
            </Text>
            
            {/* Platforms List */}
            {isLoadingPlatforms ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.modalLoadingText}>Loading platforms...</Text>
              </View>
            ) : platforms.length === 0 ? (
              <View style={styles.modalPlaceholder}>
                <Ionicons name="information-circle-outline" size={24} color={COLORS.text.secondary} />
                <Text style={styles.modalPlaceholderText}>
                  No platforms available for this park
                </Text>
              </View>
            ) : (
              <View style={styles.modalPlatformsList}>
                {platforms.map(renderPlatformItem)}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
        
        {/* Toast inside modal to appear above modal content */}
        {showToast && (
          <Animated.View 
            style={[
              styles.toastContainer,
              {
                opacity: fadeAnim,
                backgroundColor: toastType === 'success' ? '#4CAF50' : '#F44336',
              }
            ]}
          >
            <Ionicons 
              name={toastType === 'success' ? 'checkmark-circle' : 'alert-circle'} 
              size={20} 
              color="white" 
            />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </Animated.View>
        )}
      </Modal>
      </SafeAreaView>
      
      {/* Toast for main screen */}
      {showToast && !showInviteModal && (
        <Animated.View 
          style={[
            styles.toastContainer,
            {
              opacity: fadeAnim,
              backgroundColor: toastType === 'success' ? '#4CAF50' : '#F44336',
            }
          ]}
        >
          <Ionicons 
            name={toastType === 'success' ? 'checkmark-circle' : 'alert-circle'} 
            size={20} 
            color="white" 
          />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </>
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
    paddingTop: SPACING.xxl,
  },
  inviteFormCard: {
    backgroundColor: COLORS.primary,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
    ...DESIGN.shadows.lg,
  },
  inviteFormHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  inviteFormIconContainer: {
    width: 48,
    height: 48,
    borderRadius: DESIGN.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  inviteFormTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.surface,
  },
  formField: {
    marginBottom: SPACING.sm,
  },
  formLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  formSelectBox: {
    marginBottom: SPACING.sm,
  },
  compactSelectButton: {
    minHeight: 48,
    paddingVertical: SPACING.md,
  },
  formTextInput: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  formLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  formLoadingText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
    opacity: 0.8,
  },
  inviteSubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: DESIGN.borderRadius.lg,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
    ...DESIGN.shadows.md,
  },
  inviteSubmitButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
  },
  // Invite Button Styles
  inviteButton: {
    backgroundColor: COLORS.primary,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
    ...DESIGN.shadows.lg,
  },
  inviteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inviteButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inviteButtonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: DESIGN.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  inviteButtonTextContainer: {
    flex: 1,
  },
  inviteButtonTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.surface,
    marginBottom: SPACING.xs / 2,
  },
  inviteButtonSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickInviteSection: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
    ...DESIGN.shadows.md,
  },
  quickInviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  quickInviteTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickInviteTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginLeft: SPACING.xs,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: DESIGN.borderRadius.md,
    backgroundColor: COLORS.backgroundDark,
  },
  viewAllText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  quickInviteLoading: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  quickInvitePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  quickInvitePlaceholderText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    flex: 1,
  },
  quickInvitePlatforms: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.sm,
  },
  quickInvitePlatform: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderRadius: DESIGN.borderRadius.md,
    backgroundColor: COLORS.backgroundDark,
  },
  quickInviteIconContainer: {
    width: 40,
    height: 40,
    borderRadius: DESIGN.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  quickInviteText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  // Park Selector styles
  parkSelectorContainer: {
    marginBottom: SPACING.lg,
  },
  parkSelectorLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  parkSelectorLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  parkSelectorLoadingText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
  },
  parkSelectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: DESIGN.borderRadius.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 48,
    ...DESIGN.shadows.sm,
  },
  parkSelectText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
    flex: 1,
  },
  // Park Selector Modal styles
  modalParksList: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    marginTop: 2,
  },
  modalParkItem: {
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalParkItemSelected: {
    backgroundColor: COLORS.backgroundDark,
  },
  modalParkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalParkName: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
    flex: 1,
  },
  modalParkNameSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  inviteSection: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...DESIGN.shadows.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  invitationCount: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  sectionDescription: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    gap: SPACING.md,
  },
  platformsList: {
    gap: SPACING.sm,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...DESIGN.shadows.sm,
  },
  platformLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformIconContainer: {
    width: 44,
    height: 44,
    borderRadius: DESIGN.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  platformName: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  platformRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  invitationsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    ...DESIGN.shadows.md,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  invitationsList: {
    gap: SPACING.md,
  },
  invitationItem: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginLeft: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: DESIGN.borderRadius.full,
  },
  statusText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  invitationDetails: {
    gap: SPACING.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  modalBackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: SPACING.lg,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  modalDescription: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  modalParkSelectorContainer: {
    marginBottom: SPACING.lg,
  },
  phoneInputContainer: {
    marginBottom: SPACING.lg,
  },
  phoneInputLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  phoneInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: DESIGN.borderRadius.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.primary,
    minHeight: 48,
  },
  modalParkSelectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: DESIGN.borderRadius.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 48,
  },
  modalPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  modalPlaceholderText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  modalLoading: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  modalLoadingText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  inviteButtonContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  inviteActionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: DESIGN.borderRadius.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    minWidth: 200,
    ...DESIGN.shadows.md,
  },
  inviteActionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteActionButtonText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
  },
  modalPlatformsList: {
    gap: SPACING.sm,
  },
  // Toast styles
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: DESIGN.borderRadius.lg,
    zIndex: 9999,
    elevation: 9999,
  },
  toastText: {
    color: 'white',
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginLeft: SPACING.sm,
    flex: 1,
  },
});

export default InviteFriendScreen;
