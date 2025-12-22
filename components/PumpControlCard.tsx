import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, glassCard, spacing, glassButton, cardDimensions } from '../styles/theme';

interface PumpControlCardProps {
  pumpStatus: 'ON' | 'OFF';
  mode: 'AUTO' | 'MANUAL';
  flowRate: number;
  totalLiters: number;
  onPumpToggle: (state: 'ON' | 'OFF') => void;
  onModeToggle: (mode: 'AUTO' | 'MANUAL') => void;
}

export default function PumpControlCard({
  pumpStatus,
  mode,
  flowRate,
  totalLiters,
  onPumpToggle,
  onModeToggle,
}: PumpControlCardProps) {
  const isPumpOn = pumpStatus === 'ON';
  const isAutoMode = mode === 'AUTO';
  const isManualControlEnabled = mode === 'MANUAL';

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
          colors={colors.sensors.flow as any}
          style={styles.headerIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerIconText}>💧</Text>
        </LinearGradient>
        <Text style={[typography.h3, styles.title]}>Irrigation Control</Text>
      </View>

      {/* Pump Status Display */}
      <View style={styles.pumpStatusContainer}>
        <LinearGradient
          colors={(isPumpOn ? colors.status.success : colors.status.error) as any}
          style={[styles.pumpIcon, isPumpOn && styles.pumpIconActive]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.pumpIconText}>⚡</Text>
        </LinearGradient>

        <View style={styles.pumpStatusText}>
          <Text style={[typography.caption, styles.pumpStatusLabel]}>PUMP STATUS</Text>
          <LinearGradient
            colors={(isPumpOn ? colors.status.success : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']) as any}
            style={styles.statusBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[typography.body, styles.pumpStatusValue]}>
              {isPumpOn ? '🟢 RUNNING' : '🔴 STOPPED'}
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* Flow Statistics */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={colors.background.card as any}
          style={[styles.statCard, glassCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={colors.sensors.flow as any}
            style={styles.statIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.statIconText}>🚰</Text>
          </LinearGradient>
          <Text style={[typography.caption, styles.statLabel]}>FLOW RATE</Text>
          <Text style={[typography.h3, styles.statValue]}>{flowRate.toFixed(2)} L/min</Text>
        </LinearGradient>

        <LinearGradient
          colors={colors.background.card as any}
          style={[styles.statCard, glassCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={colors.sensors.humidity as any}
            style={styles.statIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.statIconText}>💧</Text>
          </LinearGradient>
          <Text style={[typography.caption, styles.statLabel]}>TOTAL USAGE</Text>
          <Text style={[typography.h3, styles.statValue]}>{totalLiters.toFixed(1)} L</Text>
        </LinearGradient>
      </View>

      {/* Auto/Manual Mode Toggle */}
      <LinearGradient
        colors={colors.background.card as any}
        style={[styles.modeContainer, glassCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.modeHeader}>
          <LinearGradient
            colors={(isAutoMode ? colors.status.success : colors.status.warning) as any}
            style={styles.modeIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.modeIconText}>⚙️</Text>
          </LinearGradient>
          <View style={styles.modeTextContainer}>
            <Text style={[typography.body, styles.modeLabel]}>Auto Irrigation</Text>
            <Text style={[typography.caption, styles.modeDescription]}>
              {isAutoMode ? 'ESP32 CONTROLLING' : 'MANUAL OVERRIDE'}
            </Text>
          </View>
        </View>

        <View style={styles.modeToggle}>
          <LinearGradient
            colors={(isAutoMode ? colors.status.success : colors.status.warning) as any}
            style={styles.modeStatusBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[typography.caption, styles.modeStatus]}>
              {isAutoMode ? 'AUTO' : 'MANUAL'}
            </Text>
          </LinearGradient>

          <Switch
            value={isAutoMode}
            onValueChange={(value) => onModeToggle(value ? 'AUTO' : 'MANUAL')}
            trackColor={{
              false: 'rgba(255, 255, 255, 0.2)',
              true: colors.status.success[0]
            }}
            thumbColor={isAutoMode ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)'}
            style={styles.switch}
          />
        </View>
      </LinearGradient>

      {/* Manual Pump Controls */}
      {isManualControlEnabled && (
        <View style={styles.manualControls}>
          <Text style={[typography.body, styles.manualControlsTitle]}>Manual Control</Text>
          <View style={styles.pumpButtons}>
            <TouchableOpacity
              style={styles.pumpButtonContainer}
              onPress={() => onPumpToggle('ON')}
              disabled={isPumpOn}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={(isPumpOn ? colors.status.success : colors.background.card) as any}
                style={[styles.pumpButton, glassButton]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[
                  typography.body,
                  styles.pumpButtonText,
                  isPumpOn && styles.pumpButtonTextActive
                ]}>
                  PUMP ON
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pumpButtonContainer}
              onPress={() => onPumpToggle('OFF')}
              disabled={!isPumpOn}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={(!isPumpOn ? colors.status.error : colors.background.card) as any}
                style={[styles.pumpButton, glassButton]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[
                  typography.body,
                  styles.pumpButtonText,
                  !isPumpOn && styles.pumpButtonTextActive
                ]}>
                  PUMP OFF
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Auto Mode Info */}
      {isAutoMode && (
        <LinearGradient
          colors={colors.status.info as any}
          style={styles.autoModeInfo}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[typography.body, styles.autoModeText]}>
            🤖 ESP32 is intelligently controlling irrigation based on soil moisture, weather conditions, and AI predictions
          </Text>
        </LinearGradient>
      )}

      {/* Shine Effect */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'transparent'] as any}
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
    position: 'relative',
    overflow: 'hidden',
    minHeight: cardDimensions.controlHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIconText: {
    fontSize: 16,
  },
  title: {
    color: colors.text.primary,
  },
  pumpStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.glass.dark,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  pumpIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  pumpIconActive: {
    transform: [{ scale: 1.1 }],
  },
  pumpIconText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  pumpStatusText: {
    flex: 1,
  },
  pumpStatusLabel: {
    marginBottom: spacing.xs,
    opacity: 0.8,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pumpStatusValue: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    marginHorizontal: spacing.xs,
    position: 'relative',
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statIconText: {
    fontSize: 14,
  },
  statLabel: {
    marginBottom: spacing.xs,
    opacity: 0.8,
  },
  statValue: {
    color: colors.text.primary,
  },
  modeContainer: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: spacing.md,
  },
  modeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modeIconText: {
    fontSize: 14,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeLabel: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  modeDescription: {
    opacity: 0.7,
    marginTop: 2,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeStatusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  modeStatus: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  manualControls: {
    marginBottom: spacing.lg,
  },
  manualControlsTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  pumpButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pumpButtonContainer: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  pumpButton: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  pumpButtonText: {
    color: colors.text.secondary,
    fontWeight: '600',
  },
  pumpButtonTextActive: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  autoModeInfo: {
    padding: spacing.lg,
    borderRadius: 16,
    marginTop: spacing.md,
  },
  autoModeText: {
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    borderRadius: 20,
  },
});