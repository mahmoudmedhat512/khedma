import { useTheme } from '@/hooks/use-theme';
import { Store } from '@/types';
import { Image } from 'expo-image';
import { Bike, Clock, MapPin, Star } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface StoreCardProps {
    store: Store;
    onPress: () => void;
    variant?: 'horizontal' | 'vertical';
}

function StoreCardComponent({ store, onPress, variant = 'vertical' }: StoreCardProps) {
    const colors = useTheme();
    const styles = getStyles(colors);
    const isPharmacy = store.category === 'pharmacy';
    const categoryColor = isPharmacy ? colors.pharmacy : colors.veggies;

    if (variant === 'horizontal') {
        return (
            <Pressable
                style={({ pressed }) => [styles.horizontalCard, pressed && styles.pressed]}
                onPress={onPress}
                testID={`store-card-${store.id}`}
            >
                <View style={styles.horizontalImageWrap}>
                    <Image source={{ uri: store.image }} style={styles.horizontalImage} contentFit="cover" />
                    {!store.isOpen && (
                        <View style={styles.closedBadgeH}>
                            <Text style={styles.closedBadgeText}>Closed</Text>
                        </View>
                    )}
                </View>
                <View style={styles.horizontalContent}>
                    <View style={styles.horizontalTop}>
                        <Text style={styles.storeName} numberOfLines={1}>{store.nameAr}</Text>
                        <View style={styles.ratingChip}>
                            <Star size={10} color={colors.rating} fill={colors.rating} />
                            <Text style={styles.ratingChipText}>{store.rating}</Text>
                        </View>
                    </View>
                    <Text style={styles.storeNameEn} numberOfLines={1}>{store.name}</Text>
                    <View style={styles.horizontalMeta}>
                        <View style={styles.metaItem}>
                            <Clock size={12} color={colors.textTertiary} />
                            <Text style={styles.metaText}>{store.deliveryTime}</Text>
                        </View>
                        <View style={styles.metaDot} />
                        <View style={styles.metaItem}>
                            <MapPin size={12} color={colors.textTertiary} />
                            <Text style={styles.metaText}>{store.distance} km</Text>
                        </View>
                    </View>
                    <View style={styles.horizontalBottom}>
                        <View style={styles.metaItem}>
                            <Bike size={12} color={categoryColor} />
                            <Text style={[styles.feeText, { color: categoryColor }]}>
                                {store.deliveryFee} EGP
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        );
    }

    return (
        <Pressable
            style={({ pressed }) => [styles.verticalCard, pressed && styles.pressed]}
            onPress={onPress}
            testID={`store-card-${store.id}`}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: store.image }} style={styles.verticalImage} contentFit="cover" />
                {!store.isOpen && (
                    <View style={styles.closedOverlay}>
                        <Text style={styles.closedOverlayText}>مغلق</Text>
                    </View>
                )}
                <View style={styles.timeBadge}>
                    <Clock size={10} color={colors.white} />
                    <Text style={styles.timeBadgeText}>{store.deliveryTime}</Text>
                </View>
            </View>
            <View style={styles.verticalContent}>
                <View style={styles.nameRow}>
                    <Text style={styles.storeName} numberOfLines={1}>{store.nameAr}</Text>
                </View>
                <Text style={styles.storeNameEn} numberOfLines={1}>{store.name}</Text>
                <View style={styles.verticalMeta}>
                    <Star size={11} color={colors.rating} fill={colors.rating} />
                    <Text style={styles.ratingText}>{store.rating}</Text>
                    <Text style={styles.reviewText}>({store.reviewCount})</Text>
                    <View style={styles.metaDot} />
                    <Text style={styles.distanceText}>{store.distance} km</Text>
                </View>
            </View>
        </Pressable>
    );
}

export const StoreCard = React.memo(StoreCardComponent);

const getStyles = (colors: any) => StyleSheet.create({
    verticalCard: {
        width: 190,
        backgroundColor: colors.surface,
        borderRadius: 24,
        overflow: 'visible' as const,
        marginRight: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 8,
    },
    horizontalCard: {
        flexDirection: 'row' as const,
        backgroundColor: colors.surface,
        borderRadius: 24,
        overflow: 'visible' as const,
        marginBottom: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    imageContainer: {
        position: 'relative' as const,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    verticalImage: {
        width: 190,
        height: 110,
    },
    horizontalImageWrap: {
        position: 'relative' as const,
    },
    horizontalImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
        margin: 12,
    },
    horizontalContent: {
        flex: 1,
        paddingVertical: 14,
        paddingRight: 16,
        justifyContent: 'center' as const,
    },
    horizontalTop: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
    },
    verticalContent: {
        padding: 12,
        paddingTop: 10,
    },
    nameRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
    },
    storeName: {
        fontSize: 15,
        fontWeight: '800' as const,
        color: colors.textPrimary,
        flex: 1,
    },
    storeNameEn: {
        fontSize: 11,
        color: colors.textTertiary,
        marginTop: 1,
        marginBottom: 6,
    },
    ratingChip: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: colors.rating + '15',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 3,
        gap: 3,
        marginLeft: 6,
    },
    ratingChipText: {
        fontSize: 12,
        fontWeight: '800' as const,
        color: colors.rating,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '800' as const,
        color: colors.textPrimary,
    },
    reviewText: {
        fontSize: 11,
        color: colors.textTertiary,
    },
    horizontalMeta: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        marginTop: 6,
        gap: 6,
    },
    verticalMeta: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
    },
    metaItem: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
    },
    metaDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: colors.borderLight,
        marginHorizontal: 3,
    },
    metaText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    distanceText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    feeText: {
        fontSize: 13,
        fontWeight: '700' as const,
    },
    horizontalBottom: {
        marginTop: 8,
    },
    timeBadge: {
        position: 'absolute' as const,
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    timeBadgeText: {
        fontSize: 11,
        color: colors.textPrimary,
        fontWeight: '700' as const,
    },
    closedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    closedOverlayText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '800' as const,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    closedBadgeH: {
        position: 'absolute' as const,
        top: 16,
        left: 16,
        backgroundColor: colors.error,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    closedBadgeText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '800' as const,
    },
});
