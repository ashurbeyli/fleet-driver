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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, UnifiedSelectBox, AppHeader } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { parksApi, authApi } from '../api';
import { Park } from '../api/parks';
import { RootStackParamList } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  onLoginSuccess?: (phoneNumber: string, parkName: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { t } = useLanguage();
  const logoSource = require('../../assets/react-logo.png');
  const [parks, setParks] = useState<Park[]>([]);
  const [selectedPark, setSelectedPark] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('+90 ');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingParks, setIsLoadingParks] = useState<boolean>(true);

  const extractLocalDigits = (input: string) => {
    const digits = input.replace(/\D/g, '');
    // Always treat leading 90 as country code; also handle partial "9" backspace case
    let local = digits;
    if (local.startsWith('90')) {
      local = local.slice(2);
    } else if (local.startsWith('9')) {
      local = local.slice(1);
    }
    return local.slice(0, 10); // max 10 digits after +90
  };

  const formatPhoneNumber = (input: string) => {
    const localDigits = extractLocalDigits(input);

    const part1 = localDigits.slice(0, 3);
    const part2 = localDigits.slice(3, 6);
    const part3 = localDigits.slice(6, 10);

    let formatted = '+90';
    if (localDigits.length > 0) formatted += ` ${part1}`;
    if (part2) formatted += ` ${part2}`;
    if (part3) formatted += ` ${part3}`;

    return formatted.trimEnd();
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    // Ensure we always keep a trailing space after +90 when empty for nicer UX
    setPhoneNumber(formatted === '+90' ? '+90 ' : formatted);
  };

  // Fetch parks from API
  useEffect(() => {
    const fetchParks = async () => {
      try {
        setIsLoadingParks(true);
        const parksData = await parksApi.getParks();
        setParks(parksData);
      } catch (error) {
        console.error('Failed to fetch parks:', error);
        Alert.alert(t.common.error, t.login.failedToLoadParks);
      } finally {
        setIsLoadingParks(false);
      }
    };

    fetchParks();
  }, []);

  const handlePhoneSubmit = async () => {
    if (!selectedPark) {
      Alert.alert(t.common.error, t.login.pleaseSelectPark);
      return;
    }
    const withoutCountry = extractLocalDigits(phoneNumber);

    if (withoutCountry.length !== 10) {
      Alert.alert(t.common.error, t.login.invalidPhoneNumber);
      return;
    }

    setIsLoading(true);
    try {
      // Get selected park object to extract the correct data
      const park = parks.find(p => p.id === selectedPark);
      if (!park) {
        Alert.alert(t.common.error, t.login.parkNotFound);
        return;
      }
      
      // Call real login API with park.id (internal ID)
      const normalizedPhone = `+90${withoutCountry}`;
      const response = await authApi.login(normalizedPhone, park.id);
      
      if (response.isValid) {
        const parkName = park.name || 'Selected Park';
        
        // Navigate to OTP screen with data
        navigation.navigate('Otp', {
          phoneNumber: normalizedPhone,
          parkName,
          parkId: park.id, // Use park.id (internal ID)
        });
      } else {
        Alert.alert(t.common.error, response.message || t.login.loginFailed);
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert(t.common.error, t.login.loginFailedConnection);
    } finally {
      setIsLoading(false);
    }
  };


  // Phone number will be complete with +, e.g., +994704220692
  // No formatting or validation needed for now

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="RidexGo" showBack={false} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image source={logoSource} style={styles.logoImage} />
          </View>
          <Text style={styles.logo}>RidexGo</Text>
          <Text style={styles.tagline}>{t.login.controlCentre}</Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          <UnifiedSelectBox
            label={t.login.yourPark}
            placeholder={
              isLoadingParks 
                ? t.login.loadingParks
                : parks.length === 0 
                  ? t.login.noParksAvailable
                  : t.login.selectPark
            }
            modalTitle={t.login.selectPark}
            options={parks}
            selectedValue={selectedPark}
            onSelect={(option) => setSelectedPark(option.id)}
            disabled={isLoadingParks || parks.length === 0}
          />

          <Input
            label={t.login.phoneNumber}
            placeholder={t.login.phonePlaceholder}
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            inputStyle={{
              ...Platform.select({
                web: {
                  outlineWidth: 0,
                  outlineColor: 'transparent',
                },
              }),
            }}
          />

          <Button
            title={isLoading ? t.login.loggingIn : t.login.continue}
            onPress={handlePhoneSubmit}
            variant="primary"
            size="large"
            disabled={!selectedPark || !phoneNumber || parks.length === 0 || isLoading}
            style={styles.submitButton}
          />
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          {t.login.termsAgreement}
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
  logoImage: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
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

