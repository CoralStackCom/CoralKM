import './shim'

import { ThemedView } from '@/components/Ui/ThemedView/themed-view'
import AuthScreen from '@/Views/AuthScreen/AuthScreen'
import { router } from 'expo-router'
import React from 'react'

/**
 * Home screen component with authentication interface
 */

export const HomeScreen: React.FC = () => {
  // Render
  return (
    <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <AuthScreen
        isAuthenticated={false}
        onGetOOBCode={async (email: string) => {
          await new Promise(resolve => setTimeout(resolve, 2000))
          if (email === 'test@angelfish.app') {
            throw new Error(
              "There was a connection error trying to login to Angelfish. Make sure you're online."
            )
          }
        }}
        onAuthenticate={async (oob_code: string) => {
          await new Promise(resolve => setTimeout(resolve, 2000))
          if (oob_code === '111111') {
            throw new Error('Invalid OOB Code')
          }
          router.replace('/setup')
        }}
      />
    </ThemedView>
  )
}
export default HomeScreen
