import type React from 'react'
import { TextInput } from 'react-native'
import { TextareaProps } from './TextArea.interfaces'
import { styles } from './TextArea.styles'

/**
 * Textarea component for multi-line text input.
 * @param Style - Optional style prop to customize the TextArea appearance.
 * @param props - Additional TextInput props to configure the TextArea behavior.
 * @returns
 */
export const Textarea: React.FC<TextareaProps> = ({ style, ...props }) => {
  // Render
  return (
    <TextInput
      style={[styles.textarea, style]}
      multiline
      placeholderTextColor="#9CA3AF"
      textAlignVertical="top"
      {...props}
    />
  )
}
