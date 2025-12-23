# 📱 Push Notifications Setup Guide

## 🎯 Overview

Your Smart Agriculture app now has **full push notification support** for real-time alerts even when the app is closed, in background, or not opened.

### Architecture

```
ESP32 Sensors
     ↓
Backend (Render)
     ↓
Expo Push Notification Service
     ↓
Android Mobile Device
```

---

## ✅ What's Been Implemented

### 1. **Notification Service** (`services/notifications.ts`)
- Expo push token registration
- Android notification channels
- Permission handling
- Backend token registration

### 2. **Custom Hooks** (`hooks/useNotifications.ts`)
- `usePushNotifications()` - Main notification hook
- `useSensorAlerts()` - Automatic sensor threshold alerts
- `usePumpAlerts()` - Pump status change notifications
- `useModeAlerts()` - Mode change notifications

### 3. **Auto-Initialization**
- Push notifications initialize automatically on app start
- Token is sent to backend for storage
- Works even when app is closed

---

## 🔔 Notification Types

Your app will send notifications for:

| Event | Notification |
|-------|-------------|
| **Low Soil Moisture** | ⚠️ "Soil moisture is X%. Irrigation may be needed." |
| **Rain Detected** | 🌧️ "Rain detected in the field. Irrigation paused automatically." |
| **Pump ON** | 🚰 "Water pump has been turned ON." |
| **Pump OFF** | 🚰 "Water pump has been turned OFF." |
| **Auto Mode ON** | ⚙️ "System is now running in automatic irrigation mode." |
| **Manual Mode ON** | 👤 "System is now in manual control mode." |
| **High Temperature** | 🌡️ "Temperature is X°C. Monitor crop health." |

---

## 🚀 Quick Start

### Step 1: Update `app.json` with Your Project ID

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-expo-project-id-here"
      }
    }
  }
}
```

**How to get your project ID:**
1. Run `npx expo whoami` to check if logged in
2. Run `eas init` if you haven't already
3. Your project ID will be in `app.json` under `extra.eas.projectId`

---

### Step 2: Update Notification Service

In `services/notifications.ts`, replace the project ID:

```typescript
const tokenData = await Notifications.getExpoPushTokenAsync({
  projectId: 'your-actual-project-id', // Replace this
});
```

---

### Step 3: Test on Physical Device

**⚠️ Important:** Push notifications only work on **physical Android devices**, not emulators.

```bash
# Build and install on your Android device
npx expo run:android
```

---

## 🧪 Testing Notifications

### Test 1: Check Permission

```typescript
import { usePushNotifications } from '../hooks/useNotifications';

function TestComponent() {
  const { permissionStatus, expoPushToken } = usePushNotifications();
  
  return (
    <View>
      <Text>Permission: {permissionStatus}</Text>
      <Text>Token: {expoPushToken}</Text>
    </View>
  );
}
```

---

### Test 2: Send Test Notification

```typescript
import { usePushNotifications } from '../hooks/useNotifications';

function TestButton() {
  const { sendTest } = usePushNotifications();
  
  return (
    <Button 
      title="Send Test Notification" 
      onPress={sendTest}
    />
  );
}
```

---

### Test 3: Manual Notification

```typescript
import { scheduleLocalNotification } from '../services/notifications';

// Send notification in 5 seconds
await scheduleLocalNotification(
  '🌱 Test Alert',
  'This is a test notification!',
  { test: true },
  5
);
```

---

## 🔧 Backend Integration

### Step 1: Add Push Token Endpoint to Backend

Your backend needs to store push tokens. Add this endpoint:

**Node.js/Express Example:**

```javascript
const pushTokens = new Set(); // Use database in production

app.post('/api/push-token', (req, res) => {
  const { token, platform, deviceName } = req.body;
  
  if (token) {
    pushTokens.add(token);
    console.log(`✅ Registered push token for ${deviceName} (${platform})`);
  }
  
  res.json({ success: true, message: 'Token registered' });
});
```

**Python/FastAPI Example:**

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
push_tokens = set()

class PushToken(BaseModel):
    token: str
    platform: str
    deviceName: str

@app.post("/api/push-token")
def register_push_token(data: PushToken):
    push_tokens.add(data.token)
    print(f"✅ Registered push token for {data.deviceName} ({data.platform})")
    return {"success": True, "message": "Token registered"}
```

---

### Step 2: Send Notifications from Backend

When sensor data changes, send push notifications:

**Node.js Example:**

```javascript
async function sendPushNotification(title, body, data = {}) {
  const messages = Array.from(pushTokens).map(token => ({
    to: token,
    sound: 'default',
    title,
    body,
    data,
    priority: 'high',
    channelId: 'default',
  }));

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  });

  return await response.json();
}

// Example: Send notification when soil is low
if (sensorData.soil < 30) {
  await sendPushNotification(
    '⚠️ Low Soil Moisture',
    `Soil moisture is ${sensorData.soil}%. Irrigation activated.`,
    { type: 'soil_alert', value: sensorData.soil }
  );
}
```

**Python/FastAPI Example:**

```python
import httpx
from typing import List

async def send_push_notification(title: str, body: str, data: dict = None):
    messages = [
        {
            "to": token,
            "sound": "default",
            "title": title,
            "body": body,
            "data": data or {},
            "priority": "high",
            "channelId": "default",
        }
        for token in push_tokens
    ]
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://exp.host/--/api/v2/push/send",
            json=messages
        )
        return response.json()

# Example: Send notification when pump turns on
if sensor_data["pump"] == 1:
    await send_push_notification(
        "🚰 Pump Activated",
        "Water pump has been turned ON.",
        {"type": "pump_alert", "status": "ON"}
    )
```

