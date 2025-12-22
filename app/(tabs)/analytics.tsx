import React from 'react';
import { View, ScrollView, RefreshControl, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useSmartFarmData from '../../hooks/useSmartFarmData';
import { colors, spacing, typography, cardDimensions } from '../../styles/theme';


import LiquidGlassCard from '../../components/LiquidGlassCard';
import SensorBarChart from '../../components/SensorBarChart';

export default function Analytics() {
  const { history } = useSmartFarmData();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const calculateStats = () => {
    if (!history || history.length === 0) return { avgSoil: 0, avgTemp: 0, maxSoil: 0, minSoil: 0 };
    const soil = history.map(h => h.soil || 0);
    const temp = history.map(h => h.temperature || 0);
    return {
      avgSoil: soil.reduce((a, b) => a + b, 0) / soil.length,
      avgTemp: temp.reduce((a, b) => a + b, 0) / temp.length,
      maxSoil: Math.max(...soil),
      minSoil: Math.min(...soil),
    };
  };

  const stats = calculateStats();

  const StatBox = ({ label, value, unit, icon, color }: any) => (
    <LiquidGlassCard gradient={colors.background.card} style={{ flex: 1 }} height={cardDimensions.gridCard.height} glowEffect={false}>
      <View style={{ flex: 1, padding: spacing.md, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name={icon} size={24} color={color} style={{ marginBottom: spacing.md }} />
        <Text style={[typography.caption, { color: colors.text.secondary }]}>{label}</Text>
        <Text style={[typography.h2, { color: colors.text.primary, marginTop: 4 }]}>
          {value.toFixed(1)}
          <Text style={[typography.caption, { fontSize: 14 }]}> {unit}</Text>
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
            <Text style={typography.h1}>Data Analytics</Text>
            <Text style={typography.body}>Trends & History</Text>
          </View>




          {/* 1. Chart */}
          <View style={{ marginBottom: spacing.lg }}>
            <SensorBarChart data={history} />
          </View>

          {/* 2. Stats Grid */}
          <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }}>
            <StatBox
              label="Avg Soil Moisture"
              value={stats.avgSoil}
              unit="%"
              icon="water"
              color="#00BFFF"
            />
            <StatBox
              label="Avg Temperature"
              value={stats.avgTemp}
              unit="°C"
              icon="thermometer"
              color={colors.sensors.temperature[0]}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: 100 }}>
            <StatBox
              label="Max Soil Moisture"
              value={stats.maxSoil}
              unit="%"
              icon="trending-up"
              color={colors.status.success[0]}
            />
            <StatBox
              label="Min Soil Moisture"
              value={stats.minSoil}
              unit="%"
              icon="trending-down"
              color={colors.status.error[0]}
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}