import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, glassCard, liquidGlass, cardDimensions } from '../styles/theme';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gradient?: string[];
  height?: number | string;
  borderRadius?: number;
  glowEffect?: boolean;
  glowColor?: string;
  textOverlay?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export default function LiquidGlassCard({
  children,
  style,
  gradient = colors.background.liquid,
  height = cardDimensions.uniform,
  borderRadius = cardDimensions.borderRadius,
  glowEffect = true,
  glowColor = '#000',
  textOverlay = false,
  onPress,
  disabled = false,
}: LiquidGlassCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
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
    ]).start();
  };

  const CardContent = (
    <Animated.View style={[
      glassCard,
      style,
      {
        height: height as any,
        borderRadius,
        position: 'relative',
        backgroundColor: colors.glass.ultra,
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      },
      glowEffect && {
        shadowColor: glowColor,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 12,
      },
    ]}>
      {/* iOS 18 Liquid Glass Background - Multi-layer gradient */}
      <LinearGradient
        colors={gradient.length >= 2 ? gradient as any : colors.background.liquid as any}
        style={[liquidGlass, { borderRadius }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={gradient.length === 4 ? [0, 0.3, 0.7, 1] : [0, 0.5, 1]}
      />

      {/* iOS 18 Premium Glass Layers - Enhanced depth */}
      <View style={[styles.iosGlassLayer1, { borderRadius }]} />
      <View style={[styles.iosGlassLayer2, { borderRadius }]} />
      <View style={[styles.iosGlassLayer3, { borderRadius }]} />

      {/* Optional Text Overlay for better contrast */}
      {textOverlay && (
        <View style={[styles.textOverlay, { borderRadius }]} />
      )}

      {/* Content Container with proper z-index */}
      <View style={styles.content}>
        {children}
      </View>

      {/* iOS 18 Shine Effect - Subtle top highlight */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.5)',
          'rgba(255, 255, 255, 0.2)',
          'transparent'
        ]}
        style={[styles.iosShine, { borderRadius }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* iOS 18 Border - Refined edge definition */}
      <View style={[styles.iosBorder, { borderRadius }]} />

      {/* Inner Shadow for depth */}
      <View style={[styles.innerShadow, { borderRadius }]} />

      {/* Press State Overlay */}
      {onPress && !disabled && (
        <Animated.View
          style={[
            styles.pressOverlay,
            {
              borderRadius,
              opacity: scaleAnim.interpolate({
                inputRange: [0.97, 1],
                outputRange: [0.08, 0],
              }),
            }
          ]}
        />
      )}
    </Animated.View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
        style={{ flex: 1 }}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
}

const styles = StyleSheet.create({
  // iOS 18 Glass Layers - Progressive transparency
  iosGlassLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  iosGlassLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  iosGlassLayer3: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  content: {
    flex: 1,
    zIndex: 10,
    position: 'relative',
  },
  iosShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    zIndex: 5,
  },
  iosBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    zIndex: 8,
  },
  innerShadow: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 6,
  },
  pressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary.start,
    zIndex: 9,
  },
  iosGlow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
});