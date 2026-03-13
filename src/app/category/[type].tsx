import { StoreCard } from '@/components/StoreCard';
import { useTheme } from '@/hooks/use-theme';
import { stores } from '@/mocks/stores';
import { Store, StoreCategory } from '@/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Apple, Pill } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function CategoryScreen() {
  const colors = useTheme();
  const styles = getStyles(colors);
    const { type } = useLocalSearchParams<{ type: string }>();
    const router = useRouter();

    const category = type as StoreCategory;
    const isPharmacy = category === 'pharmacy';
    const title = isPharmacy ? 'Pharmacies' : 'Veggies & Fruits';
    const accentColor = isPharmacy ? colors.pharmacy : colors.veggies;
    const accentBg = isPharmacy ? colors.pharmacyBg : colors.veggiesBg;

    const filteredStores = useMemo(
        () =>
            stores
                .filter((s) => s.category === category)
                .sort((a, b) => {
                    if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
                    return a.distance - b.distance;
                }),
        [category]
    );

    const openCount = useMemo(
        () => filteredStores.filter((s) => s.isOpen).length,
        [filteredStores]
    );

    const handleStorePress = useCallback(
        (store: Store) => {
            router.push(`/store/${store.id}`);
        },
        [router]
    );

    const renderStore = useCallback(
        ({ item }: { item: Store }) => (
            <StoreCard store={item} onPress={() => handleStorePress(item)} variant="horizontal" />
        ),
        [handleStorePress]
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title,
                    headerStyle: { backgroundColor: accentBg },
                    headerTintColor: colors.textPrimary,
                }}
            />
            <View style={[styles.banner, { backgroundColor: accentBg }]}>
                <View style={[styles.bannerIcon, { backgroundColor: `${accentColor}15` }]}>
                    {isPharmacy ? (
                        <Pill size={20} color={accentColor} />
                    ) : (
                        <Apple size={20} color={accentColor} />
                    )}
                </View>
                <View style={styles.bannerInfo}>
                    <Text style={styles.bannerTitle}>
                        {isPharmacy ? 'صيدليات قريبة منك' : 'خضار وفاكهة طازة'}
                    </Text>
                    <Text style={styles.bannerSubtitle}>
                        {openCount} open · {filteredStores.length} total within 5 km
                    </Text>
                </View>
            </View>
            <FlatList
                data={filteredStores}
                renderItem={renderStore}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    bannerIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerInfo: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    bannerSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    list: {
        padding: 16,
    },
});
