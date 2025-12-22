import React from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SensorData } from '../types';
import LiquidGlassCard from './LiquidGlassCard';
import { colors, typography, spacing, cardDimensions } from '../styles/theme';

interface HistoryChartProps {
  data: SensorData[];
}

export default function HistoryChart({ data }: HistoryChartProps) {
  const chartWidth = cardDimensions.fullWidth - spacing.cardPadding * 3; // Improved padding
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [data]);

  // Prepare chart data with smooth animations
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      // Return demo data for better UX
      return {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
          {
            data: [25, 28, 30, 27, 29],
            color: () => colors.sensors.temperature[0],
            strokeWidth: 3,
          },
          {
            data: [60, 65, 62, 68, 66],
            color: () => colors.sensors.humidity[0],
            strokeWidth: 3,
          },
          {
            data: [40, 45, 42, 48, 46],
            color: () => colors.sensors.soil[0],
            strokeWidth: 3,
          },
        ],
        legend: ['Temp (°C)', 'Humidity (%)', 'Soil (%)'],
      };
    }

    // Use last 10 data points for mobile display
    const recentData = data.slice(-10);
    const labels = recentData.map((_, index) => (index + 1).toString());

    return {
      labels,
      datasets: [
        {
          data: recentData.map(d => d.temperature || 0),
          color: () => colors.sensors.temperature[0],
          strokeWidth: 3,
        },
        {
          data: recentData.map(d => d.humidity || 0),
          color: () => colors.sensors.humidity[0],
          strokeWidth: 3,
        },
        {
          data: recentData.map(d => d.soil || 0),
          color: () => colors.sensors.soil[0],
          strokeWidth: 3,
        },
      ],
      legend: ['Temp (°C)', 'Humidity (%)', 'Soil (%)'],
    };
  }, [data]);

  const [isFirstLoad, setIsFirstLoad] = React.useState(true);

  React.useEffect(() => {
    if (data.length > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.7, duration: 100, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
      ]).start();

      if (isFirstLoad) {
        setTimeout(() => setIsFirstLoad(false), 2000);
      }
    }
  }, [data]);

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Solid white for visibility
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.8})`,
    style: {
      borderRadius: 16,
      paddingRight: spacing.md,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#FFF',
    },
    propsForBackgroundLines: {
      strokeDasharray: '5,5',
      stroke: 'rgba(255, 255, 255, 0.1)',
      strokeWidth: 1,
    },
    fillShadowGradient: colors.primary.start,
    fillShadowGradientOpacity: 0.2,
  };

  return (
    <LiquidGlassCard
      gradient={['#1c1c1e', '#2c2c2e', '#1c1c1e']} // Dark gradient as requested
      style={styles.container}
      height={cardDimensions.chartHeight}
      glowEffect={true}
      textOverlay={false} // Dark background handles contrast
    >
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={colors.status.info as any}
          style={styles.headerIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="analytics" size={20} color={colors.text.white} />
        </LinearGradient>
        <Text style={[typography.h3, styles.title, { color: '#000000' }]}>Sensor History</Text>
      </View>

      <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={cardDimensions.chartHeight - 140} // Account for header and legend
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withDots={true}
          withShadow={false}
          fromZero={isFirstLoad}
        />
      </Animated.View>

      {/* Enhanced Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={colors.sensors.temperature as any}
            style={styles.legendDot}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={[typography.caption, styles.legendText]}>Temperature</Text>
        </View>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={colors.sensors.humidity as any}
            style={styles.legendDot}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={[typography.caption, styles.legendText]}>Humidity</Text>
        </View>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={colors.sensors.soil as any}
            style={styles.legendDot}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={[typography.caption, styles.legendText]}>Soil Moisture</Text>
        </View>
      </View>

      {data.length === 0 && (
        <Animated.View style={[styles.noDataContainer, { opacity: fadeAnim }]}>
          <Ionicons name="bar-chart-outline" size={32} color={colors.text.tertiary} />
          <Text style={[typography.body, styles.noDataText]}>
            Waiting for sensor data...
          </Text>
        </Animated.View>
      )}
    </LiquidGlassCard>
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  title: {
    color: colors.text.contrast,
    fontWeight: '800',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  chart: {
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    backgroundColor: colors.glass.overlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: cardDimensions.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.glass.borderSubtle,
  },
  legendDot: {
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
  legendText: {
    color: colors.text.white,
    fontWeight: '600',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  noDataText: {
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});