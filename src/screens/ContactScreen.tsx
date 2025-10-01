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

const ContactScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleCallSupport = () => {
    const phoneNumber = '+994501234567'; // Replace with actual support number
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
    const phoneNumber = '994501234567'; // Replace with actual WhatsApp number
    const message = 'Hello, I need support with Fleet Driver app';
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

  const handleFAQ = () => {
    Alert.alert('FAQ', 'FAQ feature coming soon!');
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'logo-facebook',
      url: 'https://facebook.com/fleetdriver',
      color: '#1877F2',
    },
    {
      name: 'Instagram',
      icon: 'logo-instagram',
      url: 'https://instagram.com/fleetdriver',
      color: '#E4405F',
    },
    {
      name: 'Twitter',
      icon: 'logo-twitter',
      url: 'https://twitter.com/fleetdriver',
      color: '#1DA1F2',
    },
    {
      name: 'LinkedIn',
      icon: 'logo-linkedin',
      url: 'https://linkedin.com/company/fleetdriver',
      color: '#0077B5',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>


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
              <Text style={styles.supportDescription}>+994 50 123 45 67</Text>
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

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Information</Text>
          
          <TouchableOpacity
            style={styles.faqCard}
            onPress={handleFAQ}
            activeOpacity={0.7}
          >
            <View style={styles.faqIconContainer}>
              <Ionicons name="help-circle" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.faqContent}>
              <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
              <Text style={styles.faqDescription}>Find answers to common questions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          
          <View style={styles.socialGrid}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialCard}
                onPress={() => handleSocialLink(social.url, social.name)}
                activeOpacity={0.7}
              >
                <View style={[styles.socialIconContainer, { backgroundColor: social.color }]}>
                  <Ionicons name={social.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.socialName}>{social.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Fleet Driver v1.0.0</Text>
          <Text style={styles.footerText}>© 2024 Fleet Driver. All rights reserved.</Text>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...DESIGN.shadows.sm,
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
