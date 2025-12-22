import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

const resources = {
    en: {
        translation: {
            "system_overview": "System Overview",
            "smart_agriculture_dashboard": "Smart Agriculture Dashboard",
            "system_status": "System Status",
            "connection": "Connection",
            "mode": "Mode",
            "pump_status": "Pump Status",
            "online": "Online",
            "offline": "Offline",
            "auto": "Auto",
            "manual": "Manual",
            "pump_on": "ON",
            "pump_off": "OFF",
            "current_soil": "Current Soil",
            "predicted_soil": "Pred",
            "water_used": "Water Used",
            "today": "Today",
            "liters": "Liters",
            "system_message": "System is running in {{mode}} mode. All sensors are responsive. Pump is currently {{status}}.",
            "download_report": "Professional Report",
            "settings": "Settings",
            "language": "Language",
            "irrigation": "Irrigation",
            "sensors": "Sensors",
            "analytics": "Analytics",
            "ai_models": "AI Models",
            "data_analytics": "Data Analytics",
            "model_comparison": "Model Comparison",
            "auto_irrigation": "Auto Irrigation",
            "sensor_data": "Sensor Data"
        }
    },
    ta: {
        translation: {
            "system_overview": "அமைப்பு கண்ணோட்டம்",
            "smart_agriculture_dashboard": "ஸ்மார்ட் வேளாண்மை டாஷ்போர்டு",
            "system_status": "அமைப்பு நிலை",
            "connection": "இணைப்பு",
            "mode": "முறை",
            "pump_status": "பம்ப் நிலை",
            "online": "ஆன்லைன்",
            "offline": "ஆஃப்லைன்",
            "auto": "தானியங்கி",
            "manual": "கைமுறை",
            "pump_on": "இயங்குகிறது",
            "pump_off": "நிறுத்தப்பட்டது",
            "current_soil": "மண் ஈரம்",
            "predicted_soil": "கணிப்பு",
            "water_used": "நீர் பயன்பாடு",
            "today": "இன்று",
            "liters": "லிட்டர்",
            "system_message": "கணினி {{mode}} முறையில் இயங்குகிறது. அனைத்து சென்சார்களும் செயல்படுகின்றன. பம்ப் தற்போது {{status}}.",
            "download_report": "அறிக்கை",
            "settings": "அமைப்புகள்",
            "language": "மொழி",
            "irrigation": "நீர்ப்பாசனம்",
            "sensors": "சென்சார்கள்",
            "analytics": "பகுப்பாய்வு",
            "ai_models": "AI மாதிரிகள்",
            "data_analytics": "தரவு பகுப்பாய்வு",
            "model_comparison": "மாதிரி ஒப்பீடு",
            "auto_irrigation": "தானியங்கி பாசனம்",
            "sensor_data": "சென்சார் தரவு"
        }
    },
    hi: {
        translation: {
            "system_overview": "सिस्टम अवलोकन",
            "smart_agriculture_dashboard": "स्मार्ट कृषि डैशबोर्ड",
            "system_status": "सिस्टम स्थिति",
            "connection": "कनेक्शन",
            "mode": "मोड",
            "pump_status": "पंप स्थिति",
            "online": "ऑनलाइन",
            "offline": "ऑफलाइन",
            "auto": "ऑटो",
            "manual": "मैनुअल",
            "pump_on": "चालू",
            "pump_off": "बंद",
            "current_soil": "मृदा नमी",
            "predicted_soil": "अनुमानित",
            "water_used": "पानी का उपयोग",
            "today": "आज",
            "liters": "लीटर",
            "system_message": "सिस्टम {{mode}} मोड में चल रहा है। सभी सेंसर सक्रिय हैं। पंप वर्तमान में {{status}} है।",
            "download_report": "रिपोर्ट",
            "settings": "सेटिंग्स",
            "language": "भाषा",
            "irrigation": "सिंचाई",
            "sensors": "सेंसर",
            "analytics": "एनालिटिक्स",
            "ai_models": "एआई मॉडल",
            "data_analytics": "डेटा एनालिटिक्स",
            "model_comparison": "मॉडल तुलना",
            "auto_irrigation": "ऑटो सिंचाई",
            "sensor_data": "सेंसर डेटा"
        }
    }
};

const LANGUAGE_DETECTOR = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem('user-language');
            if (savedLanguage) {
                return callback(savedLanguage);
            }
        } catch (error) {
            console.log('Error reading language', error);
        }

        // Default fallback
        callback('en');
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem('user-language', language);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

i18n
    .use(LANGUAGE_DETECTOR as any)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
