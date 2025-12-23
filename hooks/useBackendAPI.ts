/**
 * Custom React Hook for Backend API Integration
 * Provides easy access to all backend endpoints with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
    checkBackendHealth,
    getLatestSensorData,
    getSensorHistory,
    controlPump,
    setOperationMode,
    getModelReport,
    getWeatherData,
    getSystemStatus,
} from '../services/api';
import { SensorData, ModelReport, WeatherData, SystemStatus } from '../types';

/**
 * Hook to check backend health status
 */
export function useBackendHealth() {
    const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    const checkHealth = useCallback(async () => {
        setLoading(true);
        const healthy = await checkBackendHealth();
        setIsHealthy(healthy);
        setLoading(false);
        return healthy;
    }, []);

    useEffect(() => {
        checkHealth();
    }, [checkHealth]);

    return { isHealthy, loading, checkHealth };
}

/**
 * Hook to fetch latest sensor data
 */
export function useLatestSensorData(autoRefresh = false, refreshInterval = 5000) {
    const [data, setData] = useState<SensorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const sensorData = await getLatestSensorData();
            setData(sensorData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch sensor data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        if (autoRefresh) {
            const interval = setInterval(fetchData, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchData, autoRefresh, refreshInterval]);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Hook to fetch sensor history
 */
export function useSensorHistory(limit = 100) {
    const [history, setHistory] = useState<SensorData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getSensorHistory(limit);
            setHistory(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch history');
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { history, loading, error, refetch: fetchHistory };
}

/**
 * Hook to control pump
 */
export function usePumpControl() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setPump = useCallback(async (state: boolean) => {
        try {
            setLoading(true);
            setError(null);
            const result = await controlPump(state);

            if (!result.success) {
                throw new Error(result.message);
            }

            return result;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to control pump';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    return { setPump, loading, error };
}

/**
 * Hook to set operation mode
 */
export function useModeControl() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setMode = useCallback(async (mode: 'AUTO' | 'MANUAL') => {
        try {
            setLoading(true);
            setError(null);
            const result = await setOperationMode(mode);

            if (!result.success) {
                throw new Error(result.message);
            }

            return result;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to set mode';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    return { setMode, loading, error };
}

/**
 * Hook to fetch ML model report
 */
export function useModelReport() {
    const [report, setReport] = useState<ModelReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getModelReport();
            setReport(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch model report');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    return { report, loading, error, refetch: fetchReport };
}

/**
 * Hook to fetch weather data
 */
export function useWeatherData(autoRefresh = false, refreshInterval = 300000) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getWeatherData();
            setWeather(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeather();

        if (autoRefresh) {
            const interval = setInterval(fetchWeather, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchWeather, autoRefresh, refreshInterval]);

    return { weather, loading, error, refetch: fetchWeather };
}

/**
 * Hook to fetch system status
 */
export function useSystemStatus() {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getSystemStatus();
            setStatus(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch system status');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return { status, loading, error, refetch: fetchStatus };
}

/**
 * Combined hook for all backend data
 * Use this for comprehensive dashboard views
 */
export function useBackendData() {
    const { isHealthy, loading: healthLoading } = useBackendHealth();
    const { data: sensorData, loading: sensorLoading, refetch: refetchSensor } = useLatestSensorData();
    const { report, loading: reportLoading } = useModelReport();
    const { weather, loading: weatherLoading } = useWeatherData();
    const { status, loading: statusLoading } = useSystemStatus();

    const loading = healthLoading || sensorLoading || reportLoading || weatherLoading || statusLoading;

    return {
        isHealthy,
        sensorData,
        report,
        weather,
        status,
        loading,
        refetchSensor,
    };
}
