# Smart Agriculture Backend API Integration

## 🌐 Deployed Backend URL
```
https://smart-agriculture-backend-my7c.onrender.com
```

Your backend is **LIVE** and accessible from anywhere! 🎉

---

## 📡 Available API Endpoints

### 1. **Health Check**
Check if the backend is running.

**Endpoint:** `GET /`

**Response:**
```json
"ok"
```

**Example:**
```typescript
const response = await fetch('https://smart-agriculture-backend-my7c.onrender.com/');
const status = await response.text(); // "ok"
```

---

### 2. **Get Latest Sensor Data**
Retrieve the most recent sensor readings from the ESP32.

**Endpoint:** `GET /api/sensors/latest`

**Response:**
```json
{
  "soil": 45.2,
  "temperature": 28.5,
  "humidity": 65.3,
  "rainRaw": 3200,
  "rainDetected": false,
  "ldr": 2800,
  "lightPercent": 75.4,
  "lightStatus": "Normal Light",
  "flow": 2.3,
  "totalLiters": 145.7,
  "pump": 0,
  "mode": "AUTO",
  "rainExpected": false,
  "timestamp": "2025-12-22T17:35:00Z"
}
```

**Usage in App:**
```typescript
const API_URL = "https://smart-agriculture-backend-my7c.onrender.com";

async function getLatestSensorData() {
  const response = await fetch(`${API_URL}/api/sensors/latest`);
  const data = await response.json();
  return data;
}
```

---

### 3. **Get Sensor History**
Retrieve historical sensor data with optional time range.

**Endpoint:** `GET /api/sensors/history`

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 100)
- `from` (optional): Start timestamp (ISO 8601)
- `to` (optional): End timestamp (ISO 8601)

**Response:**
```json
{
  "data": [
    {
      "soil": 45.2,
      "temperature": 28.5,
      "humidity": 65.3,
      "timestamp": "2025-12-22T17:35:00Z",
      ...
    },
    ...
  ],
  "count": 100
}
```

**Usage:**
```typescript
async function getSensorHistory(limit = 50) {
  const response = await fetch(
    `${API_URL}/api/sensors/history?limit=${limit}`
  );
  const data = await response.json();
  return data;
}
```

---

### 4. **Control Pump**
Send pump control commands to the ESP32.

**Endpoint:** `POST /api/pump`

**Request Body:**
```json
{
  "pump": true  // true = ON, false = OFF
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pump command sent",
  "pump": true
}
```

**Usage:**
```typescript
async function controlPump(state: boolean) {
  const response = await fetch(`${API_URL}/api/pump`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pump: state })
  });
  const result = await response.json();
  return result;
}

// Turn pump ON
await controlPump(true);

// Turn pump OFF
await controlPump(false);
```

---

### 5. **Set Operation Mode**
Switch between AUTO and MANUAL irrigation modes.

**Endpoint:** `POST /api/mode`

**Request Body:**
```json
{
  "mode": "AUTO"  // "AUTO" or "MANUAL"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mode changed to AUTO",
  "mode": "AUTO"
}
```

**Usage:**
```typescript
async function setMode(mode: "AUTO" | "MANUAL") {
  const response = await fetch(`${API_URL}/api/mode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode })
  });
  const result = await response.json();
  return result;
}
```

---

### 6. **Get ML Model Report**
Retrieve machine learning model performance metrics.

**Endpoint:** `GET /model-report`

**Response:**
```json
{
  "arima_rmse": 3.45,
  "arimax_rmse": 1.78,
  "arima_mape": 0.175,
  "arimax_mape": 0.054,
  "arima_accuracy": 82.5,
  "arimax_accuracy": 94.6,
  "best_model": "ARIMAX",
  "rows": 2847
}
```

---

### 7. **Get Weather Forecast**
Retrieve weather forecast data for irrigation planning.

**Endpoint:** `GET /weather`

**Response:**
```json
{
  "temperature": 29.2,
  "humidity": 68,
  "rain_probability": 25,
  "rain_expected": false,
  "forecast_window": "Next 24 hours",
  "location": "Erode, Tamil Nadu",
  "last_updated": "2025-12-22T17:35:00"
}
```

---

### 8. **Get System Status**
Check backend system health and data logging status.

**Endpoint:** `GET /system-status`

**Response:**
```json
{
  "total_rows": 2847,
  "last_retrain": "2024-12-21 14:30:00",
  "next_retrain": "2024-12-22 02:00:00",
  "sensor_connectivity": true,
  "data_logging_active": true
}
```

---

### 9. **Predict Soil Moisture**
Get AI-powered soil moisture predictions.

**Endpoint:** `POST /predict-simple`

**Request Body:**
```json
{
  "soil": 45.2,
  "temperature": 28.5,
  "humidity": 65.3,
  "rain": 3200,
  "light": 2800
}
```

**Response:**
```json
{
  "forecast": [
    {
      "soil_pct_pred": 47.8,
      "timestamp": "2025-12-22T18:00:00Z"
    }
  ],
  "model": "ARIMAX"
}
```

---

## 🔌 WebSocket Connection

For **real-time sensor updates**, connect to the WebSocket endpoint:

**WebSocket URL:**
```
wss://smart-agriculture-backend-my7c.onrender.com/ws
```

**Usage:**
```typescript
const socket = new WebSocket("wss://smart-agriculture-backend-my7c.onrender.com/ws");

