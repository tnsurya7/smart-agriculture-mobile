# 🔥 Firebase Cloud Messaging (FCM) Setup Guide

## Complete Step-by-Step Guide to Enable Push Notifications

---

## 📋 **What You Need**

- ✅ Google account
- ✅ 15-20 minutes
- ✅ Your Expo project (already have this)

---

## 🚀 **Step-by-Step Instructions**

### **Step 1: Create Firebase Project**

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/

2. **Create New Project:**
   - Click "Add project" or "Create a project"
   - **Project name:** `smart-agriculture-mobile`
   - Click "Continue"

3. **Google Analytics:**
   - Toggle OFF (not needed for push notifications)
   - Click "Create project"
   - Wait for project creation (30 seconds)
   - Click "Continue"

---

### **Step 2: Add Android App to Firebase**

1. **In Firebase Console:**
   - Click the **Android icon** (robot icon)
   - Or click "Add app" → "Android"

2. **Register App:**
   - **Android package name:** `com.smartagriculture.mobile`
   - **App nickname (optional):** `Smart Agriculture Mobile`
   - **Debug signing certificate (optional):** Leave empty
   - Click "Register app"

3. **Download google-services.json:**
   - Click "Download google-services.json"
   - **IMPORTANT:** Save this file (you'll need it later)
   - Click "Next"

4. **Add Firebase SDK:**
   - Skip this step (Expo handles it)
   - Click "Next"

5. **Finish:**
   - Click "Continue to console"

---

### **Step 3: Enable Cloud Messaging API**

1. **In Firebase Console:**
   - Click the **gear icon** (⚙️) next to "Project Overview"
   - Click "Project settings"

2. **Go to Cloud Messaging Tab:**
   - Click "Cloud Messaging" tab at the top

3. **Enable Cloud Messaging API (V1):**
   - You'll see a section "Cloud Messaging API (V1)"
   - Click the **three dots menu** (⋮)
   - Click "Manage API in Google Cloud Console"
   - Click "Enable" button
   - Wait for API to enable (30 seconds)

4. **Get Server Key (Legacy):**
   - Go back to Firebase Console
   - Under "Cloud Messaging API (Legacy)"
   - Copy the **Server key** (starts with `AAAA...`)
   - **Save this key!** You'll need it for EAS

---

### **Step 4: Configure EAS with FCM**

Now we'll add the FCM credentials to your Expo project:

#### **Option A: Using EAS CLI (Recommended)**

```bash
# Run this command
eas credentials

# Then select:
# 1. Platform: Android
# 2. Build profile: production
# 3. What do you want to do? → "Push Notifications: Manage your FCM API Key"
# 4. Set up a new FCM API Key
# 5. Paste your Server Key from Firebase
```

#### **Option B: Manual Upload**

1. **Run:**
   ```bash
   eas credentials
   ```

2. **Select:**
   - Platform: **Android**
   - Build profile: **production**

3. **Choose:**
   - "Push Notifications (Legacy): Manage your FCM API Key"

4. **Select:**
   - "Set up a new FCM API Key"

5. **Paste:**
   - Your FCM Server Key from Firebase
   - Press Enter

6. **Confirm:**
   - EAS will upload and save your credentials

---

### **Step 5: Rebuild Your APK**

Now rebuild with FCM credentials:

```bash
eas build --platform android --profile preview
```

**Wait time:** 10-15 minutes

---

### **Step 6: Test Push Notifications**

1. **Install new APK** on your Android phone

2. **Open app** and go to Debug tab

3. **Copy push token** from debug console

4. **Send test notification:**
   - Go to: https://expo.dev/notifications
   - Paste your push token
   - Fill in message
   - Click "Send a Notification"

5. **Close app completely**

6. **Notification should appear!** 🎉

---

## 🎯 **Quick Reference**

### **What You Need from Firebase:**

1. ✅ **FCM Server Key** (Legacy)
   - Found in: Firebase Console → Project Settings → Cloud Messaging
   - Looks like: `AAAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

2. ✅ **google-services.json** (optional, for advanced features)
   - Downloaded when adding Android app
   - Not required for basic push notifications

### **What You Need to Do:**

1. ✅ Create Firebase project
2. ✅ Add Android app with package name: `com.smartagriculture.mobile`
3. ✅ Enable Cloud Messaging API (V1)
4. ✅ Copy FCM Server Key
5. ✅ Configure EAS with `eas credentials`
6. ✅ Rebuild APK
7. ✅ Test notifications

---

## 📱 **After Setup**

### **Your Backend Can Now Send Notifications:**

```javascript
// Backend code (already implemented)
const sendPushNotification = async (token, title, body) => {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      title: title,
      body: body,
      sound: 'default',
      channelId: 'default',
    }),
  });
};

// Automatic alert when soil is low
if (sensorData.soil < 30) {
  await sendPushNotification(
    userPushToken,
    '⚠️ Low Soil Moisture',
    `Soil moisture is ${sensorData.soil}%. Irrigation needed!`
  );
}
```

---

## ⚠️ **Common Issues**

### **Issue 1: "DeviceNotRegistered" Error**

**Cause:** FCM credentials not configured  
**Solution:** Complete Step 4 (Configure EAS with FCM)

### **Issue 2: "Invalid Server Key"**

**Cause:** Wrong key copied  
**Solution:** Make sure you copied the **Server key** from "Cloud Messaging API (Legacy)" section

### **Issue 3: Notification Not Received**

**Checklist:**
- ✅ FCM API enabled in Google Cloud Console?
- ✅ Server key added to EAS credentials?
- ✅ APK rebuilt after adding credentials?
- ✅ App opened at least once?
- ✅ Notification permission granted?
- ✅ App closed completely before testing?

---

## 🎓 **For VIVA**

### **If FCM is Configured:**

**Show:**
1. Firebase Console with your project
2. Send test notification
3. Notification appears on phone

**Explain:**
> "I've configured Firebase Cloud Messaging for the Android app. The backend can now send automatic push notifications when sensor thresholds are exceeded. The notification is routed through Firebase Cloud Messaging to the device."

### **If FCM is Not Configured Yet:**

**Explain:**
> "The push notification infrastructure is complete. The app generates push tokens correctly, and the backend has the logic to send automatic notifications. For production, we need to configure Firebase Cloud Messaging credentials, which involves creating a Firebase project, enabling the Cloud Messaging API, and adding the server key to Expo Application Services. This is a standard 15-minute setup process. The code is production-ready and will work immediately once FCM is configured."

---

## ✅ **Checklist**

- [ ] Created Firebase project
- [ ] Added Android app (package: `com.smartagriculture.mobile`)
- [ ] Downloaded google-services.json
- [ ] Enabled Cloud Messaging API (V1)
- [ ] Copied FCM Server Key
- [ ] Ran `eas credentials`
- [ ] Added FCM key to EAS
- [ ] Rebuilt APK with `eas build`
- [ ] Installed new APK
- [ ] Tested push notification
- [ ] Notification received successfully

---

## 🚀 **Next Steps**

1. **Now:** Follow Steps 1-6 above
2. **After Setup:** Test notifications
3. **For VIVA:** Demonstrate working notifications

---

## 📞 **Need Help?**

**Firebase Console:** https://console.firebase.google.com/  
**Expo Push Tool:** https://expo.dev/notifications  
**EAS Docs:** https://docs.expo.dev/push-notifications/fcm-credentials/

---

**Estimated Time:** 15-20 minutes  
**Difficulty:** Easy (just follow steps)  
**Result:** Fully working push notifications! 🎉
