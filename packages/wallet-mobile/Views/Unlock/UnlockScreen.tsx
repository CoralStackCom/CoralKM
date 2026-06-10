import { Background } from '@/components/Background'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useAuth } from '@/providers/AuthContext'
import type React from 'react'
import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from './UnlockScreen.styles'

/**
 * Unlock screen — the wallet's second factor.
 *
 * Prompts for biometrics (with the device passcode as the OS-level fallback) to
 * open the wallet. No app PIN is used.
 */
const UnlockScreen: React.FC = () => {
  const { unlock, biometricType } = useAuth()
  const [attempting, setAttempting] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleUnlock = async () => {
    setAttempting(true)
    setFailed(false)
    const success = await unlock()
    if (!success) setFailed(true)
    setAttempting(false)
  }

  // Prompt automatically when the lock screen appears.
  useEffect(() => {
    handleUnlock()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View style={styles.container}>
      <Background view="underwater" />
      <View style={styles.content}>
        <View style={styles.header}>
          <IconSymbol name="lock.fill" size={60} color="#1B5678" />
          <Text style={styles.title}>App Locked</Text>
          <Text style={styles.subtitle}>
            {failed
              ? 'Authentication needed to continue'
              : `Use ${biometricType || 'biometrics'} to unlock`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleUnlock}
          disabled={attempting}
          accessibilityRole="button"
          accessibilityLabel={`Unlock with ${biometricType || 'biometrics'}`}
        >
          <IconSymbol
            name={biometricType === 'Face ID' ? 'faceid' : 'touchid'}
            size={48}
            color="#fff"
          />
          <Text style={styles.biometricText}>
            {attempting ? 'Authenticating…' : `Unlock with ${biometricType || 'biometrics'}`}
          </Text>
        </TouchableOpacity>

        {failed && (
          <TouchableOpacity onPress={handleUnlock}>
            <Text style={styles.usePasscodeText}>Try again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default UnlockScreen