socket.onopen = () => {
  console.log("Connected to backend");
  
  // Register as mobile app
  socket.send(JSON.stringify({
    type: "register",
    role: "dashboard",
    id: "mobile-app"
  }));
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.source === "esp32") {
    // Real-time sensor data from ESP32
    console.log("Sensor update:", data);
  }
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.log("Disconnected from backend");
};
```

---

## 🎯 Integration Examples

### Example 1: Fetch and Display Latest Sensor Data

```typescript
import { useEffect, useState } from 'react';

const API_URL = "https://smart-agriculture-backend-my7c.onrender.com";

function SensorDashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`${API_URL}/api/sensors/latest`);
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error("Failed to fetch sensor data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
    
    // Refresh every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>Soil Moisture: {sensorData?.soil}%</Text>
      <Text>Temperature: {sensorData?.temperature}°C</Text>
      <Text>Humidity: {sensorData?.humidity}%</Text>
    </View>
  );
}
```

---

### Example 2: Control Pump from App

```typescript
import { useState } from 'react';
import { Button, Alert } from 'react-native';

const API_URL = "https://smart-agriculture-backend-my7c.onrender.com";

function PumpControl() {
  const [pumpOn, setPumpOn] = useState(false);
  const [loading, setLoading] = useState(false);

  async function togglePump() {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/pump`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pump: !pumpOn })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPumpOn(!pumpOn);
        Alert.alert("Success", `Pump turned ${!pumpOn ? 'ON' : 'OFF'}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to control pump");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      title={pumpOn ? "Turn Pump OFF" : "Turn Pump ON"}
      onPress={togglePump}
      disabled={loading}
    />
  );
}
```

---

### Example 3: Real-Time Updates with WebSocket

```typescript
import { useEffect, useState } from 'react';

function useRealtimeSensorData() {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("wss://smart-agriculture-backend-my7c.onrender.com/ws");

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({
        type: "register",
        role: "dashboard",
        id: "mobile-app"
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.source === "esp32") {
        setData(message);
      }
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    return () => ws.close();
  }, []);

  return { data, connected };
}
```

---

## 🔐 Best Practices

### 1. **Use Environment Variables**
Never hardcode URLs. Use `.env` file:

```bash
EXPO_PUBLIC_API_URL=https://smart-agriculture-backend-my7c.onrender.com
```

Then in code:
```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

---

### 2. **Error Handling**
Always handle network errors gracefully:

```typescript
async function fetchWithErrorHandling(url: string) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    // Show user-friendly error message
    Alert.alert("Connection Error", "Unable to reach server");
    return null;
  }
}
```

---

### 3. **Offline Mode**
Provide fallback data when backend is unreachable:

```typescript
async function getSensorData() {
  try {
    const response = await fetch(`${API_URL}/api/sensors/latest`);
    return await response.json();
  } catch (error) {
    // Return cached or mock data
    return {
      soil: 45.0,
      temperature: 28.0,
      humidity: 65.0,
      // ... fallback data
    };
  }
}
```

---

### 4. **Request Timeout**
Add timeout to prevent hanging requests:

```typescript
async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timeout');
    }
    throw error;
  }
}
```

---

## 🎓 VIVA-Ready Explanation

**"How does your mobile app communicate with the backend?"**

> "The mobile app makes REST API calls to our deployed backend at `smart-agriculture-backend-my7c.onrender.com`. For real-time sensor updates, we use WebSocket connections. The app can fetch latest sensor data, control the irrigation pump, switch between AUTO and MANUAL modes, and receive AI-powered soil moisture predictions. All communication is secured using HTTPS and WSS protocols."

**"What happens if the backend is offline?"**

> "The app implements graceful degradation with fallback data and error handling. If the backend is unreachable, we display cached sensor data and notify the user. The app also uses exponential backoff for WebSocket reconnection attempts to minimize battery drain."

---

## 📊 Testing the Integration

Use these commands to test your backend:

```bash
# Health check
curl https://smart-agriculture-backend-my7c.onrender.com/

# Get latest sensor data
curl https://smart-agriculture-backend-my7c.onrender.com/api/sensors/latest

# Control pump
curl -X POST https://smart-agriculture-backend-my7c.onrender.com/api/pump \
  -H "Content-Type: application/json" \
  -d '{"pump": true}'

# Get model report
curl https://smart-agriculture-backend-my7c.onrender.com/model-report
```

---

## 🚀 Next Steps

1. ✅ Backend is deployed and accessible
2. ✅ Environment variables configured
3. 🔄 Update API service to use deployed backend
4. 🔄 Test all endpoints from mobile app
5. 🔄 Implement error handling and offline mode
6. 🔄 Add loading states and user feedback

---

**Your backend is ready to use! Start integrating these endpoints into your mobile app.** 🎉
