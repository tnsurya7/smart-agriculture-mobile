import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const ERODE_LAT = 11.3410;
const ERODE_LON = 77.7172;

export interface WeatherData {
    temperature: number;
    humidity: number;
    rainPossibility: number; // 0-100%
    description: string;
    icon: string;
    location: string;
    rainExpected: boolean;
}

// Mock data for fallback
const MOCK_WEATHER: WeatherData = {
    temperature: 32,
    humidity: 65,
    rainPossibility: 45,
    description: "Partly Cloudy",
    icon: "02d",
    location: "Erode",
    rainExpected: false,
};

export const fetchEthodeWeather = async (): Promise<WeatherData> => {
    if (!API_KEY || API_KEY.includes('your_openweather_api_key')) {
        console.warn('⚠️ No valid OpenWeather API key found. Using mock data.');
        return MOCK_WEATHER;
    }

    try {
        // 1. Get Current Weather
        const currentRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${ERODE_LAT}&lon=${ERODE_LON}&units=metric&appid=${API_KEY}`
        );

        // 2. Get Forecast (for rain probability)
        // Note: Standard free API doesn't give "probability of precipitation" (pop) easily in 'weather' endpoint, 
        // but 'forecast' endpoint gives it.
        const forecastRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${ERODE_LAT}&lon=${ERODE_LON}&units=metric&appid=${API_KEY}&cnt=8` // Next 24 hours (3hr intervals * 8)
        );

        const current = currentRes.data;
        const forecast = forecastRes.data.list;

        // Calculate max rain probability in next 24h
        // 'pop' is probability of precipitation (0 to 1)
        const maxPop = Math.max(...forecast.map((f: any) => f.pop || 0)) * 100;

        return {
            temperature: Math.round(current.main.temp),
            humidity: current.main.humidity,
            rainPossibility: Math.round(maxPop),
            description: current.weather[0].description,
            icon: current.weather[0].icon,
            location: "Erode",
            rainExpected: maxPop > 50 || current.weather[0].main === 'Rain',
        };

    } catch (error) {
        console.error('Error fetching weather:', error);
        return MOCK_WEATHER;
    }
};
