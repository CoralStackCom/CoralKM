import type React from 'react'
import { StyleSheet, TextInput } from 'react-native'

interface TextareaProps extends React.ComponentProps<typeof TextInput> {
  className?: string
}

export function Textarea({ style, ...props }: TextareaProps) {
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

const styles = StyleSheet.create({
  textarea: {
    minHeight: 64,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FFF',
  },
})
