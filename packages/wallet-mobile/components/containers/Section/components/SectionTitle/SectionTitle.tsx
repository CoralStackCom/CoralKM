import React from 'react'
import { Text } from 'react-native'
import { SectionTitleProps } from './SectionTitle.interfaces'
import { styles } from './SectionTitle.styles'

/*
 * Section Title Component
 */

export const SectionTitle: React.FC<SectionTitleProps> = ({ value, style, ...props }) => {
  // Render
  return (
    <Text style={[styles.sectionTitle, style]} {...props}>
      {value}
    </Text>
  )
}
