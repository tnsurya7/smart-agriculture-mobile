export interface SensorData {
  soil: number;                    // soil moisture % (0-100) from ESP32
  temperature: number;             // temperature in °C from ESP32
  humidity: number;                // humidity % from ESP32
  rainRaw: number;                 // rain_raw sensor value from ESP32
  rainDetected: boolean;           // rain_detected boolean from ESP32
  ldr: number;                     // light_raw sensor value from ESP32
  lightPercent: number;            // light_percent (0-100) from ESP32
  lightStatus: "dark" | "low" | "normal" | "very_bright" | string; // light_state from ESP32
  flow: number;                    // flow rate L/min from ESP32
  totalLiters: number;             // total water used L from ESP32
  pump: 0 | 1;                     // pump state: 0=OFF, 1=ON from ESP32
  mode: "AUTO" | "MANUAL";         // irrigation mode from ESP32
  rainExpected: boolean;           // rain_expected forecast from ESP32
  predictedSoil?: number | null;   // ML predicted soil moisture (optional)
  timestamp?: string;              // ISO timestamp of the reading
}

export interface RawSensorData {
  soil: number;
  rain: number;
  light: number;
  temperature: number;
  humidity: number;
  flowRate: number;
  totalLiters: number;
  pump: number;
}

export interface HistoricalDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  soilPercent?: number;
  light?: number;
}

export enum AlertType {
  Info = 'info',
  Warning = 'warning',
  Critical = 'critical',
}

export interface Alert {
  id: number;
  type: AlertType;
  message: string;
}

export interface PumpStats {
  runtime: number;
  waterConsumed: number;
  lastOn: Date | null;
}

export interface ModelReport {
  arima_rmse: number;
  arimax_rmse: number;
  arima_mape: number;
  arimax_mape: number;
  arima_accuracy: number;
  arimax_accuracy: number;
  best_model: 'ARIMA' | 'ARIMAX';
  rows?: number;
}

export interface PredictionResult {
  predicted_soil: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rain_probability: number;
  rain_expected: boolean;
  forecast_window: string;
  location: string;
  last_updated?: string;
}

export interface SystemStatus {
  total_rows: number;
  last_retrain: string;
  next_retrain: string;
  sensor_connectivity: boolean;
  data_logging_active: boolean;
}