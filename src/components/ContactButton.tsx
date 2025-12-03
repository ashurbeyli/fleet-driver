import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactButtonProps {
  onPress: () => void;
  style?: any;
}

const ContactButton: React.FC<ContactButtonProps> = ({ onPress, style }) => {
  const { t } = useLanguage();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.bubble,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubble-outline" size={14} color="#333" />
        <Text style={styles.text}>{t.contact.support}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    position: 'absolute' as const,
    top: Platform.OS === 'web' ? 10 : 70,
    right: 20,
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#333',
    marginLeft: 6,
  },
  bubble: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
  },
};

export default ContactButton;