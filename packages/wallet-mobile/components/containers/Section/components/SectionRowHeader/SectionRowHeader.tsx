// imports
import { IconSymbol } from '@/components/ui/icon-symbol'
import React from 'react'
import { Text, View } from 'react-native'
import { SectionRowHeaderProps } from './SectionRowHeader.interfaces'
import { styles } from './SectionRowHeader.styles'

/**
 * SectionRowHeader
 *
 * A compact horizontal header used to label
 * sections inside a screen (e.g. App Lock, Privacy).
 */

// component
export const SectionRowHeader: React.FC<SectionRowHeaderProps> = ({
  iconName,
  title,
  iconSize = 24,
  iconColor = '#1B5678',
}) => {
  return (
    <View style={styles.container}>
      <IconSymbol name={iconName} size={iconSize} color={iconColor} />
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}
