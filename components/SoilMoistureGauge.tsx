import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors, typography, glassCard, spacing, cardDimensions } from '../styles/theme';

interface SoilMoistureGaugeProps {
  soilPercent: number;
  connectionStatus?: 'connected' | 'disconnected' | 'connecting';
}

export default function SoilMoistureGauge({ soilPercent, connectionStatus = 'connected' }: SoilMoistureGaugeProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const [displayValue, setDisplayValue] = React.useState(soilPercent);

  useEffect(() => {
    // Animate gauge fill with listener since SVG doesn't support native driver directly
    // Using a listener to update state efficiently for SVG path props
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(value);
    });

    Animated.timing(animatedValue, {
      toValue: soilPercent,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Animate scale entrance
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [soilPercent]);

  // Idle Animation (Breathing)
  const breathingAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (connectionStatus !== 'connected') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathingAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(breathingAnim, { toValue: 0.6, duration: 1500, useNativeDriver: true })
        ])
      ).start();
    } else {
      breathingAnim.setValue(1); // Stop blinking when connected
    }
  }, [connectionStatus]);

  // Get gradient colors based on moisture level
  const getGradient = (moisture: number): string[] => {
    if (moisture < 20) return ['#fc466b', '#3f5efb']; // red to purple
    if (moisture < 40) return ['#f093fb', '#f5576c']; // pink to red
    if (moisture < 60) return ['#ffecd2', '#fcb69f']; // orange gradient
    if (moisture < 80) return ['#a8edea', '#fed6e3']; // cyan to pink
    return ['#11998e', '#38ef7d']; // green gradient
  };

  const gradient = getGradient(soilPercent);
  const size = 200;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;

  return (
    <LinearGradient
      colors={colors.background.card as any}
      style={[styles.container, glassCard]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={gradient as any}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerIcon}>💧</Text>
        </LinearGradient>
        <Text style={[typography.h3, styles.title]}>Soil Moisture</Text>
      </View>

      {/* Animated Gauge Container */}
      <Animated.View
        style={[
          styles.gaugeContainer,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        <Svg width={size} height={size / 2 + 30} style={styles.svg}>
          <Defs>
            <RadialGradient id="gaugeGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={gradient[0]} stopOpacity="1" />
              <Stop offset="100%" stopColor={gradient[1]} stopOpacity="1" />
            </RadialGradient>
          </Defs>

          {/* Background arc */}
          <Path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <Path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference - (displayValue / 100) * circumference}
          />

          {/* Glow effect */}
          <Path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            stroke={gradient[0]}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference - (displayValue / 100) * circumference}
            opacity={0.6}
          />
        </Svg>

        {/* Center Value Display */}
        <View style={styles.valueContainer}>
          <LinearGradient
            colors={gradient as any}
            style={styles.valueBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[typography.h1, styles.value]}>
              {displayValue.toFixed(0)}%
            </Text>
          </LinearGradient>
          <Text style={[typography.caption, styles.valueLabel]}>MOISTURE</Text>
        </View>
      </Animated.View>

      {/* Connection Status Text Removed */}

      {/* Status Indicator */}
      <View style={styles.statusContainer}>
        <LinearGradient
          colors={gradient as any}
          style={styles.statusIndicator}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Text style={[typography.body, styles.statusText]}>
          {soilPercent < 20 ? 'Critical - Needs Water' :
            soilPercent < 40 ? 'Low - Water Soon' :
              soilPercent < 60 ? 'Moderate - Monitor' :
                soilPercent < 80 ? 'Good - Optimal' : 'Excellent - Perfect'}
        </Text>
      </View>

      {/* Shine Effect */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'transparent'] as any}
        style={styles.shine}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.cardPadding,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    height: cardDimensions.hero,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIcon: {
    fontSize: 16,
  },
  title: {
    color: colors.text.primary,
  },
  gaugeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  valueContainer: {
    position: 'absolute',
    top: 60,
    alignItems: 'center',
  },
  valueBackground: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginBottom: spacing.xs,
  },
  value: {
    color: colors.text.primary,
    textAlign: 'center',
  },
  valueLabel: {
    color: colors.text.tertiary,
    letterSpacing: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.glass.dark,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statusText: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderRadius: 20,
  },
});