import React from 'react'
import { Text, View } from 'react-native'
import type { BadgeProps } from './Badge.interfaces'
import { styles } from './Badge.styles'

export const Badge: React.FC<BadgeProps> = ({ label }) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  )
}
