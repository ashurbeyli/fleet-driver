import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { Header } from '../components';
import { useConfig } from '../contexts/ConfigContext';

const ContactScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { links } = useConfig();

  const handleCallSupport = () => {
    const phoneNumber = links.callCenterNumber || '+994501234567';
    const url = `tel:${phoneNumber}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Phone calls are not supported on this device');
        }
      })
      .catch((err) => {
        console.error('Error opening phone dialer:', err);
        Alert.alert('Error', 'Unable to open phone dialer');
      });
  };

  const handleWhatsApp = () => {
    // Extract phone number from whatsApp link (may contain full URL or just number)
    const whatsAppLink = links.whatsAppLink || '994501234567';
    // Check if it's a full URL or just a phone number
    const phoneNumber = whatsAppLink.includes('wa.me') || whatsAppLink.includes('whatsapp') 
      ? whatsAppLink 
      : whatsAppLink.replace(/[^0-9]/g, '');
    const message = 'Hello, I need support with RidexGo app';
    
    // If it's already a full URL, use it as is
    if (whatsAppLink.includes('wa.me') || whatsAppLink.includes('whatsapp')) {
      Linking.openURL(whatsAppLink).catch((err) => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Error', 'Unable to open WhatsApp');
      });
      return;
    }
    
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback to web WhatsApp
          const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          Linking.openURL(webUrl);
        }
      })
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Error', 'Unable to open WhatsApp');
      });
  };

  const handleSocialLink = (url: string, platform: string) => {
    if (!url) {
      Alert.alert('Error', `${platform} link is not configured`);
      return;
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', `Unable to open ${platform}`);
        }
      })
      .catch((err) => {
        console.error(`Error opening ${platform}:`, err);
        Alert.alert('Error', `Unable to open ${platform}`);
      });
  };

  // Build social links array from config - only include links that are provided
  const socialLinks = [
    ...(links.facebookLink ? [{
      name: 'Facebook',
      icon: 'logo-facebook' as keyof typeof Ionicons.glyphMap,
      url: links.facebookLink,
      color: '#1877F2',
    }] : []),
    ...(links.instagramLink ? [{
      name: 'Instagram',
      icon: 'logo-instagram' as keyof typeof Ionicons.glyphMap,
      url: links.instagramLink,
      color: '#E4405F',
    }] : []),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >


        {/* Support Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Support</Text>
          
          {/* Call Support */}
          <TouchableOpacity
            style={styles.supportCard}
            onPress={handleCallSupport}
            activeOpacity={0.7}
          >
            <View style={styles.supportIconContainer}>
              <Ionicons name="call" size={24} color="#4CAF50" />
            </View>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Call Support</Text>
              <Text style={styles.supportDescription}>{links.callCenterNumber || '+994 50 123 45 67'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
          </TouchableOpacity>

          {/* WhatsApp */}
          <TouchableOpacity
            style={styles.supportCard}
            onPress={handleWhatsApp}
            activeOpacity={0.7}
          >
            <View style={styles.supportIconContainer}>
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </View>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>WhatsApp Chat</Text>
              <Text style={styles.supportDescription}>Chat with our support team</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Social Links - Only show if there are links from config */}
        {socialLinks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Follow Us</Text>
            <View style={styles.socialGrid}>
              {socialLinks.map((social) => (
                <TouchableOpacity
                  key={social.name}
                  style={styles.socialCard}
                  onPress={() => handleSocialLink(social.url, social.name)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.socialIconContainer, { backgroundColor: social.color }]}>
                    <Ionicons name={social.icon} size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.socialName}>{social.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>RidexGo v1.0.0</Text>
          <Text style={styles.footerText}>© 2024 RidexGo. All rights reserved.</Text>
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
    paddingTop: Platform.OS === 'web' ? 100 : 80, // More padding for web to avoid overlap
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...DESIGN.shadows.sm,
  },
  supportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  supportDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  faqCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    ...DESIGN.shadows.sm,
  },
  faqIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  faqContent: {
    flex: 1,
  },
  faqTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  faqDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...DESIGN.shadows.sm,
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  socialName: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    fontWeight: TYPOGRAPHY.weights.medium,
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default ContactScreen;
