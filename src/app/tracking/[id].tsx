import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/hooks/use-theme';
import { OrderStatus } from '@/types';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
    CheckCircle,
    ChefHat,
    Clock,
    MapPin,
    MessageCircle,
    Navigation,
    Package,
    Phone,
    Truck,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import {
    Animated,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const STEPS: { key: OrderStatus; label: string; labelAr: string; icon: React.ComponentType<any> }[] = [
    { key: 'pending', label: 'Order Placed', labelAr: 'تم الطلب', icon: Clock },
    { key: 'accepted', label: 'Accepted', labelAr: 'تم القبول', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', labelAr: 'جاري التحضير', icon: ChefHat },
    { key: 'picked_up', label: 'Picked Up', labelAr: 'تم الاستلام', icon: Package },
    { key: 'on_the_way', label: 'On the Way', labelAr: 'في الطريق', icon: Truck },
    { key: 'delivered', label: 'Delivered', labelAr: 'تم التوصيل', icon: MapPin },
];

const STATUS_ORDER: OrderStatus[] = [
    'pending',
    'accepted',
    'preparing',
    'picked_up',
    'on_the_way',
    'delivered',
];

export default function TrackingScreen() {
    const colors = useTheme();
    const styles = getStyles(colors);
    const { id } = useLocalSearchParams<{ id: string }>();
    const { orders } = useCart();
    const router = useRouter();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const order = useMemo(() => orders.find((o) => o.id === id), [orders, id]);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.12,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [pulseAnim]);

    if (!order) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ title: 'Order not found' }} />
                <Text style={styles.errorText}>Order not found</Text>
                <Pressable style={styles.goBackBtn} onPress={() => router.back()}>
                    <Text style={styles.goBackText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    const currentIdx = STATUS_ORDER.indexOf(order.status);
    const isDelivered = order.status === 'delivered';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Stack.Screen
                options={{
                    title: `Order #${order.id}`,
                    headerStyle: { backgroundColor: colors.surface },
                    headerShadowVisible: false,
                }}
            />

            <View style={styles.storeSection}>
                <Image source={{ uri: order.store.image }} style={styles.storeImage} contentFit="cover" />
                <View style={styles.storeInfo}>
                    <Text style={styles.storeName}>{order.store.nameAr}</Text>
                    <Text style={styles.storeNameEn}>{order.store.name}</Text>
                </View>
            </View>

            {!isDelivered && (
                <View style={styles.etaCard}>
                    <Animated.View style={[styles.etaIconWrap, { transform: [{ scale: pulseAnim }] }]}>
                        <Truck size={22} color={colors.primary} />
                    </Animated.View>
                    <View style={styles.etaInfo}>
                        <Text style={styles.etaLabel}>Estimated Delivery</Text>
                        <Text style={styles.etaTime}>
                            {new Date(order.estimatedDelivery).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                </View>
            )}

            {isDelivered && (
                <View style={styles.deliveredCard}>
                    <CheckCircle size={20} color={colors.success} />
                    <Text style={styles.deliveredText}>Order delivered successfully!</Text>
                </View>
            )}

            <View style={styles.stepsCard}>
                <Text style={styles.stepsTitle}>Order Progress</Text>
                {STEPS.map((step, index) => {
                    const isCompleted = index <= currentIdx;
                    const isCurrent = index === currentIdx;
                    const StepIcon = step.icon;

                    return (
                        <View key={step.key} style={styles.stepRow}>
                            <View style={styles.stepIndicator}>
                                <View
                                    style={[
                                        styles.stepDot,
                                        isCompleted && styles.stepDotCompleted,
                                        isCurrent && styles.stepDotCurrent,
                                    ]}
                                >
                                    <StepIcon
                                        size={13}
                                        color={isCompleted ? colors.white : colors.textTertiary}
                                    />
                                </View>
                                {index < STEPS.length - 1 && (
                                    <View
                                        style={[
                                            styles.stepLine,
                                            isCompleted && index < currentIdx && styles.stepLineCompleted,
                                        ]}
                                    />
                                )}
                            </View>
                            <View style={styles.stepContent}>
                                <Text
                                    style={[
                                        styles.stepLabel,
                                        isCompleted && styles.stepLabelCompleted,
                                        isCurrent && styles.stepLabelCurrent,
                                    ]}
                                >
                                    {step.label}
                                </Text>
                                <Text style={styles.stepLabelAr}>{step.labelAr}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            {order.driverName && !isDelivered && (
                <View style={styles.driverCard}>
                    <View style={styles.driverLeft}>
                        <View style={styles.driverAvatar}>
                            <Text style={styles.driverAvatarText}>{order.driverName.charAt(0)}</Text>
                        </View>
                        <View>
                            <Text style={styles.driverName}>{order.driverName}</Text>
                            <Text style={styles.driverLabel}>Your Driver</Text>
                        </View>
                    </View>
                    <View style={styles.driverActions}>
                        <Pressable
                            style={styles.driverBtn}
                            onPress={() => {
                                if (order.driverPhone) {
                                    Linking.openURL(`tel:${order.driverPhone}`);
                                }
                            }}
                        >
                            <Phone size={16} color={colors.primary} />
                        </Pressable>
                        <Pressable style={styles.driverBtn}>
                            <MessageCircle size={16} color={colors.primary} />
                        </Pressable>
                    </View>
                </View>
            )}

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                {order.items.map((item) => (
                    <View key={item.product.id} style={styles.summaryItem}>
                        <Text style={styles.summaryQty}>{item.quantity}x</Text>
                        <Text style={styles.summaryName} numberOfLines={1}>{item.product.nameAr}</Text>
                        <Text style={styles.summaryPrice}>{item.product.price * item.quantity} EGP</Text>
                    </View>
                ))}

                {order.note ? (
                    <View style={styles.noteBox}>
                        <View style={styles.noteHeader}>
                            <Navigation size={12} color={colors.textSecondary} />
                            <Text style={styles.noteTitle}>Order Notes</Text>
                        </View>
                        <Text style={styles.noteText}>{order.note}</Text>
                    </View>
                ) : null}

                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>{order.total} EGP</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery fee</Text>
                    <Text style={styles.summaryValue}>{order.deliveryFee} EGP</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{order.total + order.deliveryFee} EGP</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    errorText: {
        fontSize: 15,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    goBackBtn: {
        backgroundColor: colors.textPrimary,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 28,
    },
    goBackText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: 14,
    },
    storeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        gap: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    storeImage: {
        width: 48,
        height: 48,
        borderRadius: 12,
    },
    storeInfo: {
        flex: 1,
    },
    storeName: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    storeNameEn: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    etaCard: {
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 16,
    },
    etaIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    etaInfo: {},
    etaLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    etaTime: {
        fontSize: 26,
        fontWeight: '900',
        color: colors.textPrimary,
        marginTop: 2,
    },
    deliveredCard: {
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    deliveredText: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    stepsCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    stepsTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 16,
    },
    stepRow: {
        flexDirection: 'row',
        minHeight: 50,
    },
    stepIndicator: {
        alignItems: 'center',
        width: 36,
    },
    stepDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepDotCompleted: {
        backgroundColor: colors.textPrimary,
    },
    stepDotCurrent: {
        backgroundColor: colors.textPrimary,
        borderWidth: 4,
        borderColor: colors.background,
    },
    stepLine: {
        width: 2,
        flex: 1,
        backgroundColor: colors.background,
        marginVertical: 4,
    },
    stepLineCompleted: {
        backgroundColor: colors.textPrimary,
    },
    stepContent: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'center',
        minHeight: 32,
    },
    stepLabel: {
        fontSize: 14,
        color: colors.textTertiary,
        fontWeight: '600',
    },
    stepLabelCompleted: {
        color: colors.textPrimary,
        fontWeight: '700',
    },
    stepLabelCurrent: {
        color: colors.textPrimary,
        fontWeight: '800',
    },
    stepLabelAr: {
        fontSize: 11,
        color: colors.textTertiary,
        marginTop: 1,
    },
    driverCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    driverLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    driverAvatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    driverAvatarText: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '800',
    },
    driverName: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    driverLabel: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    driverActions: {
        flexDirection: 'row',
        gap: 10,
    },
    driverBtn: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    summaryTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 14,
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryQty: {
        fontSize: 13,
        fontWeight: '800',
        color: colors.textPrimary,
        width: 32,
    },
    summaryName: {
        fontSize: 13,
        color: colors.textPrimary,
        flex: 1,
    },
    summaryPrice: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: colors.background,
        marginVertical: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    summaryLabel: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    summaryValue: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    totalValue: {
        fontSize: 17,
        fontWeight: '900',
        color: colors.textPrimary,
    },
    noteBox: {
        marginTop: 14,
        padding: 12,
        backgroundColor: colors.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderLight,
        borderStyle: 'dashed',
    },
    noteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    noteTitle: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    noteText: {
        fontSize: 13,
        color: colors.textPrimary,
        fontStyle: 'italic',
    },
});
