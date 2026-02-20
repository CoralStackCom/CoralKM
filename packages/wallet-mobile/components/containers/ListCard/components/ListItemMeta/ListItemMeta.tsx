import React from 'react'
import { Text, View } from 'react-native'
import { ListItemMetaProps } from './ListItemMeta.interfaces'
import { styles } from './ListItemMeta.styles'

/*
 * ListItemMeta component.
 * Displays title, subtitle, caption, and optional badge.
 * Used within ListItem to show item metadata.
 */

export const ListItemMeta: React.FC<ListItemMetaProps> = ({ title, subtitle, caption, badge }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {badge}
      </View>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  )
}
