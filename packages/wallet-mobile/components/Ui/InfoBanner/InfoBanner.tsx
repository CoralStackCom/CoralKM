import React from 'react'
import { Text, View } from 'react-native'
import { InfoBannerProps } from './InfoBanner.interfaces'
import { styles } from './InfoBanner.styles'

/*
 * InfoBanner component to display informational messages with optional icon
 */
export const InfoBanner: React.FC<InfoBannerProps> = ({ icon, children }) => {
  // Render
  return (
    <View style={styles.infoCard}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.infoText}>{children}</Text>
    </View>
  )
}
