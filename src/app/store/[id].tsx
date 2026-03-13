import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/hooks/use-theme';
import { products } from '@/mocks/products';
import { stores } from '@/mocks/stores';
import { Product } from '@/types';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bike, Clock, MapPin, ShoppingBag, Star } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
export default function StoreDetailScreen() {
    const colors = useTheme();
    const styles = getStyles(colors);
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { items, addItem, updateQuantity, itemCount, total, currentStore } = useCart();

    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

    const store = useMemo(() => stores.find((s) => s.id === id), [id]);
    const storeProducts = useMemo(
        () => products.filter((p) => p.storeId === id),
        [id]
    );

    const categories = useMemo(() => {
        const cats = [...new Set(storeProducts.map((p) => p.category))];
        return cats;
    }, [storeProducts]);

    const filteredProducts = useMemo(() => {
        if (!activeCategory) return storeProducts;
        return storeProducts.filter(p => p.category === activeCategory);
    }, [storeProducts, activeCategory]);

    const getQuantity = useCallback(
        (productId: string) => {
            const item = items.find((i) => i.product.id === productId);
            return item?.quantity ?? 0;
        },
        [items]
    );

    const handleAdd = useCallback(
        (product: Product) => {
            if (!store) return;

            if (currentStore && currentStore.id !== store.id) {
                Alert.alert(
                    t('cart.multiStoreTitle'),
                    t('cart.multiStoreMessage'),
                    [
                        { text: t('common.cancel'), style: 'cancel' },
                        {
                            text: t('cart.clearAndAdd'),
                            style: 'destructive',
                            onPress: () => {
                                // We need clearAndAddItem in the context
                                (useCart as any).clearAndAddItem?.(product, store);
                            }
                        }
                    ]
                );
                return;
            }

            addItem(product, store);
        },
        [store, addItem, currentStore, t]
    );

    const handleRemove = useCallback(
        (product: Product) => {
            const qty = getQuantity(product.id);
            updateQuantity(product.id, qty - 1);
        },
        [getQuantity, updateQuantity]
    );

    if (!store) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ title: 'Store not found' }} />
                <Text style={styles.errorText}>Store not found</Text>
            </View>
        );
    }

    const isPharmacy = store.category === 'pharmacy';
    const accentColor = isPharmacy ? colors.pharmacy : colors.textPrimary;
    const accentBg = isPharmacy ? colors.pharmacyBg : colors.background;

    const renderProduct = ({ item }: { item: Product }) => (
        <View style={styles.productWrapper}>
            <ProductCard
                product={item}
                quantity={getQuantity(item.id)}
                onAdd={() => handleAdd(item)}
                onRemove={() => handleRemove(item)}
            />
        </View>
    );

    const ListHeader = () => (
        <View>
            <View style={styles.storeHeader}>
                <Image source={{ uri: store.image }} style={styles.storeImage} contentFit="cover" />
                <View style={[styles.storeImageOverlay, { paddingTop: insets.top }]}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={20} color={colors.textPrimary} />
                    </Pressable>
                </View>
            </View>

            <View style={styles.storeInfo}>
                <View style={styles.storeNameRow}>
                    <View style={styles.storeNameWrap}>
                        <Text style={styles.storeName}>{store.nameAr}</Text>
                        <Text style={styles.storeNameEn}>{store.name}</Text>
                    </View>
                    <View style={[styles.openBadge, { backgroundColor: colors.background }]}>
                        <View style={[styles.openDot, { backgroundColor: store.isOpen ? colors.textPrimary : colors.error }]} />
                        <Text style={[styles.openText, { color: store.isOpen ? colors.textPrimary : colors.error }]}>
                            {store.isOpen ? 'Open' : 'Closed'}
                        </Text>
                    </View>
                </View>

                <View style={styles.metaRow}>
                    <View style={styles.metaChip}>
                        <Star size={13} color={colors.rating} fill={colors.rating} />
                        <Text style={styles.metaChipText}>{store.rating}</Text>
                        <Text style={styles.metaChipSub}>({store.reviewCount})</Text>
                    </View>
                    <View style={styles.metaChip}>
                        <MapPin size={13} color={colors.textTertiary} />
                        <Text style={styles.metaChipText}>{store.distance} km</Text>
                    </View>
                    <View style={styles.metaChip}>
                        <Clock size={13} color={colors.textTertiary} />
                        <Text style={styles.metaChipText}>{store.deliveryTime}</Text>
                    </View>
                </View>

                <Text style={styles.addressText}>{store.address}</Text>

                <View style={[styles.deliveryChip, { backgroundColor: accentBg }]}>
                    <Bike size={14} color={accentColor} />
                    <Text style={[styles.deliveryChipText, { color: accentColor }]}>
                        Delivery: {store.deliveryFee} EGP
                    </Text>
                </View>
            </View>

            {categories.length > 0 && (
                <View style={styles.filterSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        <Pressable
                            style={[styles.filterChip, !activeCategory && styles.filterChipActive]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setActiveCategory(null);
                            }}
                        >
                            <Text style={[styles.filterChipText, !activeCategory && styles.filterChipTextActive]}>All</Text>
                        </Pressable>
                        {categories.map((cat) => (
                            <Pressable
                                key={cat}
                                style={[styles.filterChip, activeCategory === cat && styles.filterChipActive]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setActiveCategory(cat);
                                }}
                            >
                                <Text style={[styles.filterChipText, activeCategory === cat && styles.filterChipTextActive]}>{cat}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}

            <View style={styles.productsHeader}>
                <Text style={styles.productsTitle}>{activeCategory || t('store.products')}</Text>
                <Text style={styles.productsCount}>{filteredProducts.length} {t('store.items')}</Text>
            </View>
        </View>
    );

    const renderProductsGrid = () => {
        return (
            <View style={styles.productGrid}>
                {filteredProducts.map(product => (
                    <View key={product.id} style={styles.productWrapper}>
                        <ProductCard
                            product={product}
                            quantity={getQuantity(product.id)}
                            onAdd={() => handleAdd(product)}
                            onRemove={() => handleRemove(product)}
                            onPress={() => setSelectedProduct(product)}
                        />
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                <ListHeader />
                {renderProductsGrid()}
            </ScrollView>

            <ProductDetailModal
                product={selectedProduct}
                visible={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                quantity={selectedProduct ? getQuantity(selectedProduct.id) : 0}
                onAdd={() => selectedProduct && handleAdd(selectedProduct)}
                onRemove={() => selectedProduct && handleRemove(selectedProduct)}
                total={total}
            />

            {itemCount > 0 && currentStore?.id === store.id && (
                <Pressable
                    style={[styles.cartBar, { backgroundColor: colors.textPrimary }]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        router.push('/cart');
                    }}
                >
                    <View style={styles.cartBarLeft}>
                        <View style={styles.cartBadge}>
                            <Text style={[styles.cartBadgeText, { color: accentColor }]}>{itemCount}</Text>
                        </View>
                        <Text style={styles.cartBarLabel}>View Cart</Text>
                    </View>
                    <View style={styles.cartBarRight}>
                        <Text style={styles.cartBarTotal}>{total} EGP</Text>
                        <ShoppingBag size={16} color={colors.white} />
                    </View>
                </Pressable>
            )}
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    errorText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    storeHeader: {
        position: 'relative',
        height: 190,
    },
    storeImage: {
        width: '100%',
        height: 190,
    },
    storeImageOverlay: {
        ...StyleSheet.absoluteFillObject,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    storeInfo: {
        backgroundColor: colors.surface,
        padding: 16,
        marginTop: -16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    storeNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    storeNameWrap: {
        flex: 1,
        marginRight: 10,
    },
    storeName: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    storeNameEn: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    openBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 5,
    },
    openDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    openText: {
        fontSize: 11,
        fontWeight: '700',
    },
    metaRow: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
        flexWrap: 'wrap',
    },
    metaChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 5,
        gap: 4,
    },
    metaChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    metaChipSub: {
        fontSize: 11,
        color: colors.textTertiary,
    },
    addressText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 10,
    },
    deliveryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 5,
        marginTop: 10,
    },
    deliveryChipText: {
        fontSize: 12,
        fontWeight: '600',
    },
    productsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    productsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    productsCount: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    listContent: {
        paddingBottom: 120,
    },
    filterSection: {
        marginTop: 12,
    },
    filterScroll: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    filterChipActive: {
        backgroundColor: colors.textPrimary,
        borderColor: colors.textPrimary,
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'capitalize',
    },
    filterChipTextActive: {
        color: colors.white,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 11,
        marginTop: 8,
    },
    productWrapper: {
        width: '50%',
        paddingHorizontal: 5,
        marginBottom: 10,
    },
    cartBar: {
        position: 'absolute',
        bottom: 28,
        left: 16,
        right: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    cartBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cartBadge: {
        backgroundColor: colors.white,
        width: 26,
        height: 26,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        fontSize: 13,
        fontWeight: '800',
    },
    cartBarLabel: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '700',
    },
    cartBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cartBarTotal: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '800',
    },
});
