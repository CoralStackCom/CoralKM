import { IconSymbol } from '@/components/others/icon-symbol'
import { useAuth } from '@/providers/AuthContext'
import { useState } from 'react'
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from './Settings.style'

/**
 * Settings screen for managing app security and authentication
 */
export default function SettingsScreen() {
  // Component State
  const { isAuthEnabled, enableAuth, disableAuth, biometricType, lockApp } = useAuth()
  const [passcode, setPasscode] = useState('')
  const [confirmPasscode, setConfirmPasscode] = useState('')
  const [showSetup, setShowSetup] = useState(false)

  /**
   * Handle enabling authentication with passcode validation
   */
  const handleEnableAuth = async () => {
    if (passcode.length !== 6) {
      Alert.alert('Error', 'Passcode must be 6 digits')
      return
    }

    if (passcode !== confirmPasscode) {
      Alert.alert('Error', 'Passcodes do not match')
      return
    }

    await enableAuth(passcode)
    setPasscode('')
    setConfirmPasscode('')
    setShowSetup(false)
    Alert.alert('Success', 'Authentication enabled successfully')
  }

  /**
   * Handle disabling authentication with confirmation dialog
   */
  const handleDisableAuth = () => {
    Alert.alert('Disable Authentication', 'Are you sure you want to disable app lock?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disable',
        style: 'destructive',
        onPress: async () => {
          await disableAuth()
          Alert.alert('Success', 'Authentication disabled')
        },
      },
    ])
  }

  // Render
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <IconSymbol name="gear" size={40} color="#1B5678" />
        <Text style={styles.title}>Security Settings</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="lock.shield.fill" size={24} color="#1B5678" />
          <Text style={styles.sectionTitle}>App Lock</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Authentication</Text>
              <Text style={styles.settingDescription}>
                {isAuthEnabled
                  ? `Enabled with ${biometricType || 'passcode'}`
                  : 'Protect your app with biometric or passcode'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.toggleButton, isAuthEnabled && styles.toggleButtonActive]}
              onPress={() => (isAuthEnabled ? handleDisableAuth() : setShowSetup(true))}
            >
              <Text style={[styles.toggleText, isAuthEnabled && styles.toggleTextActive]}>
                {isAuthEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showSetup && !isAuthEnabled && (
          <View style={styles.setupCard}>
            <Text style={styles.setupTitle}>Setup Passcode</Text>
            <Text style={styles.setupDescription}>
              Create a 6-digit passcode. You can also use {biometricType || 'biometric'} to unlock.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter Passcode</Text>
              <TextInput
                style={styles.input}
                value={passcode}
                onChangeText={setPasscode}
                keyboardType="number-pad"
                maxLength={6}
                secureTextEntry
                placeholder="6-digit passcode"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Passcode</Text>
              <TextInput
                style={styles.input}
                value={confirmPasscode}
                onChangeText={setConfirmPasscode}
                keyboardType="number-pad"
                maxLength={6}
                secureTextEntry
                placeholder="Re-enter passcode"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowSetup(false)
                  setPasscode('')
                  setConfirmPasscode('')
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleEnableAuth}
              >
                <Text style={styles.saveButtonText}>Enable</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isAuthEnabled && (
          <TouchableOpacity style={styles.lockButton} onPress={lockApp}>
            <IconSymbol name="lock.fill" size={24} color="#fff" />
            <Text style={styles.lockButtonText}>Lock App Now</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoCard}>
        <IconSymbol name="info.circle.fill" size={20} color="#1B5678" />
        <Text style={styles.infoText}>
          When enabled, youll need to authenticate every time you open the app or when returning
          from background. Your passcode is stored securely on your device.
        </Text>
      </View>
    </ScrollView>
  )
}
