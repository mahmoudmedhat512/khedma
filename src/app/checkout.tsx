import { useCart } from '@/contexts/CartContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useTheme } from '@/hooks/use-theme';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { ArrowRight, Check, FileText, MapPin, Package, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
    const colors = useTheme();
    const styles = getStyles(colors);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { t } = useTranslation();

    const { currentStore, subtotal, deliveryFee, total, items, placeOrder } = useCart();
    const { addresses } = useProfile();

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        addresses.find((a: any) => a.isDefault)?.id || (addresses.length > 0 ? addresses[0].id : null)
    );
    const [note, setNote] = useState('');

    const handleConfirmOrder = () => {
        if (!selectedAddressId) {
            Alert.alert(t('checkout.addressRequired'), t('checkout.addressRequiredDesc'));
            return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Pass the note and addressId
        const order = placeOrder({ note, addressId: selectedAddressId });

        if (order) {
            Alert.alert(
                t('checkout.orderPlaced'),
                t('checkout.orderPlacedDesc', { id: order.id }),
                [
                    {
                        text: t('checkout.trackOrder'),
                        onPress: () => {
                            router.replace('/');
                            router.push(`/tracking/${order.id}`);
                        },
                    },
                    {
                        text: 'OK',
                        onPress: () => router.replace('/')
                    },
                ]
            );
        }
    };

    if (items.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ title: t('checkout.title') }} />
                <Text style={styles.errorText}>{t('checkout.empty')}</Text>
                <Pressable style={styles.goBackBtn} onPress={() => router.back()}>
                    <Text style={styles.goBackText}>{t('checkout.goBack')}</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: t('checkout.title'),
                    headerStyle: { backgroundColor: colors.surface },
                    headerTintColor: colors.textPrimary,
                    headerShadowVisible: false,
                }}
            />

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('checkout.deliveryAddress')}</Text>
                    {addresses.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyBoxText}>{t('checkout.noAddresses')}</Text>
                            <Pressable
                                style={styles.addAddressInline}
                                onPress={() => router.push('/profile')}
                            >
                                <Plus size={16} color={colors.primary} />
                                <Text style={styles.addAddressInlineText}>{t('profile.addAddress')}</Text>
                            </Pressable>
                        </View>
                    ) : (
                        addresses.map((address: any) => (
                            <Pressable
                                key={address.id}
                                style={[
                                    styles.addressCard,
                                    selectedAddressId === address.id && styles.addressCardSelected
                                ]}
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    setSelectedAddressId(address.id);
                                }}
                            >
                                <View style={styles.addressLeft}>
                                    <View style={[
                                        styles.radioBtn,
                                        selectedAddressId === address.id && styles.radioBtnSelected
                                    ]}>
                                        {selectedAddressId === address.id && <Check size={12} color={colors.white} />}
                                    </View>
                                    <View style={styles.addressInfo}>
                                        <Text style={styles.addressLabel}>{address.label}</Text>
                                        <Text style={styles.addressText}>{address.address}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('checkout.orderInfo')}</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Package size={18} color={colors.textTertiary} />
                            <Text style={styles.infoText}>{t('checkout.from')}: {currentStore?.nameAr} ({currentStore?.name})</Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoRow}>
                            <MapPin size={18} color={colors.textTertiary} />
                            <Text style={styles.infoText}>{t('checkout.time')}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('checkout.addNote')}</Text>
                    <View style={styles.inputContainer}>
                        <FileText size={18} color={colors.textTertiary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('checkout.notePlaceholder')}
                            placeholderTextColor={colors.textTertiary}
                            value={note}
                            onChangeText={setNote}
                            multiline
                            maxLength={150}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('checkout.paymentMethod')}</Text>
                    <View style={[styles.addressCard, styles.addressCardSelected]}>
                        <View style={styles.addressLeft}>
                            <View style={[styles.radioBtn, styles.radioBtnSelected]}>
                                <Check size={12} color={colors.white} />
                            </View>
                            <View style={styles.addressInfo}>
                                <Text style={styles.addressLabel}>{t('checkout.cod')}</Text>
                                <Text style={styles.addressText}>{t('checkout.codDesc')}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>{t('checkout.summary')}</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
                        <Text style={styles.summaryValue}>{subtotal} EGP</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('cart.deliveryFee')}</Text>
                        <Text style={styles.summaryValue}>{deliveryFee} EGP</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>{t('cart.total')}</Text>
                        <Text style={styles.totalValue}>{total} EGP</Text>
                    </View>
                </View>

            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <View style={styles.bottomBarContent}>
                    <View style={styles.totalWrap}>
                        <Text style={styles.bottomTotalLabel}>{t('checkout.totalAmount')}</Text>
                        <Text style={styles.bottomTotalValue}>{total} EGP</Text>
                    </View>
                    <Pressable
                        style={({ pressed }) => [
                            styles.confirmBtn,
                            (!selectedAddressId || addresses.length === 0) && styles.confirmBtnDisabled,
                            pressed && styles.confirmBtnPressed
                        ]}
                        onPress={handleConfirmOrder}
                        disabled={!selectedAddressId || addresses.length === 0}
                    >
                        <Text style={styles.confirmBtnText}>{t('checkout.confirmOrder')}</Text>
                        <ArrowRight size={18} color={colors.white} />
                    </Pressable>
                </View>
            </View>
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
        marginBottom: 16,
    },
    goBackBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    goBackText: {
        color: colors.white,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    addressCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    addressCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
    addressLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioBtn: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    radioBtnSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    addressInfo: {
        flex: 1,
    },
    addressLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    addressText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    emptyBox: {
        padding: 16,
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderLight,
        alignItems: 'center',
    },
    emptyBoxText: {
        color: colors.textSecondary,
        fontSize: 13,
        marginBottom: 12,
    },
    addAddressInline: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: colors.primaryLight,
    },
    addAddressInlineText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    infoDivider: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginVertical: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderLight,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    inputIcon: {
        marginTop: 2,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: colors.textPrimary,
        minHeight: 40,
        textAlignVertical: 'top',
    },
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.borderLight,
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 12,
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
        fontWeight: '600',
        color: colors.textPrimary,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    totalValue: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.primary,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        paddingHorizontal: 16,
        paddingTop: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 8,
    },
    bottomBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalWrap: {
        flex: 1,
    },
    bottomTotalLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    bottomTotalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.textPrimary,
        marginTop: 2,
    },
    confirmBtn: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minWidth: 180,
    },
    confirmBtnDisabled: {
        backgroundColor: colors.textTertiary,
    },
    confirmBtnPressed: {
        backgroundColor: colors.primaryDark,
        transform: [{ scale: 0.98 }],
    },
    confirmBtnText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '700',
    },
});
