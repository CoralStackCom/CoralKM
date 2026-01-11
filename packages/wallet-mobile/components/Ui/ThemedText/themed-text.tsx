import { Text } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'
import { ThemedTextProps } from './ThemedText.interfaces'
import { styles } from './ThemedText.syles'

/**
 * ThemedText component.
 * Renders text with theme-aware colors and styles.
 * @param lightColor - Optional color for light theme.
 * @param darkColor - Optional color for dark theme.
 * @param type - Text style type (default, title, subtitle, link).
 * @param style - Additional styles to apply.
 * @param rest - Other TextProps to pass to the Text
 * @returns
 **/

export const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  // Render
  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  )
}
