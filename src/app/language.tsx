import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/hooks/use-theme';
import * as Haptics from 'expo-haptics';
import { Check, Languages } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LanguageScreen() {
    const colors = useTheme();
    const insets = useSafeAreaInsets();
    const { language, changeLanguage } = useLanguage();
    const { confirmLanguageSelected } = useAuth();
    const { t } = useTranslation();

    const handleSelect = async (lang: 'en' | 'ar') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // We MUST confirm selection before changing language (which triggers reload)
        // or before finishing if it's the same language.
        await confirmLanguageSelected();

        if (lang !== language) {
            await changeLanguage(lang);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
                <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
                    <Languages size={32} color={colors.primary} />
                </View>

                <Text style={[styles.title, { color: colors.textPrimary }]}>{t('language.title')}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('language.subtitle')}</Text>

                <View style={styles.options}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.option,
                            { borderColor: language === 'ar' ? colors.primary : colors.border },
                            language === 'ar' && { backgroundColor: colors.primary + '08' },
                            pressed && { opacity: 0.8 }
                        ]}
                        onPress={() => handleSelect('ar')}
                    >
                        <View style={styles.optionContent}>
                            <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>{t('language.arabic')}</Text>
                            <Text style={[styles.optionSub, { color: colors.textTertiary }]}>Arabic</Text>
                        </View>
                        {language === 'ar' && (
                            <View style={[styles.check, { backgroundColor: colors.primary }]}>
                                <Check size={14} color={colors.white} strokeWidth={3} />
                            </View>
                        )}
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.option,
                            { borderColor: language === 'en' ? colors.primary : colors.border },
                            language === 'en' && { backgroundColor: colors.primary + '08' },
                            pressed && { opacity: 0.8 }
                        ]}
                        onPress={() => handleSelect('en')}
                    >
                        <View style={styles.optionContent}>
                            <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>{t('language.english')}</Text>
                            <Text style={[styles.optionSub, { color: colors.textTertiary }]}>الإنجليزيّة</Text>
                        </View>
                        {language === 'en' && (
                            <View style={[styles.check, { backgroundColor: colors.primary }]}>
                                <Check size={14} color={colors.white} strokeWidth={3} />
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    iconWrap: {
        width: 72,
        height: 72,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 48,
    },
    options: {
        width: '100%',
        gap: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
    },
    optionContent: {
        flex: 1,
        gap: 2,
    },
    optionLabel: {
        fontSize: 20,
        fontWeight: '700',
    },
    optionSub: {
        fontSize: 13,
        fontWeight: '500',
    },
    check: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingHorizontal: 24,
    },
    confirmBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 10,
    },
    confirmBtnPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    confirmBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
});
