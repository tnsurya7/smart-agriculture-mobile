import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WeatherData } from '../types';
import { colors, typography, glassCard, spacing, cardDimensions } from '../styles/theme';

interface WeatherCardProps {
  weatherData: WeatherData | null;
}

export default function WeatherCard({ weatherData }: WeatherCardProps) {
  // Safe defaults
  const safeWeatherData = weatherData || {
    temperature: 28.5,
    humidity: 65,
    rain_probability: 25,
    rain_expected: false,
    forecast_window: "Next 24 hours",
    location: "Erode, Tamil Nadu",
    last_updated: new Date().toLocaleTimeString()
  };

  const getRainIcon = (probability: number) => {
    if (probability >= 70) return '🌧️';
    if (probability >= 40) return '⛅';
    if (probability >= 20) return '🌤️';
    return '☀️';
  };

  const getRainColor = (probability: number) => {
    if (probability >= 70) return '#3B82F6';
    if (probability >= 40) return '#F59E0B';
    return '#22C55E';
  };

  return (
    <LinearGradient
      colors={colors.background.card as any}
      style={[styles.container, glassCard, { height: cardDimensions.controlHeight }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={colors.sensors.light as any}
          style={styles.headerIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerIconText}>🌤️</Text>
        </LinearGradient>
        <Text style={[typography.h3, styles.title]}>Weather Forecast</Text>
      </View>

      {/* Location */}
      <View style={styles.locationContainer}>
        <Text style={[typography.body, styles.location]}>📍 {safeWeatherData.location}</Text>
        <Text style={[typography.caption, styles.lastUpdated]}>
          Updated: {safeWeatherData.last_updated}
        </Text>
      </View>

      {/* Main Weather Info */}
      <View style={styles.mainWeatherContainer}>
        <LinearGradient
          colors={colors.background.card as any}
          style={[styles.temperatureContainer, glassCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={colors.sensors.temperature as any}
            style={styles.weatherIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.weatherIconText}>🌡️</Text>
          </LinearGradient>
          <Text style={[typography.h2, styles.temperatureValue]}>
            {safeWeatherData.temperature.toFixed(1)}°C
          </Text>
          <Text style={[typography.caption, styles.temperatureLabel]}>Temperature</Text>
        </LinearGradient>

        <LinearGradient
          colors={colors.background.card as any}
          style={[styles.humidityContainer, glassCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={colors.sensors.humidity as any}
            style={styles.weatherIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.weatherIconText}>💧</Text>
          </LinearGradient>
          <Text style={[typography.h2, styles.humidityValue]}>
            {safeWeatherData.humidity}%
          </Text>
          <Text style={[typography.caption, styles.humidityLabel]}>Humidity</Text>
        </LinearGradient>
      </View>

      {/* Rain Forecast */}
      <LinearGradient
        colors={colors.background.card as any}
        style={[styles.rainContainer, glassCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.rainHeader}>
          <LinearGradient
            colors={colors.sensors.rain as any}
            style={styles.rainIconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.rainIconText}>
              {getRainIcon(safeWeatherData.rain_probability)}
            </Text>
          </LinearGradient>
          <Text style={[typography.body, styles.rainTitle]}>Rain Forecast</Text>
        </View>

        <View style={styles.rainDetails}>
          <View style={styles.rainProbabilityContainer}>
            <Text style={[
              typography.h2,
              styles.rainProbability,
              { color: getRainColor(safeWeatherData.rain_probability) }
            ]}>
              {safeWeatherData.rain_probability}%
            </Text>
            <Text style={[typography.caption, styles.rainProbabilityLabel]}>Probability</Text>
          </View>

          <View style={styles.rainStatusContainer}>
            <LinearGradient
              colors={(safeWeatherData.rain_expected ? colors.sensors.rain : colors.status.success) as any}
              style={styles.rainStatusDot}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={[typography.body, styles.rainStatusText]}>
              {safeWeatherData.rain_expected ? 'Rain Expected' : 'No Rain Expected'}
            </Text>
          </View>
        </View>

        <Text style={[typography.caption, styles.forecastWindow]}>
          {safeWeatherData.forecast_window}
        </Text>
      </LinearGradient>

      {/* Irrigation Impact */}
      <LinearGradient
        colors={(safeWeatherData.rain_expected ? colors.sensors.rain : colors.status.success) as any}
        style={styles.impactContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[typography.body, styles.impactTitle]}>💧 Irrigation Impact</Text>
        <Text style={[typography.caption, styles.impactText]}>
          {safeWeatherData.rain_expected
            ? "🌧️ Rain expected - irrigation may be reduced automatically"
            : "☀️ No rain expected - normal irrigation schedule"}
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
    marginBottom: spacing.lg,
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
  locationContainer: {
    marginBottom: spacing.lg,
  },
  location: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  lastUpdated: {
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  mainWeatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  temperatureContainer: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    marginRight: spacing.sm,
  },
  humidityContainer: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    marginLeft: spacing.sm,
  },
  weatherIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  weatherIconText: {
    fontSize: 14,
  },
  temperatureValue: {
    color: colors.sensors.temperature[0],
    marginBottom: spacing.xs,
  },
  temperatureLabel: {
    opacity: 0.8,
  },
  humidityValue: {
    color: colors.sensors.humidity[0],
    marginBottom: spacing.xs,
  },
  humidityLabel: {
    opacity: 0.8,
  },
  rainContainer: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  rainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  rainIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
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
  rainIconText: {
    fontSize: 14,
  },
  rainTitle: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  rainDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rainProbabilityContainer: {
    alignItems: 'center',
  },
  rainProbability: {
    fontWeight: 'bold',
  },
  rainProbabilityLabel: {
    marginTop: spacing.xs,
    opacity: 0.8,
  },
  rainStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rainStatusDot: {
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
  rainStatusText: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  forecastWindow: {
    textAlign: 'center',
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  impactContainer: {
    padding: spacing.lg,
    borderRadius: 16,
    marginTop: spacing.md,
  },
  impactTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  impactText: {
    color: colors.text.primary,
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