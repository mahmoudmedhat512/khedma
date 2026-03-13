import { CartFloatingBar } from '@/components/CartFloatingBar';
import { LocationPickerSheet } from '@/components/LocationPickerSheet';
import { StoreCard } from '@/components/StoreCard';
import { useLocation } from '@/contexts/LocationContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useTheme } from '@/hooks/use-theme';
import { stores } from '@/mocks/stores';
import { Address, Store } from '@/types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
    Apple,
    ChevronDown,
    ChevronRight,
    Pill,
    Search,
    ShieldCheck,
    Timer,
    Zap,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const separatorColors = useTheme();
    const styles = getStyles(separatorColors);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { t } = useTranslation();
    const colors = useTheme();

    // Location & Profile
    const { address: detectedAddress, isLoading: isDetecting, requestLocation } = useLocation();
    const { addresses } = useProfile();

    const [isLocationSheetVisible, setIsLocationSheetVisible] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isHurryMode, setIsHurryMode] = useState(false);

    const activeAddress = selectedAddressId
        ? addresses.find(a => a.id === selectedAddressId)?.address
        : (detectedAddress || t('home.detectingLocation'));

    const activeLabel = selectedAddressId
        ? addresses.find(a => a.id === selectedAddressId)?.label
        : t('home.currentLocation');

    const handleSelectAddress = (selection: Address | 'current') => {
        if (selection === 'current') {
            setSelectedAddressId(null);
            requestLocation();
        } else {
            setSelectedAddressId(selection.id);
        }
        setIsLocationSheetVisible(false);
    };

    const nearbyPharmacies = stores
        .filter((s) => s.category === 'pharmacy' && s.isOpen)
        .filter((s) => !isHurryMode || parseInt(s.deliveryTime) < 15)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

    const nearbyVeggies = stores
        .filter((s) => s.category === 'veggies' && s.isOpen)
        .filter((s) => !isHurryMode || parseInt(s.deliveryTime) < 15)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

    const handleStorePress = useCallback(
        (store: Store) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/store/${store.id}`);
        },
        [router]
    );

    const handleCategoryPress = useCallback(
        (type: string) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push(`/category/${type}`);
        },
        [router]
    );

    const renderStoreItem = useCallback(
        ({ item }: { item: Store }) => (
            <StoreCard store={item} onPress={() => handleStorePress(item)} />
        ),
        [handleStorePress]
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
                <View style={styles.headerTop}>
                    <Pressable
                        style={styles.locationBtn}
                        onPress={() => setIsLocationSheetVisible(true)}
                    >
                        <View style={styles.locationDot} />
                        <View style={styles.locationInfo}>
                            <Text style={styles.deliverLabel}>{t('home.deliverTo')}</Text>
                            <View style={styles.locationRow}>
                                <Text style={styles.locationText} numberOfLines={1}>
                                    {activeLabel}: {activeAddress}
                                </Text>
                                <ChevronDown size={14} color={colors.textPrimary} />
                            </View>
                        </View>
                    </Pressable>
                </View>
                <Pressable style={styles.searchBar} onPress={() => router.push('/search')}>
                    <Search size={17} color={colors.textTertiary} />
                    <Text style={styles.searchPlaceholder}>{t('home.searchPlaceholder')}</Text>
                </Pressable>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.brandSection}>
                    <Text style={styles.brandName}>{t('home.brandName')}</Text>
                    <Text style={styles.brandTagline}>{t('home.brandTagline')}</Text>
                    <Text style={styles.brandSub}>{t('home.brandSub')}</Text>
                </View>

                <View style={styles.categorySection}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.categoryCard,
                            styles.pharmacyCard,
                            pressed && styles.categoryPressed,
                        ]}
                        onPress={() => handleCategoryPress('pharmacy')}
                        testID="category-pharmacy"
                    >
                        <View style={styles.categoryTop}>
                            <View style={[styles.categoryIcon, styles.pharmacyIcon]}>
                                <Pill size={22} color={colors.textPrimary} />
                            </View>
                            <View style={[styles.categoryArrow, styles.pharmacyArrow]}>
                                <ChevronRight size={14} color={colors.textPrimary} />
                            </View>
                        </View>
                        <Text style={styles.categoryTitleAr}>{t('home.categoryPharmacyAr')}</Text>
                        <Text style={styles.categoryTitleEn}>{t('home.categoryPharmacy')}</Text>
                        <Text style={styles.categoryCount}>
                            {stores.filter((s) => s.category === 'pharmacy' && s.isOpen).length} {t('home.openNearby')}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.categoryCard,
                            styles.veggiesCard,
                            pressed && styles.categoryPressed,
                        ]}
                        onPress={() => handleCategoryPress('veggies')}
                        testID="category-veggies"
                    >
                        <View style={styles.categoryTop}>
                            <View style={[styles.categoryIcon, styles.veggiesIcon]}>
                                <Apple size={22} color={colors.textPrimary} />
                            </View>
                            <View style={[styles.categoryArrow, styles.veggiesArrow]}>
                                <ChevronRight size={14} color={colors.textPrimary} />
                            </View>
                        </View>
                        <Text style={styles.categoryTitleAr}>{t('home.categoryVeggiesAr')}</Text>
                        <Text style={styles.categoryTitleEn}>{t('home.categoryVeggies')}</Text>
                        <Text style={styles.categoryCount}>
                            {stores.filter((s) => s.category === 'veggies' && s.isOpen).length} {t('home.openNearby')}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.hurrySection}>
                    <View style={styles.hurryContent}>
                        <Zap size={20} color={isHurryMode ? colors.warning : colors.textTertiary} fill={isHurryMode ? colors.warning : 'transparent'} />
                        <View style={styles.hurryTextWrapper}>
                            <Text style={styles.hurryTitle}>{t('home.hurryToggle')}</Text>
                            <Text style={styles.hurrySubtitle}>{t('home.hurryDesc')}</Text>
                        </View>
                    </View>
                    <Switch
                        value={isHurryMode}
                        onValueChange={(val) => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setIsHurryMode(val);
                        }}
                        trackColor={{ false: colors.borderLight, true: colors.warning }}
                        thumbColor={colors.white}
                    />
                </View>

                <View style={styles.promiseRow}>
                    <View style={styles.promiseChip}>
                        <View style={[styles.promiseIconWrap, { backgroundColor: colors.background }]}>
                            <Zap size={13} color={colors.textPrimary} />
                        </View>
                        <Text style={styles.promiseText}>{t('home.promise30Min')}</Text>
                    </View>
                    <View style={styles.promiseChip}>
                        <View style={[styles.promiseIconWrap, { backgroundColor: colors.background }]}>
                            <Timer size={13} color={colors.textPrimary} />
                        </View>
                        <Text style={styles.promiseText}>{t('home.promiseTracking')}</Text>
                    </View>
                    <View style={styles.promiseChip}>
                        <View style={[styles.promiseIconWrap, { backgroundColor: colors.background }]}>
                            <ShieldCheck size={13} color={colors.textPrimary} />
                        </View>
                        <Text style={styles.promiseText}>{t('home.promiseQuality')}</Text>
                    </View>
                </View>

                <View style={styles.storesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('home.nearestPharmacies')}</Text>
                        <Pressable
                            style={styles.seeAllBtn}
                            onPress={() => handleCategoryPress('pharmacy')}
                        >
                            <Text style={styles.seeAllText}>{t('home.seeAll')}</Text>
                            <ChevronRight size={14} color={colors.primary} />
                        </Pressable>
                    </View>
                    <FlatList
                        data={nearbyPharmacies}
                        renderItem={renderStoreItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.storeList}
                    />
                </View>

                <View style={styles.storesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('home.freshVeggies')}</Text>
                        <Pressable
                            style={styles.seeAllBtn}
                            onPress={() => handleCategoryPress('veggies')}
                        >
                            <Text style={styles.seeAllText}>{t('home.seeAll')}</Text>
                            <ChevronRight size={14} color={colors.primary} />
                        </Pressable>
                    </View>
                    <FlatList
                        data={nearbyVeggies}
                        renderItem={renderStoreItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.storeList}
                    />
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <CartFloatingBar />

            <LocationPickerSheet
                isVisible={isLocationSheetVisible}
                onClose={() => setIsLocationSheetVisible(false)}
                currentAddress={detectedAddress}
                savedAddresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={handleSelectAddress}
                onAddAddress={() => {
                    setIsLocationSheetVisible(false);
                    router.push('/profile'); // User can add addresses in profile
                }}
                isDetecting={isDetecting}
            />
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.surface,
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    locationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.textPrimary,
    },
    locationInfo: {},
    deliverLabel: {
        fontSize: 10,
        color: colors.textTertiary,
        fontWeight: '600' as const,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 15,
        fontWeight: '800' as const,
        color: colors.textPrimary,
        maxWidth: 260,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
        gap: 10,
    },
    searchPlaceholder: {
        fontSize: 14,
        color: colors.textTertiary,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 20,
    },
    brandSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    brandName: {
        fontSize: 34,
        fontWeight: '900' as const,
        color: colors.textPrimary,
        letterSpacing: -1,
    },
    brandTagline: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.textPrimary,
        marginTop: 2,
    },
    brandSub: {
        fontSize: 13,
        color: colors.textTertiary,
        marginTop: 4,
    },
    categorySection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    categoryCard: {
        flex: 1,
        borderRadius: 24,
        padding: 16,
        minHeight: 140,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    pharmacyCard: {
        backgroundColor: colors.surface,
    },
    veggiesCard: {
        backgroundColor: colors.surface,
    },
    categoryPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    categoryTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    categoryIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pharmacyIcon: {
        backgroundColor: colors.pharmacy + '15',
    },
    veggiesIcon: {
        backgroundColor: colors.veggies + '15',
    },
    categoryArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    pharmacyArrow: {},
    veggiesArrow: {},
    categoryTitleAr: {
        fontSize: 18,
        fontWeight: '800' as const,
        color: colors.textPrimary,
    },
    categoryTitleEn: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    categoryCount: {
        fontSize: 11,
        color: colors.textTertiary,
        marginTop: 6,
    },
    hurrySection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        marginHorizontal: 20,
        padding: 18,
        borderRadius: 24,
        marginBottom: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    hurryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    hurryTextWrapper: {
        flex: 1,
    },
    hurryTitle: {
        fontSize: 16,
        fontWeight: '800' as const,
        color: colors.textPrimary,
    },
    hurrySubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    promiseRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 24,
    },
    promiseChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    promiseIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    promiseText: {
        fontSize: 10,
        fontWeight: '700' as const,
        color: colors.textPrimary,
        flex: 1,
    },
    storesSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800' as const,
        color: colors.textPrimary,
    },
    seeAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seeAllText: {
        fontSize: 13,
        fontWeight: '700' as const,
        color: colors.textPrimary,
    },
    storeList: {
        paddingHorizontal: 20,
    },
});
