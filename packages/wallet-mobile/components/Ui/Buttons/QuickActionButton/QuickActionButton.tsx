// imports
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { IconSymbol } from '../../icon-symbol'
import { QuickActionButtonProps } from './QuickActionButton.interfaces'
import { styles } from './QuickActionButton.styles'

/**
 * QuickActionButton
 *
 * A compact button used for quick user actions
 * such as chat, call, share, or navigate.
 */

// component
export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  iconName,
  iconBackgroundColor,
  onPress,
  activeOpacity = 0.8,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={activeOpacity}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <IconSymbol name={iconName} size={20} style={styles.icon} color="white" />
      </View>

      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  )
}
