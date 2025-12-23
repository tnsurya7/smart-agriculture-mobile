# 📱 How to See Console Logs in APK

## 🎯 Quick Answer

In a production APK, you **cannot** see console logs directly on the phone screen. But you have **3 easy options**:

---

## ✅ **Method 1: Use ADB (Easiest & Best)**

### **What You Need:**
- Your Android phone connected to computer via USB
- USB Debugging enabled

### **Steps:**

#### **1. Enable USB Debugging on Phone**
```
Settings → About Phone → Tap "Build Number" 7 times
Settings → Developer Options → Enable "USB Debugging"
```

#### **2. Install ADB on Mac**
```bash
brew install android-platform-tools
```

#### **3. Connect Phone & View Logs**
```bash
# Connect phone via USB cable

# View all logs
adb logcat

# Filter for your app only (recommended)
adb logcat | grep -i "ReactNativeJS\|expo"

# Filter for specific messages
adb logcat | grep -i "push token\|notification"

# Save logs to file
adb logcat > smart-agriculture-logs.txt
```

### **What You'll See:**
```
12-23 09:53:27.123  1234  5678 I ReactNativeJS: 📱 Using Expo Project ID: 47863d6d...
12-23 09:53:28.456  1234  5678 I ReactNativeJS: ✅ Expo Push Token: ExponentPushToken[...]
12-23 09:53:29.789  1234  5678 I ReactNativeJS: ✅ Push token registered with backend
```

---

## ✅ **Method 2: Check Push Token in App**

### **Where to Find It:**

1. **Open your Smart Agriculture app**
2. **Look for a popup/alert** when app starts (if implemented)
3. **Or shake phone** → Debug menu → Show Dev Menu

### **Alternative: Add Display in App**

I've created a **Debug tab** for you that shows:
- ✅ Push Token
- ✅ Connection Status
- ✅ Sensor Data
- ✅ Console Logs

**File:** `app/(tabs)/debug.tsx` (already created!)

To use it, you need to add it to the tab navigation.

---

## ✅ **Method 3: Use Expo Dev Tools (When Connected)**

If your APK is still connected to the dev server:

```bash
# In your terminal where expo is running
# Press 'j' to open debugger
j

# Or shake your phone
# Tap "Debug" in the menu
# Opens Chrome DevTools with console
```

---

## 🔍 **Finding Your Expo Push Token**

### **Option A: ADB Logcat (Recommended)**
```bash
# Run this after opening the app
adb logcat | grep -i "expo push token"

# You'll see:
# ✅ Expo Push Token: ExponentPushToken[xxxxxxxxxxxxxx]
```

### **Option B: Check Terminal**

If your phone is connected to `npx expo start -c`:
- Look in your Mac terminal
- Find lines with "Expo Push Token"
- Copy the token

### **Option C: Add Alert in Code**

Temporarily add this to show token on screen:

```typescript
// In app/(tabs)/dashboard.tsx
import { usePushNotifications } from '../../hooks/useNotifications';

// Inside component:
const { expoPushToken } = usePushNotifications();

useEffect(() => {
  if (expoPushToken) {
    Alert.alert('Push Token', expoPushToken);
  }
}, [expoPushToken]);
```

---

## 📋 **Quick Commands Reference**

### **View All Logs**
```bash
adb logcat
```

### **Filter for React Native**
```bash
adb logcat | grep ReactNativeJS
```

### **Filter for Expo**
```bash
adb logcat | grep -i expo
```

### **Filter for Push Notifications**
```bash
adb logcat | grep -i "push\|notification"
```

### **Filter for WebSocket**
```bash
adb logcat | grep -i websocket
```

### **Save to File**
```bash
adb logcat > app-logs.txt
```

### **Clear Logs**
```bash
adb logcat -c
```

---

## 🎓 **For VIVA Demo**

### **Best Approach:**

1. **Before Demo:**
   ```bash
   # Start ADB logging
   adb logcat | grep -i "ReactNativeJS" > demo-logs.txt
   ```

2. **During Demo:**
   - Open app on phone
   - Show app working
   - Show terminal with logs appearing in real-time

3. **Show Examiner:**
   - "Here you can see the console logs"
   - "The app generated the Expo Push Token"
   - "It registered with the backend"
   - Point to specific log lines

### **Alternative: Use Debug Tab**

If you add the debug tab to your app:
- Open app
- Navigate to "Debug" tab
- Show push token on screen
- Show system status
- Show console logs
- **Very impressive for examiners!**

---

## ✅ **What Logs to Look For**

### **App Startup:**
```
🔌 WebSocket initialized
🔌 Connecting to WebSocket
📱 Using Expo Project ID: 47863d6d...
⚠️ Push notifications only work on physical devices
```

### **Push Notifications:**
```
✅ Expo Push Token: ExponentPushToken[...]
✅ Push token registered with backend
```

### **WebSocket Connection:**
```
🔌 WebSocket connected
✅ Backend health check: true
```

### **Sensor Data:**
```
📊 Latest sensor data loaded
🔄 Sensor data updated
```

---

## 🚀 **Quick Start**

### **Right Now - Get Your Push Token:**

```bash
# 1. Connect phone via USB
# 2. Enable USB debugging
# 3. Run this command:
adb logcat | grep -i "expo push token"

# 4. Open your app
# 5. Token will appear in terminal!
```

---

## 📱 **Debug Tab (Already Created!)**

I've created `app/(tabs)/debug.tsx` which shows:

- ✅ Connection Status
- ✅ Push Token (with copy button)
- ✅ Notification Status
- ✅ Sensor Data
- ✅ Console Logs (last 50 messages)

**To enable it:** Add it to your tab navigation (or I can help you do this)

---

## 🎯 **Summary**

| Method | Difficulty | Best For |
|--------|-----------|----------|
| **ADB Logcat** | Easy | Development & debugging |
| **Debug Tab** | Medium | VIVA demo |
| **Dev Tools** | Easy | When connected to dev server |

**Recommended:** Use **ADB Logcat** for getting push token and debugging!

---

## 💡 **Pro Tip**

For VIVA, have ADB running in background:
```bash
adb logcat | grep -i "ReactNativeJS" > viva-logs.txt
```

Then you can show the log file to examiners!

---

**Need help setting up ADB?** Reply with `setup adb` and I'll guide you! 🚀
