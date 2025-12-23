# 🔔 Backend Push Notification Implementation

## 🎯 How to Send Push Notifications from Backend

Your backend can automatically send push notifications to **both Android and iOS** devices!

---

## 📋 **Complete Backend Implementation**

### **1. Store Push Tokens in Database**

When mobile app sends its push token, store it in your database:

```python
# Backend: FastAPI endpoint to receive push tokens
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import httpx

app = FastAPI()

class PushTokenRequest(BaseModel):
    token: str
    platform: str  # "ios" or "android"
    deviceName: str
    timestamp: str

@app.post("/api/push-token")
async def register_push_token(request: PushTokenRequest):
    """
    Store push token in database
    Mobile app calls this when it starts
    """
    try:
        # Store in Supabase (or your database)
        from supabase import create_client
        
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Insert or update token
        result = supabase.table("push_tokens").upsert({
            "token": request.token,
            "platform": request.platform,
            "device_name": request.deviceName,
            "last_updated": request.timestamp,
            "active": True
        }).execute()
        
        return {
            "success": True,
            "message": "Push token registered successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### **2. Send Push Notification Function**

```python
import httpx
from typing import List

async def send_push_notification(
    tokens: List[str],
    title: str,
    body: str,
    data: dict = None
):
    """
    Send push notification to multiple devices
    Works for both iOS and Android automatically!
    """
    
    # Expo Push API endpoint
    expo_push_url = "https://exp.host/--/api/v2/push/send"
    
    # Create messages for each token
    messages = []
    for token in tokens:
        message = {
            "to": token,
            "sound": "default",
            "title": title,
            "body": body,
            "priority": "high",
            "channelId": "default",  # For Android
        }
        
        # Add custom data if provided
        if data:
            message["data"] = data
        
        messages.append(message)
    
    # Send to Expo Push API
    async with httpx.AsyncClient() as client:
        response = await client.post(
            expo_push_url,
            json=messages,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Sent {len(messages)} notifications")
            return result
        else:
            print(f"❌ Failed to send notifications: {response.text}")
            return None
```

---

### **3. Get All Active Tokens**

```python
async def get_all_push_tokens():
    """
    Get all active push tokens from database
    Returns tokens for BOTH iOS and Android
    """
    from supabase import create_client
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Get all active tokens
    result = supabase.table("push_tokens")\
        .select("token")\
        .eq("active", True)\
        .execute()
    
    # Extract just the token strings
    tokens = [row["token"] for row in result.data]
    
    print(f"📱 Found {len(tokens)} active devices")
    return tokens
```

---

### **4. Automatic Alert System**

```python
async def check_sensor_alerts(sensor_data: dict):
    """
    Check sensor data and send alerts automatically
    This runs every time new sensor data arrives
    """
    
    alerts = []
    
    # Check soil moisture
    if sensor_data["soil"] < 30:
        alerts.append({
            "title": "⚠️ Low Soil Moisture",
            "body": f"Soil moisture is {sensor_data['soil']}%. Irrigation may be needed.",
            "data": {"type": "low_soil", "value": sensor_data["soil"]}
        })
    
    # Check temperature
    if sensor_data["temperature"] > 35:
        alerts.append({
            "title": "🌡️ High Temperature",
            "body": f"Temperature is {sensor_data['temperature']}°C. Monitor crops closely.",
            "data": {"type": "high_temp", "value": sensor_data["temperature"]}
        })
    
    # Check rain detection
    if sensor_data["rainDetected"]:
        alerts.append({
            "title": "🌧️ Rain Detected",
            "body": "Rain detected. Irrigation paused automatically.",
            "data": {"type": "rain_detected"}
        })
    
    # Send all alerts
    if alerts:
        tokens = await get_all_push_tokens()
        
        for alert in alerts:
            await send_push_notification(
                tokens=tokens,
                title=alert["title"],
                body=alert["body"],
                data=alert["data"]
            )
        
        print(f"✅ Sent {len(alerts)} alerts to {len(tokens)} devices")
```

---

### **5. Pump Status Notification**

```python
async def notify_pump_status(pump_state: str):
    """
    Send notification when pump turns ON or OFF
    """
    tokens = await get_all_push_tokens()
    
    if pump_state == "ON":
        await send_push_notification(
            tokens=tokens,
            title="🚰 Water Pump Activated",
            body="Water pump has been turned ON.",
            data={"type": "pump_on"}
        )
    else:
        await send_push_notification(
            tokens=tokens,
            title="🚰 Water Pump Deactivated",
            body="Water pump has been turned OFF.",
            data={"type": "pump_off"}
        )
```

---

### **6. Mode Change Notification**

```python
async def notify_mode_change(new_mode: str):
    """
    Send notification when irrigation mode changes
    """
    tokens = await get_all_push_tokens()
    
    if new_mode == "AUTO":
        await send_push_notification(
            tokens=tokens,
            title="⚙️ Automatic Mode Enabled",
            body="System is now running in automatic irrigation mode.",
            data={"type": "mode_auto"}
        )
    else:
        await send_push_notification(
            tokens=tokens,
            title="👤 Manual Mode Enabled",
            body="System is now in manual control mode.",
            data={"type": "mode_manual"}
        )
```

---

## 🔄 **Complete Integration Example**

```python
# Backend: WebSocket handler for sensor data
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            # Receive sensor data from ESP32
            data = await websocket.receive_json()
            
            # Store in database
            await store_sensor_data(data)
            
            # Check for alerts and send notifications
            await check_sensor_alerts(data)
            
            # Broadcast to all connected mobile apps
            await broadcast_to_clients(data)
    
    except WebSocketDisconnect:
        print("WebSocket disconnected")
```

---

## 📊 **Database Schema**

### **Table: push_tokens**

```sql
CREATE TABLE push_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    platform VARCHAR(10) NOT NULL,  -- 'ios' or 'android'
    device_name VARCHAR(100),
    last_updated TIMESTAMP DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_active_tokens ON push_tokens(active) WHERE active = TRUE;
```

---

## 🎯 **How It Works for Both Platforms**

### **Step 1: Mobile Apps Register**

```
iPhone opens app
  ↓
Generates token: ExponentPushToken[ABC123...]
  ↓
Sends to backend: POST /api/push-token
  ↓
Backend stores: {token: "ABC...", platform: "ios"}

Android opens app
  ↓
Generates token: ExponentPushToken[XYZ789...]
  ↓
Sends to backend: POST /api/push-token
  ↓
Backend stores: {token: "XYZ...", platform: "android"}
```

### **Step 2: Backend Sends Notification**

```
Soil moisture drops to 28%
  ↓
Backend detects alert
  ↓
Gets all tokens: ["ABC123...", "XYZ789..."]
  ↓
Sends to Expo Push API with BOTH tokens
  ↓
Expo routes:
  ├─ ABC123... → APNs → iPhone ✅
  └─ XYZ789... → FCM → Android ✅
  ↓
BOTH devices receive notification! 🎉
```

---

## ✅ **Key Points**

1. **One API Call** - Backend sends to Expo, Expo handles routing
2. **Platform Agnostic** - Same code works for iOS and Android
3. **Multiple Devices** - One user can have multiple devices
4. **Automatic Routing** - Expo knows which service to use
5. **No Platform-Specific Code** - Backend doesn't need to know iOS vs Android

---

## 🎓 **VIVA Answer**

**Examiner:** "How does your backend send notifications to both platforms?"

**Answer:**
> "The backend stores all push tokens in the database, regardless of platform. When an alert condition is detected, the backend retrieves all active tokens and sends them to Expo's Push Notification API in a single request. Expo automatically routes iOS tokens through Apple Push Notification Service (APNs) and Android tokens through Firebase Cloud Messaging (FCM). This platform-agnostic approach means the backend doesn't need separate code for iOS and Android - Expo handles the routing automatically based on the token format."

---

## 📋 **Implementation Checklist**

- [ ] Create `push_tokens` table in database
- [ ] Implement `POST /api/push-token` endpoint
- [ ] Implement `send_push_notification()` function
- [ ] Implement `check_sensor_alerts()` function
- [ ] Add notification calls to sensor data handler
- [ ] Add notification calls to pump control
- [ ] Add notification calls to mode switching
- [ ] Test with both iOS and Android devices

---

## 🚀 **Testing**

```python
# Test sending to all devices
async def test_notification():
    tokens = await get_all_push_tokens()
    
    await send_push_notification(
        tokens=tokens,
        title="🧪 Test Notification",
        body="Testing push notifications to all devices!",
        data={"type": "test"}
    )
    
    print(f"✅ Sent test to {len(tokens)} devices")
```

---

**The backend handles everything automatically - no need to worry about iOS vs Android!** 🎉
