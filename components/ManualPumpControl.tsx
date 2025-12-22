import React from 'react';
import { View, Text, StyleSheet, Animated, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LiquidGlassCard from './LiquidGlassCard';
import AnimatedButton from './AnimatedButton';
import { colors, typography, spacing, cardDimensions } from '../styles/theme';

interface ManualPumpControlProps {
  pumpStatus: 'ON' | 'OFF';
  mode: 'AUTO' | 'MANUAL';
  onPumpToggle: (status: 'ON' | 'OFF') => void;
  onModeToggle: (mode: 'AUTO' | 'MANUAL') => void;
  flowRate: number;
  totalLiters: number;
}

export default function ManualPumpControl({
  pumpStatus,
  mode,
  onPumpToggle,
  onModeToggle,
  flowRate,
  totalLiters,
}: ManualPumpControlProps) {
  const handlePumpPress = () => {
    // Toggle pump
    onPumpToggle(pumpStatus === 'ON' ? 'OFF' : 'ON');
  };

  const handleModePress = () => {
    onModeToggle(mode === 'AUTO' ? 'MANUAL' : 'AUTO');
  };

  return (
    <LiquidGlassCard
      gradient={colors.background.liquid}
      style={styles.container}
      height="auto"
      glowEffect={true}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={colors.sensors.flow as any}
            style={styles.headerIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="water" size={24} color="#00BFFF" />
          </LinearGradient>
          <Text style={[typography.h3, styles.title]}>Pump Control</Text>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeSection}>
          <View style={styles.switchContainer}>
            <Text style={[typography.h3, styles.switchLabel]}>Auto Irrigation</Text>
            <Switch
              trackColor={{ false: colors.glass.border, true: colors.status.success[0] }}
              thumbColor={colors.text.white}
              ios_backgroundColor={colors.glass.subtle}
              onValueChange={() => handleModePress()}
              value={mode === 'AUTO'}
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            />
          </View>
          <Text style={[typography.caption, { color: mode === 'AUTO' ? colors.status.success[0] : colors.text.secondary }]}>
            {mode === 'AUTO' ? 'System is running automatically' : 'Switch to auto for smart control'}
          </Text>
        </View>

        {/* Manual Pump Control */}
        {mode === 'MANUAL' && (
          <View style={styles.manualSection}>
            <Text style={[typography.caption, styles.manualLabel]}>Manual Control</Text>
            <View style={styles.pumpButtonContainer}>
              <AnimatedButton
                title={pumpStatus === 'ON' ? 'TURN OFF PUMP' : 'TURN ON PUMP'}
                onPress={handlePumpPress}
                gradient={pumpStatus === 'ON' ? colors.status.error : colors.status.success}
                icon={pumpStatus === 'ON' ? 'power' : 'power-outline'}
                size="large"
                variant={pumpStatus === 'ON' ? 'error' : 'success'}
                style={styles.pumpButton}
              />
              <Text style={[typography.caption, styles.pumpStatusText]}>
                Pump is {pumpStatus === 'ON' ? 'Running' : 'Stopped'}
              </Text>
            </View>
          </View>
        )}

        {/* Auto Mode Info */}
        {mode === 'AUTO' && (
          <View style={styles.autoSection}>
            <LinearGradient
              colors={colors.status.info as any}
              style={styles.autoInfo}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="cog" size={20} color={colors.text.white} />
              <Text style={[typography.body, styles.autoText]}>
                ESP32 is controlling irrigation automatically based on soil moisture and weather conditions
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Status Info */}
        <View style={styles.statusSection}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <LinearGradient
                colors={colors.sensors.flow as any}
                style={styles.statusIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="speedometer" size={16} color="#00BFFF" />
              </LinearGradient>
              <Text style={[typography.caption, styles.statusLabel]}>Flow Rate</Text>
              <Text style={[typography.body, styles.statusValue]}>{flowRate.toFixed(1)} L/min</Text>
            </View>

            <View style={styles.statusItem}>
              <LinearGradient
                colors={colors.status.info as any}
                style={styles.statusIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="analytics" size={16} color={colors.text.white} />
              </LinearGradient>
              <Text style={[typography.caption, styles.statusLabel]}>Total Usage</Text>
              <Text style={[typography.body, styles.statusValue]}>{totalLiters.toFixed(1)} L</Text>
            </View>
          </View>
        </View>
      </View>
    </LiquidGlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.componentGap,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    shadowColor: colors.glass.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  modeSection: {
    marginBottom: spacing.xl,
  },
  modeLabel: {
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  switchLabel: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  manualSection: {
    marginBottom: spacing.xl,
  },
  manualLabel: {
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pumpButtonContainer: {
    alignItems: 'center',
  },
  pumpButton: {
    minWidth: 220,
    marginBottom: spacing.md,
  },
  pumpStatusText: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  autoSection: {
    marginBottom: spacing.xl,
  },
  autoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: cardDimensions.borderRadiusSmall,
    shadowColor: colors.glass.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  autoText: {
    color: colors.text.white,
    marginLeft: spacing.md,
    flex: 1,
    lineHeight: 20,
  },
  statusSection: {
    marginTop: 'auto',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.glass.ultra,
    padding: spacing.lg,
    borderRadius: cardDimensions.borderRadiusSmall,
    marginHorizontal: spacing.sm,
    borderWidth: 0.5,
    borderColor: colors.glass.border,
    shadowColor: colors.glass.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusLabel: {
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  statusValue: {
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});