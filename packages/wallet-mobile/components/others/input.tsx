import type React from 'react'
import { StyleSheet, TextInput } from 'react-native'

interface InputProps extends React.ComponentProps<typeof TextInput> {
  className?: string
}

export function Input({ style, ...props }: InputProps) {
  return <TextInput style={[styles.input, style]} placeholderTextColor="#9CA3AF" {...props} />
}

const styles = StyleSheet.create({
  input: {
    height: 36,
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
