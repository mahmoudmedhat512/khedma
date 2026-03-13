import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './ar.json';
import en from './en.json';

const resources = {
    en: { translation: en },
    ar: { translation: ar },
};

// Fallback to 'ar' if locale is not available since the app is mainly focused on Arabic
let defaultLanguage = 'ar';
try {
    const locales = getLocales();
    if (locales && locales.length > 0) {
        const deviceLanguage = locales[0].languageCode;
        if (deviceLanguage === 'en' || deviceLanguage === 'ar') {
            defaultLanguage = deviceLanguage;
        }
    }
} catch (error) {
    console.warn('Error getting device locale:', error);
}

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4',
        resources,
        lng: defaultLanguage,
        fallbackLng: 'ar',
        interpolation: {
            escapeValue: false, // React already safes from XSS
        },
    });

export default i18n;
