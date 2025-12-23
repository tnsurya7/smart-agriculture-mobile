# 🚀 Quick Reference Card

## Backend URL
```
https://smart-agriculture-backend-my7c.onrender.com
```

## 📱 Test Commands

```bash
# Health check
curl https://smart-agriculture-backend-my7c.onrender.com/

# Restart app
npx expo start -c

# Build for Android
npx expo run:android
```

## 🎣 Common Hooks

```typescript
// Backend API
import { useLatestSensorData, usePumpControl, useModeControl } from '../hooks/useBackendAPI';

// Notifications
import { usePushNotifications, useSensorAlerts } from '../hooks/useNotifications';

// Usage
const { data, loading } = useLatestSensorData(true, 5000); // Auto-refresh every 5s
const { setPump } = usePumpControl();
const { setMode } = useModeControl();
const { expoPushToken, isRegistered } = usePushNotifications();
```

## 🔔 Notification Types

| Event | Icon | Cooldown |
|-------|------|----------|
| Low Soil (< 30%) | ⚠️ | 5 min |
| Rain Detected | 🌧️ | 5 min |
| Pump ON/OFF | 🚰 | None |
| Mode Change | ⚙️ | None |
| High Temp (> 35°C) | 🌡️ | 5 min |

## 📁 Key Files

```
services/
  ├── api.ts              # REST API calls
  ├── websocket.ts        # Real-time updates
  └── notifications.ts    # Push notifications

hooks/
  ├── useBackendAPI.ts    # Backend hooks
  └── useNotifications.ts # Notification hooks

docs/
  ├── API_INTEGRATION.md       # API reference
  ├── PUSH_NOTIFICATIONS.md    # Notification guide
  ├── QUICK_START.md           # Testing guide
  └── FINAL_SUMMARY.md         # Complete overview
```

## ⚡ Quick Actions

### Send Test Notification
```typescript
const { sendTest } = usePushNotifications();
await sendTest();
```

### Control Pump
```typescript
const { setPump } = usePumpControl();
await setPump(true);  // ON
await setPump(false); // OFF
```

### Switch Mode
```typescript
const { setMode } = useModeControl();
await setMode('AUTO');
await setMode('MANUAL');
```

### Get Latest Sensors
```typescript
const { data } = useLatestSensorData();
console.log(data.soil, data.temperature);
```

## 🔧 Configuration

### .env
```bash
EXPO_PUBLIC_API_URL=https://smart-agriculture-backend-my7c.onrender.com
EXPO_PUBLIC_WS_URL=wss://smart-agriculture-backend-my7c.onrender.com/ws
```

### app.json
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

## ✅ Success Indicators

```
Console logs to look for:
✅ Backend health check: true
✅ Latest sensor data loaded
✅ Expo Push Token: ExponentPushToken[...]
✅ Push token registered with backend
✅ Pump control command sent
✅ Mode changed to: AUTO
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 errors | Check backend endpoints |
| Timeout | Wait 30s for backend wake-up |
| No notifications | Test on physical device |
| Token not registered | Check backend logs |

## 📚 Documentation

- **Full API Reference:** `docs/API_INTEGRATION.md`
- **Notification Setup:** `docs/PUSH_NOTIFICATIONS.md`
- **Testing Guide:** `docs/QUICK_START.md`
- **Complete Overview:** `docs/FINAL_SUMMARY.md`
