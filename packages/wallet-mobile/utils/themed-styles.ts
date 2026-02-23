import { Colors } from '@/constants/theme'
import { useTheme } from '@/providers/ThemeProvider'
import { useMemo } from 'react'
import { StyleSheet } from 'react-native'

type ColorPalette = typeof Colors.light

/**
 * Creates a hook that returns theme-aware styles.
 * Usage:
 * ```
 * const useStyles = createThemedStyles((colors) => ({
 *   container: { backgroundColor: colors.background },
 *   text: { color: colors.text },
 * }))
 * ```
 */
export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ColorPalette) => T
) {
  return function useThemedStyles(): T {
    const { colors } = useTheme()
    return useMemo(() => StyleSheet.create(factory(colors)), [colors])
  }
}
