import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LiquidGlassCard from './LiquidGlassCard';
import GradientText from './GradientText';
import { colors, typography, spacing, cardDimensions } from '../styles/theme';
import { fetchEthodeWeather, WeatherData } from '../services/weather';

export default function WeatherForecastCard() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadWeather = async () => {
        setLoading(true);
        const data = await fetchEthodeWeather();
        setWeather(data);
        setLoading(false);
    };

    useEffect(() => {
        loadWeather();
        // Refresh weather every hour
        const interval = setInterval(loadWeather, 3600000);
        return () => clearInterval(interval);
    }, []);

    if (loading || !weather) {
        return (
            <LiquidGlassCard gradient={colors.background.liquid} height="auto" style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary.start} />
                    <Text style={[typography.caption, { marginTop: spacing.sm }]}>Loading Weather...</Text>
                </View>
            </LiquidGlassCard>
        );
    }

    // Dynamic Theme Logic
    const getTheme = () => {
        if (!weather) return {
            gradient: ['#4c669f', '#3b5998', '#192f6a'],
            textColors: ['#FFFFFF', '#E0E0E0'],
            iconColor: colors.text.white
        };

        // Rain/Storm -> Dark BG, Cyan Text
        if (weather.rainExpected || weather.description.includes('rain') || weather.description.includes('storm')) {
            return {
                gradient: ['#373B44', '#4286f4'],
                textColors: ['#E0FFFF', '#00FFFF'], // Light Cyan
                iconColor: '#00FFFF'
            };
        }

        // Cold / Clouds -> Light Sky BG, Deep Blue Text
        if (weather.temperature < 20 || weather.description.includes('cloud')) {
            return {
                gradient: ['#ffffff', '#f0faff'], // Almost White / Light Sky
                textColors: ['#0052D4', '#00BFFF'], // Deep Blue to Sky Blue
                iconColor: '#007AFF'
            };
        }

        // Hot / Clear -> Sunny BG, White/Gold Text
        if (weather.temperature >= 30 || weather.description.includes('clear') || weather.description.includes('sun')) {
            return {
                gradient: ['#FF512F', '#DD2476', '#FFD700'],
                textColors: ['#FFFFFF', '#FFFACD'],
                iconColor: '#FFFFFF'
            };
        }

        // Default warm
        return {
            gradient: ['#FF416C', '#FF4B2B'],
            textColors: ['#FFFFFF', '#E0E0E0'],
            iconColor: '#FFFFFF'
        };
    };

    const theme = getTheme();

    return (
        <LiquidGlassCard
            gradient={theme.gradient} // Dynamic gradient
            style={styles.container}
            height="auto"
            glowEffect={true}
        >
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <GradientText
                            text={weather.location}
                            style={typography.h2}
                            colors={theme.textColors}
                        />
                        <Text style={[typography.caption, { color: theme.iconColor, opacity: 0.8, textTransform: 'capitalize' }]}>
                            {weather.description}
                        </Text>
                    </View>
                    <View style={styles.iconContainer}>
                        {(() => {
                            const iconSize = 50;
                            // Cloud/Mist/Smoke/Haze
                            if (weather.description.includes('cloud') || weather.description.includes('mist')) {
                                return <Ionicons name="cloud" size={iconSize} color="#007AFF" />; // Dark Sky Blue for clouds
                            }
                            // Rain/Drizzle/Thunderstorm
                            if (weather.description.includes('rain') || weather.description.includes('drizzle') || weather.description.includes('storm')) {
                                return <Ionicons name="rainy" size={iconSize} color="#00FFFF" />; // Cyan for Rain
                            }
                            // Clear/Sun
                            if (weather.description.includes('clear') || weather.description.includes('sun')) {
                                return <Ionicons name="sunny" size={iconSize} color="#FFD700" />; // Gold for Sun
                            }
                            // Default
                            return <Ionicons name="partly-sunny" size={iconSize} color={theme.iconColor} />;
                        })()}
                    </View>
                </View>

                {/* Rain Probability - Highlighted */}
                <View style={[styles.rainSection, { borderColor: theme.iconColor + '40' }]}>
                    <View style={styles.rainBadge}>
                        <Ionicons name={weather.rainExpected ? "rainy" : "sunny"} size={20} color={theme.iconColor} />
                        <GradientText
                            text={`${weather.rainPossibility}% Rain Chance`}
                            style={[typography.h3, { marginLeft: spacing.sm }]}
                            colors={theme.textColors}
                        />
                    </View>
                    {weather.rainExpected && (
                        <Text style={[typography.caption, { color: '#FFD700', marginTop: 4, fontWeight: '700' }]}>
                            ⚠️ Irrigation may not be needed
                        </Text>
                    )}
                </View>

                {/* Grid Stats */}
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Ionicons name="thermometer" size={16} color={theme.iconColor} style={{ marginBottom: 4 }} />
                        <Text style={[typography.caption, { color: theme.iconColor, opacity: 0.9 }]}>Temp</Text>
                        <GradientText
                            text={`${weather.temperature}°`}
                            style={typography.h2}
                            colors={theme.textColors}
                        />
                    </View>

                    <View style={[styles.statDot, { backgroundColor: theme.iconColor + '40' }]} />

                    <View style={styles.statItem}>
                        <Ionicons name="water" size={16} color="#00BFFF" style={{ marginBottom: 4 }} />
                        <Text style={[typography.caption, { color: theme.iconColor, opacity: 0.9 }]}>Humidity</Text>
                        <GradientText
                            text={`${weather.humidity}%`}
                            style={typography.h2}
                            colors={theme.textColors}
                        />
                    </View>

                    <View style={[styles.statDot, { backgroundColor: theme.iconColor + '40' }]} />

                    <View style={styles.statItem}>
                        <Ionicons name="cloud" size={16} color={theme.iconColor} style={{ marginBottom: 4 }} />
                        <Text style={[typography.caption, { color: theme.iconColor, opacity: 0.9 }]}>Cloud Cover</Text>
                        <GradientText
                            text={weather.description.includes('cloud') ? 'High' : 'Low'}
                            style={typography.h2}
                            colors={theme.textColors}
                        />
                    </View>
                </View>
            </View>
        </LiquidGlassCard>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    content: {
        padding: spacing.lg,
    },
    loadingContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    iconContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    rainSection: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    rainBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDot: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
    }
});
