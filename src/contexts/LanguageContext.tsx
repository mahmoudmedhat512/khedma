import i18n from '@/i18n';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { useCallback, useEffect, useState } from 'react';
import { Alert, I18nManager } from 'react-native';

type LanguageType = 'en' | 'ar';

interface LanguageState {
    language: LanguageType;
    isRTL: boolean;
    changeLanguage: (lang: LanguageType) => Promise<void>;
    isReady: boolean;
}

const LANGUAGE_STORAGE_KEY = '@app_language';

export const [LanguageProvider, useLanguage] = createContextHook<LanguageState>(() => {
    const getInitialLang = (): LanguageType => {
        const lang = i18n.language || 'ar';
        return lang.startsWith('ar') ? 'ar' : 'en';
    };
    const [language, setLanguage] = useState<LanguageType>(getInitialLang());
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageType | null;
                if (savedLanguage) {
                    setLanguage(savedLanguage);
                    i18n.changeLanguage(savedLanguage);
                    // Don't fully force RTL changes on mount unless they mismatch, since Expo handles RTL mainly via I18nManager
                    const requiresRTL = savedLanguage === 'ar';
                    if (I18nManager.isRTL !== requiresRTL) {
                        I18nManager.allowRTL(requiresRTL);
                        I18nManager.forceRTL(requiresRTL);
                    }
                }
            } catch (error) {
                console.error('Failed to load language:', error);
            } finally {
                setIsReady(true);
            }
        };
        loadLanguage();
    }, []);

    const changeLanguage = useCallback(async (newLang: LanguageType) => {
        // Even if the same language, let's ensure RTL state is correct (useful for debugging)
        const requiresRTL = newLang === 'ar';

        try {
            console.log(`[LanguageContext] Changing language to: ${newLang}, RTL: ${requiresRTL}`);

            // 1. Save language
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
            setLanguage(newLang);

            // 2. Set I18nManager BEFORE reload
            if (I18nManager.isRTL !== requiresRTL) {
                I18nManager.allowRTL(requiresRTL);
                I18nManager.forceRTL(requiresRTL);
            }

            // 3. Update i18n
            await i18n.changeLanguage(newLang);

            // 4. Reload app to apply RTL changes
            // We wait a tiny bit to ensure storage and I18nManager are flushed
            setTimeout(async () => {
                try {
                    await Updates.reloadAsync();
                } catch (reloadError) {
                    if (__DEV__) {
                        const { DevSettings } = require('react-native');
                        DevSettings.reload();
                    }
                }
            }, 100);

        } catch (error) {
            console.error('[LanguageContext] Error during language change:', error);
            Alert.alert('Language Change Failed', 'Please try restarting the app manually.');
        }
    }, [language]);

    return {
        language,
        isRTL: I18nManager.isRTL,
        changeLanguage,
        isReady,
    };
});
