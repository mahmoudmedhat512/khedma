import createContextHook from '@nkzw/create-context-hook';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';

interface LocationState {
    location: Location.LocationObject | null;
    address: string | null;
    errorMsg: string | null;
    isLoading: boolean;
    requestLocation: () => Promise<void>;
}

export const [LocationProvider, useLocation] = createContextHook<LocationState>(() => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const reverseGeocode = async (coords: { latitude: number; longitude: number }) => {
        try {
            const results = await Location.reverseGeocodeAsync(coords);
            if (results && results.length > 0) {
                const item = results[0];
                // Try to get a more specific address
                const parts = [
                    item.name !== item.street ? item.name : null,
                    item.street,
                    item.district,
                    item.city,
                ].filter(Boolean);

                // If the parts are too generic, fallback to district/city
                const addressText = parts.length > 1 ? parts.join('، ') : `${item.district || ''}، ${item.city || ''}`.replace(/^، | ،$/, '');
                setAddress(addressText || 'Unknown Location');
            }
        } catch (error) {
            console.error('Reverse geocode error:', error);
        }
    };

    const requestLocation = useCallback(async () => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert(
                    'Location Permission',
                    'Khedma needs your location to find nearby stores. Please enable it in settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Settings', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
                    ]
                );
                setIsLoading(false);
                return;
            }

            let currentLocation = await Promise.race([
                Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                }),
                new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Location timeout')), 10000))
            ]);

            if (!currentLocation) throw new Error('Could not get location');

            setLocation(currentLocation as Location.LocationObject);
            await reverseGeocode(currentLocation.coords);
        } catch (error) {
            console.error('Location request error:', error);
            setErrorMsg('Could not detect location');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    return {
        location,
        address,
        errorMsg,
        isLoading,
        requestLocation,
    };
});
