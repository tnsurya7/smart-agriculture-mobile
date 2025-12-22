import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { SensorData, ModelReport, WeatherData, SystemStatus } from "../types";
import { smartFarmWebSocket, ConnectionStatus } from "../services/websocket";
import { getModelReport, getWeatherData, getSystemStatus } from "../services/api";

type SmartFarmContextType = {
    data: SensorData;
    history: SensorData[];
    hasLiveData: boolean;
    predictedSoil: number | null;
    connection: ConnectionStatus;
    isConnected: boolean;
    modelReport: ModelReport | null;
    weatherData: WeatherData | null;
    systemStatus: SystemStatus | null;
    sendPump: (value: "ON" | "OFF") => void;
    setMode: (mode: "AUTO" | "MANUAL") => void;
    sendRainForecast: (rainExpected: boolean) => void;
    pumpStatus: "ON" | "OFF";
    mode: "AUTO" | "MANUAL";
    soilPercent: number;
    isRaining: boolean;
};

const SmartFarmContext = createContext<SmartFarmContextType | undefined>(undefined);

export function SmartFarmProvider({ children }: { children: React.ReactNode }) {
    const [connection, setConnection] = useState<ConnectionStatus>("disconnected");
    const [data, setData] = useState<SensorData>({
        // Demo data for UI testing when backend is not available
        soil: 45.2,
        temperature: 28.5,
        humidity: 65.3,
        rainRaw: 3200,
        rainDetected: false,
        ldr: 2800,
        lightPercent: 75.4,
        lightStatus: "Normal Light",
        flow: 2.3,
        totalLiters: 145.7,
        pump: 0,
        mode: "AUTO",
        rainExpected: false,
    });

    const [hasLiveData, setHasLiveData] = useState(true);
    const [history, setHistory] = useState<SensorData[]>([
        { soil: 42.1, temperature: 27.8, humidity: 68.2, rainRaw: 3100, rainDetected: false, ldr: 2600, lightPercent: 72.1, lightStatus: "Normal Light", flow: 2.1, totalLiters: 140.2, pump: 0, mode: "AUTO", rainExpected: false },
        { soil: 43.5, temperature: 28.2, humidity: 66.8, rainRaw: 3150, rainDetected: false, ldr: 2700, lightPercent: 73.5, lightStatus: "Normal Light", flow: 2.2, totalLiters: 142.4, pump: 0, mode: "AUTO", rainExpected: false },
        { soil: 44.8, temperature: 28.7, humidity: 65.9, rainRaw: 3180, rainDetected: false, ldr: 2750, lightPercent: 74.2, lightStatus: "Normal Light", flow: 2.3, totalLiters: 143.8, pump: 0, mode: "AUTO", rainExpected: false },
        { soil: 45.2, temperature: 28.5, humidity: 65.3, rainRaw: 3200, rainDetected: false, ldr: 2800, lightPercent: 75.4, lightStatus: "Normal Light", flow: 2.3, totalLiters: 145.7, pump: 0, mode: "AUTO", rainExpected: false },
    ]);
    const [modelReport, setModelReport] = useState<ModelReport | null>({
        arima_rmse: 3.45,
        arimax_rmse: 1.78,
        arima_mape: 0.175,
        arimax_mape: 0.054,
        arima_accuracy: 82.5,
        arimax_accuracy: 94.6,
        best_model: 'ARIMAX',
        rows: 2847,
    });
    const [weatherData, setWeatherData] = useState<WeatherData | null>({
        temperature: 29.2,
        humidity: 68,
        rain_probability: 25,
        rain_expected: false,
        forecast_window: "Next 24 hours",
        location: "Erode, Tamil Nadu",
        last_updated: new Date().toLocaleTimeString()
    });
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>({
        total_rows: 2847,
        last_retrain: "2024-12-21 14:30:00",
        next_retrain: "2024-12-22 02:00:00",
        sensor_connectivity: true,
        data_logging_active: true
    });
    const [predictedSoil, setPredictedSoil] = useState<number | null>(47.8);
    const lastPumpState = useRef<"ON" | "OFF" | null>(null);
    const lastPumpTime = useRef<number>(0);

    // Initialize WebSocket connection
    useEffect(() => {
        // Setup WebSocket callbacks
        smartFarmWebSocket.onConnectionChange = (status: ConnectionStatus) => {
            setConnection(status);
        };

        smartFarmWebSocket.onSensorData = (sensorData: SensorData) => {
            setData(sensorData);
            setHasLiveData(true);
            setHistory(prev => {
                const newHistory = [...prev, sensorData];
                return newHistory.slice(-30);
            });
        };

        smartFarmWebSocket.connect();
        return () => smartFarmWebSocket.disconnect();
    }, []);

    // Fetch API data periodically
    useEffect(() => {
        const fetchApiData = async () => {
            try {
                const report = await getModelReport();
                setModelReport(report);
                const weather = await getWeatherData();
                setWeatherData(weather);
                const status = await getSystemStatus();
                setSystemStatus(status);
            } catch (error) { }
        };

        fetchApiData();
        const interval = setInterval(fetchApiData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Simulate ML prediction
    useEffect(() => {
        if (!hasLiveData) {
            const timer = setTimeout(() => {
                setPredictedSoil(45.2);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [hasLiveData]);

    const sendPump = (value: "ON" | "OFF") => {
        const now = Date.now();
        if (lastPumpState.current === value) return;
        // Cooldown check removed for UI responsiveness, assume backend handles or use optimistic
        // But keeping cooldown to prevent spam
        if (now - lastPumpTime.current < 2000) return;

        lastPumpState.current = value;
        lastPumpTime.current = now;

        // Optimistic Update
        setData(prev => ({ ...prev, pump: value === 'ON' ? 1 : 0 }));
        smartFarmWebSocket.sendPumpCommand(value);
    };

    const setMode = (newMode: "AUTO" | "MANUAL") => {
        // Optimistic Update
        setData(prev => ({ ...prev, mode: newMode }));
        smartFarmWebSocket.sendModeCommand(newMode);
    };

    const sendRainForecast = (rainExpected: boolean) => {
        smartFarmWebSocket.sendRainForecast(rainExpected);
    };

    const value = {
        data,
        history,
        hasLiveData,
        predictedSoil,
        connection,
        isConnected: smartFarmWebSocket.isConnected(),
        modelReport,
        weatherData,
        systemStatus,
        sendPump,
        setMode,
        sendRainForecast,
        pumpStatus: (data.pump === 1 ? 'ON' : 'OFF') as 'ON' | 'OFF',
        mode: data.mode,
        soilPercent: data.soil,
        isRaining: data.rainDetected,
    };

    return (
        <SmartFarmContext.Provider value={value}>
            {children}
        </SmartFarmContext.Provider>
    );
}

export function useSmartFarm() {
    const context = useContext(SmartFarmContext);
    if (context === undefined) {
        throw new Error('useSmartFarm must be used within a SmartFarmProvider');
    }
    return context;
}
