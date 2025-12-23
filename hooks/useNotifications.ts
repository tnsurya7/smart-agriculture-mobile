/**
 * Custom React Hook for Push Notifications
 * Provides easy notification management in components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
    initializePushNotifications,
    registerForPushNotifications,
    registerPushTokenWithBackend,
    scheduleLocalNotification,
    getNotificationPermissionStatus,
    addNotificationReceivedListener,
    addNotificationResponseReceivedListener,
} from '../services/notifications';

/**
 * Main hook for push notifications
 */
export function usePushNotifications() {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    // Initialize notifications on mount
    useEffect(() => {
        async function initialize() {
            try {
                // Check permission status
                const status = await getNotificationPermissionStatus();
                setPermissionStatus(status);

                // Initialize push notifications
                await initializePushNotifications();

                // Get token
                const token = await registerForPushNotifications();
                if (token) {
                    setExpoPushToken(token);
                    setIsRegistered(true);

                    // Show alert with token for easy copying
                    Alert.alert(
                        '✅ Push Token Generated',
                        `Your Expo Push Token:\n\n${token}\n\nThis token is needed to send push notifications.`,
                        [
                            {
                                text: 'Copy to Console',
                                onPress: () => console.log('📋 EXPO PUSH TOKEN:', token)
                            },
                            { text: 'OK' }
                        ]
                    );
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to initialize notifications');
                console.error('Notification initialization error:', err);
            }
        }

        initialize();

        // Set up listeners
        notificationListener.current = addNotificationReceivedListener((notification) => {
            setNotification(notification);
            console.log('📬 Notification received:', notification);
        });

        responseListener.current = addNotificationResponseReceivedListener((response) => {
            console.log('👆 Notification tapped:', response);
            // Handle notification tap - navigate to relevant screen
            const data = response.notification.request.content.data;
            if (data) {
                handleNotificationTap(data);
            }
        });

        // Cleanup
        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    // Handle notification tap
    const handleNotificationTap = useCallback((data: any) => {
        // You can use navigation here to go to specific screens
        console.log('Handling notification tap with data:', data);

        // Example: Navigate based on notification type
        if (data.type === 'soil_alert') {
            // Navigate to sensors screen
        } else if (data.type === 'pump_alert') {
            // Navigate to irrigation screen
        } else if (data.type === 'rain_alert') {
            // Navigate to weather screen
        }
    }, []);

    // Re-register push token
    const reRegister = useCallback(async () => {
        try {
            setError(null);
            const token = await registerForPushNotifications();
            if (token) {
                setExpoPushToken(token);
                const success = await registerPushTokenWithBackend(token);
                setIsRegistered(success);
                return success;
            }
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to register');
            return false;
        }
    }, []);

    // Send test notification
    const sendTest = useCallback(async () => {
        await scheduleLocalNotification(
            '🌱 Test Notification',
            'Push notifications are working correctly!',
            { test: true },
            1
        );
    }, []);

    return {
        expoPushToken,
        permissionStatus,
        notification,
        isRegistered,
        error,
        reRegister,
        sendTest,
    };
}

/**
 * Hook for monitoring sensor alerts
 * Automatically triggers local notifications based on sensor thresholds
 */
export function useSensorAlerts(sensorData: any) {
    const lastAlertTime = useRef<{ [key: string]: number }>({});
    const ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutes between same alerts

    useEffect(() => {
        if (!sensorData) return;

        const now = Date.now();

        // Low soil moisture alert
        if (sensorData.soil < 30) {
            const lastAlert = lastAlertTime.current['low_soil'] || 0;
            if (now - lastAlert > ALERT_COOLDOWN) {
                scheduleLocalNotification(
                    '⚠️ Low Soil Moisture',
                    `Soil moisture is ${sensorData.soil.toFixed(1)}%. Irrigation may be needed.`,
                    { type: 'soil_alert', value: sensorData.soil }
                );
                lastAlertTime.current['low_soil'] = now;
            }
        }

        // Rain detected alert
        if (sensorData.rainDetected) {
            const lastAlert = lastAlertTime.current['rain'] || 0;
            if (now - lastAlert > ALERT_COOLDOWN) {
                scheduleLocalNotification(
                    '🌧️ Rain Detected',
                    'Rain detected in the field. Irrigation paused automatically.',
                    { type: 'rain_alert' }
                );
                lastAlertTime.current['rain'] = now;
            }
        }

        // High temperature alert
        if (sensorData.temperature > 35) {
            const lastAlert = lastAlertTime.current['high_temp'] || 0;
            if (now - lastAlert > ALERT_COOLDOWN) {
                scheduleLocalNotification(
                    '🌡️ High Temperature',
                    `Temperature is ${sensorData.temperature.toFixed(1)}°C. Monitor crop health.`,
                    { type: 'temp_alert', value: sensorData.temperature }
                );
                lastAlertTime.current['high_temp'] = now;
            }
        }
    }, [sensorData]);
}

/**
 * Hook for pump status notifications
 */
export function usePumpAlerts(pumpStatus: 'ON' | 'OFF', prevStatus: 'ON' | 'OFF' | null) {
    useEffect(() => {
        if (prevStatus === null) return; // Skip initial render

        if (pumpStatus !== prevStatus) {
            scheduleLocalNotification(
                pumpStatus === 'ON' ? '🚰 Pump Activated' : '🚰 Pump Deactivated',
                pumpStatus === 'ON'
                    ? 'Water pump has been turned ON.'
                    : 'Water pump has been turned OFF.',
                { type: 'pump_alert', status: pumpStatus }
            );
        }
    }, [pumpStatus, prevStatus]);
}

/**
 * Hook for mode change notifications
 */
export function useModeAlerts(mode: 'AUTO' | 'MANUAL', prevMode: 'AUTO' | 'MANUAL' | null) {
    useEffect(() => {
        if (prevMode === null) return; // Skip initial render

        if (mode !== prevMode) {
            scheduleLocalNotification(
                mode === 'AUTO' ? '⚙️ Auto Mode Enabled' : '👤 Manual Mode Enabled',
                mode === 'AUTO'
                    ? 'System is now running in automatic irrigation mode.'
                    : 'System is now in manual control mode.',
                { type: 'mode_alert', mode }
            );
        }
    }, [mode, prevMode]);
}
