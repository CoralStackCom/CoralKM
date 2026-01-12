import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { IconSymbol } from '../icon-symbol'
import { ActionRowProps } from './ActionRow.interfaces'
import { styles } from './ActionRow.styles'

/**
 * ActionRow component for displaying a row with title, description, and icons
 *
 * */
export const ActionRow: React.FC<ActionRowProps> = ({
  title,
  description,
  onPress,
  leftIcon,
  rightIcon,
}) => {
  // Render
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View style={styles.left}>
          {leftIcon && <IconSymbol name={leftIcon} size={24} style={styles.resourceIcon} />}
          <View style={styles.text}>
            <Text style={styles.title}>{title}</Text>
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
