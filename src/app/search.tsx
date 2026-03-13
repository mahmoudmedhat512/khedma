import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { StoreCard } from '@/components/StoreCard';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/hooks/use-theme';
import { products } from '@/mocks/products';
import { stores } from '@/mocks/stores';
import { Product, Store } from '@/types';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Search as SearchIcon, X } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    FlatList,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const colors = useTheme();
    const styles = getStyles(colors);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { t } = useTranslation();
    const { items, addItem, updateQuantity, currentStore } = useCart();

    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'stores' | 'products'>('stores');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleClear = () => {
        setQuery('');
    };

    const getQuantity = useCallback(
        (productId: string) => {
            const item = items.find((i) => i.product.id === productId);
            return item?.quantity ?? 0;
        },
        [items]
    );

    const handleAddProduct = useCallback(
        (product: Product) => {
            const store = stores.find(s => s.id === product.storeId);
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
                                (useCart as any).clearAndAddItem?.(product, store);
                            }
                        }
                    ]
                );
                return;
            }

            addItem(product, store);
        },
        [addItem, currentStore, t]
    );

    const handleRemoveProduct = useCallback(
        (product: Product) => {
            const qty = getQuantity(product.id);
            updateQuantity(product.id, qty - 1);
        },
        [getQuantity, updateQuantity]
    );

    const handleStorePress = useCallback(
        (store: Store) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/store/${store.id}`);
        },
        [router]
    );

    const filteredStores = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();
        return stores.filter(
            (s) =>
                s.name.toLowerCase().includes(lowerQuery) ||
                s.nameAr.includes(lowerQuery)
        );
    }, [query]);

    const filteredProducts = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.nameAr.includes(lowerQuery)
        );
    }, [query]);

    const renderStoreItem = ({ item }: { item: Store }) => (
        <StoreCard store={item} onPress={() => handleStorePress(item)} variant="horizontal" />
    );

    const renderProductItem = ({ item }: { item: Product }) => (
        <View style={styles.productWrapper}>
            <ProductCard
                product={item}
                quantity={getQuantity(item.id)}
                onAdd={() => handleAddProduct(item)}
                onRemove={() => handleRemoveProduct(item)}
                onPress={() => setSelectedProduct(item)}
            />
        </View>
    );

    const renderEmpty = () => {
        if (!query.trim()) {
            return (
                <View style={styles.emptyContainer}>
                    <SearchIcon size={48} color={colors.textTertiary} />
                    <Text style={styles.emptyTitle}>{t('search.emptyTitleStart')}</Text>
                    <Text style={styles.emptySubtitle}>{t('search.emptySubtitleStart')}</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>{t('search.emptyTitleNoResults')}</Text>
                <Text style={styles.emptySubtitle}>{t('search.emptySubtitleNoResults')}</Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <View style={styles.searchBarRow}>
                    <Pressable
                        onPress={() => router.back()}
                        style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
                    >
                        <ArrowLeft size={24} color={colors.textPrimary} />
                    </Pressable>
                    <View style={styles.searchBar}>
                        <SearchIcon size={18} color={colors.textTertiary} />
                        <TextInput
                            style={styles.searchInput}
                            value={query}
                            onChangeText={setQuery}
                            placeholder={t('search.placeholder')}
                            placeholderTextColor={colors.textTertiary}
                            autoFocus
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {query.length > 0 && (
                            <Pressable onPress={handleClear} hitSlop={10} style={styles.clearBtn}>
                                <X size={16} color={colors.textSecondary} />
                            </Pressable>
                        )}
                    </View>
                </View>

                <View style={styles.tabsRow}>
                    <Pressable
                        style={[styles.tab, activeTab === 'stores' && styles.tabActive]}
                        onPress={() => setActiveTab('stores')}
                    >
                        <Text style={[styles.tabText, activeTab === 'stores' && styles.tabTextActive]}>
                            {t('search.stores')} ({query.trim() ? filteredStores.length : 0})
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'products' && styles.tabActive]}
                        onPress={() => setActiveTab('products')}
                    >
                        <Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>
                            {t('search.products')} ({query.trim() ? filteredProducts.length : 0})
                        </Text>
                    </Pressable>
                </View>
            </View>

            {activeTab === 'stores' ? (
                <FlatList
                    key="stores-list"
                    data={filteredStores}
                    renderItem={renderStoreItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmpty}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    key="products-list"
                    data={filteredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.productRow}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmpty}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <ProductDetailModal
                product={selectedProduct}
                visible={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                quantity={selectedProduct ? getQuantity(selectedProduct.id) : 0}
                onAdd={() => selectedProduct && handleAddProduct(selectedProduct)}
                onRemove={() => selectedProduct && handleRemoveProduct(selectedProduct)}
                total={0} // total is not strictly needed for the modal to function, but we pass current cart total if needed.
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
        paddingTop: 10,
        paddingBottom: 0,
        zIndex: 10,
    },
    searchBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    backBtn: {
        padding: 8,
        backgroundColor: colors.background,
        borderRadius: 12,
    },
    backBtnPressed: {
        opacity: 0.7,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        marginLeft: 10,
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    clearBtn: {
        padding: 6,
        backgroundColor: colors.borderLight,
        borderRadius: 12,
    },
    tabsRow: {
        flexDirection: 'row',
        gap: 20,
    },
    tab: {
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: colors.textPrimary,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textTertiary,
    },
    tabTextActive: {
        color: colors.textPrimary,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
        flexGrow: 1,
    },
    productRow: {
        paddingHorizontal: 4,
    },
    productWrapper: {
        width: '50%',
        paddingHorizontal: 4,
        marginBottom: 8,
    },
    emptyContainer: {
        flex: 1,
        minHeight: 400,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
        marginTop: 20,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 8,
    },
});
