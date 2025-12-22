import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ConnectionStatus as ConnectionStatusType } from '../services/websocket';
import { colors, typography, glassCard, spacing, animations } from '../styles/theme';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
  hasLiveData: boolean;
  mode: 'AUTO' | 'MANUAL';
}

export default function ConnectionStatus({ status, hasLiveData, mode }: ConnectionStatusProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Entrance animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      ...animations.spring,
    }).start();

    // Pulse animation for connecting state
    if (status === 'connecting') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      Animated.timing(pulseAnim, {
        toValue: 1,
        ...animations.timing,
      }).start();
    }
  }, [status]);

  const getStatusGradient = () => {
    switch (status) {
      case 'connected':
        return colors.status.success;
      case 'connecting':
        return colors.status.warning;
      default:
        return colors.status.error;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return hasLiveData ? 'Connected' : 'Connected (No Data)';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Offline';
    }
  };

  const getModeGradient = () => {
    return mode === 'AUTO' ? colors.status.info : colors.status.warning;
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      {/* Connection Status Badge */}
      <LinearGradient
        colors={colors.background.card as any}
        style={[styles.statusBadge, glassCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <LinearGradient
            colors={getStatusGradient() as any}
            style={styles.statusIndicator}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        <Text style={[typography.caption, styles.statusText]}>
          {getStatusText()}
        </Text>

        {/* Pulse effect for connecting state */}
        {status === 'connecting' && (
          <LinearGradient
            colors={['rgba(240, 147, 251, 0.3)', 'transparent'] as any}
            style={styles.pulseEffect}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
      </LinearGradient>

      {/* Mode Status Badge */}
      <LinearGradient
        colors={colors.background.card as any}
        style={[styles.statusBadge, glassCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <LinearGradient
          colors={getModeGradient() as any}
          style={styles.modeIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.modeIconText}>⚙️</Text>
        </LinearGradient>
        <Text style={[typography.caption, styles.statusText]}>
          {mode} MODE
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flex: 1,
    marginHorizontal: spacing.xs,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modeIconText: {
    fontSize: 10,
  },
  statusText: {
    color: colors.text.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  pulseEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
});