import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Bike, Eye, Leaf, Pill } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Dimensions,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const colors = useTheme();
    const styles = getStyles(colors);
    const { t } = useTranslation();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { enterGuestMode } = useAuth();

    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(40)).current;
    const logoScale = useRef(new Animated.Value(0.6)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const bikeSlide = useRef(new Animated.Value(-60)).current;
    const btnFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(fadeIn, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideUp, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(bikeSlide, {
                    toValue: 0,
                    friction: 7,
                    tension: 60,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(btnFade, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleStart = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/phone');
    };

    const handleSkip = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        enterGuestMode();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <StatusBar barStyle="light-content" />

            {/* Premium Background Pattern */}
            <View style={styles.bgPattern}>
                <View style={[styles.bgCircle, { top: -100, left: -100, width: 400, height: 400, borderRadius: 200, opacity: 0.04, backgroundColor: colors.white }]} />
                <View style={[styles.bgCircle, { top: 200, right: -150, width: 350, height: 350, borderRadius: 175, opacity: 0.03, backgroundColor: colors.white }]} />
                <View style={[styles.bgCircle, { bottom: 100, left: -120, width: 300, height: 300, borderRadius: 150, opacity: 0.05, backgroundColor: colors.white }]} />
                <View style={[styles.bgCircle, { bottom: -150, right: -50, width: 400, height: 400, borderRadius: 200, opacity: 0.04, backgroundColor: colors.white }]} />
            </View>

            <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
                <Animated.View
                    style={[
                        styles.logoArea,
                        {
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }],
                        },
                    ]}
                >
                    <View style={styles.logoContainer}>
                        <View style={styles.logoInner}>
                            <View style={styles.logoIconRow}>
                                <Pill size={20} color={colors.white} strokeWidth={3} />
                                <Leaf size={22} color={colors.primaryLight} strokeWidth={2.5} />
                            </View>
                            <Animated.View style={{ transform: [{ translateX: bikeSlide }] }}>
                                <Bike size={42} color={colors.white} strokeWidth={2} />
                            </Animated.View>
                        </View>
                    </View>
                    <Text style={[styles.appName, { color: colors.white }]}>{t('welcome.khedma')}</Text>
                    <Text style={[styles.appNameEn, { color: colors.white + '99' }]}>{t('welcome.khedmaEn')}</Text>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.heroSection,
                        {
                            opacity: fadeIn,
                            transform: [{ translateY: slideUp }],
                        },
                    ]}
                >
                    <View style={styles.illustrationRow}>
                        <View style={[styles.pillBadge, { backgroundColor: colors.white + 'F2' }]}>
                            <Pill size={14} color={colors.pharmacy} strokeWidth={3} />
                            <Text style={[styles.pillBadgeText, { color: colors.pharmacy }]}>{t('welcome.pharmacy')}</Text>
                        </View>
                        <View style={[styles.vegBadge, { backgroundColor: colors.white + 'F2' }]}>
                            <Leaf size={14} color={colors.veggies} strokeWidth={2.5} />
                            <Text style={[styles.vegBadgeText, { color: colors.veggies }]}>{t('welcome.veggies')}</Text>
                        </View>
                    </View>

                    <Text style={[styles.headline, { color: colors.white }]}>
                        {t('welcome.headline')}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.white + 'BF' }]}>
                        {t('welcome.subtitle')}
                    </Text>
                </Animated.View>
            </View>

            <Animated.View
                style={[
                    styles.bottomSection,
                    { paddingBottom: insets.bottom + 20, opacity: btnFade },
                ]}
            >
                <View style={styles.trustRow}>
                    <View style={styles.trustItem}>
                        <Text style={styles.trustNumber}>{t('welcome.support')}</Text>
                        <Text style={styles.trustLabel}>{t('welcome.realSupport')}</Text>
                    </View>
                    <View style={styles.trustDivider} />
                    <View style={styles.trustItem}>
                        <Text style={styles.trustNumber}>{t('welcome.distance')}</Text>
                        <Text style={styles.trustLabel}>{t('welcome.nearest')}</Text>
                    </View>
                    <View style={styles.trustDivider} />
                    <View style={styles.trustItem}>
                        <Text style={[styles.trustNumber, { fontSize: 18 }]}>30</Text>
                        <Text style={styles.trustLabel}>{t('welcome.minutes')}</Text>
                    </View>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.startBtn,
                        { backgroundColor: colors.white },
                        pressed && styles.startBtnPressed,
                    ]}
                    onPress={handleStart}
                    testID="welcome-start-btn"
                >
                    <Text style={[styles.startBtnText, { color: colors.primary }]}>{t('welcome.start')}</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.skipBtn,
                        pressed && styles.skipBtnPressed,
                    ]}
                    onPress={handleSkip}
                    testID="welcome-skip-btn"
                >
                    <Eye size={16} color={colors.white + 'B3'} />
                    <Text style={[styles.skipBtnText, { color: colors.white + 'B3' }]}>{t('welcome.skip')}</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    bgPattern: {
        ...StyleSheet.absoluteFillObject,
    },
    bgCircle: {
        position: 'absolute' as const,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    logoArea: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 110,
        height: 110,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    logoInner: {
        alignItems: 'center',
        gap: 4,
    },
    logoIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    appName: {
        fontSize: 48,
        fontWeight: '900' as const,
        letterSpacing: -1,
    },
    appNameEn: {
        fontSize: 14,
        fontWeight: '700' as const,
        letterSpacing: 6,
        marginTop: -4,
    },
    heroSection: {
        flex: 1,
        justifyContent: 'center',
    },
    illustrationRow: {
        flexDirection: 'row-reverse',
        gap: 10,
        marginBottom: 24,
    },
    pillBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
    },
    pillBadgeText: {
        fontSize: 14,
        fontWeight: '700' as const,
    },
    vegBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
    },
    vegBadgeText: {
        fontSize: 14,
        fontWeight: '700' as const,
    },
    headline: {
        fontSize: 34,
        fontWeight: '800' as const,
        lineHeight: 48,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 26,
        marginTop: 16,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    bottomSection: {
        paddingHorizontal: 24,
    },
    trustRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        paddingVertical: 16,
        marginBottom: 24,
    },
    trustItem: {
        flex: 1,
        alignItems: 'center',
    },
    trustNumber: {
        fontSize: 18,
        fontWeight: '900' as const,
        color: '#FFFFFF',
    },
    trustLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
        fontWeight: '600' as const,
    },
    trustDivider: {
        width: 1,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 18,
    },
    startBtnPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    startBtnText: {
        fontSize: 18,
        fontWeight: '800' as const,
    },
    skipBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 6,
    },
    skipBtnPressed: {
        opacity: 0.7,
    },
    skipBtnText: {
        fontSize: 15,
        fontWeight: '600' as const,
    },
});
