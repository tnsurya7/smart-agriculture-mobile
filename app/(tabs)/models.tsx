import React from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useSmartFarmData from '../../hooks/useSmartFarmData';
import { colors, spacing, typography } from '../../styles/theme';

import ModelPerformanceCard from '../../components/ModelPerformanceCard';
import LiquidGlassCard from '../../components/LiquidGlassCard';

export default function AIModels() {
  const { modelReport, predictedSoil, data } = useSmartFarmData();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const InfoCard = ({ title, icon, color, children }: any) => (
    <LiquidGlassCard gradient={colors.background.card} height="auto" style={{ marginBottom: spacing.md }}>
      <View style={{ padding: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <LinearGradient
            colors={color}
            style={{ width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }}
          >
            <Ionicons name={icon} size={18} color={colors.text.white} />
          </LinearGradient>
          <Text style={typography.h3}>{title}</Text>
        </View>
        <Text style={[typography.body, { lineHeight: 22 }]}>{children}</Text>
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
            <Text style={typography.h1}>AI Models</Text>
            <Text style={typography.body}>Predictive Intelligence</Text>
          </View>

          {/* 1. Performance Card */}
          <View style={{ marginBottom: spacing.lg }}>
            <ModelPerformanceCard
              modelReport={modelReport}
              predictedSoil={predictedSoil}
              currentSoil={data.soil}
            />
          </View>

          {/* 2. Text Details */}
          <InfoCard
            title="ARIMAX Model"
            icon="hardware-chip"
            color={colors.status.success}
          >
            Advanced time series forecasting with external variables (weather, temperature, humidity) for accurate soil moisture prediction.
          </InfoCard>

          <InfoCard
            title="Auto-Retraining"
            icon="sync"
            color={colors.status.info}
          >
            Models automatically retrain every 24 hours with new sensor data to continuously improve prediction accuracy.
          </InfoCard>

          <InfoCard
            title="Accuracy Metrics"
            icon="school"
            color={colors.features.analytics}
          >
            RMSE (Root Mean Square Error) and MAPE (Mean Absolute Percentage Error) track model performance in real-time.
          </InfoCard>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}