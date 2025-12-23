# 📱 Get Your Expo Push Token - Quick Guide

## ✅ ADB Installed Successfully!

---

## 🚀 **3 Simple Steps**

### **Step 1: Enable USB Debugging on Your Android Phone**

1. Go to **Settings** → **About Phone**
2. Tap **"Build Number"** 7 times (you'll see "You are now a developer!")
3. Go back to **Settings** → **Developer Options**
4. Enable **"USB Debugging"**
5. Connect your phone to Mac via USB cable
6. On your phone, tap **"Allow"** when prompted for USB debugging

---

### **Step 2: Test ADB Connection**

```bash
# Check if phone is connected
adb devices

# You should see:
# List of devices attached
# ABC123XYZ    device
```

If you see "unauthorized", check your phone for the USB debugging prompt and tap "Allow".

---

### **Step 3: View Console Logs**

```bash
# View all logs (lots of output)
adb logcat

# Filter for your app only (recommended)
adb logcat | grep -i "expo\|ReactNativeJS"

# Filter for push token specifically
adb logcat | grep -i "push token"

# Save logs to file
adb logcat > smart-agriculture-logs.txt
```

---

## 🔔 **Get Your Expo Push Token**

### **Quick Method:**

```bash
# 1. Clear old logs
adb logcat -c

# 2. Start filtering for push token
adb logcat | grep -i "expo push token"

# 3. Open your Smart Agriculture app on phone

# 4. Token will appear in terminal!
# Output:
# ✅ Expo Push Token: ExponentPushToken[xxxxxxxxxxxxxx]
```

**Copy that entire token!**

---

## 📋 **Useful ADB Commands**

### **View Logs**
```bash
# All logs
adb logcat

# React Native only
adb logcat | grep -i "ReactNativeJS"

# Expo only
adb logcat | grep -i "expo"

# Push notifications
adb logcat | grep -i "push\|notification"

# WebSocket
adb logcat | grep -i "websocket"
```

### **Save Logs**
```bash
# Save to file
adb logcat > app-logs.txt

# Save filtered logs
adb logcat | grep -i "ReactNativeJS" > react-logs.txt
```

### **Clear Logs**
```bash
# Clear all logs (fresh start)
adb logcat -c
```

### **Stop Logging**
```
Press Ctrl+C in terminal
```

---

## 🎯 **What You'll See**

### **When App Opens:**
```
12-23 09:55:01 I ReactNativeJS: 🔌 WebSocket initialized
12-23 09:55:02 I ReactNativeJS: 📱 Using Expo Project ID: 47863d6d...
12-23 09:55:03 I ReactNativeJS: ⚠️ Push notifications only work on physical devices
12-23 09:55:04 I ReactNativeJS: ✅ Expo Push Token: ExponentPushToken[xxxxxx]
12-23 09:55:05 I ReactNativeJS: ✅ Push token registered with backend
```

### **Copy the Push Token:**
```
ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

---

## 🧪 **Test Push Notification**

Once you have the token:

1. **Go to:** https://expo.dev/notifications
2. **Paste your token**
3. **Fill in:**
   - Title: `🌱 Smart Agriculture`
   - Body: `Test notification working!`
   - Channel ID: `default`
4. **Click "Send a Notification"**
5. **Close your app**
6. **Notification appears!** 🎉

---

## 🎓 **For VIVA Demo**

### **Professional Setup:**

```bash
# Before demo, start logging to file
adb logcat | grep -i "ReactNativeJS" > viva-demo-logs.txt

# During demo:
# 1. Open app on phone
# 2. Show app working
# 3. Show terminal with logs
# 4. Point to push token in logs
# 5. Show notification test

# After demo:
# Stop logging (Ctrl+C)
# Show saved log file
```

---

## ✅ **Quick Checklist**

- [x] ADB installed ✅
- [ ] USB debugging enabled on phone
- [ ] Phone connected via USB
- [ ] `adb devices` shows your device
- [ ] App opened on phone
- [ ] Logs visible in terminal
- [ ] Push token copied
- [ ] Test notification sent
- [ ] Notification received

---

## 🚀 **Ready to Get Your Token!**

**Run this now:**

```bash
# 1. Connect phone via USB
# 2. Enable USB debugging
# 3. Run this command:
adb logcat -c && adb logcat | grep -i "expo push token"

# 4. Open your Smart Agriculture app
# 5. Token will appear!
```

---

**Status:** ✅ ADB Ready - Get your push token now! 🔔
