import type React from 'react'
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native'
import { ButtonProps } from './Button.interfaces'
import { styles } from './Button.styles'

/**
 * Button component.
 *
 * A flexible and reusable button component supporting multiple variants, sizes, and states.
 * Features:
 * - Pressable feedback
 * - Disabled state
 * - Supports text or ReactNode as children
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  disabled = false,
  onPress,
  style,
  textStyle,
}) => {
  const buttonStyle: ViewStyle[] = [
    styles.base,
    styles[variant as keyof typeof styles] as ViewStyle,
    styles[`size-${size}` as keyof typeof styles] as ViewStyle,
    disabled ? styles.disabled : {},
    StyleSheet.flatten(style) ?? {},
  ]

  return (
    <Pressable
      style={({ pressed }) =>
        [...buttonStyle, pressed && !disabled ? styles.pressed : {}] as ViewStyle[]
      }
      onPress={onPress}
      disabled={disabled}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  )
}
export default Button
