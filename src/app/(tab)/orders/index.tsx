import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/hooks/use-theme';
import { Order, OrderStatus } from '@/types';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronRight, Clock, Package, RotateCcw } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: '#D97706', bg: '#FFFBEB' },
    accepted: { label: 'Accepted', color: '#2563EB', bg: '#EFF4FF' },
    preparing: { label: 'Preparing', color: '#7C3AED', bg: '#F3E8FF' },
    picked_up: { label: 'Picked Up', color: '#E8590C', bg: '#FFF4ED' },
    on_the_way: { label: 'On the Way', color: '#059669', bg: '#ECFDF5' },
    delivered: { label: 'Delivered', color: '#16A34A', bg: '#F0FDF4' },
    cancelled: { label: 'Cancelled', color: '#DC2626', bg: '#FEF2F2' },
};

export default function OrdersScreen() {
    const colors = useTheme();
    const styles = getStyles(colors);
    const { orders, reorder } = useCart();
    const router = useRouter();
    const { t } = useTranslation();

    const formatDate = useCallback((dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    const renderOrder = useCallback(
        ({ item }: { item: Order }) => {
            const statusConfig = STATUS_CONFIG[item.status];
            const isActive = !['delivered', 'cancelled'].includes(item.status);

            return (
                <Pressable
                    style={({ pressed }) => [styles.orderCard, pressed && styles.orderCardPressed]}
                    onPress={() => {
                        if (isActive) {
                            router.push(`/tracking/${item.id}`);
                        }
                    }}
                    testID={`order-${item.id}`}
                >
                    <View style={styles.orderTop}>
                        <View style={styles.orderStore}>
                            <Image
                                source={{ uri: item.store.image }}
                                style={styles.storeImage}
                                contentFit="cover"
                            />
                            <View style={styles.orderStoreInfo}>
                                <Text style={styles.orderStoreName} numberOfLines={1}>{item.store.nameAr}</Text>
                                <Text style={styles.orderStoreNameEn} numberOfLines={1}>{item.store.name}</Text>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                            <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
                            <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                {statusConfig.label}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.orderMid}>
                        <View style={styles.orderMeta}>
                            <Text style={styles.orderId}>#{item.id}</Text>
                            <View style={styles.dateRow}>
                                <Clock size={11} color={colors.textTertiary} />
                                <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
                            </View>
                        </View>
                        <View style={styles.orderItemsList}>
                            <Text style={styles.orderItemsText} numberOfLines={1}>
                                {item.items.map((i) => `${i.quantity}x ${i.product.nameAr}`).join(' · ')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.orderBottom}>
                        <Text style={styles.orderTotal}>{item.total} EGP</Text>
                        {isActive ? (
                            <Pressable style={styles.trackBtn} onPress={() => router.push(`/tracking/${item.id}`)}>
                                <Text style={styles.trackBtnText}>Track</Text>
                                <ChevronRight size={14} color={colors.primary} />
                            </Pressable>
                        ) : item.status === 'delivered' ? (
                            <View style={{ flexDirection: 'row' }}>
                                <Pressable
                                    style={styles.reorderBtn}
                                    onPress={() => {
                                        Alert.alert(
                                            t('checkout.reorderConfirmTitle'),
                                            t('checkout.reorderConfirmMessage'),
                                            [
                                                { text: t('common.cancel'), style: 'cancel' },
                                                {
                                                    text: t('checkout.reorder'),
                                                    onPress: () => {
                                                        reorder(item);
                                                        router.push('/cart');
                                                    }
                                                }
                                            ]
                                        );
                                    }}
                                >
                                    <RotateCcw size={12} color={colors.primary} />
                                    <Text style={styles.reorderBtnText}>Re-order</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.reorderBtn, { backgroundColor: colors.borderLight, marginLeft: 8 }]}
                                    onPress={() => {
                                        Alert.alert(
                                            t('common.reportIssue'),
                                            "Our team will call you within 15 minutes to solve this.",
                                            [{ text: "OK" }]
                                        );
                                    }}
                                >
                                    <Text style={[styles.reorderBtnText, { color: colors.textSecondary }]}>{t('common.reportIssue')}</Text>
                                </Pressable>
                            </View>
                        ) : null}
                    </View>
                </Pressable>
            );
        },
        [formatDate, router]
    );

    if (orders.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                    <Package size={40} color={colors.textTertiary} />
                </View>
                <Text style={styles.emptyTitle}>No orders yet</Text>
                <Text style={styles.emptySubtitle}>Your order history will appear here</Text>

                <Pressable
                    style={styles.supportBtn}
                    onPress={() => Linking.openURL('tel:12345678')}
                >
                    <Text style={styles.supportBtnText}>{t('common.contactSupport')}</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderOrder}
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
    emptyContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        width: 88,
        height: 88,
        borderRadius: 24,
        backgroundColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    supportBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.borderLight,
        backgroundColor: colors.surface,
    },
    supportBtnText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    list: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    orderCardPressed: {
        opacity: 0.95,
        transform: [{ scale: 0.99 }],
    },
    orderTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderStore: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    storeImage: {
        width: 38,
        height: 38,
        borderRadius: 10,
    },
    orderStoreInfo: {
        flex: 1,
    },
    orderStoreName: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    orderStoreNameEn: {
        fontSize: 10,
        color: colors.textTertiary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 4,
        marginLeft: 8,
    },
    statusDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    orderMid: {
        marginBottom: 10,
    },
    orderMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    orderId: {
        fontSize: 11,
        color: colors.textTertiary,
        fontWeight: '500',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    orderDate: {
        fontSize: 11,
        color: colors.textTertiary,
    },
    orderItemsList: {
        backgroundColor: colors.background,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    orderItemsText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    orderBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderTotal: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    trackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    trackBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary,
    },
    reorderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primaryLight,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 4,
    },
    reorderBtnText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary,
    },
});
