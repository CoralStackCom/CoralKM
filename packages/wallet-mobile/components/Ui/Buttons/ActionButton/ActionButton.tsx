import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { ActionButtonProps } from './ActionButton.interfaces'
import styles from './ActionButton.styles'

/**
 * ActionButton
 *
 * A generic button component used to trigger
 * destructive or primary user actions (e.g. logout).
 */

// interfaces

// component
export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  activeOpacity = 0.8,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{label}</Text>
    </TouchableOpacity>
  )
}
