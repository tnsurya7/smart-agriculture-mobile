import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSmartFarm } from '../../context/SmartFarmContext';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Simple in-app console for viewing logs
export default function DebugScreen() {
    const { connection, data, isConnected } = useSmartFarm();
    const [logs, setLogs] = useState<string[]>([]);
    const [pushToken, setPushToken] = useState<string>('Generating...');
    const [notificationStatus, setNotificationStatus] = useState<string>('Checking...');
    const [permissionStatus, setPermissionStatus] = useState<string>('Checking...');

    // Get push token directly
    useEffect(() => {
        async function getPushToken() {
            try {
                if (!Device.isDevice) {
                    setPushToken('Not available (emulator)');
                    setNotificationStatus('NOT AVAILABLE');
                    return;
                }

                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                setPermissionStatus(existingStatus);

                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                    setPermissionStatus(status);
                }

                if (finalStatus !== 'granted') {
                    setPushToken('Permission denied');
                    setNotificationStatus('NOT REGISTERED');
                    return;
                }

                const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
                if (!projectId) {
                    setPushToken('Project ID not found');
                    setNotificationStatus('ERROR');
                    return;
                }

                const token = await Notifications.getExpoPushTokenAsync({ projectId });
                setPushToken(token.data);
                setNotificationStatus('REGISTERED');
                console.log('📱 Expo Push Token:', token.data);
            } catch (error) {
                setPushToken(`Error: ${error.message}`);
                setNotificationStatus('ERROR');
                console.error('Push token error:', error);
            }
        }

        getPushToken();
    }, []);

    useEffect(() => {
        // Capture console.log
        const originalLog = console.log;
        console.log = (...args) => {
            const message = args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            setLogs(prev => [...prev.slice(-50), `[${new Date().toLocaleTimeString()}] ${message}`]);
            originalLog(...args);
        };

        return () => {
            console.log = originalLog;
        };
    }, []);

    const clearLogs = () => setLogs([]);

    const copyToken = () => {
        console.log('📋 FULL EXPO PUSH TOKEN:', pushToken);
        Alert.alert(
            '📋 Push Token',
            pushToken,
            [
                { text: 'OK' }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🔧 Debug Console</Text>
                <TouchableOpacity onPress={clearLogs} style={styles.clearButton}>
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
            </View>

            {/* System Status */}
            <View style={styles.statusSection}>
                <Text style={styles.sectionTitle}>System Status</Text>

                <View style={styles.statusRow}>
                    <Text style={styles.label}>Connection:</Text>
                    <Text style={[styles.value, { color: isConnected ? '#4CAF50' : '#f44336' }]}>
                        {connection.toUpperCase()}
                    </Text>
                </View>

                <View style={styles.statusRow}>
                    <Text style={styles.label}>Push Token:</Text>
                    <Text style={styles.value} numberOfLines={1}>
                        {pushToken.length > 30 ? pushToken.substring(0, 30) + '...' : pushToken}
                    </Text>
                </View>

                <View style={styles.statusRow}>
                    <Text style={styles.label}>Notifications:</Text>
                    <Text style={[styles.value, {
                        color: notificationStatus === 'REGISTERED' ? '#4CAF50' : '#f44336'
                    }]}>
                        {notificationStatus}
                    </Text>
                </View>

                <View style={styles.statusRow}>
                    <Text style={styles.label}>Permission:</Text>
                    <Text style={styles.value}>{permissionStatus}</Text>
                </View>

                <View style={styles.statusRow}>
                    <Text style={styles.label}>Soil Moisture:</Text>
                    <Text style={styles.value}>{data.soil}%</Text>
                </View>

                <View style={styles.statusRow}>
                    <Text style={styles.label}>Temperature:</Text>
                    <Text style={styles.value}>{data.temperature}°C</Text>
                </View>

                <View style={styles.statusRow}>
                    <Text style={styles.label}>Pump Status:</Text>
                    <Text style={styles.value}>{data.pump === 1 ? 'ON' : 'OFF'}</Text>
                </View>

                <View style={styles.statusRow}>
                    <Text style={styles.label}>Mode:</Text>
                    <Text style={styles.value}>{data.mode}</Text>
                </View>
            </View>

            {/* Console Logs */}
            <View style={styles.logsSection}>
                <Text style={styles.sectionTitle}>Console Logs ({logs.length})</Text>
                <ScrollView style={styles.logsScroll}>
                    {logs.length === 0 ? (
                        <Text style={styles.noLogs}>No logs yet...</Text>
                    ) : (
                        logs.map((log, index) => (
                            <Text key={index} style={styles.logLine}>
                                {log}
                            </Text>
                        ))
                    )}
                </ScrollView>
            </View>

            {/* Copy Token Button */}
            {pushToken && pushToken.startsWith('ExponentPushToken') && (
                <TouchableOpacity style={styles.copyButton} onPress={copyToken}>
                    <Ionicons name="copy-outline" size={20} color="#fff" />
                    <Text style={styles.copyText}>Show Full Push Token</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f44336',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    clearText: {
        color: '#fff',
        fontWeight: '600',
    },
    statusSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    label: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
    },
    value: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    logsSection: {
        flex: 1,
        padding: 16,
    },
    logsScroll: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 12,
    },
    logLine: {
        fontSize: 12,
        color: '#4CAF50',
        fontFamily: 'monospace',
        marginBottom: 4,
    },
    noLogs: {
        fontSize: 14,
        color: '#64748B',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    copyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
