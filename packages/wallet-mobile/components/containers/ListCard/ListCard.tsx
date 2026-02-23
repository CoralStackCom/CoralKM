import React from 'react'
import { View } from 'react-native'
import { ListCardProps } from './ListCard.interfaces'
import { styles } from './ListCard.styles'

/**
 * ListCard container component.
 * Extends ViewProps to allow standard View properties.
 *
 * Wrapped in React.memo to prevent unnecessary re-renders when props are unchanged.
 */
const ListCardComponent: React.FC<ListCardProps> = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  )
}

export const ListCard = React.memo(ListCardComponent)
ListCard.displayName = 'ListCard'
