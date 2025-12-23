/**
 * Push Notification Service for Smart Agriculture App
 * Handles Expo Push Notifications for real-time alerts
 * 
 * Architecture:
 * ESP32 → Backend (Render) → Expo Push Service → Android Device
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://smart-agriculture-backend-my7c.onrender.com';

/**
 * Configure notification behavior
 */
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Register for push notifications and get Expo Push Token
 */
export async function registerForPushNotifications(): Promise<string | null> {
    let token: string | null = null;

    // Only works on physical devices
    if (!Device.isDevice) {
        console.warn('⚠️ Push notifications only work on physical devices');
        return null;
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not granted
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    // Permission denied
    if (finalStatus !== 'granted') {
        console.warn('⚠️ Push notification permission denied');
        return null;
    }

    // Get Expo Push Token with project ID from Constants
    try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;

        if (!projectId) {
            console.error('❌ No Expo project ID found in app.json');
            console.log('Please ensure app.json has: extra.eas.projectId');
            return null;
        }

        console.log('📱 Using Expo Project ID:', projectId);

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId,
        });

        token = tokenData.data;
        console.log('✅ Expo Push Token:', token);
    } catch (error) {
        console.error('❌ Failed to get push token:', error);
        return null;
    }

    // Android-specific channel setup
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Smart Agriculture Alerts',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4CAF50',
            sound: 'default',
            enableVibrate: true,
            showBadge: true,
        });

        // Create separate channels for different alert types
        await Notifications.setNotificationChannelAsync('critical', {
            name: 'Critical Alerts',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 500, 250, 500],
            lightColor: '#FF0000',
            sound: 'default',
            enableVibrate: true,
            showBadge: true,
        });

        await Notifications.setNotificationChannelAsync('info', {
            name: 'Information',
            importance: Notifications.AndroidImportance.DEFAULT,
            vibrationPattern: [0, 250],
            lightColor: '#2196F3',
            sound: 'default',
            enableVibrate: true,
            showBadge: true,
        });
    }

    return token;
}

/**
 * Send push token to backend for storage
 */
export async function registerPushTokenWithBackend(token: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/push-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                platform: Platform.OS,
                deviceName: Device.deviceName,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            console.warn(`⚠️ Backend returned HTTP ${response.status} - push token not registered (backend may be sleeping)`);
            return false;
        }

        const result = await response.json();
        console.log('✅ Push token registered with backend:', result);
        return true;
    } catch (error) {
        console.warn('⚠️ Could not register push token with backend (this is OK for testing):', error.message);
        return false;
    }
}

/**
 * Initialize push notifications
 * Call this on app startup
 */
export async function initializePushNotifications(): Promise<void> {
    try {
        // Register for notifications
        const token = await registerForPushNotifications();

        if (token) {
            // Send token to backend
            await registerPushTokenWithBackend(token);
        }
    } catch (error) {
        console.error('Failed to initialize push notifications:', error);
    }
}

/**
 * Schedule a local notification (for testing)
 */
export async function scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    delaySeconds: number = 0
): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data,
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: delaySeconds > 0 ? { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delaySeconds } : null,
    });

    return notificationId;
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get notification permissions status
 */
export async function getNotificationPermissionStatus(): Promise<string> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
}

/**
 * Notification event listeners
 */
export function addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Test notification (for development)
 */
export async function sendTestNotification(): Promise<void> {
    await scheduleLocalNotification(
        '🌱 Smart Agriculture',
        'Push notifications are working!',
        { test: true },
        1
    );
}
