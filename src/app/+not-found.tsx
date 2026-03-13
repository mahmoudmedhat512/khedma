import { useTheme } from '@/hooks/use-theme';
import { Link, Stack } from 'expo-router';
import { SearchX } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  const colors = useTheme();
  const styles = getStyles(colors);
    return (
        <>
            <Stack.Screen options={{ title: 'Not Found' }} />
            <View style={styles.container}>
                <View style={styles.iconWrap}>
                    <SearchX size={48} color={colors.textTertiary} />
                </View>
                <Text style={styles.title}>Page not found</Text>
                <Text style={styles.subtitle}>The page you are looking for does not exist.</Text>
                <Link href="/" style={styles.link}>
                    <Text style={styles.linkText}>Back to Home</Text>
                </Link>
            </View>
        </>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    iconWrap: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    link: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 28,
    },
    linkText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.white,
    },
});
