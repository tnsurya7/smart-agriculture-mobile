# 🌱 Smart Agriculture Mobile App

A comprehensive React Native mobile application for real-time agricultural monitoring and irrigation control with AI-powered predictions and push notifications.

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=flat&logo=react&logoColor=white)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📱 Features

### 🔴 Real-Time Monitoring
- Live sensor data from ESP32 (soil moisture, temperature, humidity, rain, light)
- WebSocket connection for instant updates
- Historical data visualization with charts
- ML-powered soil moisture predictions using ARIMAX model (94.6% accuracy)

### 🎮 Remote Control
- Pump ON/OFF control from anywhere
- AUTO/MANUAL irrigation mode switching
- Commands routed through secure backend to ESP32

### 📱 Push Notifications
- Alerts when app is closed, background, or not opened
- Low soil moisture warnings (< 30%)
- Rain detection alerts
- Pump status change notifications
- Operation mode change notifications
- High temperature warnings (> 35°C)

### 🤖 AI & Analytics
- ARIMAX model for soil moisture forecasting
- Model performance metrics dashboard
- Weather forecast integration
- Irrigation recommendations

### 🌐 Backend Integration
- Connected to deployed Render backend
- REST API for data fetching and control
- WebSocket for real-time updates
- Offline support with graceful degradation

---

## 🏗️ Architecture

```
ESP32 Sensors
     ↓
Backend (Render)
     ↓
     ├─→ REST API ──────→ Mobile App
     ├─→ WebSocket ─────→ Mobile App (Real-time)
     └─→ Expo Push API ─→ Mobile App (Notifications)
```

**Security:** Mobile app never directly accesses database or ESP32. All operations go through backend.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- Physical Android device (for push notifications)

### Installation

```bash
# Clone repository
git clone https://github.com/tnsurya7/smart-agriculture-mobile.git
cd smart-agriculture-mobile

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your actual values
```

### Configuration

1. **Update `.env` file:**
```bash
EXPO_PUBLIC_API_URL=https://your-backend-url.onrender.com
EXPO_PUBLIC_WS_URL=wss://your-backend-url.onrender.com/ws
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_weather_api_key
```

2. **Update Expo Project ID** in `app.json`:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-expo-project-id"
      }
    }
  }
}
```

### Running the App

```bash
# Start development server
npx expo start

# Or with cache clear
npx expo start -c

# Build for Android
npx expo run:android
```

---

## 📁 Project Structure

```
smart-agriculture-mobile/
├── app/                    # Expo Router pages
│   └── (tabs)/            # Tab navigation
│       ├── dashboard.tsx  # Main dashboard
│       ├── sensors.tsx    # Sensor monitoring
│       ├── irrigation.tsx # Pump control
│       └── analytics.tsx  # ML predictions
├── components/            # Reusable components
├── context/              # React Context
│   └── SmartFarmContext.tsx
├── hooks/                # Custom hooks
│   ├── useBackendAPI.ts  # Backend integration
│   └── useNotifications.ts # Push notifications
├── services/             # API services
│   ├── api.ts           # REST API
│   ├── websocket.ts     # WebSocket
│   └── notifications.ts # Push notifications
├── docs/                # Documentation
├── .env.example         # Environment template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

---

## 🔐 Security

### ✅ What's Safe in This Repo
- All source code
- Documentation
- Configuration templates (`.env.example`)
- App structure and assets

### ❌ What's NOT in This Repo
- `.env` - Environment variables with API keys
- Database credentials
- Service keys
- Keystores and certificates

**Architecture:** Mobile app uses backend abstraction. All sensitive operations (database access, ESP32 communication) happen on the backend. Even if the APK is reverse-engineered, the database remains secure.

---

## 🎣 Usage Examples

### Fetch Latest Sensor Data
```typescript
import { useLatestSensorData } from './hooks/useBackendAPI';

function Dashboard() {
  const { data, loading, error } = useLatestSensorData(true, 5000);
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  
  return <Text>Soil: {data?.soil}%</Text>;
}
```

