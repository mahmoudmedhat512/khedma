import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
    ArrowRight,
    Clock,
    Headphones,
    MapPin,
    ShieldCheck,
} from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
    const colors = useTheme();
    const { t } = useTranslation();
    const styles = getStyles(colors);

    const FEATURES = [
        {
            icon: MapPin,
            color: colors.primary,
            bg: colors.primaryLight,
            title: t('onboarding.feature1Title'),
            subtitle: t('onboarding.feature1Subtitle'),
        },
        {
            icon: Clock,
            color: colors.warning,
            bg: colors.warningLight,
            title: t('onboarding.feature2Title'),
            subtitle: t('onboarding.feature2Subtitle'),
        },
        {
            icon: ShieldCheck,
            color: colors.secondary,
            bg: colors.secondaryLight,
            title: t('onboarding.feature3Title'),
            subtitle: t('onboarding.feature3Subtitle'),
        },
        {
            icon: Headphones,
            color: colors.accent,
            bg: colors.accentLight,
            title: t('onboarding.feature4Title'),
            subtitle: t('onboarding.feature4Subtitle'),
        },
    ];

    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { completeOnboarding } = useAuth();

    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(40)).current;
    const featureAnims = useRef(
        FEATURES.map(() => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(20),
        }))
    ).current;

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
        ]).start(() => {
            Animated.stagger(
                120,
                featureAnims.map((anim) =>
                    Animated.parallel([
                        Animated.timing(anim.opacity, {
                            toValue: 1,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim.translateY, {
                            toValue: 0,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                    ])
                )
            ).start();
        });
    }, []);

    const handleStart = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        completeOnboarding();
        setTimeout(() => {
            router.replace('/');
        }, 100);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={[styles.content, { paddingTop: insets.top + 32 }]}>
                <Animated.View
                    style={[
                        styles.headerSection,
                        { opacity: fadeIn, transform: [{ translateY: slideUp }] },
                    ]}
                >
                    <View style={styles.welcomeBadge}>
                        <Text style={styles.welcomeBadgeText}>{t('onboarding.welcome')}</Text>
                    </View>
                    <Text style={styles.title}>
                        {t('onboarding.headline')}
                    </Text>
                </Animated.View>

                <View style={styles.featuresSection}>
                    {FEATURES.map((feature, index) => {
                        const IconComp = feature.icon;
                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.featureRow,
                                    {
                                        opacity: featureAnims[index].opacity,
                                        transform: [
                                            { translateY: featureAnims[index].translateY },
                                        ],
                                    },
                                ]}
                            >
                                <View style={[styles.featureIcon, { backgroundColor: feature.bg }]}>
                                    <IconComp size={20} color={feature.color} />
                                </View>
                                <View style={styles.featureText}>
                                    <Text style={styles.featureTitle}>{feature.title}</Text>
                                    <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                                </View>
                            </Animated.View>
                        );
                    })}
                </View>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.cashNote}>
                    <Text style={styles.cashNoteText}>{t('onboarding.cashNote')}</Text>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.startBtn,
                        pressed && styles.startBtnPressed,
                    ]}
                    onPress={handleStart}
                    testID="onboarding-start-btn"
                >
                    <Text style={styles.startBtnText}>{t('onboarding.start')}</Text>
                    <ArrowRight size={20} color="#FFFFFF" />
                </Pressable>
            </View>
        </View>
    );
}


const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    headerSection: {
        marginBottom: 32,
    },
    welcomeBadge: {
        alignSelf: 'flex-end',
        backgroundColor: colors.primaryLight,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        marginBottom: 16,
    },
    welcomeBadgeText: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    title: {
        fontSize: 26,
        fontWeight: '800' as const,
        color: colors.textPrimary,
        lineHeight: 38,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    featuresSection: {
        gap: 14,
    },
    featureRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 14,
        padding: 14,
        gap: 14,
    },
    featureIcon: {
        width: 44,
        height: 44,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        flex: 1,
        alignItems: 'flex-end',
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: '700' as const,
        color: colors.textPrimary,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    featureSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
        textAlign: 'right',
        writingDirection: 'rtl',
        lineHeight: 18,
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    cashNote: {
        alignItems: 'center',
        marginBottom: 14,
    },
    cashNoteText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '600' as const,
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        gap: 8,
    },
    startBtnPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    startBtnText: {
        fontSize: 17,
        fontWeight: '800' as const,
        color: colors.white,
    },
});
