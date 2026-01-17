import '../shim'

import { ThemedView } from '@/components/Ui/ThemedView/themed-view'
import { SetupScreen } from '@/Views'
import React from 'react'

/**
 * Home screen component with setup interface and background
 */
export const Setup: React.FC = () => {
  // Render
  return (
    <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <SetupScreen />
    </ThemedView>
  )
}
export default Setup
