import React from 'react'
import { View } from 'react-native'
import { ListItemProps } from './ListItem.interfaces'
import { styles } from './ListItem.styles'

/**
 * ListItem component for displaying a row with left and optional right content.
 *
 * Wrapped in React.memo to prevent unnecessary re-renders when props are unchanged.
 */
const ListItemComponent: React.FC<ListItemProps> = ({ left, right }) => {
  return (
    <View style={[styles.row, { minHeight: 44 }]} accessible={true} accessibilityRole="text">
      <View style={styles.left}>{left}</View>
      {right && <View style={styles.right}>{right}</View>}
    </View>
  )
}

export const ListItem = React.memo(ListItemComponent)
ListItem.displayName = 'ListItem'
