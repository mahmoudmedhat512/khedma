import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/hooks/use-theme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ArrowRight, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function CartFloatingBarComponent() {
    const colors = useTheme();
    const styles = getStyles(colors);
    const { itemCount, total, currentStore } = useCart();
    const router = useRouter();

    if (itemCount === 0) return null;

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/cart');
    };

    return (
        <Pressable
            style={({ pressed }) => [styles.container, pressed && styles.pressed]}
            onPress={handlePress}
            testID="cart-floating-bar"
        >
            <View style={styles.left}>
                <View style={styles.badge}>
                    <ShoppingBag size={14} color={colors.white} />
                    <View style={styles.countBubble}>
                        <Text style={styles.countText}>{itemCount}</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.label}>View Cart</Text>
                    {currentStore && (
                        <Text style={styles.storeName} numberOfLines={1}>{currentStore.nameAr}</Text>
                    )}
                </View>
            </View>
            <View style={styles.right}>
                <Text style={styles.total}>{total} EGP</Text>
                <ArrowRight size={16} color={colors.white} />
            </View>
        </Pressable>
    );
}

export const CartFloatingBar = React.memo(CartFloatingBarComponent);

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        position: 'absolute' as const,
        bottom: 90,
        left: 16,
        right: 16,
        backgroundColor: colors.textPrimary,
        borderRadius: 20,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        paddingVertical: 14,
        paddingHorizontal: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    pressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.95,
    },
    left: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 12,
        flex: 1,
    },
    badge: {
        position: 'relative' as const,
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    countBubble: {
        position: 'absolute' as const,
        top: -4,
        right: -4,
        backgroundColor: colors.white,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    countText: {
        color: colors.textPrimary,
        fontSize: 10,
        fontWeight: '900' as const,
    },
    label: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '700' as const,
    },
    storeName: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        marginTop: 1,
    },
    right: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    total: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '800' as const,
    },
});
