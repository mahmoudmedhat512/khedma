import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { Bike, Leaf, Pill } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    const colors = useTheme();
    const { confirmSplashSeen } = useAuth();
    const { t } = useTranslation();

    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const bikeSlide = useRef(new Animated.Value(-100)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const textSlide = useRef(new Animated.Value(20)).current;
    const bgOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Hide the native splash screen once our custom splash is mounted
        ExpoSplashScreen.hideAsync().catch(() => { });

        Animated.sequence([
            Animated.parallel([
                Animated.timing(bgOpacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.spring(bikeSlide, {
                    toValue: 0,
                    friction: 6,
                    tension: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(textSlide, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(1200),
        ]).start(() => {
            confirmSplashSeen();
        });
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <StatusBar barStyle="light-content" />

            {/* Background Pattern synced with Welcome screen */}
            <Animated.View style={[styles.bgPattern, { opacity: bgOpacity }]}>
                {[...Array(6)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.bgCircle,
                            {
                                top: 60 + i * 120,
                                left: i % 2 === 0 ? -40 : width - 80,
                                opacity: 0.06,
                                width: 160 + i * 20,
                                height: 160 + i * 20,
                                borderRadius: 80 + i * 10,
                                backgroundColor: colors.white,
                            },
                        ]}
                    />
                ))}
            </Animated.View>

            <View style={styles.content}>
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
                                <Pill size={24} color={colors.white} strokeWidth={3} />
                                <Leaf size={28} color={colors.primaryLight} strokeWidth={2.5} />
                            </View>
                            <Animated.View style={{ transform: [{ translateX: bikeSlide }] }}>
                                <Bike size={48} color={colors.white} strokeWidth={2} />
                            </Animated.View>
                        </View>
                    </View>
                    <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textSlide }], alignItems: 'center' }}>
                        <Text style={[styles.appName, { color: colors.white }]}>{t('welcome.khedma')}</Text>
                        <Text style={[styles.appNameEn, { color: colors.white + '99' }]}>{t('welcome.khedmaEn')}</Text>
                    </Animated.View>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgPattern: {
        ...StyleSheet.absoluteFillObject,
    },
    bgCircle: {
        position: 'absolute' as const,
    },
    content: {
        alignItems: 'center',
    },
    logoArea: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    logoInner: {
        alignItems: 'center',
        gap: 6,
    },
    logoIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    appName: {
        fontSize: 52,
        fontWeight: '900',
        letterSpacing: -1,
    },
    appNameEn: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 8,
        marginTop: -4,
    },
});
