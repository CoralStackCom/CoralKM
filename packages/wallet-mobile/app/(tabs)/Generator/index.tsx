import { ThemedView } from '@/components/others/themed-view'
import { Background } from '@/components/Shared/Background'
import { EntropyGenerator } from '@/components/Shared/EntropyGenerator'
import React, { useRef } from 'react'
import { Text } from 'react-native'

/**
 * Page component for generating cryptographic entropy through user interaction
 */
export default function App() {
  // Component State
  const ref = useRef<any>(null)
  const [seed, setSeed] = React.useState('')

  /**
   * Handle entropy value changes from the generator
   */
  const handleEntropyChange = (val: any) => {
    setSeed(val)
  }

  // Render
  return (
    <ThemedView style={{ flex: 1 }}>
      <Background view="underwater" />
      <EntropyGenerator size={300} onChange={handleEntropyChange} ref={ref} />
      <Text
        style={{
          marginTop: 20,
          textAlign: 'center',
          width: '90%',
        }}
      >
        {seed}
      </Text>
    </ThemedView>
  )
}
