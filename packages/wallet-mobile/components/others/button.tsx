import type React from 'react'
import { Pressable, StyleSheet, Text, type TextStyle, type ViewStyle } from 'react-native'

interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  children?: React.ReactNode
  disabled?: boolean
  onPress?: () => void
  style?: ViewStyle
  textStyle?: TextStyle
}

export function Button({
  variant = 'default',
  size = 'default',
  children,
  disabled = false,
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant as keyof typeof styles],
    styles[`size-${size}` as keyof typeof styles],
    disabled && styles.disabled,
    style,
  ]

  return (
    <Pressable
      style={({ pressed }) => [buttonStyle, pressed && !disabled && styles.pressed]}
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

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8,
  },
  default: {
    backgroundColor: '#3B82F6',
  },
  destructive: {
    backgroundColor: '#EF4444',
  },
  outline: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondary: {
    backgroundColor: '#E5E7EB',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
  },
  'size-default': {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  'size-sm': {
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  'size-lg': {
    height: 40,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  'size-icon': {
    width: 36,
    height: 36,
  },
  'size-icon-sm': {
    width: 32,
    height: 32,
  },
  'size-icon-lg': {
    width: 40,
    height: 40,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
})
