import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Dimensions, Platform, TouchableOpacity, Alert, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSmartFarm } from '../../context/SmartFarmContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import useSmartFarmData from '../../hooks/useSmartFarmData';
import { colors, spacing, cardDimensions, typography } from '../../styles/theme';
import LiquidGlassCard from '../../components/LiquidGlassCard';

const { width } = Dimensions.get('window');

// Status Badge Component
const StatusBadge = ({ label, value, active, color }: { label: string, value: string, active: boolean, color: string[] }) => (
  <View style={styles.statusBadge}>
    <View style={styles.statusIconContainer}>
      <LinearGradient
        colors={(active ? color : [colors.glass.subtle, colors.glass.subtle]) as any}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Ionicons
        name={label === 'Mode' ? 'settings-outline' : label === 'Pump' ? 'water-outline' : 'wifi-outline'}
        size={20}
        color={active ? '#fff' : colors.text.secondary}
      />
    </View>
    <Text style={[typography.caption, styles.statusLabel]}>{label.toUpperCase()}</Text>
    <Text style={[typography.h3, styles.statusValue, { color: active ? color[0] : colors.text.primary }]}>{value}</Text>
  </View>
);

export default function Dashboard() {
  const { data, connection, mode, pumpStatus, history, predictedSoil } = useSmartFarm();

  // Fallback calculations in case hook data is missing
  const soilPercent = data?.soil || 0;

  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate refresh delay since data is real-time
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const generatePDF = async () => {
    try {
      // Calculate Stats & Counts
      let pumpOnCount = 0;
      let pumpOffCount = 0;
      let autoModeCount = 0;
      let totalSoil = 0;
      let totalTemp = 0;
      let totalHum = 0;
      let minSoil = 100, maxSoil = 0;

      const historyLength = history.length;

      history.forEach((item, index) => {
        // Sums for Averages
        totalSoil += item.soil || 0;
        totalTemp += item.temperature || 0;
        totalHum += item.humidity || 0;

        // Min/Max
        if (item.soil < minSoil) minSoil = item.soil;
        if (item.soil > maxSoil) maxSoil = item.soil;

        // Transitions (skip first item)
        if (index > 0) {
          const prev = history[index - 1];
          if (prev.pump === 0 && item.pump === 1) pumpOnCount++;
          if (prev.pump === 1 && item.pump === 0) pumpOffCount++;
          if (prev.mode !== 'AUTO' && item.mode === 'AUTO') autoModeCount++;
        }
      });

      const avgSoil = historyLength ? (totalSoil / historyLength).toFixed(1) : 0;
      const avgTemp = historyLength ? (totalTemp / historyLength).toFixed(1) : 0;
      const avgHum = historyLength ? (totalHum / historyLength).toFixed(1) : 0;

      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              @page { margin: 20px; }
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 10px; color: #000; background-color: #fff; }
              h1 { color: #000; font-size: 22px; margin-bottom: 5px; text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; font-weight: 900; }
              h2 { font-size: 14px; color: #000; margin-top: 15px; margin-bottom: 8px; border-left: 5px solid #000; padding-left: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800; }
              
              .header-meta { text-align: center; font-size: 10px; color: #000; margin-bottom: 20px; font-style: italic; font-weight: 600; }
              
              .section { margin-bottom: 15px; }
              .grid-row { display: flex; flex-wrap: wrap; gap: 10px; }
              .stat-box { flex: 1; min-width: 100px; background: #f0f2f5; padding: 10px; border-radius: 6px; text-align: center; border: 1px solid #000; }
              .stat-label { font-size: 10px; color: #000; display: block; margin-bottom: 4px; text-transform: uppercase; font-weight: 800; }
              .stat-value { font-size: 15px; font-weight: 900; color: #000; }
              
              /* Status Colors (Darker) */
              .text-success { color: #006400 !important; }
              .text-danger { color: #8B0000 !important; }
              .text-primary { color: #00008B !important; }
              
              /* Badges (Darker Backgrounds) */
              .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; color: #fff; }
              .badge-success { background-color: #006400; }
              .badge-warning { background-color: #CC5500; }
              .badge-danger { background-color: #8B0000; }
              .badge-info { background-color: #00008B; }

              /* Table */
              table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 5px; }
              th, td { border: 1px solid #000; padding: 6px 8px; text-align: center; }
              th { background-color: #ddd; color: #000; font-weight: 900; text-transform: uppercase; }
              tr:nth-child(even) { background-color: #f2f2f2; }
              tr:hover { background-color: #e6e6e6; }
            </style>
          </head>
          <body>
            <h1>Smart Agriculture Report</h1>
            <div class="header-meta">Generated on: ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString()}</div>
            
            <!-- 1. System Status -->
            <div class="section">
              <h2>System Overview</h2>
              <div class="grid-row">
                <div class="stat-box">
                  <span class="stat-label">Connection</span>
                  <span class="stat-value ${connection === 'connected' ? 'text-success' : 'text-danger'}">
                    ${connection === 'connected' ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
                 <div class="stat-box">
                  <span class="stat-label">Operation Mode</span>
                  <span class="badge ${mode === 'AUTO' ? 'badge-info' : 'badge-warning'}">
                    ${mode}
                  </span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Pump State</span>
                  <span class="badge ${pumpStatus === 'ON' ? 'badge-danger' : 'badge-success'}">
                    ${pumpStatus}
                  </span>
                </div>
              </div>
            </div>

            <!-- 2. Sensor Summary -->
            <div class="section">
              <h2>Environmental Data</h2>
              <div class="grid-row">
                <div class="stat-box">
                  <span class="stat-label">Avg Soil Moisture</span>
                  <span class="stat-value" style="color: #006400;">${avgSoil}%</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Avg Temperature</span>
                  <span class="stat-value" style="color: #CC5500;">${avgTemp}°C</span>
                </div>
                 <div class="stat-box">
                  <span class="stat-label">Avg Humidity</span>
                  <span class="stat-value" style="color: #00008B;">${avgHum}%</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Sunlight</span>
                  <span class="stat-value text-primary">${data.lightPercent ? data.lightPercent.toFixed(1) : 0}%</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Rain Status</span>
                  <span class="stat-value ${data.rainDetected ? 'text-primary' : 'text-success'}">${data.rainDetected ? 'RAINING' : 'CLEAR'}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Water Usage</span>
                  <span class="stat-value" style="color: #4B0082;">${data.totalLiters.toFixed(1)} L</span>
                </div>
              </div>
            </div>

            <!-- 3. Operations -->
            <div class="section">
              <h2>Operational Stats</h2>
              <div class="grid-row">
                 <div class="stat-box">
                  <span class="stat-label">Pump Activations</span>
                  <span class="stat-value" style="color: #000;">${pumpOnCount}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Auto Mode Events</span>
                  <span class="stat-value" style="color: #000;">${autoModeCount}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Flow Rate</span>
                  <span class="stat-value" style="color: #000;">${data.flow.toFixed(1)} L/min</span>
                </div>
              </div>
            </div>

            <!-- 4. History Table -->
            <div class="section">
              <h2>Recent Activity Log</h2>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Mode</th>
                    <th>Pump</th>
                    <th>Soil</th>
                    <th>Temp</th>
                    <th>Hum</th>
                    <th>Sun</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.slice(-15).reverse().map((item) => `
                    <tr>
                      <td style="font-weight: bold; color: #000;">${item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</td>
                      <td><span class="badge ${item.mode === 'AUTO' ? 'badge-info' : 'badge-warning'}" style="font-size: 8px; padding: 2px 4px;">${item.mode}</span></td>
                      <td><span style="color: ${item.pump ? '#8B0000' : '#006400'}; font-weight: bold;">${item.pump ? 'ON' : 'OFF'}</span></td>
                      <td style="color: #000; font-weight: 700;">${item.soil}%</td>
                      <td style="color: #000; font-weight: 700;">${item.temperature}°C</td>
                      <td style="color: #000; font-weight: 700;">${item.humidity}%</td>
                      <td style="color: #000; font-weight: 700;">${item.lightPercent ? item.lightPercent.toFixed(0) : 0}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div style="text-align: center; font-size: 9px; color: #000; margin-top: 30px; border-top: 2px solid #000; padding-top: 10px; font-weight: bold;">
              Generated by Smart Agriculture System • Professional Report
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF report');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[colors.background.primary[0], '#E2E8F0'] as any}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.start} />
            }
          >
            {/* Header / Intro */}
            <View style={styles.header}>
              <View>
                <Text style={[typography.h1, styles.greeting]}>System Overview</Text>
                <Text style={[typography.body, styles.subtitle]}>
                  Smart Agriculture Dashboard
                </Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={generatePDF} style={styles.downloadButton}>
                  <Ionicons name="download-outline" size={24} color={colors.primary.start} />
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View style={{ opacity: fadeAnim }}>

              {/* Status Grid */}
              <LiquidGlassCard
                gradient={colors.background.liquid}
                style={[styles.smallCard, { marginBottom: spacing.lg, borderRadius: 24 }]}
                height={'auto'}
                glowEffect={true}
                glowColor={colors.primary.start}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={[typography.h3, styles.cardTitle]}>System Status</Text>
                    <View style={[styles.onlineIndicator, { backgroundColor: connection === 'connected' ? colors.status.success[0] : colors.status.error[0] }]} />
                  </View>

                  <View style={styles.statusGrid}>
                    <StatusBadge
                      label="Connection"
                      value={connection === 'connected' ? 'Online' : 'Offline'}
                      active={connection === 'connected'}
                      color={colors.status.success}
                    />
                    <StatusBadge
                      label="Mode"
                      value={mode}
                      active={true}
                      color={colors.status.info}
                    />
                    <StatusBadge
                      label="Pump"
                      value={pumpStatus}
                      active={pumpStatus === 'ON'}
                      color={colors.status.warning}
                    />
                  </View>

                  <View style={styles.systemMessage}>
                    <Text style={[typography.caption, { lineHeight: 18 }]}>
                      System is running in {mode} mode. All sensors are responsive. Pump is currently {pumpStatus}.
                    </Text>
                  </View>
                </View>
              </LiquidGlassCard>

              {/* Sensor Highlights Row */}
              <View style={[styles.rowContainer, { marginBottom: spacing.lg }]}>
                <LiquidGlassCard
                  gradient={colors.background.card}
                  style={[styles.smallCard, { marginRight: spacing.sm }]}
                  height={cardDimensions.gridCard.height}
                  glowEffect={false}
                >
                  <View style={styles.smallCardContent}>
                    <Ionicons name="water" size={32} color="#00BFFF" />
                    <Text style={[typography.caption, { marginTop: spacing.sm }]}>Current Soil</Text>
                    <Text style={[typography.h1, { color: colors.sensors.soil[0], fontSize: 32 }]}>{soilPercent.toFixed(1)}%</Text>
                    <Text style={[typography.caption, { marginTop: spacing.xs }]}>
                      Predicted: {predictedSoil?.toFixed(1)}%
                    </Text>
                  </View>
                </LiquidGlassCard>

                <LiquidGlassCard
                  gradient={colors.background.card}
                  style={[styles.smallCard, { marginLeft: spacing.sm }]}
                  height={cardDimensions.gridCard.height}
                >
                  <View style={styles.smallCardContent}>
                    <Ionicons name="speedometer" size={32} color="#ff0808ff" />
                    <Text style={[typography.caption, { marginTop: spacing.sm }]}>Water Used</Text>
                    <Text style={[typography.h1, { color: colors.sensors.flow[0], fontSize: 32 }]}>
                      {data.totalLiters.toFixed(1)}
                      <Text style={[typography.caption, { fontSize: 14, opacity: 0.8 }]}> L</Text>
                    </Text>
                    <Text style={[typography.caption, { marginTop: spacing.xs }]}>Today</Text>
                  </View>
                </LiquidGlassCard>
              </View>

              <Animated.View style={[styles.largeCard, { opacity: fadeAnim }]}>
                <LinearGradient
                  colors={['#ffffff', '#f8f9fa'] as any}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name="water" size={24} color={colors.primary.start} />
                    <Text style={styles.cardTitle}>Total Usage</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.bigMetric}>{data.totalLiters.toFixed(1)} <Text style={{ fontSize: 18 }}>L</Text></Text>
                    <Text style={styles.metricSub}>Today</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            </Animated.View>

            {/* Bottom Spacing */}
            <View style={{ height: 100 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 10 },
  header: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  downloadButton: { padding: 8, backgroundColor: colors.glass.light, borderRadius: 20, borderWidth: 1, borderColor: colors.glass.border },
  greeting: { marginBottom: spacing.xs },
  subtitle: { opacity: 0.7 },
  cardContent: { padding: spacing.lg },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#4A5568' },
  onlineIndicator: { width: 8, height: 8, borderRadius: 4 },
  statusGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg, gap: 8 },
  statusBadge: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column', // Changed to column
    justifyContent: 'center',
    paddingVertical: 16, // Increased padding
    paddingHorizontal: 8,
    borderRadius: 16, // Softer corners
    backgroundColor: 'rgba(255,255,255,0.4)', // Subtle background
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    overflow: 'hidden', // Ensure gradient stays inside
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
    marginTop: 4,
    opacity: 0.6,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  systemMessage: { backgroundColor: colors.glass.subtle, padding: spacing.md, borderRadius: 12 },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  smallCard: { flex: 1, borderRadius: 24, padding: 0, overflow: 'hidden' },
  smallCardContent: { flex: 1, padding: spacing.lg, justifyContent: 'center', alignItems: 'center' },
  largeCard: {
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    backgroundColor: '#fff', // fallback
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  bigMetric: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A202C',
  },
  metricSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0AEC0',
  },
});