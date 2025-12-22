# Smart Agriculture Mobile App

A React Native (Expo) mobile application for monitoring and controlling smart agriculture systems. This app provides real-time sensor monitoring, irrigation control, AI-powered predictions, and weather integration.

## Features

### 🌾 Complete Dashboard
- **Real-time Sensor Monitoring**: Temperature, Humidity, Soil Moisture, Light, Rain detection
- **Soil Moisture Gauge**: Visual semicircle gauge matching web dashboard
- **Connection Status**: Live ESP32 connection indicator
- **Historical Charts**: Multi-line charts showing sensor trends

### 💧 Irrigation Control
- **Pump Control**: Manual ON/OFF buttons (MANUAL mode only)
- **Auto/Manual Mode**: Toggle between ESP32 automatic control and manual override
- **Flow Rate Monitoring**: Real-time water flow and total usage
- **Irrigation Recommendations**: AI-powered suggestions based on soil moisture

### 🧠 AI Analytics
- **Model Performance**: ARIMA vs ARIMAX accuracy comparison (94.6% vs 82.5%)
- **Soil Moisture Prediction**: ML forecasts for next irrigation cycle
- **Confidence Metrics**: RMSE, MAPE, and accuracy scores
- **Training Statistics**: 2000+ sensor readings used for model training

### 🌤️ Weather Integration
- **Real-time Weather**: Temperature, humidity, rain probability
- **24-hour Forecast**: Rain expected indicator for irrigation planning
- **Location-based**: Erode, Tamil Nadu weather data
- **Irrigation Impact**: Automatic rain-based irrigation adjustments

### ⚙️ System Status
- **Data Logging**: 7000+ sensor readings stored
- **Auto Retraining**: AI models retrain every 24 hours
- **Sensor Health**: Connectivity and logging status
- **System Metrics**: Last/next retrain timestamps

## Technology Stack

- **Frontend**: React Native 0.81.5 with Expo 54.0.30
- **Navigation**: Expo Router 6.0.21 (file-based routing)
- **Charts**: react-native-chart-kit for historical data visualization
- **WebSocket**: Native WebSocket API for real-time ESP32 communication
- **API**: Fetch API for FastAPI backend integration
- **UI**: Custom dark theme components matching web dashboard

## Backend Integration

### WebSocket Connection (ESP32)
```
URL: ws://192.0.0.2:8080/ws
Data Format: JSON with sensor readings every ~5 seconds
Commands: pump_cmd, mode, rain_expected
```

### FastAPI Endpoints
```
Base URL: http://localhost:8000
- GET /model-report - ARIMA vs ARIMAX performance
- POST /predict-simple - Soil moisture predictions
- GET /weather - Weather forecast data
- GET /system-status - Data logging statistics
```

## Installation & Setup

### Prerequisites
- Node.js 20.x
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Expo Go app on physical device

### 1. Install Dependencies
```bash
cd smart-agriculture-mobile
npm install --legacy-peer-deps
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your actual URLs and API keys
```

### 3. Start Development Server
```bash
# Start with tunnel (works on any network)
npx expo start --tunnel

# Or start locally (same WiFi required)
npx expo start
```

### 4. Open on Device
- **iOS**: Scan QR code with Camera app
- **Android**: Scan QR code with Expo Go app
- **Simulator**: Press 'i' (iOS) or 'a' (Android) in terminal

## Environment Variables

Create `.env` file in project root:

```env
# WebSocket Server (ESP32)
EXPO_PUBLIC_WS_URL=ws://192.0.0.2:8080/ws

# FastAPI Backend
EXPO_PUBLIC_API_URL=http://localhost:8000

# OpenWeather API Key
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

## Project Structure

```
smart-agriculture-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── dashboard.tsx      # Main sensor dashboard
│   │   └── irrigation.tsx     # Irrigation control screen
│   ├── _layout.tsx           # Tab navigation layout
│   └── index.tsx             # App entry point
├── components/
│   ├── SensorCard.tsx        # Individual sensor display
│   ├── SoilMoistureGauge.tsx # Semicircle soil gauge
│   ├── PumpControlCard.tsx   # Pump control interface
│   ├── HistoryChart.tsx      # Multi-line sensor charts
│   ├── ModelPerformanceCard.tsx # AI model metrics
│   ├── WeatherCard.tsx       # Weather forecast display
│   ├── ConnectionStatus.tsx  # WebSocket status indicator
│   └── SystemStatusCard.tsx  # System health metrics
├── hooks/
│   └── useSmartFarmData.ts   # Main data management hook
├── services/
│   ├── api.ts               # FastAPI integration
│   └── websocket.ts         # WebSocket service class
├── types/
│   └── index.ts             # TypeScript type definitions
└── package.json
```

## Key Components

### Dashboard Screen
- Complete sensor overview with real-time updates
- Soil moisture gauge as primary feature
- Grid layout for temperature, humidity, light, rain sensors
- Pump control and historical charts

### Irrigation Screen
- Irrigation-focused interface with recommendations
- Prominent soil moisture gauge and pump controls
- Weather impact analysis
- AI predictions and irrigation statistics

### Data Management
- `useSmartFarmData` hook manages all state and API calls
- WebSocket service handles ESP32 communication
- API service manages FastAPI backend requests
- Automatic reconnection and error handling

## Features Matching Web Dashboard

✅ **Real-time Sensor Data**: Temperature, Humidity, Soil, Light, Rain  
✅ **Soil Moisture Gauge**: Semicircle visualization with color coding  
✅ **Pump Control**: ON/OFF buttons with Auto/Manual mode toggle  
✅ **Historical Charts**: Multi-line charts (Temperature, Humidity, Soil)  
✅ **AI Model Performance**: ARIMA vs ARIMAX comparison with metrics  
✅ **Weather Forecast**: Rain probability and irrigation impact  
✅ **System Status**: Data logging stats and retraining schedule  
✅ **Connection Status**: Real-time ESP32 connection indicator  
✅ **Dark Theme**: Matching web dashboard color scheme  

## Troubleshooting

### WebSocket Connection Issues
- Ensure ESP32 is running and accessible
- Check WiFi network connectivity
- Verify WebSocket URL in environment variables
- Use tunnel mode for network firewall issues

### Chart Display Problems
- Ensure react-native-svg is properly installed
- Check that sensor data array has valid numbers
- Verify chart dimensions fit screen width

### API Connection Failures
- Confirm FastAPI backend is running
- Check API URL in environment variables
- Verify CORS settings allow mobile app origin

## Development Notes

- Uses Expo SDK 54 for latest React Native features
- Implements TypeScript for type safety
- Follows React Native best practices for performance
- Includes proper error handling and loading states
- Optimized for both iOS and Android platforms

## Production Deployment

1. **Build for Production**:
   ```bash
   npx expo build:android
   npx expo build:ios
   ```

2. **Environment Variables**: Update production URLs in `.env`

3. **App Store Submission**: Follow Expo documentation for store deployment

## Support

For issues or questions:
1. Check console logs for WebSocket/API errors
2. Verify environment variable configuration
3. Test backend connectivity independently
4. Review Expo documentation for platform-specific issues