// imports
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { HeaderProps } from './Header.interfaces'
import { styles } from './Header.styles'

/**
 * Header
 *
 * A reusable screen header with optional back button
 * and optional right-side action.
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
}) => {
  const router = useRouter()
  return (
    <View style={styles.container}>
      {/* Left */}
      <View style={styles.side}>
        {showBackButton && (
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color="#b0c2ccff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Center */}
      <Text style={styles.title}>{title}</Text>

      {/* Right */}
      <View style={styles.side}>{rightComponent}</View>
    </View>
  )
}
