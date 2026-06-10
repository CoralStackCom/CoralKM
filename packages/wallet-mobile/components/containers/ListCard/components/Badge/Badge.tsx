import React from 'react'
import { Text, View } from 'react-native'
import type { BadgeProps } from './Badge.interfaces'
import { styles } from './Badge.styles'

/**
 * Badge component for displaying a small label indicator.
 *
 * Wrapped in React.memo to prevent unnecessary re-renders when props are unchanged.
 */
const BadgeComponent: React.FC<BadgeProps> = ({ label }) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  )
}

export const Badge = React.memo(BadgeComponent)
Badge.displayName = 'Badge'
