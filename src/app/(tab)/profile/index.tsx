import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useTheme } from '@/hooks/use-theme';
import { Address } from '@/types';
import { useRouter } from 'expo-router';
import {
    Bell,
    Check,
    ChevronDown,
    ChevronRight,
    Edit3,
    FileText,
    Globe,
    Headphones,
    Heart,
    LogOut,
    MapPin,
    MessageCircle,
    Moon,
    Navigation,
    Phone,
    Plus,
    Shield,
    Star,
    Trash2,
    User,
    X,
} from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Linking,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';

type ModalType = 'none' | 'editProfile' | 'addresses' | 'addAddress' | 'editAddress' | 'notifications' | 'favorites' | 'help' | 'contact' | 'terms' | 'theme';

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    danger?: boolean;
    badge?: number;
}

function MenuItem({ icon, label, subtitle, onPress, showChevron = true, danger = false, badge }: MenuItemProps) {
    const colors = useTheme();
    const styles = getStyles(colors);
    return (
        <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={onPress}
            testID={`menu-${label.toLowerCase().replace(/\s/g, '-')}`}
        >
            <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
                {icon}
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
                {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
            </View>
            {badge && badge > 0 ? (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                </View>
            ) : null}
            {showChevron && <ChevronRight size={16} color={colors.textTertiary} />}
        </Pressable>
    );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
    const colors = useTheme();
    const styles = getStyles(colors);
    return (
        <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable onPress={onClose} style={styles.modalClose} hitSlop={12}>
                <X size={20} color={colors.textSecondary} />
            </Pressable>
        </View>
    );
}

export default function ProfileScreen() {
    const colors = useTheme();
    const styles = getStyles(colors);
    const router = useRouter();
    const { isGuest, phone, name, logout, updateName, isReady } = useAuth();
    const { language, changeLanguage } = useLanguage();
    const { mode, setMode } = useThemeContext();
    const { address: detectedAddress, isLoading: isDetecting, requestLocation } = useLocation();
    const {
        addresses,
        addAddress,
        updateAddress,
        removeAddress,
        favoriteStores,
        toggleFavorite,
        notificationPrefs,
        updateNotificationPref,
    } = useProfile();

    const [activeModal, setActiveModal] = useState<ModalType>('none');
    const [editName, setEditName] = useState<string>('');
    const [newAddressLabel, setNewAddressLabel] = useState<string>('');
    const [newAddressText, setNewAddressText] = useState<string>('');
    const [newAddressDefault, setNewAddressDefault] = useState<boolean>(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const openModal = useCallback((type: ModalType) => {
        if (type === 'editProfile') {
            setEditName(name || '');
        }
        setActiveModal(type);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [name, fadeAnim]);

    const closeModal = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setActiveModal('none');
            setEditingAddress(null);
            setNewAddressLabel('');
            setNewAddressText('');
            setNewAddressDefault(false);
        });
    }, [fadeAnim]);

    const handleSaveProfile = useCallback(() => {
        if (editName.trim()) {
            updateName(editName.trim());
        }
        closeModal();
    }, [editName, updateName, closeModal]);

    const handleAddAddress = useCallback(() => {
        if (!newAddressLabel.trim() || !newAddressText.trim()) {
            Alert.alert('Missing Info', 'Please fill in both label and address.');
            return;
        }
        addAddress({
            label: newAddressLabel.trim(),
            address: newAddressText.trim(),
            isDefault: newAddressDefault || addresses.length === 0,
        });
        setNewAddressLabel('');
        setNewAddressText('');
        setNewAddressDefault(false);
        setActiveModal('addresses');
    }, [newAddressLabel, newAddressText, newAddressDefault, addAddress, addresses.length]);

    const handleUpdateAddress = useCallback(() => {
        if (!editingAddress) return;
        if (!newAddressLabel.trim() || !newAddressText.trim()) {
            Alert.alert('Missing Info', 'Please fill in both label and address.');
            return;
        }
        updateAddress(editingAddress.id, {
            label: newAddressLabel.trim(),
            address: newAddressText.trim(),
            isDefault: newAddressDefault,
        });
        setEditingAddress(null);
        setNewAddressLabel('');
        setNewAddressText('');
        setNewAddressDefault(false);
        setActiveModal('addresses');
    }, [editingAddress, newAddressLabel, newAddressText, newAddressDefault, updateAddress]);

    const handleDeleteAddress = useCallback((id: string) => {
        Alert.alert('Delete Address', 'Are you sure you want to remove this address?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => removeAddress(id) },
        ]);
    }, [removeAddress]);

    const handleLogout = useCallback(() => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => {
                        console.log('[Profile] User logged out');
                        logout();
                    },
                },
            ]
        );
    }, [logout]);

    const handleContactCall = useCallback(() => {
        const phoneNumber = 'tel:+201234567890';
        if (Platform.OS === 'web') {
            window.open(phoneNumber);
        } else {
            Linking.openURL(phoneNumber).catch(() => {
                Alert.alert('Error', 'Could not open phone dialer.');
            });
        }
    }, []);

    const handleContactChat = useCallback(() => {
        Alert.alert('Support Chat', 'Our support team will respond within 15 minutes. How can we help you?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Start Chat', onPress: () => console.log('[Profile] Support chat started') },
        ]);
    }, []);

    const displayName = name || (isGuest ? 'Guest User' : 'User');
    const displayPhone = phone ? `+20 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}` : '+20 XXX XXX XXXX';

    const renderEditProfileModal = () => (
        <Modal visible={activeModal === 'editProfile'} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
                <ModalHeader title="Edit Profile" onClose={closeModal} />
                <View style={styles.modalBody}>
                    <View style={styles.editAvatarSection}>
                        <View style={styles.editAvatar}>
                            <User size={36} color={colors.white} />
                        </View>
                    </View>

                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={editName}
                        onChangeText={setEditName}
                        placeholder="Enter your name"
                        placeholderTextColor={colors.textTertiary}
                        autoFocus
                        testID="edit-name-input"
                    />

                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <View style={styles.disabledInput}>
                        <Text style={styles.disabledInputText}>{displayPhone}</Text>
                    </View>
                    <Text style={styles.inputHint}>Phone number cannot be changed</Text>

                    <Pressable
                        style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
                        onPress={handleSaveProfile}
                        testID="save-profile-btn"
                    >
                        <Check size={18} color={colors.white} />
                        <Text style={styles.saveBtnText}>Save Changes</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );

    const renderAddressesModal = () => (
        <Modal visible={activeModal === 'addresses'} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
                <ModalHeader title="My Addresses" onClose={closeModal} />
                <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalScrollContent}>
                    {addresses.length === 0 ? (
                        <View style={styles.emptyState}>
                            <MapPin size={40} color={colors.textTertiary} />
                            <Text style={styles.emptyTitle}>No addresses yet</Text>
                            <Text style={styles.emptySubtitle}>Add your first delivery address</Text>
                        </View>
                    ) : (
                        addresses.map((addr) => (
                            <View key={addr.id} style={styles.addressCard}>
                                <View style={styles.addressLeft}>
                                    <View style={[styles.addressIcon, addr.isDefault && styles.addressIconDefault]}>
                                        <Navigation size={14} color={addr.isDefault ? colors.white : colors.textSecondary} />
                                    </View>
                                    <View style={styles.addressInfo}>
                                        <View style={styles.addressLabelRow}>
                                            <Text style={styles.addressLabel}>{addr.label}</Text>
                                            {addr.isDefault && (
                                                <View style={styles.defaultBadge}>
                                                    <Text style={styles.defaultBadgeText}>Default</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.addressText} numberOfLines={2}>{addr.address}</Text>
                                    </View>
                                </View>
                                <View style={styles.addressActions}>
                                    <Pressable
                                        onPress={() => {
                                            setEditingAddress(addr);
                                            setNewAddressLabel(addr.label);
                                            setNewAddressText(addr.address);
                                            setNewAddressDefault(addr.isDefault);
                                            setActiveModal('editAddress');
                                        }}
                                        hitSlop={8}
                                        style={styles.addressActionBtn}
                                    >
                                        <Edit3 size={15} color={colors.secondary} />
                                    </Pressable>
                                    <Pressable onPress={() => handleDeleteAddress(addr.id)} hitSlop={8} style={styles.addressActionBtn}>
                                        <Trash2 size={15} color={colors.error} />
                                    </Pressable>
                                </View>
                            </View>
                        ))
                    )}

                    <Pressable
                        style={({ pressed }) => [styles.addAddressBtn, pressed && styles.addAddressBtnPressed]}
                        onPress={() => {
                            setNewAddressLabel('');
                            setNewAddressText('');
                            setNewAddressDefault(false);
                            setActiveModal('addAddress');
                        }}
                    >
                        <Plus size={18} color={colors.primary} />
                        <Text style={styles.addAddressBtnText}>Add New Address</Text>
                    </Pressable>
                </ScrollView>
            </View>
        </Modal>
    );

    const renderAddEditAddressModal = () => {
        const isEditing = activeModal === 'editAddress';
        return (
            <Modal visible={activeModal === 'addAddress' || activeModal === 'editAddress'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setActiveModal('addresses')}>
                <View style={styles.modalContainer}>
                    <ModalHeader title={isEditing ? 'Edit Address' : 'New Address'} onClose={() => setActiveModal('addresses')} />
                    <View style={styles.modalBody}>
                        <Text style={styles.inputLabel}>Label</Text>
                        <TextInput
                            style={styles.input}
                            value={newAddressLabel}
                            onChangeText={setNewAddressLabel}
                            placeholder="e.g. Home, Work, Mom's house"
                            placeholderTextColor={colors.textTertiary}
                            autoFocus
                        />

                        <Text style={styles.inputLabel}>Full Address</Text>
                        <TextInput
                            style={[styles.input, styles.inputMultiline]}
                            value={newAddressText}
                            onChangeText={setNewAddressText}
                            placeholder="Street name, building, floor, apartment"
                            placeholderTextColor={colors.textTertiary}
                            multiline
                            numberOfLines={3}
                        />

                        {!isEditing && (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.useLocationBtn,
                                    pressed && { opacity: 0.7 }
                                ]}
                                onPress={async () => {
                                    await requestLocation();
                                    if (detectedAddress) {
                                        setNewAddressText(detectedAddress);
                                    }
                                }}
                                disabled={isDetecting}
                            >
                                <Navigation size={14} color={colors.primary} />
                                <Text style={styles.useLocationBtnText}>
                                    {isDetecting ? 'Detecting...' : 'Use Current Location'}
                                </Text>
                            </Pressable>
                        )}

                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Set as default address</Text>
                            <Switch
                                value={newAddressDefault}
                                onValueChange={setNewAddressDefault}
                                trackColor={{ false: colors.border, true: colors.primaryLight }}
                                thumbColor={newAddressDefault ? colors.primary : colors.textTertiary}
                            />
                        </View>

                        <Pressable
                            style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
                            onPress={isEditing ? handleUpdateAddress : handleAddAddress}
                        >
                            <Check size={18} color={colors.white} />
                            <Text style={styles.saveBtnText}>{isEditing ? 'Update Address' : 'Add Address'}</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        );
    };

    const renderNotificationsModal = () => (
        <Modal visible={activeModal === 'notifications'} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
                <ModalHeader title="Notifications" onClose={closeModal} />
                <View style={styles.modalBody}>
                    <View style={styles.notifCard}>
                        <View style={styles.notifItem}>
                            <View style={styles.notifInfo}>
                                <Text style={styles.notifTitle}>Order Updates</Text>
                                <Text style={styles.notifDesc}>Get notified about order status changes</Text>
                            </View>
                            <Switch
                                value={notificationPrefs.orderUpdates}
                                onValueChange={(v) => updateNotificationPref('orderUpdates', v)}
                                trackColor={{ false: colors.border, true: colors.primaryLight }}
                                thumbColor={notificationPrefs.orderUpdates ? colors.primary : colors.textTertiary}
                            />
                        </View>
                        <View style={styles.notifSep} />
                        <View style={styles.notifItem}>
                            <View style={styles.notifInfo}>
                                <Text style={styles.notifTitle}>Promotions & Offers</Text>
                                <Text style={styles.notifDesc}>Deals and discounts from nearby stores</Text>
                            </View>
                            <Switch
                                value={notificationPrefs.promotions}
                                onValueChange={(v) => updateNotificationPref('promotions', v)}
                                trackColor={{ false: colors.border, true: colors.primaryLight }}
                                thumbColor={notificationPrefs.promotions ? colors.primary : colors.textTertiary}
                            />
                        </View>
                        <View style={styles.notifSep} />
                        <View style={styles.notifItem}>
                            <View style={styles.notifInfo}>
                                <Text style={styles.notifTitle}>New Stores Nearby</Text>
                                <Text style={styles.notifDesc}>When new pharmacies or vendors open near you</Text>
                            </View>
                            <Switch
                                value={notificationPrefs.newStores}
                                onValueChange={(v) => updateNotificationPref('newStores', v)}
                                trackColor={{ false: colors.border, true: colors.primaryLight }}
                                thumbColor={notificationPrefs.newStores ? colors.primary : colors.textTertiary}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderFavoritesModal = () => (
        <Modal visible={activeModal === 'favorites'} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
                <ModalHeader title="Favorites" onClose={closeModal} />
                <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalScrollContent}>
                    {favoriteStores.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Heart size={40} color={colors.textTertiary} />
                            <Text style={styles.emptyTitle}>No favorites yet</Text>
                            <Text style={styles.emptySubtitle}>Heart a store to save it here for quick access</Text>
                        </View>
                    ) : (
                        favoriteStores.map((store) => (
                            <Pressable
                                key={store.id}
                                style={({ pressed }) => [styles.favStoreCard, pressed && styles.favStoreCardPressed]}
                                onPress={() => {
                                    closeModal();
                                    setTimeout(() => router.push(`/store/${store.id}`), 300);
                                }}
                            >
                                <View style={[styles.favStoreIcon, { backgroundColor: store.category === 'pharmacy' ? colors.pharmacyBg : colors.veggiesBg }]}>
                                    <Text style={styles.favStoreEmoji}>{store.category === 'pharmacy' ? '💊' : '🥬'}</Text>
                                </View>
                                <View style={styles.favStoreInfo}>
                                    <Text style={styles.favStoreName}>{store.nameAr}</Text>
                                    <View style={styles.favStoreMeta}>
                                        <Star size={11} color={colors.rating} fill={colors.rating} />
                                        <Text style={styles.favStoreRating}>{store.rating}</Text>
                                        <Text style={styles.favStoreDot}>·</Text>
                                        <Text style={styles.favStoreDistance}>{store.distance} km</Text>
                                        <Text style={styles.favStoreDot}>·</Text>
                                        <Text style={styles.favStoreTime}>{store.deliveryTime}</Text>
                                    </View>
                                </View>
                                <Pressable
                                    onPress={() => toggleFavorite(store.id)}
                                    hitSlop={10}
                                    style={styles.favRemoveBtn}
                                >
                                    <Heart size={18} color={colors.error} fill={colors.error} />
                                </Pressable>
                            </Pressable>
                        ))
                    )}
                </ScrollView>
            </View>
        </Modal>
    );

    const renderHelpModal = () => (
        <Modal visible={activeModal === 'help'} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
                <ModalHeader title="Help Center" onClose={closeModal} />
                <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalScrollContent}>
                    {[
                        { q: 'How do I place an order?', a: 'Select a category (Pharmacy or Veggies), choose a store, add items to your cart, and proceed to checkout. Cash on delivery only for now.' },
                        { q: 'What is the delivery radius?', a: 'We deliver from stores within 5 km of your location to ensure the fastest delivery possible.' },
                        { q: 'How are delivery fees calculated?', a: 'Base fee of 15 EGP + 2 EGP per kilometer from the store to your address.' },
                        { q: 'Can I cancel my order?', a: 'You can cancel before the store accepts the order. After acceptance, please contact support for assistance.' },
                        { q: 'What if I receive wrong or damaged items?', a: 'Use the "Report Issue" button in your order history. Upload a photo and our team will resolve it within 15 minutes.' },
                        { q: 'How fast is delivery?', a: 'We target under 30 minutes for most orders. "I\'m in a hurry" mode prioritizes the fastest stores near you.' },
                    ].map((faq, index) => (
                        <FAQItem key={index} question={faq.q} answer={faq.a} />
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );

    const renderContactModal = () => (
        <Modal visible={activeModal === 'contact'} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
                <ModalHeader title="Contact Us" onClose={closeModal} />
                <View style={styles.modalBody}>
                    <Text style={styles.contactDesc}>Our support team is available 7 days a week, 8 AM to midnight.</Text>

                    <Pressable style={({ pressed }) => [styles.contactOption, pressed && styles.contactOptionPressed]} onPress={handleContactCall}>
                        <View style={[styles.contactIcon, { backgroundColor: colors.primaryLight }]}>
                            <Phone size={20} color={colors.primary} />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Call Support</Text>
                            <Text style={styles.contactSub}>+20 123 456 7890</Text>
                        </View>
                        <ChevronRight size={16} color={colors.textTertiary} />
                    </Pressable>

                    <Pressable style={({ pressed }) => [styles.contactOption, pressed && styles.contactOptionPressed]} onPress={handleContactChat}>
                        <View style={[styles.contactIcon, { backgroundColor: colors.secondaryLight }]}>
                            <MessageCircle size={20} color={colors.secondary} />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Live Chat</Text>
                            <Text style={styles.contactSub}>Average response: 15 min</Text>
                        </View>
                        <ChevronRight size={16} color={colors.textTertiary} />
                    </Pressable>
                </View>
            </View>
        </Modal>
    );

    const renderTermsModal = () => (
        <Modal visible={activeModal === 'terms'} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
                <ModalHeader title="Terms & Privacy" onClose={closeModal} />
                <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalScrollContent}>
                    <View style={styles.termsSection}>
                        <View style={styles.termsSectionHeader}>
                            <Shield size={18} color={colors.primary} />
                            <Text style={styles.termsSectionTitle}>Privacy Policy</Text>
                        </View>
                        <Text style={styles.termsText}>
                            Khedma collects your phone number, delivery address, and order history to provide our delivery service. We do not sell your personal data to third parties. Location data is used only to find nearby stores and calculate delivery fees. You can request deletion of your data at any time by contacting support.
                        </Text>
                    </View>

                    <View style={styles.termsSection}>
                        <View style={styles.termsSectionHeader}>
                            <FileText size={18} color={colors.secondary} />
                            <Text style={styles.termsSectionTitle}>Terms of Service</Text>
                        </View>
                        <Text style={styles.termsText}>
                            By using Khedma, you agree to pay for orders placed through the app including delivery fees. Orders can only be cancelled before store acceptance. Cash on delivery is the only payment method currently available. Khedma is not responsible for store pricing — prices are set by vendors. We guarantee best effort delivery times but cannot guarantee specific delivery windows due to traffic and other factors.
                        </Text>
                    </View>

                    <View style={styles.termsSection}>
                        <View style={styles.termsSectionHeader}>
                            <FileText size={18} color={colors.warning} />
                            <Text style={styles.termsSectionTitle}>Refund Policy</Text>
                        </View>
                        <Text style={styles.termsText}>
                            If you receive wrong, damaged, or expired items, report the issue within 1 hour of delivery with photo evidence. Our team will review and process a refund or replacement within 15 minutes of the report. Refunds are issued as store credit or cash on your next order.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );

    const renderThemeModal = () => (
        <Modal visible={activeModal === 'theme'} transparent animationType="fade" onRequestClose={closeModal}>
            <Pressable style={styles.modalOverlay} onPress={closeModal}>
                <View style={styles.dropdownModalContent}>
                    <Text style={styles.dropdownTitle}>Appearance</Text>
                    <View style={styles.dropdownOptions}>
                        {[
                            { id: 'light', label: 'Light Mode', icon: <Globe size={18} color={colors.primary} /> }, // Using Globe as placeholder or similar
                            { id: 'dark', label: 'Dark Mode', icon: <Moon size={18} color={colors.primary} /> },
                            { id: 'system', label: 'System Default', icon: <Bell size={18} color={colors.primary} /> },
                        ].map((opt) => (
                            <Pressable
                                key={opt.id}
                                style={({ pressed }) => [
                                    styles.dropdownOption,
                                    mode === opt.id && styles.dropdownOptionSelected,
                                    pressed && { opacity: 0.7 }
                                ]}
                                onPress={() => {
                                    setMode(opt.id as any);
                                    closeModal();
                                }}
                            >
                                <Text style={[styles.dropdownOptionText, mode === opt.id && styles.dropdownOptionTextSelected]}>
                                    {opt.label}
                                </Text>
                                {mode === opt.id && <Check size={16} color={colors.primary} />}
                            </Pressable>
                        ))}
                    </View>
                </View>
            </Pressable>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <User size={28} color={colors.white} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{displayName}</Text>
                        <Text style={styles.profilePhone}>{displayPhone}</Text>
                        {isGuest && (
                            <View style={styles.guestBadge}>
                                <Text style={styles.guestBadgeText}>Guest</Text>
                            </View>
                        )}
                    </View>
                    <Pressable
                        style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.7 }]}
                        onPress={() => openModal('editProfile')}
                        testID="edit-profile-btn"
                    >
                        <Text style={styles.editBtnText}>Edit</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.sectionCard}>
                        <MenuItem
                            icon={<Globe size={17} color={colors.secondary} />}
                            label="Language / اللغة"
                            subtitle={language === 'ar' ? 'العربية' : 'English'}
                            onPress={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
                            showChevron={false}
                        />
                        <View style={styles.separator} />
                        <MenuItem
                            icon={<Moon size={17} color={colors.secondary} />}
                            label="Dark Mode"
                            subtitle={mode === 'system' ? 'System Default' : mode === 'dark' ? 'On' : 'Off'}
                            onPress={() => openModal('theme')}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.sectionCard}>
                        <MenuItem
                            icon={<MapPin size={17} color={colors.secondary} />}
                            label="My Addresses"
                            subtitle={addresses.length > 0 ? `${addresses.length} saved` : 'Manage delivery addresses'}
                            onPress={() => openModal('addresses')}
                            badge={addresses.length || undefined}
                        />
                        <View style={styles.separator} />
                        <MenuItem
                            icon={<Bell size={17} color={colors.warning} />}
                            label="Notifications"
                            subtitle="Order updates & offers"
                            onPress={() => openModal('notifications')}
                        />
                        <View style={styles.separator} />
                        <MenuItem
                            icon={<Heart size={17} color={colors.error} />}
                            label="Favorites"
                            subtitle={favoriteStores.length > 0 ? `${favoriteStores.length} stores` : 'Saved stores'}
                            onPress={() => openModal('favorites')}
                            badge={favoriteStores.length || undefined}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.sectionCard}>
                        <MenuItem
                            icon={<Headphones size={17} color={colors.primary} />}
                            label="Help Center"
                            subtitle="FAQs & contact support"
                            onPress={() => openModal('help')}
                        />
                        <View style={styles.separator} />
                        <MenuItem
                            icon={<Phone size={17} color={colors.primary} />}
                            label="Contact Us"
                            subtitle="Chat or call"
                            onPress={() => openModal('contact')}
                        />
                        <View style={styles.separator} />
                        <MenuItem
                            icon={<FileText size={17} color={colors.textSecondary} />}
                            label="Terms & Privacy"
                            onPress={() => openModal('terms')}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionCard}>
                        <MenuItem
                            icon={<LogOut size={17} color={colors.error} />}
                            label="Log Out"
                            showChevron={false}
                            danger
                            onPress={handleLogout}
                        />
                    </View>
                </View>

                <Text style={styles.version}>Khedma v1.0.0 · Cairo, Egypt</Text>
            </ScrollView>

            {renderEditProfileModal()}
            {renderAddressesModal()}
            {renderAddEditAddressModal()}
            {renderNotificationsModal()}
            {renderFavoritesModal()}
            {renderHelpModal()}
            {renderContactModal()}
            {renderTermsModal()}
            {renderThemeModal()}
        </View>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const colors = useTheme();
    const styles = getStyles(colors);
    const [expanded, setExpanded] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const toggle = useCallback(() => {
        setExpanded((prev) => {
            Animated.timing(rotateAnim, {
                toValue: prev ? 0 : 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
            return !prev;
        });
    }, [rotateAnim]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <Pressable onPress={toggle} style={styles.faqItem}>
            <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{question}</Text>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <ChevronDown size={16} color={colors.textTertiary} />
                </Animated.View>
            </View>
            {expanded && <Text style={styles.faqAnswer}>{answer}</Text>}
        </Pressable>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dropdownModalContent: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        width: '100%',
        maxWidth: 340,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    dropdownTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 16,
        textAlign: 'center',
    },
    dropdownOptions: {
        gap: 8,
    },
    dropdownOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    dropdownOptionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
    dropdownOptionText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    dropdownOptionTextSelected: {
        color: colors.primary,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 22,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 12,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.textPrimary,
    },
    profilePhone: {
        fontSize: 12,
        color: colors.textTertiary,
        marginTop: 2,
    },
    guestBadge: {
        backgroundColor: colors.warningLight,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 1,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    guestBadgeText: {
        fontSize: 10,
        fontWeight: '600' as const,
        color: colors.warning,
    },
    editBtn: {
        backgroundColor: colors.primaryLight,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    editBtnText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.primary,
    },
    section: {
        marginBottom: 18,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '600' as const,
        color: colors.textTertiary,
        marginBottom: 7,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    sectionCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    menuItemPressed: {
        backgroundColor: colors.background,
    },
    menuIcon: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIconDanger: {
        backgroundColor: colors.errorLight,
    },
    menuContent: {
        flex: 1,
        marginLeft: 10,
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.textPrimary,
    },
    menuLabelDanger: {
        color: colors.error,
    },
    menuSubtitle: {
        fontSize: 11,
        color: colors.textTertiary,
        marginTop: 1,
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginRight: 6,
    },
    badgeText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '700' as const,
    },
    separator: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginLeft: 58,
    },
    version: {
        textAlign: 'center',
        fontSize: 11,
        color: colors.textTertiary,
        marginTop: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '700' as const,
        color: colors.textPrimary,
    },
    modalClose: {
        padding: 4,
    },
    modalBody: {
        flex: 1,
        padding: 20,
    },
    modalScrollContent: {
        paddingBottom: 40,
    },
    editAvatarSection: {
        alignItems: 'center',
        marginBottom: 28,
    },
    editAvatar: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: colors.textSecondary,
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: colors.textPrimary,
    },
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    disabledInput: {
        backgroundColor: colors.background,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.borderLight,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    disabledInputText: {
        fontSize: 15,
        color: colors.textTertiary,
    },
    inputHint: {
        fontSize: 11,
        color: colors.textTertiary,
        marginTop: 4,
    },
    saveBtn: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 28,
    },
    saveBtnPressed: {
        opacity: 0.85,
    },
    saveBtnText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '700' as const,
    },
    useLocationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        marginTop: 4,
    },
    useLocationBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.textPrimary,
        marginTop: 14,
    },
    emptySubtitle: {
        fontSize: 13,
        color: colors.textTertiary,
        marginTop: 4,
        textAlign: 'center',
    },
    addressCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
        marginBottom: 10,
    },
    addressLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressIcon: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressIconDefault: {
        backgroundColor: colors.primary,
    },
    addressInfo: {
        flex: 1,
        marginLeft: 10,
    },
    addressLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    addressLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.textPrimary,
    },
    defaultBadge: {
        backgroundColor: colors.primaryLight,
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 1,
    },
    defaultBadgeText: {
        fontSize: 9,
        fontWeight: '600' as const,
        color: colors.primary,
    },
    addressText: {
        fontSize: 12,
        color: colors.textTertiary,
        marginTop: 2,
    },
    addressActions: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 8,
    },
    addressActionBtn: {
        padding: 6,
    },
    addAddressBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.primaryLight,
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 6,
    },
    addAddressBtnPressed: {
        opacity: 0.7,
    },
    addAddressBtnText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.primary,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 18,
        paddingVertical: 4,
    },
    switchLabel: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.textPrimary,
    },
    notifCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderLight,
        overflow: 'hidden',
    },
    notifItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    notifSep: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginLeft: 16,
    },
    notifInfo: {
        flex: 1,
        marginRight: 12,
    },
    notifTitle: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.textPrimary,
    },
    notifDesc: {
        fontSize: 12,
        color: colors.textTertiary,
        marginTop: 2,
    },
    favStoreCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
        marginBottom: 10,
    },
    favStoreCardPressed: {
        backgroundColor: colors.background,
    },
    favStoreIcon: {
        width: 42,
        height: 42,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },
    favStoreEmoji: {
        fontSize: 20,
    },
    favStoreInfo: {
        flex: 1,
        marginLeft: 12,
    },
    favStoreName: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.textPrimary,
    },
    favStoreMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 3,
    },
    favStoreRating: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.textSecondary,
    },
    favStoreDot: {
        fontSize: 10,
        color: colors.textTertiary,
    },
    favStoreDistance: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    favStoreTime: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    favRemoveBtn: {
        padding: 6,
    },
    faqItem: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.borderLight,
        marginBottom: 8,
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    faqQuestion: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    faqAnswer: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 10,
        lineHeight: 19,
    },
    contactDesc: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 20,
        lineHeight: 20,
    },
    contactOption: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
        marginBottom: 12,
    },
    contactOptionPressed: {
        backgroundColor: colors.background,
    },
    contactIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactInfo: {
        flex: 1,
        marginLeft: 12,
    },
    contactTitle: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: colors.textPrimary,
    },
    contactSub: {
        fontSize: 12,
        color: colors.textTertiary,
        marginTop: 2,
    },
    termsSection: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.borderLight,
        marginBottom: 12,
    },
    termsSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    termsSectionTitle: {
        fontSize: 15,
        fontWeight: '700' as const,
        color: colors.textPrimary,
    },
    termsText: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});
