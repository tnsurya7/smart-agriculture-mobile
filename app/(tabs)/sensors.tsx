import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useSmartFarmData from '../../hooks/useSmartFarmData';
import { colors, spacing, typography, cardDimensions } from '../../styles/theme';

import SoilMoistureGauge from '../../components/SoilMoistureGauge';
import LiquidGlassCard from '../../components/LiquidGlassCard';

export default function Sensors() {
  const { data, soilPercent, isRaining, connection, systemStatus } = useSmartFarmData();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const SensorCard = ({ icon, label, value, unit, color }: { icon: string, label: string, value: string | number, unit: string, color: string[] }) => (
    <LiquidGlassCard
      gradient={colors.background.card}
      style={{ flex: 1, marginBottom: spacing.md }}
      height={cardDimensions.sensorCard.height}
      glowEffect={false}
    >
      <View style={{ flex: 1, padding: spacing.md, justifyContent: 'center', alignItems: 'center' }}>
        <LinearGradient
          colors={color as any}
          style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm }}
        >
          <Ionicons name={icon as any} size={20} color={colors.text.white} />
        </LinearGradient>
        <Text style={[typography.caption, { color: colors.text.secondary }]}>{label}</Text>
        <Text style={[typography.h3, { color: colors.text.primary, marginTop: 4 }]}>
          {typeof value === 'number' ? value.toFixed(1) : value}
          <Text style={[typography.caption, { opacity: 0.6 }]}> {unit}</Text>
        </Text>
      </View>
    </LiquidGlassCard>
  );

  return (
    <LinearGradient colors={colors.background.primary as any} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.screenHorizontal }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={{ marginBottom: spacing.lg, marginTop: spacing.sm }}>
            <Text style={typography.h1}>Sensor Data</Text>
            <Text style={typography.body}>Real-time field readings</Text>
          </View>

          {/* 1. Soil Gauge */}
          <View style={{ marginBottom: spacing.lg }}>
            <SoilMoistureGauge soilPercent={soilPercent} connectionStatus={connection} />
          </View>

          {/* 2. Sensor Grid */}
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <SensorCard
                icon="thermometer"
                label="Temperature"
                value={data.temperature}
                unit="°C"
                color={colors.sensors.temperature}
              />
              <SensorCard
                icon="water"
                label="Water Flow"
                value={data.flow}
                unit="L/min"
                color={colors.sensors.flow}
              />
            </View>
            <View style={{ flex: 1 }}>
              <SensorCard
                icon="cloud"
                label="Humidity"
                value={data.humidity}
                unit="%"
                color={colors.sensors.humidity}
              />
              <SensorCard
                icon="rainy"
                label="Rain Status"
                value={isRaining ? "Raining" : "Dry"}
                unit=""
                color={isRaining ? colors.sensors.rain : colors.status.info}
              />
              <SensorCard
                icon="sunny"
                label="Sunlight"
                value={data.lightPercent}
                unit="%"
                color={colors.sensors.light}
              />
            </View>
          </View>

          {/* 3. Total Usage */}
          <View style={{ marginBottom: spacing.md }}>
            <SensorCard
              icon="speedometer"
              label="Total Water Consumed Today"
              value={data.totalLiters}
              unit="Liters"
              color={colors.sensors.flow}
            />
          </View>

          {/* 4. Connectivity Status */}
          <LiquidGlassCard gradient={colors.background.liquid} height="auto" style={{ marginBottom: 100 }}>
            <View style={{ padding: spacing.lg, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 12, height: 12, borderRadius: 6,
                backgroundColor: connection === 'connected' ? colors.status.success[0] : colors.status.error[0],
                marginRight: spacing.md
              }} />
              <View>
                <Text style={typography.h3}>Sensor Connectivity</Text>
                <Text style={typography.body}>
                  Status: {connection === 'connected' ? 'Normal' : 'Interrupted'}
                </Text>
              </View>
            </View>
          </LiquidGlassCard>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}