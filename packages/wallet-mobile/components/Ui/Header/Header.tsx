// imports
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useCallback } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { HeaderProps } from './Header.interfaces'
import { styles } from './Header.styles'

/**
 * Header
 *
 * A reusable screen header with optional back button
 * and optional right-side action.
 *
 * Wrapped in React.memo to prevent unnecessary re-renders when props are unchanged.
 */
const HeaderComponent: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
}) => {
  const router = useRouter()
  const handleBack = useCallback(() => router.back(), [router])

  return (
    <View style={styles.container}>
      {/* Left */}
      <View style={styles.side}>
        {showBackButton && (
          <TouchableOpacity
            style={[styles.iconButton, { minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'center' }]}
            onPress={handleBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Navigate to the previous screen"
          >
            <Ionicons name="arrow-back" size={24} color="#b0c2ccff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Center */}
      <Text style={styles.title} accessibilityRole="header">{title}</Text>

      {/* Right */}
      <View style={styles.side}>{rightComponent}</View>
    </View>
  )
}

export const Header = React.memo(HeaderComponent)
Header.displayName = 'Header'
