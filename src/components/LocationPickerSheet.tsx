import { useTheme } from '@/hooks/use-theme';
import { Address } from '@/types';
import { Check, MapPin, Navigation, Plus, X } from 'lucide-react-native';
import React from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LocationPickerSheetProps {
    isVisible: boolean;
    onClose: () => void;
    currentAddress: string | null;
    savedAddresses: Address[];
    selectedAddressId: string | null;
    onSelectAddress: (address: Address | 'current') => void;
    onAddAddress: () => void;
    isDetecting: boolean;
}

export function LocationPickerSheet({
    isVisible,
    onClose,
    currentAddress,
    savedAddresses,
    selectedAddressId,
    onSelectAddress,
    onAddAddress,
    isDetecting,
}: LocationPickerSheetProps) {
    const colors = useTheme();
    const styles = getStyles(colors);
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.dismissArea} onPress={onClose} />
                <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Delivery Address</Text>
                        <Pressable onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color={colors.textSecondary} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.section}>
                            <Pressable
                                style={styles.currentLocationBtn}
                                onPress={() => onSelectAddress('current')}
                            >
                                <View style={styles.currentLocationIcon}>
                                    <Navigation size={18} color={colors.primary} />
                                </View>
                                <View style={styles.currentLocationInfo}>
                                    <Text style={styles.optionLabel}>Current Location</Text>
                                    <Text style={styles.optionSub} numberOfLines={1}>
                                        {isDetecting ? 'Detecting...' : (currentAddress || 'Enable location for better accuracy')}
                                    </Text>
                                </View>
                                {!selectedAddressId && <Check size={18} color={colors.primary} />}
                            </Pressable>
                        </View>

                        <Text style={styles.sectionTitle}>Saved Addresses</Text>
                        <View style={styles.section}>
                            {savedAddresses.map((addr) => (
                                <Pressable
                                    key={addr.id}
                                    style={styles.addressOption}
                                    onPress={() => onSelectAddress(addr)}
                                >
                                    <View style={styles.addressIcon}>
                                        <MapPin size={18} color={colors.textSecondary} />
                                    </View>
                                    <View style={styles.addressInfo}>
                                        <Text style={styles.optionLabel}>{addr.label}</Text>
                                        <Text style={styles.optionSub} numberOfLines={1}>{addr.address}</Text>
                                    </View>
                                    {selectedAddressId === addr.id && <Check size={18} color={colors.primary} />}
                                </Pressable>
                            ))}

                            <Pressable style={styles.addBtn} onPress={onAddAddress}>
                                <Plus size={18} color={colors.primary} />
                                <Text style={styles.addBtnText}>Add New Address</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    closeBtn: {
        padding: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textTertiary,
        marginHorizontal: 20,
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    currentLocationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.borderLight,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    currentLocationIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    currentLocationInfo: {
        flex: 1,
    },
    addressOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    addressIcon: {
        marginRight: 14,
    },
    addressInfo: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    optionSub: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        marginTop: 4,
    },
    addBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginLeft: 10,
    },
});
