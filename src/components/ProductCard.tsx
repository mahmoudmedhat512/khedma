import { useTheme } from '@/hooks/use-theme';
import { Product } from '@/types';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Minus, Plus } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ProductCardProps {
    product: Product;
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
    onPress?: () => void;
}

function ProductCardComponent({ product, quantity, onAdd, onRemove, onPress }: ProductCardProps) {
    const colors = useTheme();
    const styles = getStyles(colors);
    const handleAdd = () => {
        if (!product.inStock) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onAdd();
    };

    const handleRemove = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onRemove();
    };

    return (
        <Pressable
            style={[styles.card, !product.inStock && styles.outOfStock]}
            testID={`product-${product.id}`}
            onPress={onPress}
        >
            <View style={styles.imageWrap}>
                <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
                {!product.inStock && (
                    <View style={styles.outOfStockOverlay}>
                        <Text style={styles.outOfStockText}>Sold out</Text>
                    </View>
                )}
            </View>
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>{product.nameAr}</Text>
                <Text style={styles.nameEn} numberOfLines={1}>{product.name}</Text>
                {product.description ? (
                    <Text style={styles.description} numberOfLines={1}>{product.description}</Text>
                ) : null}
                <View style={styles.footer}>
                    <View style={styles.priceWrap}>
                        <Text style={styles.price}>{product.price}</Text>
                        <Text style={styles.currency}> EGP</Text>
                        <Text style={styles.unit}> / {product.unit}</Text>
                    </View>
                    {product.inStock && (
                        <View style={styles.quantityControl}>
                            {quantity > 0 ? (
                                <>
                                    <Pressable style={styles.qtyBtn} onPress={handleRemove}>
                                        <Minus size={13} color={colors.textPrimary} />
                                    </Pressable>
                                    <Text style={styles.qtyText}>{quantity}</Text>
                                </>
                            ) : null}
                            <Pressable
                                style={[styles.addBtn, quantity > 0 && styles.addBtnSmall]}
                                onPress={handleAdd}
                            >
                                <Plus size={15} color={colors.white} />
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
}

export const ProductCard = React.memo(ProductCardComponent);

const getStyles = (colors: any) => StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        overflow: 'visible' as const, // Allow image to "float" a bit if needed, or just stay clean
        padding: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 8,
    },
    outOfStock: {
        opacity: 0.6,
    },
    imageWrap: {
        width: '100%',
        height: 110,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginBottom: 8,
    },
    image: {
        width: '90%',
        height: '90%',
    },
    outOfStockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        borderRadius: 16,
    },
    outOfStockText: {
        color: colors.textSecondary,
        fontSize: 10,
        fontWeight: '800' as const,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    content: {
        marginTop: 4,
    },
    name: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.textPrimary,
    },
    nameEn: {
        fontSize: 11,
        color: colors.textTertiary,
        marginTop: 1,
    },
    description: {
        fontSize: 10,
        color: colors.textTertiary,
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginTop: 10,
    },
    priceWrap: {
        flex: 1,
    },
    price: {
        fontSize: 16,
        fontWeight: '800' as const,
        color: colors.textPrimary,
    },
    currency: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.textPrimary,
    },
    unit: {
        fontSize: 10,
        color: colors.textTertiary,
        marginTop: 2,
    },
    quantityControl: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 2,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 10,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    qtyText: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.textPrimary,
        paddingHorizontal: 8,
        textAlign: 'center' as const,
    },
    addBtn: {
        width: 32,
        height: 32,
        borderRadius: 11,
        backgroundColor: colors.textPrimary,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    addBtnSmall: {
        width: 28,
        height: 28,
        borderRadius: 10,
    },
});
