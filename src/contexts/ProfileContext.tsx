import { stores } from '@/mocks/stores';
import { Address } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

const PROFILE_KEYS = {
    addresses: 'profile_addresses',
    favorites: 'profile_favorites',
    notifications: 'profile_notifications',
};

interface NotificationPrefs {
    orderUpdates: boolean;
    promotions: boolean;
    newStores: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
    orderUpdates: true,
    promotions: false,
    newStores: true,
};

export const [ProfileProvider, useProfile] = createContextHook(() => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATIONS);

    const profileQuery = useQuery({
        queryKey: ['profile-data'],
        queryFn: async () => {
            const [savedAddresses, savedFavorites, savedNotifs] = await Promise.all([
                AsyncStorage.getItem(PROFILE_KEYS.addresses),
                AsyncStorage.getItem(PROFILE_KEYS.favorites),
                AsyncStorage.getItem(PROFILE_KEYS.notifications),
            ]);
            return {
                addresses: savedAddresses ? JSON.parse(savedAddresses) as Address[] : [],
                favoriteIds: savedFavorites ? JSON.parse(savedFavorites) as string[] : [],
                notificationPrefs: savedNotifs ? JSON.parse(savedNotifs) as NotificationPrefs : DEFAULT_NOTIFICATIONS,
            };
        },
        staleTime: Infinity,
    });

    useEffect(() => {
        if (profileQuery.data) {
            setAddresses(profileQuery.data.addresses);
            setFavoriteIds(profileQuery.data.favoriteIds);
            setNotificationPrefs(profileQuery.data.notificationPrefs);
        }
    }, [profileQuery.data]);

    const saveAddressesMutation = useMutation({
        mutationFn: async (updated: Address[]) => {
            await AsyncStorage.setItem(PROFILE_KEYS.addresses, JSON.stringify(updated));
            return updated;
        },
        onSuccess: (updated) => {
            setAddresses(updated);
        },
    });

    const saveFavoritesMutation = useMutation({
        mutationFn: async (updated: string[]) => {
            await AsyncStorage.setItem(PROFILE_KEYS.favorites, JSON.stringify(updated));
            return updated;
        },
        onSuccess: (updated) => {
            setFavoriteIds(updated);
        },
    });

    const saveNotifsMutation = useMutation({
        mutationFn: async (updated: NotificationPrefs) => {
            await AsyncStorage.setItem(PROFILE_KEYS.notifications, JSON.stringify(updated));
            return updated;
        },
        onSuccess: (updated) => {
            setNotificationPrefs(updated);
        },
    });

    const { mutate: saveAddresses } = saveAddressesMutation;
    const { mutate: saveFavorites } = saveFavoritesMutation;
    const { mutate: saveNotifs } = saveNotifsMutation;

    const addAddress = useCallback((address: Omit<Address, 'id'>) => {
        const newAddress: Address = { ...address, id: `addr-${Date.now()}` };
        const updated = [...addresses, newAddress];
        if (newAddress.isDefault) {
            updated.forEach((a) => { if (a.id !== newAddress.id) a.isDefault = false; });
        }
        saveAddresses(updated);
    }, [addresses, saveAddresses]);

    const updateAddress = useCallback((id: string, data: Partial<Omit<Address, 'id'>>) => {
        const updated = addresses.map((a) => {
            if (a.id === id) return { ...a, ...data };
            if (data.isDefault) return { ...a, isDefault: false };
            return a;
        });
        saveAddresses(updated);
    }, [addresses, saveAddresses]);

    const removeAddress = useCallback((id: string) => {
        const updated = addresses.filter((a) => a.id !== id);
        saveAddresses(updated);
    }, [addresses, saveAddresses]);

    const toggleFavorite = useCallback((storeId: string) => {
        const updated = favoriteIds.includes(storeId)
            ? favoriteIds.filter((id) => id !== storeId)
            : [...favoriteIds, storeId];
        saveFavorites(updated);
    }, [favoriteIds, saveFavorites]);

    const isFavorite = useCallback((storeId: string) => {
        return favoriteIds.includes(storeId);
    }, [favoriteIds]);

    const favoriteStores = useMemo(() => {
        return stores.filter((s) => favoriteIds.includes(s.id));
    }, [favoriteIds]);

    const updateNotificationPref = useCallback((key: keyof NotificationPrefs, value: boolean) => {
        const updated = { ...notificationPrefs, [key]: value };
        saveNotifs(updated);
    }, [notificationPrefs, saveNotifs]);

    return {
        addresses,
        addAddress,
        updateAddress,
        removeAddress,
        favoriteIds,
        favoriteStores,
        toggleFavorite,
        isFavorite,
        notificationPrefs,
        updateNotificationPref,
    };
});
