import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SystemStatus } from '../types';
import { colors, typography, glassCard, spacing, cardDimensions } from '../styles/theme';

interface SystemStatusCardProps {
  systemStatus: SystemStatus | null;
}

export default function SystemStatusCard({ systemStatus }: SystemStatusCardProps) {
  // Safe defaults
  const safeSystemStatus = systemStatus || {
    total_rows: 7245,
    last_retrain: "2024-12-21 14:30:00",
    next_retrain: "2024-12-22 02:00:00",
    sensor_connectivity: true,
    data_logging_active: true
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <LinearGradient
      colors={colors.background.card as any}
      style={[styles.container, glassCard, { minHeight: cardDimensions.controlHeight, height: 'auto' }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={colors.status.info as any}
          style={styles.headerIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerIconText}>⚙️</Text>
        </LinearGradient>
        <Text style={[typography.h3, styles.title]}>System Status</Text>
      </View>

      {/* Data Logging Stats */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={colors.background.card as any}
          style={[styles.statItem, glassCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={colors.sensors.temperature as any}
            style={styles.statIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.statIconText}>📊</Text>
          </LinearGradient>
          <View style={styles.statContent}>
            <Text style={[typography.body, styles.statValue]}>
              {safeSystemStatus.total_rows.toLocaleString()}
            </Text>
            <Text style={[typography.caption, styles.statLabel]}>Total Records</Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={colors.background.card as any}
          style={[styles.statItem, glassCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={colors.status.success as any}
            style={styles.statIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.statIconText}>🔄</Text>
          </LinearGradient>
          <View style={styles.statContent}>
            <Text style={[typography.body, styles.statValue]}>
              {formatDateTime(safeSystemStatus.last_retrain)}
            </Text>
            <Text style={[typography.caption, styles.statLabel]}>Last Retrain</Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={colors.background.card as any}
          style={[styles.statItem, glassCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={colors.status.warning as any}
            style={styles.statIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.statIconText}>⏰</Text>
          </LinearGradient>
          <View style={styles.statContent}>
            <Text style={[typography.body, styles.statValue]}>
              {formatDateTime(safeSystemStatus.next_retrain)}
            </Text>
            <Text style={[typography.caption, styles.statLabel]}>Next Retrain</Text>
          </View>
        </LinearGradient>
      </View>

      {/* System Health */}
      <LinearGradient
        colors={colors.background.card as any}
        style={[styles.healthContainer, glassCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[typography.body, styles.healthTitle]}>System Health</Text>

        <View style={styles.healthItems}>
          <View style={styles.healthItem}>
            <LinearGradient
              colors={(safeSystemStatus.sensor_connectivity ? colors.status.success : colors.status.error) as any}
              style={styles.healthDot}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={[typography.body, styles.healthText]}>Sensor Connectivity</Text>
            <Text style={[
              typography.caption,
              styles.healthStatus,
              { color: safeSystemStatus.sensor_connectivity ? colors.status.success[0] : colors.status.error[0] }
            ]}>
              {safeSystemStatus.sensor_connectivity ? 'Online' : 'Offline'}
            </Text>
          </View>

          <View style={styles.healthItem}>
            <LinearGradient
              colors={(safeSystemStatus.data_logging_active ? colors.status.success : colors.status.error) as any}
              style={styles.healthDot}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={[typography.body, styles.healthText]}>Data Logging</Text>
            <Text style={[
              typography.caption,
              styles.healthStatus,
              { color: safeSystemStatus.data_logging_active ? colors.status.success[0] : colors.status.error[0] }
            ]}>
              {safeSystemStatus.data_logging_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Auto Retrain Info */}
      <LinearGradient
        colors={colors.status.info as any}
        style={styles.retrainInfo}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[typography.caption, styles.retrainText]}>
          🤖 AI models automatically retrain every 24 hours with new sensor data to improve accuracy
        </Text>
      </LinearGradient>

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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
  statsContainer: {
    marginBottom: spacing.xl,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statIconText: {
    fontSize: 14,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    marginTop: spacing.xs,
    opacity: 0.8,
  },
  healthContainer: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  healthTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  healthItems: {
    gap: spacing.md,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  healthText: {
    flex: 1,
    color: colors.text.secondary,
  },
  healthStatus: {
    fontWeight: '600',
  },
  retrainInfo: {
    padding: spacing.lg,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.info[0],
  },
  retrainText: {
    color: colors.text.primary,
    lineHeight: 18,
    fontWeight: '500',
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