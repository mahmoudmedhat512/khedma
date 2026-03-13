import { useTheme } from '@/hooks/use-theme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatPhoneDisplay(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
}

export default function PhoneScreen() {
    const colors = useTheme();
    const styles = getStyles(colors);
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const [phoneRaw, setPhoneRaw] = useState<string>('');
    const [error, setError] = useState<string>('');
    const inputRef = useRef<TextInput>(null);

    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;

    const isValid = phoneRaw.replace(/\D/g, '').length === 11;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideUp, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        setTimeout(() => inputRef.current?.focus(), 400);
    }, []);

    const handleChange = (text: string) => {
        const digits = text.replace(/\D/g, '').slice(0, 11);
        setPhoneRaw(digits);
        if (error) setError('');
    };

    const handleSend = () => {
        const digits = phoneRaw.replace(/\D/g, '');
        if (digits.length !== 11) {
            setError(t('auth.phoneErrorLength'));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        if (!digits.startsWith('01')) {
            setError(t('auth.phoneErrorPrefix'));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        console.log('[PhoneScreen] Navigating to OTP with phone:', digits);
        router.push({ pathname: '/otp', params: { phone: digits } });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                    <Pressable
                        style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
                        onPress={() => router.back()}
                        testID="phone-back-btn"
                    >
                        <ArrowLeft size={22} color={colors.textPrimary} />
                    </Pressable>
                </View>

                <Animated.View
                    style={[
                        styles.body,
                        { opacity: fadeIn, transform: [{ translateY: slideUp }] },
                    ]}
                >
                    <View style={styles.iconWrap}>
                        <Phone size={28} color={colors.primary} />
                    </View>

                    <Text style={styles.title}>{t('auth.phoneTitle')}</Text>
                    <Text style={styles.subtitle}>
                        {t('auth.phoneSubtitle')}
                    </Text>

                    <View style={styles.inputSection}>
                        <View style={styles.countryCode}>
                            <Text style={styles.flag}>🇪🇬</Text>
                            <Text style={styles.codeText}>+20</Text>
                        </View>
                        <View style={[styles.inputWrap, error ? styles.inputError : null]}>
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                value={formatPhoneDisplay(phoneRaw)}
                                onChangeText={handleChange}
                                placeholder="1XX XXXX XXXX"
                                placeholderTextColor={colors.textTertiary}
                                keyboardType="phone-pad"
                                maxLength={13}
                                testID="phone-input"
                            />
                        </View>
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <Text style={styles.hint}>
                        {t('auth.phoneHint')}
                    </Text>
                </Animated.View>

                <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.sendBtn,
                            !isValid && styles.sendBtnDisabled,
                            pressed && isValid && styles.sendBtnPressed,
                        ]}
                        onPress={handleSend}
                        disabled={!isValid}
                        testID="phone-send-btn"
                    >
                        <Text
                            style={[styles.sendBtnText, !isValid && styles.sendBtnTextDisabled]}
                        >
                            {t('auth.sendCode')}
                        </Text>
                        <ArrowRight
                            size={18}
                            color={isValid ? colors.white : colors.textTertiary}
                        />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    flex: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '800' as const,
        color: colors.textPrimary,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        marginTop: 6,
        textAlign: 'right',
        writingDirection: 'rtl',
        lineHeight: 22,
    },
    inputSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 28,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.background,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    flag: {
        fontSize: 18,
    },
    codeText: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.textPrimary,
    },
    inputWrap: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.border,
        paddingHorizontal: 14,
    },
    inputError: {
        borderColor: colors.error,
    },
    input: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: colors.textPrimary,
        paddingVertical: 14,
        letterSpacing: 1,
    },
    errorText: {
        fontSize: 13,
        color: colors.error,
        marginTop: 8,
        textAlign: 'right',
        writingDirection: 'rtl',
        fontWeight: '500' as const,
    },
    hint: {
        fontSize: 12,
        color: colors.textTertiary,
        marginTop: 14,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    sendBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        gap: 8,
    },
    sendBtnDisabled: {
        backgroundColor: colors.borderLight,
    },
    sendBtnPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    sendBtnText: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.white,
    },
    sendBtnTextDisabled: {
        color: colors.textTertiary,
    },
});
