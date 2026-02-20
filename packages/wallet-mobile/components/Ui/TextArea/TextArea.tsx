import type React from 'react'
import { Text, TextInput, View } from 'react-native'
import { TextareaProps } from './TextArea.interfaces'
import { styles } from './TextArea.styles'

/**
 * Textarea component for multi-line text input.
 *
 * Provides consistent styling with optional inline
 * validation error display.
 */
export const Textarea: React.FC<TextareaProps> = ({ style, error, ...props }) => {
  const hasError = typeof error === 'string' && error.length > 0

  return (
    <View>
      <TextInput
        style={[styles.textarea, style, hasError && styles.textareaError]}
        multiline
        placeholderTextColor="#9CA3AF"
        textAlignVertical="top"
        {...props}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}
