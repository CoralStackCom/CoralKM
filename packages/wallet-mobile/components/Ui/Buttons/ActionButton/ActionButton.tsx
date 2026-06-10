import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { ActionButtonProps } from './ActionButton.interfaces'
import styles from './ActionButton.styles'

/**
 * ActionButton
 *
 * A generic button component used to trigger
 * destructive or primary user actions (e.g. logout).
 *
 * Wrapped in React.memo to prevent unnecessary re-renders when props are unchanged.
 */

// interfaces

// component
const ActionButtonComponent: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  activeOpacity = 0.8,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, { minHeight: 44 }]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{label}</Text>
    </TouchableOpacity>
  )
}

export const ActionButton = React.memo(ActionButtonComponent)
ActionButton.displayName = 'ActionButton'
