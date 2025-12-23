import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { SensorData, ModelReport, WeatherData, SystemStatus } from "../types";
import { smartFarmWebSocket, ConnectionStatus } from "../services/websocket";
import { getModelReport, getWeatherData, getSystemStatus } from "../services/api";
import { initializePushNotifications } from "../services/notifications";

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
        // Initialize with zero values - will show real data only when sensors are connected
        soil: 0,
        temperature: 0,
        humidity: 0,
        rainRaw: 0,
        rainDetected: false,
        ldr: 0,
        lightPercent: 0,
        lightStatus: "No Data",
        flow: 0,
        totalLiters: 0,
        pump: 0,
        mode: "AUTO",
        rainExpected: false,
    });

    const [hasLiveData, setHasLiveData] = useState(false); // Start with false - no data until connected
    const [history, setHistory] = useState<SensorData[]>([]); // Empty history until real data arrives
    const [modelReport, setModelReport] = useState<ModelReport | null>(null); // Null until loaded from API
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // Null until loaded from API
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null); // Null until loaded from API
    const [predictedSoil, setPredictedSoil] = useState<number | null>(null); // Null until prediction available
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

        // Initialize push notifications
        initializePushNotifications().catch(err => {
            console.warn('Failed to initialize push notifications:', err);
        });

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

    // ML predictions will only show when real data is available from the backend API

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
