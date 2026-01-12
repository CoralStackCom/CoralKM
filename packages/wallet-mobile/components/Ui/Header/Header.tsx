import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { HeaderProps } from './Header.interfaces'
import { styles } from './Header.styles'

export const Header: React.FC<HeaderProps> = ({ title }) => {
  // Render
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={() => router.back()} hitSlop={10}>
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
      {/* Right placeholder to keep title centered */}
      <View style={styles.rightPlaceholder} />
    </View>
  )
}
