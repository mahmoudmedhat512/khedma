import { useTheme } from '@/hooks/use-theme';
import { Stack } from 'expo-router';
import React from 'react';

export default function OrdersLayout() {
  const colors = useTheme();
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.textPrimary,
                headerTitleStyle: { fontWeight: '700' as const },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen name="index" options={{ title: 'My Orders' }} />
        </Stack>
    );
}
