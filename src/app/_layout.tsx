import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';
import { useTheme } from '@/hooks/use-theme'; // Wait, useTheme is from hooks, ThemeProvider is from contexts.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function useProtectedRoute() {
    const { isReady, isLoggedIn, hasOnboarded, isGuest, hasSeenSplash, hasSelectedLanguage } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!isReady) return;

        const inAuthFlow =
            segments[0] === 'welcome' ||
            segments[0] === 'phone' ||
            segments[0] === 'otp' ||
            segments[0] === 'onboarding' ||
            segments[0] === 'splash' ||
            segments[0] === 'language';

        const canAccessApp = isLoggedIn || isGuest;

        if (!hasSeenSplash && segments[0] !== 'splash') {
            router.replace('/splash');
        } else if (hasSeenSplash && !hasSelectedLanguage) {
            if (segments[0] !== 'language') {
                router.replace('/language');
            }
        } else if (hasSeenSplash && hasSelectedLanguage) {
            // If we just finished language selection, move to the next screen
            if (segments[0] === 'language') {
                router.replace('/welcome');
                return;
            }

            if (!canAccessApp && !inAuthFlow) {
                router.replace('/welcome');
            } else if (isLoggedIn && !hasOnboarded && segments[0] !== 'onboarding') {
                router.replace('/onboarding');
            } else if (canAccessApp && hasOnboarded && inAuthFlow) {
                router.replace('/');
            }
        }
    }, [isReady, isLoggedIn, hasOnboarded, isGuest, hasSeenSplash, hasSelectedLanguage, segments, router]);
}

function RootLayoutNav() {
    const { isReady: isAuthReady, hasSeenSplash } = useAuth();
    const { isReady: isLangReady } = useLanguage();
    const colors = useTheme();

    useProtectedRoute();

    useEffect(() => {
        if (isAuthReady && isLangReady && hasSeenSplash) {
            // If we've already seen the splash, we won't navigate to the custom splash screen,
            // so we must hide the native one here.
            SplashScreen.hideAsync().catch(() => { });
        }
    }, [isAuthReady, isLangReady, hasSeenSplash]);

    // Failsafe: Hide native splash after 5 seconds no matter what
    useEffect(() => {
        const timer = setTimeout(() => {
            SplashScreen.hideAsync().catch(() => { });
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!isAuthReady || !isLangReady) {
        return null;
    }

    // Native SplashScreen.hideAsync() for the FIRST launch is handled in splash.tsx
    // to prevent the "double splash" effect.

    return (
        <Stack
            screenOptions={{
                headerBackTitle: 'Back',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.textPrimary,
                headerTitleStyle: { fontWeight: '700' as const },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen name="(tab)" options={{ headerShown: false }} />
            <Stack.Screen
                name="splash"
                options={{ headerShown: false, animation: 'fade' }}
            />
            <Stack.Screen
                name="language"
                options={{ headerShown: false, animation: 'fade' }}
            />
            <Stack.Screen
                name="welcome"
                options={{ headerShown: false, animation: 'fade' }}
            />
            <Stack.Screen
                name="phone"
                options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="otp"
                options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="onboarding"
                options={{ headerShown: false, animation: 'fade' }}
            />
            <Stack.Screen
                name="store/[id]"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="category/[type]"
                options={{ title: 'Category' }}
            />
            <Stack.Screen
                name="tracking/[id]"
                options={{ title: 'Track Order' }}
            />
        </Stack>
    );
}


export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView>
                <AppThemeProvider>
                    <LanguageProvider>
                        <LocationProvider>
                            <AuthProvider>
                                <ProfileProvider>
                                    <CartProvider>
                                        <RootLayoutNav />
                                    </CartProvider>
                                </ProfileProvider>
                            </AuthProvider>
                        </LocationProvider>
                    </LanguageProvider>
                </AppThemeProvider>
            </GestureHandlerRootView>
        </QueryClientProvider>
    );
}
