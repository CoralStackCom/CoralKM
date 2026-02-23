import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { IconSymbol } from '../icon-symbol'
import { ActionRowProps } from './ActionRow.interfaces'
import { styles } from './ActionRow.styles'

/**
 * ActionRow component for displaying a row with title, description, and icons
 *
 * Wrapped in React.memo to prevent unnecessary re-renders when props are unchanged.
 * */
const ActionRowComponent: React.FC<ActionRowProps> = ({
  title,
  description,
  onPress,
  leftIcon,
  rightIcon,
  iconColor,
}) => {
  // Render
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={[styles.row, { minHeight: 44 }]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={title}
        accessibilityHint={description ? description : undefined}
        accessibilityState={{ disabled: !onPress }}
      >
        <View style={styles.left}>
          {leftIcon && (
            <IconSymbol name={leftIcon} size={24} style={styles.resourceIcon} color={iconColor} />
          )}
          <View style={styles.text}>
            <Text style={{ color: iconColor, ...styles.text }}>{title}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
          </View>
        </View>

        <View style={styles.right}>
          {rightIcon ?? <Ionicons name="chevron-forward" size={20} color="#999" />}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export const ActionRow = React.memo(ActionRowComponent)
ActionRow.displayName = 'ActionRow'
