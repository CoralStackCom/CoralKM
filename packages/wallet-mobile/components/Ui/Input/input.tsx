import type React from 'react'
import { TextInput } from 'react-native'
import { InputProps } from './Input.interfaces'
import { styles } from './input.styles'

/**
 * Input component.
 *
 * A styled wrapper around React Native `TextInput`
 * that provides consistent default styling.
 */

export const Input: React.FC<InputProps> = ({ style, ...props }) => {
  return <TextInput style={[styles.input, style]} placeholderTextColor="#9CA3AF" {...props} />
}
