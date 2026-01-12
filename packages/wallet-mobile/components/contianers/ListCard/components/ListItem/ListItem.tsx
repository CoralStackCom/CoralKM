import React from 'react'
import { View } from 'react-native'
import { ListItemProps } from './ListItem.interfces'
import { styles } from './ListItem.styles'

export const ListItem: React.FC<ListItemProps> = ({ left, right }) => {
  return (
    <View style={styles.row}>
      <View style={styles.left}>{left}</View>
      {right && <View style={styles.right}>{right}</View>}
    </View>
  )
}
