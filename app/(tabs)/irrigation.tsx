import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, StatusBar, Text, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import useSmartFarmData from '../../hooks/useSmartFarmData';
import { colors, typography, spacing, cardDimensions } from '../../styles/theme';
import LiquidGlassCard from '../../components/LiquidGlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import WeatherForecastCard from '../../components/WeatherForecastCard';

export default function Irrigation() {
  const {
    data,
    connection,
    sendPump,
    setMode,
    pumpStatus,
    mode,
    soilPercent,
  } = useSmartFarmData();

  const [refreshing, setRefreshing] = useState(false);
  const [focusKey, setFocusKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusKey(prev => prev + 1);
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getSoilCondition = () => {
    if (soilPercent < 20) return "Critical - Irrigating";
    if (soilPercent < 40) return "Low - Water Soon";
    if (soilPercent < 60) return "Moderate – Monitor";
    if (soilPercent < 80) return "Good - Optimal";
    return "High - No Water Needed";
  };

  const getEspMessage = () => {
    if (mode === 'AUTO') return "ESP32 is controlling irrigation automatically based on soil moisture and weather conditions.";
    return "System is in Manual Mode. User has full control over the pump.";
  };

  return (
    <LinearGradient colors={colors.background.primary as any} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.screenHorizontal }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Header */}
          <View style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}>
            <Text style={typography.h1}>Irrigation Control</Text>
            <Text style={typography.body}>Manage watering system</Text>
          </View>

          {/* 0. Weather Forecast */}
          <WeatherForecastCard />

          {/* 1. Mode Toggle */}
          <LiquidGlassCard gradient={colors.background.card} height="auto" style={{ marginBottom: spacing.lg }}>
            <View style={{ padding: spacing.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LinearGradient
                    colors={colors.status.info as any}
                    style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }}
                  >
                    <Ionicons name="water" size={20} color="#ffffffff" />
                  </LinearGradient>
                  <Text style={typography.h3}>Auto Irrigation</Text>
                </View>
                <Switch
                  trackColor={{ false: colors.glass.border, true: colors.status.success[0] }}
                  thumbColor={colors.text.white}
                  onValueChange={() => setMode(mode === 'AUTO' ? 'MANUAL' : 'AUTO')}
                  value={mode === 'AUTO'}
                />
              </View>
              <Text style={typography.body}>{getEspMessage()}</Text>
            </View>
          </LiquidGlassCard>

          {/* 2. Pump Control (Manual Only) */}
          {mode === 'MANUAL' && (
            <LiquidGlassCard gradient={colors.background.card} height="auto" style={{ marginBottom: spacing.lg, borderColor: colors.primary.start }}>
              <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <Text style={[typography.h3, { marginBottom: spacing.md }]}>Manual Pump Control</Text>
                <TouchableOpacity
                  onPress={() => sendPump(pumpStatus === 'ON' ? 'OFF' : 'ON')}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: pumpStatus === 'ON' ? '#FF3B30' : '#34C759', // iOS System Red / Green
                    paddingVertical: 16,
                    paddingHorizontal: 32,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 220,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '600', letterSpacing: -0.4 }}>
                    {pumpStatus === 'ON' ? 'Stop Pump' : 'Start Pump'}
                  </Text>
                </TouchableOpacity>
                <Text style={[typography.caption, { marginTop: spacing.md }]}>
                  Pump is currently {pumpStatus}
                </Text>
              </View>
            </LiquidGlassCard>
          )}

          {/* 3. Status Info */}
          <LiquidGlassCard gradient={colors.background.liquid} height="auto" style={{ marginBottom: 100 }}>
            <View style={{ padding: spacing.lg }}>
              <View style={{ marginBottom: spacing.lg }}>
                <Text style={typography.caption}>Soil Condition</Text>
                <Text style={[typography.h2, { color: colors.sensors.soil[0] }]}>{getSoilCondition()}</Text>
              </View>

              <View>
                <Text style={typography.caption}>System Status</Text>
                <Text style={typography.h3}>
                  {mode === 'AUTO' ? 'Running Automatically' : 'Waiting for User Input'}
                </Text>
              </View>
            </View>
          </LiquidGlassCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}