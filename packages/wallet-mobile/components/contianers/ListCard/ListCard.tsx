import React from 'react'
import { View } from 'react-native'
import { ListCardProps } from './ListCard.interfaces'
import { styles } from './ListCard.styles'

/*
 * ListCardProps interface
 * Extends ViewProps to allow standard View properties
 * */

export const ListCard: React.FC<ListCardProps> = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  )
}
