import type React from 'react'
import { Text, TextInput, View } from 'react-native'
import { InputProps } from './Input.interfaces'
import { styles } from './input.styles'

/**
 * Input component.
 *
 * A styled wrapper around React Native `TextInput`
 * that provides consistent default styling with
 * optional inline validation error display.
 */

export const Input: React.FC<InputProps> = ({ style, error, showCounter, ...props }) => {
  const hasError = typeof error === 'string' && error.length > 0
  const counterVisible =
    showCounter && typeof props.maxLength === 'number' && typeof props.value === 'string'
  const currentLength = typeof props.value === 'string' ? props.value.length : 0

  return (
    <View>
      <TextInput
        style={[styles.input, style, hasError && styles.inputError]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      <View style={styles.footerRow}>
        {hasError ? <Text style={styles.errorText}>{error}</Text> : <View />}
        {counterVisible && (
          <Text style={styles.counterText}>
            {currentLength}/{props.maxLength}
          </Text>
        )}
      </View>
    </View>
  )
}
