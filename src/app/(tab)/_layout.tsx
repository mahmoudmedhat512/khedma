import { useTheme } from '@/hooks/use-theme';
import { Tabs } from 'expo-router';
import { ClipboardList, Home, ShoppingBag, User } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
    const colors = useTheme();
    const { t } = useTranslation();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.textPrimary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.borderLight,
                    borderTopWidth: 1,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600' as const,
                },
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: t('tabs.home'),
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="orders"
                options={{
                    title: t('tabs.orders'),
                    tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: t('tabs.cart'),
                    tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('tabs.profile'),
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
