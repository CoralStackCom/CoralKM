import Section from '@/components/containers/Section'
import { SectionHeader } from '@/components/containers/Section/components/SectionHeader/SectionHeader'
import { SectionRowHeader } from '@/components/containers/Section/components/SectionRowHeader'
import Button from '@/components/ui/Button'
import Header from '@/components/ui/Header'
import { IconSymbol } from '@/components/ui/icon-symbol'
import InfoBanner from '@/components/ui/InfoBanner'
import { Input } from '@/components/ui/Input'
import { useFormValidation, validators } from '@/hooks'
import { useAuth } from '@/providers/AuthContext'
import React, { useMemo, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { styles } from './Settings.styles'

/**
 * Settings component.
 *
 * Manages app security and authentication settings including
 * passcode setup, biometric login, and app lock controls.
 */
export const Settings: React.FC = () => {
  const { isAuthEnabled, enableAuth, disableAuth, biometricType, lockApp } = useAuth()
  const [passcode, setPasscode] = useState('')
  const [confirmPasscode, setConfirmPasscode] = useState('')
  const [showSetup, setShowSetup] = useState(false)

  const schema = useMemo(
    () => ({
      passcode: [
        validators.required('Passcode is required'),
        validators.exactLength(6, 'Passcode must be 6 digits'),
        validators.pattern(/^\d{6}$/, 'Passcode must be 6 digits'),
      ],
      confirmPasscode: [
        validators.required('Please confirm your passcode'),
        validators.matches('passcode', 'Passcodes do not match'),
      ],
    }),
    []
  )

  const { errors, validateAll, clearFieldError, clearErrors } = useFormValidation(schema)

  /**
   * Handles enabling authentication with passcode validation
   */
  const handleEnableAuth = async () => {
    if (!validateAll({ passcode, confirmPasscode })) return

    await enableAuth(passcode)
    setPasscode('')
    setConfirmPasscode('')
    setShowSetup(false)
    clearErrors()
    Alert.alert('Success', 'Authentication enabled successfully')
  }

  /**
   * Handles disabling authentication with confirmation dialog
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

  /** Resets the setup form and hides it */
  const handleCancelSetup = () => {
    setShowSetup(false)
    setPasscode('')
    setConfirmPasscode('')
    clearErrors()
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      <ScrollView>
        <SectionHeader title="Security Settings" iconName="gear" />
        <Section style={styles.section}>
          <SectionRowHeader title="App Lock Settings" iconName="lock.shield.fill" />
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
              <Button
                style={[styles.toggleButton, isAuthEnabled && styles.toggleButtonActive]}
                onPress={() => (isAuthEnabled ? handleDisableAuth() : setShowSetup(true))}
              >
                <Text style={[styles.toggleText, isAuthEnabled && styles.toggleTextActive]}>
                  {isAuthEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </Button>
            </View>
          </View>

          {showSetup && !isAuthEnabled && (
            <View style={styles.setupCard}>
              <Text style={styles.setupTitle}>Setup Passcode</Text>
              <Text style={styles.setupDescription}>
                Create a 6-digit passcode. You can also use {biometricType || 'biometric'} to
                unlock.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter Passcode</Text>
                <Input
                  style={styles.input}
                  value={passcode}
                  onChangeText={(text) => {
                    setPasscode(text)
                    clearFieldError('passcode')
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  secureTextEntry
                  placeholder="6-digit passcode"
                  error={errors.passcode}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Passcode</Text>
                <Input
                  style={styles.input}
                  value={confirmPasscode}
                  onChangeText={(text) => {
                    setConfirmPasscode(text)
                    clearFieldError('confirmPasscode')
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  secureTextEntry
                  placeholder="Re-enter passcode"
                  error={errors.confirmPasscode}
                />
              </View>

              <View style={styles.buttonRow}>
                <Button
                  variant="outline"
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancelSetup}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Button>

                <Button
                  style={[styles.button, styles.saveButton]}
                  onPress={handleEnableAuth}
                >
                  <Text style={styles.saveButtonText}>Enable</Text>
                </Button>
              </View>
            </View>
          )}

          {isAuthEnabled && (
            <TouchableOpacity style={styles.lockButton} onPress={lockApp}>
              <IconSymbol name="lock.fill" size={24} color="#fff" />
              <Text style={styles.lockButtonText}>Lock App Now</Text>
            </TouchableOpacity>
          )}
        </Section>

        <View style={styles.infoCard}>
          <InfoBanner icon={<IconSymbol name="info.circle.fill" size={20} color="white" />}>
            <Text style={styles.infoText}>
              When enabled, you'll need to authenticate every time you open the app or when returning
              from background. Your passcode is stored securely on your device.
            </Text>
          </InfoBanner>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings
