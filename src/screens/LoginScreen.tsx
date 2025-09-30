import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, UnifiedSelectBox } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { parksApi, authApi } from '../api';
import { Park } from '../api/parks';
import { RootStackParamList } from '../types';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  onLoginSuccess?: (phoneNumber: string, parkName: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [parks, setParks] = useState<Park[]>([]);
  const [selectedPark, setSelectedPark] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingParks, setIsLoadingParks] = useState<boolean>(true);

  // Fetch parks from API
  useEffect(() => {
    const fetchParks = async () => {
      try {
        setIsLoadingParks(true);
        const parksData = await parksApi.getParks();
        setParks(parksData);
      } catch (error) {
        console.error('Failed to fetch parks:', error);
        Alert.alert('Error', 'Failed to load parks. Please check your connection and try again.');
      } finally {
        setIsLoadingParks(false);
      }
    };

    fetchParks();
  }, []);

  const handlePhoneSubmit = async () => {
    if (!selectedPark) {
      Alert.alert('Error', 'Please select a park');
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number with country code');
      return;
    }

    setIsLoading(true);
    try {
      // Call real login API
      const response = await authApi.login(phoneNumber, selectedPark);
      
      if (response.success) {
        // Get selected park name for display
        const park = parks.find(p => p.id === selectedPark);
        const parkName = park?.name || 'Selected Park';
        
        // Show success message and navigate to OTP screen
        Alert.alert('Success', response.message || `Verification code sent to ${phoneNumber}`);
        
        // Navigate to OTP screen with data
        navigation.navigate('Otp', {
          phoneNumber,
          parkName,
        });
      } else {
        Alert.alert('Error', response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', 'Login failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };


  // Phone number will be complete with +, e.g., +994704220692
  // No formatting or validation needed for now

  const renderPhoneStep = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Fleet Driver</Text>
        <Text style={styles.subtitle}>Control Centre</Text>
        <Text style={styles.description}>
          Login to your account to continue
        </Text>
      </View>

      <View style={styles.form}>
        <UnifiedSelectBox
          label="Select your park"
          placeholder={
            isLoadingParks 
              ? "Loading parks..." 
              : parks.length === 0 
                ? "No parks available" 
                : "Choose your working park"
          }
          options={parks}
          selectedValue={selectedPark}
          onSelect={(option) => setSelectedPark(option.id)}
          helpText={
            parks.length === 0 
              ? "No parks available. Please check your connection and refresh the page."
              : "Select the park where you work as a driver"
          }
          disabled={isLoadingParks || parks.length === 0}
        />

        <Input
          label="Your phone number"
          placeholder="+994704220692"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          helpText="Enter your complete phone number with country code (e.g., +994704220692). An SMS will be sent to verify your identity."
        />

        <Button
          title="Login"
          onPress={handlePhoneSubmit}
          variant="primary"
          size="large"
          disabled={!selectedPark || !phoneNumber || parks.length === 0}
          style={styles.submitButton}
        />
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderPhoneStep()}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Fleet Driver. All Rights Reserved.
          </Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Terms of Use</Text>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerLink}>Contact Us</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    ...Platform.select({
      web: {
        background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.backgroundDark} 100%)`,
      },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
    ...Platform.select({
      web: {
        position: 'relative',
        overflow: 'visible',
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.display,
    fontWeight: TYPOGRAPHY.weights.extrabold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    ...Platform.select({
      web: {
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
    }),
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.sizes.lg * TYPOGRAPHY.lineHeights.relaxed,
    fontWeight: TYPOGRAPHY.weights.normal,
  },
  form: {
    marginBottom: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xxl,
    ...DESIGN.shadows.md,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        overflow: 'visible',
        zIndex: 1,
      },
    }),
  },
  phoneDisplay: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: SPACING.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.lg,
  },
  resendButton: {
    flex: 0.4,
  },
  verifyButton: {
    flex: 0.55,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerLink: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary,
    marginHorizontal: SPACING.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'color 0.2s ease',
        '&:hover': {
          color: COLORS.primaryDark,
        },
      },
    }),
  },
});

export default LoginScreen;
