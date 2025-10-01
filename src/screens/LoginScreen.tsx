import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
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
      
      if (response.isValid) {
        // Get selected park name for display
        const park = parks.find(p => p.id === selectedPark);
        const parkName = park?.name || 'Selected Park';
        
        // Show success message with masked phone and OTP expiry info
        Alert.alert(
          'Success', 
          response.message || `Verification code sent to ${response.maskedPhone || phoneNumber}. Code expires in ${response.otpExpiryMinutes || 5} minutes.`
        );
        
        // Navigate to OTP screen with data
        navigation.navigate('Otp', {
          phoneNumber,
          parkName,
          parkId: selectedPark,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="car" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.logo}>Fleet Driver</Text>
          <Text style={styles.tagline}>Control Centre</Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          <UnifiedSelectBox
            label="Your Park"
            placeholder={
              isLoadingParks 
                ? "Loading parks..." 
                : parks.length === 0 
                  ? "No parks available" 
                  : "Select your park"
            }
            options={parks}
            selectedValue={selectedPark}
            onSelect={(option) => setSelectedPark(option.id)}
            disabled={isLoadingParks || parks.length === 0}
          />

          <Input
            label="Phone Number"
            placeholder="+994 70 422 06 92"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <Button
            title={isLoading ? "Logging in..." : "Continue"}
            onPress={handlePhoneSubmit}
            variant="primary"
            size="large"
            disabled={!selectedPark || !phoneNumber || parks.length === 0 || isLoading}
            style={styles.submitButton}
          />
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
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
  },
  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...DESIGN.shadows.md,
  },
  logo: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  tagline: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  // Form Card
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    ...DESIGN.shadows.md,
  },
  phoneDisplay: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.weights.medium,
    lineHeight: TYPOGRAPHY.sizes.xs * 1.5,
  },
});

export default LoginScreen;

