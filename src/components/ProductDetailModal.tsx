import { useTheme } from '@/hooks/use-theme';
import { Product } from '@/types';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Heart, Minus, Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProductDetailModalProps {
    product: Product | null;
    visible: boolean;
    onClose: () => void;
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
    total: number;
}

export function ProductDetailModal({
    product,
    visible,
    onClose,
    quantity,
    onAdd,
    onRemove,
    total,
}: ProductDetailModalProps) {
    const colors = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const styles = getStyles(colors, insets);
    const [isFavorite, setIsFavorite] = useState(false);

    if (!product) return null;

    // Mock nutrition info as per design reference
    const nutritionInfo = [
        { label: 'calories', value: '143', unit: 'kcal' },
        { label: 'proteins', value: '6.5', unit: 'bits' }, // Using the design's "bits" or units
        { label: 'fats', value: '0.5', unit: 'bits' },
        { label: 'carbs', value: '29.9', unit: 'bits' },
    ];

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable style={styles.iconBtn} onPress={onClose}>
                        <X size={20} color={colors.textPrimary} />
                    </Pressable>
                    <Pressable style={styles.iconBtn} onPress={() => setIsFavorite(!isFavorite)}>
                        <Heart size={20} color={isFavorite ? colors.error : colors.textPrimary} fill={isFavorite ? colors.error : 'transparent'} />
                    </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: product.image }} style={styles.image} contentFit="contain" />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.name}>{product.nameAr}</Text>
                        <Text style={styles.nameEn}>{product.name}</Text>
                        <Text style={styles.weight}>in 100 grams</Text>

                        <View style={styles.nutritionGrid}>
                            {nutritionInfo.map((info) => (
                                <View key={info.label} style={styles.nutritionItem}>
                                    <Text style={styles.nutValue}>{info.value}</Text>
                                    <View style={styles.nutLabelWrap}>
                                        <Text style={styles.nutLabel}>{info.label}</Text>
                                        <Text style={styles.nutUnit}>{info.unit}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View style={styles.descriptionSection}>
                            <Text style={styles.description}>{product.description || "Fresh and high-quality product carefully selected for you."}</Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                    <View style={styles.qtyContainer}>
                        <Pressable style={styles.qtyBtn} onPress={onRemove}>
                            <Minus size={20} color={colors.textPrimary} />
                        </Pressable>
                        <Text style={styles.qtyText}>{quantity || 1} {product.unit}</Text>
                        <Pressable style={styles.qtyBtn} onPress={onAdd}>
                            <Plus size={20} color={colors.textPrimary} />
                        </Pressable>
                    </View>

                    <Pressable
                        style={styles.cartBtn}
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            onAdd();
                            onClose();
                            router.push('/cart');
                        }}
                    >
                        <Text style={styles.cartBtnText}>To cart</Text>
                        <Text style={styles.cartBtnPrice}>{product.price * (quantity || 1)} EGP</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const getStyles = (colors: any, insets: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        zIndex: 10,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 154,
    },
    imageContainer: {
        height: 300,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        paddingHorizontal: 24,
    },
    name: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    nameEn: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 4,
    },
    weight: {
        fontSize: 14,
        color: colors.textTertiary,
        textAlign: 'center',
        marginTop: 12,
    },
    nutritionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        backgroundColor: colors.background,
        borderRadius: 24,
        padding: 20,
    },
    nutritionItem: {
        alignItems: 'center',
    },
    nutValue: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    nutLabelWrap: {
        alignItems: 'center',
        marginTop: 4,
    },
    nutLabel: {
        fontSize: 10,
        color: colors.textSecondary,
        textTransform: 'lowercase',
    },
    nutUnit: {
        fontSize: 10,
        color: colors.textTertiary,
    },
    descriptionSection: {
        marginTop: 32,
    },
    description: {
        fontSize: 15,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        paddingHorizontal: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        gap: 16,
    },
    qtyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: 8,
    },
    qtyBtn: {
        width: 44,
        height: 44,
        borderRadius: 16,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    qtyText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    cartBtn: {
        backgroundColor: colors.textPrimary,
        borderRadius: 20,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    cartBtnText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
    cartBtnPrice: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '800',
    },
});
