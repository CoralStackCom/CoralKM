// imports
import { IconSymbol } from '@/components/ui/icon-symbol'
import React from 'react'
import { Text, View } from 'react-native'
import { SectionHeaderProps } from './SectionHeader.interfaces'
import { styles } from './SectionHeader.styles'

/**
 * SectionHeader
 *
 * A reusable header component for screens or sections,
 * displaying an icon and a title in a centered layout.
 */

// component
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  iconName,
  title,
  iconSize = 40,
  iconColor = '#b0c2ccff',
}) => {
  return (
    <View style={styles.container}>
      <IconSymbol name={iconName} size={iconSize} color={iconColor} />
      <Text style={[styles.title, { color: iconColor }]}>{title}</Text>
    </View>
  )
}
