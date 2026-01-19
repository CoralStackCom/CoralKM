import '../shim'

import { ThemedView } from '@/components/ui/ThemedView/themed-view'
import { SetupScreen } from '@/views'
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
