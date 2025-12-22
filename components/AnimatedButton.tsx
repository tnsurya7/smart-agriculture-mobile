import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, cardDimensions } from '../styles/theme';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  gradient?: string[];
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export default function AnimatedButton({
  title,
  onPress,
  gradient,
  icon,
  style,
  textStyle,
  disabled = false,
  size = 'medium',
  variant = 'primary',
}: AnimatedButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  // Get gradient based on variant
  const getGradient = () => {
    if (gradient) return gradient;

    switch (variant) {
      case 'success': return colors.status.success;
      case 'warning': return colors.status.warning;
      case 'error': return colors.status.error;
      case 'secondary': return colors.sensors.humidity;
      default: return colors.primary.liquid;
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingHorizontal: spacing.xxl,
          paddingVertical: spacing.lg,
          minHeight: 56,
        };
      default:
        return {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          minHeight: 44,
        };
    }
  };

  const handlePressIn = () => {
    if (disabled) return;

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (disabled) return;

    // Haptic feedback simulation with additional animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.94,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 400,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
      style={[styles.container, style]}
    >
      <Animated.View
        style={[
          styles.button,
          getSizeStyles(),
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
          disabled && styles.disabled,
        ]}
      >
        <LinearGradient
          colors={(disabled ? ['#E5E5EA', '#D1D1D6'] : getGradient()) as any}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowAnim,
                shadowColor: getGradient()[0],
              },
            ]}
          />

          {/* Button Content */}
          <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
            {icon && (
              <Ionicons
                name={icon as any}
                size={size === 'large' ? 20 : size === 'small' ? 14 : 16}
                color={disabled ? colors.text.muted : colors.text.white}
                style={styles.icon}
              />
            )}
            <Text
              style={[
                typography.body,
                styles.text,
                size === 'large' && styles.largeText,
                size === 'small' && styles.smallText,
                disabled && styles.disabledText,
                textStyle,
              ]}
            >
              {title}
            </Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignSelf: 'flex-start', // Removed to allow full width or parent control
  },
  button: {
    borderRadius: 100, // Pill shape for premium feel
    overflow: 'hidden',
    ...colors.glow.card,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: cardDimensions.borderRadiusSmall + 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    color: colors.text.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  largeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  smallText: {
    fontSize: 14,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    color: colors.text.muted,
  },
});