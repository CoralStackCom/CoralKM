import { Background } from '@/components/Background'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useAuth } from '@/providers/AuthContext'
import type React from 'react'
import { useState } from 'react'
import { Text, TouchableOpacity, Vibration, View } from 'react-native'
import { styles } from './UnlockScreen.styles'

/**
 * Unlock screen component for app authentication
 */
const UnlockScreen: React.FC = () => {
  // Component State
  const { unlock, verifyPasscode, biometricType } = useAuth()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState(false)
  const [showPasscode, setShowPasscode] = useState(false)

  /**
   * Handle biometric unlock attempt
   */
  const handleBiometricUnlock = async () => {
    const success = await unlock()
    if (!success) {
      setShowPasscode(true)
    }
  }

  /**
   * Handle passcode digit input
   */
  const handlePasscodeInput = (digit: string) => {
    if (passcode.length < 6) {
      const newPasscode = passcode + digit
      setPasscode(newPasscode)

      if (newPasscode.length === 6) {
        verifyPasscodeInput(newPasscode)
      }
    }
  }

  /**
   * Verify entered passcode
   */
  const verifyPasscodeInput = async (code: string) => {
    const success = await verifyPasscode(code)
    if (!success) {
      setError(true)
      Vibration.vibrate(500)
      setTimeout(() => {
        setPasscode('')
        setError(false)
      }, 500)
    }
  }

  /**
   * Handle passcode deletion
   */
  const handleDelete = () => {
    setPasscode(passcode.slice(0, -1))
    setError(false)
  }

  // Render
  return (
    <View style={styles.container}>
      <Background view="underwater" />
      <View style={styles.content}>
        <View style={styles.header}>
          <IconSymbol name="lock.fill" size={60} color="#1B5678" />
          <Text style={styles.title}>App Locked</Text>
          <Text style={styles.subtitle}>
            {showPasscode ? 'Enter your passcode' : `Use ${biometricType || 'biometric'} to unlock`}
          </Text>
        </View>
        {!showPasscode ? (
          <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricUnlock}>
            <IconSymbol
              name={biometricType === 'Face ID' ? 'faceid' : 'touchid'}
              size={48}
              color="#fff"
            />
            <Text style={styles.biometricText}>Unlock with {biometricType}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.passcodeContainer}>
            <View style={styles.dotsContainer}>
              {[...Array(6)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    passcode.length > i && styles.dotFilled,
                    error && styles.dotError,
                  ]}
                />
              ))}
            </View>
            <View style={styles.keypad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <TouchableOpacity
                  key={num}
                  style={styles.key}
                  onPress={() => handlePasscodeInput(num.toString())}
                >
                  <Text style={styles.keyText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.key} />
              <TouchableOpacity style={styles.key} onPress={() => handlePasscodeInput('0')}>
                <Text style={styles.keyText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.key} onPress={handleDelete}>
                <IconSymbol name="delete.left" size={24} color="#1B5678" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!showPasscode && (
          <TouchableOpacity onPress={() => setShowPasscode(true)}>
            <Text style={styles.usePasscodeText}>Use Passcode Instead</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default UnlockScreen
