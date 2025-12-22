import React from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SensorData } from '../types';
import LiquidGlassCard from './LiquidGlassCard';
import { colors, typography, spacing, cardDimensions } from '../styles/theme';
import { useIsFocused } from '@react-navigation/native';

interface SensorBarChartProps {
    data: SensorData[];
}

export default function SensorBarChart({ data }: SensorBarChartProps) {
    const isFocused = useIsFocused();
    const chartWidth = cardDimensions.fullWidth - spacing.cardPadding * 3;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (isFocused) {
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    }, [data, isFocused]);

    // Prepare chart data
    const chartData = React.useMemo(() => {
        if (!data || data.length === 0) {
            return {
                labels: ['1', '2', '3', '4', '5'],
                datasets: [{ data: [0, 0, 0, 0, 0] }],
            };
        }

        // Use last 5 data points for manageable bar chart
        const recentData = data.slice(-5);
        const labels = recentData.map((_, index) => `T-${5 - index}`);

        // We'll show Soil Moisture as the primary metric for the bar chart
        // You could make this toggleable in a more advanced version
        return {
            labels,
            datasets: [{
                data: recentData.map(d => d.soil || 0),
            }],
        };
    }, [data]);

    const chartConfig = {
        backgroundColor: 'transparent',
        backgroundGradientFrom: 'transparent',
        backgroundGradientTo: 'transparent',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`, // Main green color
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.8})`,
        style: {
            borderRadius: 16,
        },
        barPercentage: 0.7,
        fillShadowGradient: colors.sensors.soil[0],
        fillShadowGradientOpacity: 1, // Full opacity for clear bars
    };

    return (
        <LiquidGlassCard
            gradient={['#1c1c1e', '#2c2c2e', '#1c1c1e']}
            style={styles.container}
            height={cardDimensions.chartHeight}
            glowEffect={true}
            textOverlay={false}
        >
            <View style={styles.header}>
                <LinearGradient
                    colors={colors.sensors.soil as any}
                    style={styles.headerIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name="stats-chart" size={20} color={colors.text.white} />
                </LinearGradient>
                <Text style={[typography.h3, styles.title, { color: '#000000' }]}>
                    Soil Moisture History
                </Text>
            </View>

            <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
                {isFocused && ( // Only render chart when focused to ensure animation plays
                    <BarChart
                        key={`chart-${isFocused}`} // Force remount on focus
                        data={chartData}
                        width={chartWidth}
                        height={cardDimensions.chartHeight - 100}
                        yAxisLabel=""
                        yAxisSuffix="%"
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        style={styles.chart}
                        showValuesOnTopOfBars={true}
                        fromZero={true}
                    />
                )}
            </Animated.View>

            {data.length === 0 && (
                <View style={styles.noDataOverlay}>
                    <Text style={[typography.body, { color: colors.text.muted }]}>
                        Waiting for real data...
                    </Text>
                </View>
            )}
        </LiquidGlassCard>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.cardPadding,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    title: {
        fontWeight: '800',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    chart: {
        borderRadius: 16,
    },
    noDataOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    }
});