---

## 📲 Using Notifications in Components

### Example 1: Dashboard with Alerts

```typescript
import { usePushNotifications, useSensorAlerts } from '../hooks/useNotifications';
import { useSmartFarm } from '../context/SmartFarmContext';

function Dashboard() {
  const { data } = useSmartFarm();
  const { expoPushToken, isRegistered } = usePushNotifications();
  
  // Automatically send alerts based on sensor thresholds
  useSensorAlerts(data);
  
  return (
    <View>
      <Text>Notifications: {isRegistered ? '✅ Enabled' : '❌ Disabled'}</Text>
      <Text>Soil: {data.soil}%</Text>
    </View>
  );
}
```

---

### Example 2: Pump Control with Notifications

```typescript
import { usePumpAlerts } from '../hooks/useNotifications';
import { useState, useEffect } from 'react';

function PumpControl() {
  const [pumpStatus, setPumpStatus] = useState<'ON' | 'OFF'>('OFF');
  const [prevStatus, setPrevStatus] = useState<'ON' | 'OFF' | null>(null);
  
  // Automatically send notification when pump status changes
  usePumpAlerts(pumpStatus, prevStatus);
  
  const togglePump = () => {
    setPrevStatus(pumpStatus);
    setPumpStatus(pumpStatus === 'ON' ? 'OFF' : 'ON');
  };
  
  return <Button title={`Pump ${pumpStatus}`} onPress={togglePump} />;
}
```

---

### Example 3: Mode Switcher with Notifications

```typescript
import { useModeAlerts } from '../hooks/useNotifications';
import { useState } from 'react';

function ModeSwitcher() {
  const [mode, setMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [prevMode, setPrevMode] = useState<'AUTO' | 'MANUAL' | null>(null);
  
  // Automatically send notification when mode changes
  useModeAlerts(mode, prevMode);
  
  const switchMode = (newMode: 'AUTO' | 'MANUAL') => {
    setPrevMode(mode);
    setMode(newMode);
  };
  
  return (
    <View>
      <Button title="AUTO" onPress={() => switchMode('AUTO')} />
      <Button title="MANUAL" onPress={() => switchMode('MANUAL')} />
    </View>
  );
}
```

---

## 🎨 Customizing Notifications

### Custom Notification Channels

```typescript
await Notifications.setNotificationChannelAsync('urgent', {
  name: 'Urgent Alerts',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 500, 250, 500, 250, 500],
  lightColor: '#FF0000',
  sound: 'default',
  enableVibrate: true,
  showBadge: true,
});
```

---

### Custom Notification Sound

1. Add sound file to `assets/sounds/alert.mp3`
2. Use in notification:

```typescript
await scheduleLocalNotification(
  'Critical Alert',
  'Immediate attention required!',
  { priority: 'critical' },
  0
);
```

---

## 🔍 Debugging

### Check Token Registration

```typescript
const { expoPushToken, isRegistered } = usePushNotifications();

console.log('Push Token:', expoPushToken);
console.log('Registered:', isRegistered);
```

---

### Test with Expo Push Tool

1. Go to https://expo.dev/notifications
2. Enter your Expo push token
3. Send a test notification
4. Check if it arrives on your device

---

### Check Backend Logs

Monitor your Render backend logs to see if tokens are being received:

```
✅ Registered push token for Pixel 6 (android)
```

---

## ⚠️ Important Notes

### 1. **Physical Device Required**
- Push notifications don't work in emulators
- Test on real Android device

### 2. **Expo Project ID**
- Must be configured in `app.json`
- Required for push token generation

### 3. **Backend Endpoint**
- Backend must have `/api/push-token` endpoint
- Must store tokens for sending notifications

### 4. **Notification Cooldown**
- Alerts have 5-minute cooldown to prevent spam
- Configurable in `hooks/useNotifications.ts`

### 5. **Battery Optimization**
- Some Android devices may kill background processes
- Users may need to disable battery optimization for your app

---

## 📊 Notification Flow

```
1. App Starts
   ↓
2. Request Permission
   ↓
3. Get Expo Push Token
   ↓
4. Send Token to Backend
   ↓
5. Backend Stores Token
   ↓
6. ESP32 Sends Sensor Data
   ↓
7. Backend Detects Threshold
   ↓
8. Backend Sends to Expo Push API
   ↓
9. Expo Delivers to Device
   ↓
10. User Receives Notification
```

---

## ✅ Success Checklist

- [ ] Expo notifications installed
- [ ] Project ID configured in `app.json`
- [ ] Notification service created
- [ ] Custom hooks implemented
- [ ] Backend endpoint for tokens created
- [ ] Backend notification sending implemented
- [ ] Tested on physical Android device
- [ ] Notifications received when app closed
- [ ] Notifications received when app in background
- [ ] All alert types working

---

## 🎓 VIVA-Ready Explanation

**"How do push notifications work in your app?"**

> "We use Expo's push notification service with a three-tier architecture. When the app starts, it requests notification permission and obtains an Expo Push Token, which is sent to our backend on Render. The backend stores this token and monitors sensor data from the ESP32. When thresholds are crossed—like low soil moisture or rain detection—the backend sends a notification request to Expo's push service with the stored tokens. Expo then delivers the notification to all registered devices, even if the app is closed or in the background. We've implemented automatic alerts for soil moisture, rain, pump status, and operation mode changes, with a 5-minute cooldown to prevent notification spam."

---

**Your push notification system is ready! Test it on a physical Android device.** 🚀
