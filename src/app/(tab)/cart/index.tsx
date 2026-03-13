import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/hooks/use-theme';
import { CartItem } from '@/types';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    Linking,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

export default function CartScreen() {
    const colors = useTheme();
    const { t } = useTranslation();
    const styles = getStyles(colors);
    const router = useRouter();
    const {
        items,
        currentStore,
        subtotal,
        deliveryFee,
        total,
        updateQuantity,
        updateItemNote,
        clearCart,
        placeOrder,
    } = useCart();

    const handlePlaceOrder = useCallback(() => {
        router.push('/checkout');
    }, [router]);

    const renderItem = useCallback(
        ({ item }: { item: CartItem }) => (
            <View style={styles.cartItemContainer}>
                <View style={styles.cartItem}>
                    <Image source={{ uri: item.product.image }} style={styles.itemImage} contentFit="cover" />
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.product.nameAr}</Text>
                        <Text style={styles.itemNameEn} numberOfLines={1}>{item.product.name}</Text>
                        <Text style={styles.itemPrice}>{item.product.price * item.quantity} EGP</Text>
                    </View>
                    <View style={styles.qtyControls}>
                        <Pressable
                            style={[styles.qtyBtn, item.quantity === 1 && styles.qtyBtnDanger]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                updateQuantity(item.product.id, item.quantity - 1);
                            }}
                        >
                            {item.quantity === 1 ? (
                                <Trash2 size={13} color={colors.error} />
                            ) : (
                                <Minus size={13} color={colors.primary} />
                            )}
                        </Pressable>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <Pressable
                            style={[styles.qtyBtn, styles.qtyBtnAdd]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                updateQuantity(item.product.id, item.quantity + 1);
                            }}
                        >
                            <Plus size={13} color={colors.white} />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.itemNoteSection}>
                    <TextInput
                        style={styles.itemNoteInput}
                        value={item.note || ''}
                        onChangeText={(text) => updateItemNote(item.product.id, text)}
                        placeholder={t('cart.itemNotePlaceholder')}
                        placeholderTextColor={colors.textTertiary}
                    />
                </View>
            </View>
        ),
        [updateQuantity, updateItemNote, t, colors]
    );

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconWrap}>
                    <ShoppingBag size={40} color={colors.textTertiary} />
                </View>
                <Text style={styles.emptyTitle}>{t('cart.emptyTitle')}</Text>
                <Text style={styles.emptySubtitle}>
                    {t('cart.emptySubtitle')}
                </Text>
                <Pressable
                    style={({ pressed }) => [styles.browseBtn, pressed && styles.browseBtnPressed]}
                    onPress={() => router.push('/')}
                >
                    <Text style={styles.browseBtnText}>{t('cart.browseStores')}</Text>
                </Pressable>

                <Pressable
                    style={styles.supportLink}
                    onPress={() => Linking.openURL('tel:12345678')}
                >
                    <Text style={styles.supportLinkText}>{t('common.contactSupport')}</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen
                options={{
                    headerTitle: t('tabs.cart'),
                    headerStyle: { backgroundColor: colors.surface },
                    headerShadowVisible: false,
                }}
            />
            {currentStore && (
                <View style={styles.storeBar}>
                    <View style={styles.storeBarLeft}>
                        <View style={styles.storeBarDot} />
                        <Text style={styles.storeBarName}>{currentStore.nameAr}</Text>
                    </View>
                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            clearCart();
                        }}
                    >
                        <Text style={styles.clearText}>{t('cart.clearAll')}</Text>
                    </Pressable>
                </View>
            )}

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.product.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
                    <Text style={styles.summaryValue}>{subtotal} EGP</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('cart.deliveryFee')}</Text>
                    <Text style={styles.summaryValue}>{deliveryFee} EGP</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>{t('cart.total')}</Text>
                    <Text style={styles.totalValue}>{total} EGP</Text>
                </View>

                <View style={styles.paymentNote}>
                    <Text style={styles.paymentNoteText}>{t('cart.paymentNote')}</Text>
                </View>

                <Pressable
                    style={({ pressed }) => [styles.checkoutBtn, pressed && styles.checkoutBtnPressed]}
                    onPress={handlePlaceOrder}
                    testID="place-order-btn"
                >
                    <Text style={styles.checkoutBtnText}>{t('cart.gotoCheckout')}</Text>
                    <ArrowRight size={18} color={colors.white} />
                </Pressable>
            </View>
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconWrap: {
        width: 100,
        height: 100,
        borderRadius: 32,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    browseBtn: {
        backgroundColor: colors.textPrimary,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 32,
    },
    browseBtnPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    browseBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    supportLink: {
        marginTop: 20,
        padding: 10,
    },
    supportLinkText: {
        fontSize: 14,
        color: colors.textTertiary,
        fontWeight: '600',
    },
    storeBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.surface,
    },
    storeBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    storeBarDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.success,
    },
    storeBarName: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    clearText: {
        fontSize: 13,
        color: colors.error,
        fontWeight: '700',
    },
    list: {
        padding: 20,
    },
    cartItemContainer: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    cartItem: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
    },
    itemImage: {
        width: 64,
        height: 64,
        borderRadius: 14,
        backgroundColor: colors.background,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    itemNameEn: {
        fontSize: 12,
        color: colors.textTertiary,
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.textPrimary,
        marginTop: 6,
    },
    qtyControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 4,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnDanger: {
        // Keeps clean background
    },
    qtyBtnAdd: {
        // Keeps clean background
    },
    qtyText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        minWidth: 24,
        textAlign: 'center',
    },
    itemNoteSection: {
        borderTopWidth: 1,
        borderTopColor: colors.background,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    itemNoteInput: {
        fontSize: 12,
        color: colors.textSecondary,
        padding: 0,
    },
    summary: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.background,
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '900',
        color: colors.textPrimary,
    },
    paymentNote: {
        backgroundColor: colors.successLight,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 20,
        alignSelf: 'stretch',
    },
    paymentNoteText: {
        fontSize: 12,
        color: colors.success,
        fontWeight: '700',
        textAlign: 'center',
    },
    checkoutBtn: {
        backgroundColor: colors.textPrimary,
        borderRadius: 20,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    checkoutBtnPressed: {
        opacity: 0.9,
    },
    checkoutBtnText: {
        color: colors.white,
        fontSize: 17,
        fontWeight: '700',
    },
});
