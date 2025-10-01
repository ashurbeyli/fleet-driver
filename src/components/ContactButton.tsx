import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, DESIGN } from '../constants';

interface ContactButtonProps {
  onPress: () => void;
  style?: any;
}

const ContactButton: React.FC<ContactButtonProps> = ({ onPress, style }) => {
  // Animation for contact button
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(1)).current;

  // Start contact button animations
  useEffect(() => {
    // Bubble animation - create expanding circles
    const createBubbleAnimation = (delay: number) => {
      const bubbleAnim = new Animated.Value(0);
      const opacityAnim = new Animated.Value(1);
      
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(bubbleAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    // Start multiple bubble animations with different delays
    const bubble1 = createBubbleAnimation(0);
    const bubble2 = createBubbleAnimation(500);
    const bubble3 = createBubbleAnimation(1000);

    bubble1.start();
    bubble2.start();
    bubble3.start();

    return () => {
      bubble1.stop();
      bubble2.stop();
      bubble3.stop();
    };
  }, []);

  return (
    <View style={[styles.contactButtonContainer, style]}>
      {/* Bubble circles */}
      <Animated.View
        style={[
          styles.bubble,
          {
            transform: [{ scale: pulseAnim }],
            opacity: flashAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bubble,
          {
            transform: [{ scale: pulseAnim }],
            opacity: flashAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bubble,
          {
            transform: [{ scale: pulseAnim }],
            opacity: flashAnim,
          },
        ]}
      />
      
      {/* Main button */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Animated.View
          style={{
            opacity: flashAnim,
          }}
        >
          <Ionicons name="call" size={20} color="#4CAF50" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  contactButtonContainer: {
    position: 'absolute' as const,
    top: 60,
    right: SPACING.lg,
    width: 48,
    height: 48,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 1000,
  },
  contactButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...DESIGN.shadows.sm,
  },
  bubble: {
    position: 'absolute' as const,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
  },
};

export default ContactButton;
