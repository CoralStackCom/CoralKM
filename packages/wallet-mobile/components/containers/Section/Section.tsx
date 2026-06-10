import React from 'react'
import { View } from 'react-native'
import type { SectionProps } from './Section.interfaces'
import { styles } from './Section.styles'

/*
 * Section Container Component
 */

export const Section: React.FC<SectionProps> = ({ children, style, ...props }) => {
  // Render
  return (
    <View style={[styles.section, style]} {...props}>
      {children}
    </View>
  )
}
