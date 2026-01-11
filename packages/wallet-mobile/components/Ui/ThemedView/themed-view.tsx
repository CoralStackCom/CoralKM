import { View } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'
import type { ThemedViewProps } from './ThemedView.interfaces'

export const ThemedView: React.FC<ThemedViewProps> = ({
  style,
  lightColor,
  darkColor,
  ...otherProps
}) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

  return <View style={[{ backgroundColor }, style]} {...otherProps} />
}
