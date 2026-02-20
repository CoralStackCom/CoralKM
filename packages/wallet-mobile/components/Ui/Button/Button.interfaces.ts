import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native'

/**
 * Button component properties
 */
export interface ButtonProps {
  /** Variant of the button, affecting color and style */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

  /** Size of the button */
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

  /** Content inside the button */
  children?: React.ReactNode

  /** Whether the button is disabled */
  disabled?: boolean

  /** Callback function when the button is pressed */
  onPress?: () => void

  /** Custom style for the button container */
  style?: StyleProp<ViewStyle>

  /** Custom style for the text inside the button */
  textStyle?: TextStyle
}