### Control Pump
```typescript
import { usePumpControl } from './hooks/useBackendAPI';

function PumpButton() {
  const { setPump, loading } = usePumpControl();
  
  return (
    <Button 
      title="Turn ON" 
      onPress={() => setPump(true)}
      disabled={loading}
    />
  );
}
```

### Enable Notifications
```typescript
import { usePushNotifications, useSensorAlerts } from './hooks/useNotifications';

function App() {
  const { expoPushToken, isRegistered } = usePushNotifications();
  const { data } = useSmartFarm();
  
  // Auto-send alerts based on sensor thresholds
  useSensorAlerts(data);
  
  return <Text>Notifications: {isRegistered ? 'Enabled' : 'Disabled'}</Text>;
}
```

---

## 🔔 Notification Alerts

| Event | Trigger | Example |
|-------|---------|---------|
| **Low Soil** | Soil < 30% | "⚠️ Soil moisture is 28.5%. Irrigation may be needed." |
| **Rain** | Rain detected | "🌧️ Rain detected. Irrigation paused automatically." |
| **Pump ON** | Pump activated | "🚰 Water pump has been turned ON." |
| **Pump OFF** | Pump deactivated | "🚰 Water pump has been turned OFF." |
| **Auto Mode** | Mode = AUTO | "⚙️ System is now running in automatic irrigation mode." |
| **Manual Mode** | Mode = MANUAL | "👤 System is now in manual control mode." |
| **High Temp** | Temp > 35°C | "🌡️ Temperature is 36.2°C. Monitor crop health." |

---

## 📚 Documentation

- **[API Integration Guide](docs/API_INTEGRATION.md)** - Complete API reference
- **[Push Notifications Setup](docs/PUSH_NOTIFICATIONS.md)** - Notification implementation
- **[Quick Start Guide](docs/QUICK_START.md)** - Testing and debugging
- **[Hooks Usage](docs/HOOKS_USAGE.md)** - Custom hook examples
- **[Environment Validation](ENV_VALIDATION.md)** - Security validation
- **[Quick Reference](QUICK_REFERENCE.md)** - Essential commands

---

## 🛠️ Tech Stack

- **Frontend:** React Native, Expo SDK 54
- **State Management:** React Context API
- **Navigation:** Expo Router
- **Charts:** React Native Chart Kit
- **Notifications:** Expo Notifications
- **Backend:** FastAPI (deployed on Render)
- **Real-time:** WebSocket
- **ML Model:** ARIMAX (Python)
- **Weather API:** OpenWeather

---

## 🎓 Academic Project

This mobile application is part of a comprehensive Smart Agriculture IoT system developed for academic purposes.

### System Components
1. **ESP32 Hardware** - Sensor data collection
2. **Backend API** - Data processing and ML predictions
3. **Web Dashboard** - Desktop monitoring interface
4. **Mobile App** - This repository

### Key Features for Academic Evaluation
- Real-time IoT data visualization
- Machine Learning integration (ARIMAX model)
- Push notification system
- Secure backend abstraction
- Professional code structure
- Comprehensive documentation

---

## 📊 Performance

- **Real-time Updates:** < 100ms latency via WebSocket
- **API Response Time:** < 2s
- **Notification Delivery:** < 5s from trigger to device
- **ML Prediction:** < 1s
- **Offline Mode:** Instant fallback to cached data

---

## 🤝 Contributing

This is an academic project. For questions or suggestions:

1. Check the [documentation](docs/)
2. Review the [Quick Reference](QUICK_REFERENCE.md)
3. See [CHECKLIST.md](CHECKLIST.md) for implementation status

---

## 📄 License

This project is part of an academic Smart Agriculture system.

---

## 🙏 Acknowledgments

- Expo team for excellent React Native framework
- OpenWeather for weather API
- Render for backend hosting
- FastAPI for backend framework

---

## 📞 Contact

**Project:** Smart Agriculture IoT System  
**Component:** Mobile Application  
**Technology:** React Native + Expo

---

**Built with ❤️ for Smart Agriculture** 🌱🚜

**Backend:** https://smart-agriculture-backend-my7c.onrender.com  
**Documentation:** See `docs/` folder for detailed guides