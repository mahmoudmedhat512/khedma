import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    mode: ThemeMode;
    isDarkMode: boolean;
    setMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = '@app_theme_mode';

export const [ThemeProvider, useThemeContext] = createContextHook<ThemeState>(() => {
    const deviceTheme = useDeviceColorScheme();
    const [mode, setModeState] = useState<ThemeMode>('system');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(deviceTheme === 'dark');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
                if (savedMode) {
                    setModeState(savedMode);
                    setIsDarkMode(savedMode === 'system' ? deviceTheme === 'dark' : savedMode === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            }
        };
        loadTheme();
    }, []);

    useEffect(() => {
        setIsDarkMode(mode === 'system' ? deviceTheme === 'dark' : mode === 'dark');
    }, [mode, deviceTheme]);

    const setMode = useCallback(async (newMode: ThemeMode) => {
        try {
            setModeState(newMode);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }, []);

    return {
        mode,
        isDarkMode,
        setMode,
    };
});
