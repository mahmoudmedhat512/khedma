/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import Colors from '@/constants/colors';
import { useThemeContext } from '@/contexts/ThemeContext';

export function useTheme() {
  const { isDarkMode } = useThemeContext();
  return isDarkMode ? Colors.dark : Colors.light;
}
