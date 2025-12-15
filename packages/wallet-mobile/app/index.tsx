import './shim'

import { ThemedView } from '@/components/others/themed-view'
import { Background } from '@/components/Shared/Background'
import AuthScreen from '@/components/ui/AuthScreen/AuthScreen'
import { router } from 'expo-router'
import React from 'react'

/**
 * Home screen component with authentication interface
 */

export default function HomeScreen() {
  // Render
  return (
    <ThemedView style={{ flex: 1 }}>
      <Background view="sky" />
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
