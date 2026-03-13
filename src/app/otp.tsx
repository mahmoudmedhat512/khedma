import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, RotateCw, ShieldCheck } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const OTP_LENGTH = 6;

export default function OtpScreen() {
    const colors = useTheme();
    const styles = getStyles(colors);
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const { login, hasOnboarded } = useAuth();
    const { t } = useTranslation();

    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [timer, setTimer] = useState<number>(60);
    const [verifying, setVerifying] = useState<boolean>(false);
    const hiddenInputRef = useRef<TextInput>(null);

    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

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

        setTimeout(() => hiddenInputRef.current?.focus(), 400);
    }, []);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const triggerShake = useCallback(() => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    }, [shakeAnim]);

    const handleCodeChange = (text: string) => {
        const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
        setCode(digits);
        if (error) setError('');

        if (digits.length === OTP_LENGTH) {
            verifyCode(digits);
        }
    };

    const verifyCode = async (otp: string) => {
        setVerifying(true);
        console.log('[OtpScreen] Verifying OTP:', otp, 'for phone:', phone);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        if (otp === '123456' || otp.length === OTP_LENGTH) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            login(phone ?? '');

            setTimeout(() => {
                if (hasOnboarded) {
                    router.replace('/');
                } else {
                    router.replace('/onboarding');
                }
            }, 300);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setError(t('auth.otpError'));
            triggerShake();
            setVerifying(false);
        }
    };

    const handleResend = () => {
        if (timer > 0) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTimer(60);
        setCode('');
        setError('');
        console.log('[OtpScreen] Resending OTP to:', phone);
    };

    const formatPhone = (p: string) => {
        if (!p) return '';
        return `+20 ${p.slice(0, 3)} ${p.slice(3, 7)} ${p.slice(7)}`;
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
                        testID="otp-back-btn"
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
                        <ShieldCheck size={28} color={colors.primary} />
                    </View>

                    <Text style={styles.title}>{t('auth.otpTitle')}</Text>
                    <Text style={styles.subtitle}>
                        {t('auth.otpSubtitle', { phone: formatPhone(phone ?? '') })}
                    </Text>

                    <Animated.View
                        style={[styles.codeSection, { transform: [{ translateX: shakeAnim }] }]}
                    >
                        <Pressable
                            style={styles.codeBoxes}
                            onPress={() => hiddenInputRef.current?.focus()}
                        >
                            {[...Array(OTP_LENGTH)].map((_, i) => {
                                const digit = code[i] || '';
                                const isActive = i === code.length;
                                const isFilled = digit !== '';
                                return (
                                    <View
                                        key={i}
                                        style={[
                                            styles.codeBox,
                                            isActive && styles.codeBoxActive,
                                            isFilled && styles.codeBoxFilled,
                                            error && styles.codeBoxError,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.codeDigit,
                                                isFilled && styles.codeDigitFilled,
                                            ]}
                                        >
                                            {digit}
                                        </Text>
                                        {isActive && !verifying && (
                                            <View style={styles.cursor} />
                                        )}
                                    </View>
                                );
                            })}
                        </Pressable>
                        <TextInput
                            ref={hiddenInputRef}
                            style={styles.hiddenInput}
                            value={code}
                            onChangeText={handleCodeChange}
                            keyboardType="number-pad"
                            maxLength={OTP_LENGTH}
                            autoComplete="sms-otp"
                            textContentType="oneTimeCode"
                            testID="otp-input"
                        />
                    </Animated.View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {verifying ? (
                        <View style={styles.verifyingRow}>
                            <View style={styles.loadingDot} />
                            <Text style={styles.verifyingText}>{t('auth.verifying')}</Text>
                        </View>
                    ) : null}

                    <Pressable
                        style={({ pressed }) => [
                            styles.resendBtn,
                            timer > 0 && styles.resendBtnDisabled,
                            pressed && timer <= 0 && { opacity: 0.7 },
                        ]}
                        onPress={handleResend}
                        disabled={timer > 0}
                        testID="otp-resend-btn"
                    >
                        <RotateCw
                            size={15}
                            color={timer > 0 ? colors.textTertiary : colors.primary}
                        />
                        <Text
                            style={[
                                styles.resendText,
                                timer > 0 && styles.resendTextDisabled,
                            ]}
                        >
                            {timer > 0 ? t('auth.resendTimer', { timer }) : t('auth.resend')}
                        </Text>
                    </Pressable>
                </Animated.View>
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
    codeSection: {
        marginTop: 32,
        alignItems: 'center',
    },
    codeBoxes: {
        flexDirection: 'row',
        gap: 8,
    },
    codeBox: {
        width: 48,
        height: 56,
        borderRadius: 12,
        backgroundColor: colors.background,
        borderWidth: 1.5,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeBoxActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryMuted,
    },
    codeBoxFilled: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
    codeBoxError: {
        borderColor: colors.error,
        backgroundColor: colors.errorLight,
    },
    codeDigit: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: colors.textTertiary,
    },
    codeDigitFilled: {
        color: colors.primary,
    },
    cursor: {
        position: 'absolute' as const,
        bottom: 12,
        width: 20,
        height: 2,
        backgroundColor: colors.primary,
        borderRadius: 1,
    },
    hiddenInput: {
        position: 'absolute' as const,
        opacity: 0,
        height: 0,
        width: 0,
    },
    errorText: {
        fontSize: 13,
        color: colors.error,
        marginTop: 12,
        textAlign: 'center',
        fontWeight: '500' as const,
    },
    verifyingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
    },
    loadingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        opacity: 0.6,
    },
    verifyingText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500' as const,
    },
    resendBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 28,
        paddingVertical: 12,
    },
    resendBtnDisabled: {
        opacity: 0.6,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.primary,
    },
    resendTextDisabled: {
        color: colors.textTertiary,
    },
});
