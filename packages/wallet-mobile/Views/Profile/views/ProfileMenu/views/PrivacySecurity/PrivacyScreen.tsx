import Section from '@/components/containers/Section'
import { SectionHeader } from '@/components/containers/Section/components/SectionHeader/SectionHeader'
import { SectionTitle } from '@/components/containers/Section/components/SectionTitle/SectionTitle'
import ActionRow from '@/components/ui/ActionRow'
import Header from '@/components/ui/Header'
import { BiometricService } from '@/providers/auth/biometric-service'
import type { BiometricCapability } from '@/providers/auth/biometric-service'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, Switch, View } from 'react-native'

import type { PrivacySettingItem } from './Privacy.interfaces'
import { styles } from './Privacy.styles'
import {
  handleChangePassword,
  handleDeleteAccount,
  handleDownloadData,
  handleViewLoginActivity,
} from './PrivacyScreen.utils'

/**
 * PrivacySecurityScreen component.
 *
 * Manages security settings including two-factor authentication,
 * biometric login, login alerts, and data management options
 * using config-driven rendering. Biometric toggle is wired to
 * BiometricService for real device capability detection and
 * persisted user preference.
 */
export const PrivacySecurityScreen: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricsEnabled, setBiometricsEnabled] = useState(false)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [biometricCapability, setBiometricCapability] = useState<BiometricCapability | null>(null)

  /** Load biometric capability and saved preference on mount */
  useEffect(() => {
    const init = async () => {
      const capability = await BiometricService.getCapability()
      setBiometricCapability(capability)

      if (capability.isAvailable && capability.hasEnrolledBiometrics) {
        const enabled = await BiometricService.isEnabled()
        setBiometricsEnabled(enabled)
      } else {
        setBiometricsEnabled(false)
      }
    }
    init()
  }, [])

  /** Determine whether the biometric toggle should be disabled */
  const isBiometricDisabled =
    !biometricCapability ||
    !biometricCapability.isAvailable ||
    !biometricCapability.hasEnrolledBiometrics

  /** Derive a description based on device capability */
  const biometricDescription = isBiometricDisabled
    ? 'Biometric authentication is not available on this device'
    : `Use ${BiometricService.getBiometricLabel(biometricCapability!.biometricTypes)} to unlock the app`

  /** Handle biometric toggle with authentication gate */
  const handleBiometricToggle = useCallback(
    async (newValue: boolean) => {
      if (newValue) {
        // Require biometric authentication before enabling
        const success = await BiometricService.authenticate(
          'Authenticate to enable biometric lock'
        )
        if (!success) {
          Alert.alert(
            'Authentication Failed',
            'Biometric authentication is required to enable this feature.'
          )
          return
        }
      }

      await BiometricService.setEnabled(newValue)
      setBiometricsEnabled(newValue)
    },
    []
  )

  /** Security toggle settings (memoized to avoid re-creating on every render) */
  const securitySettings: PrivacySettingItem[] = useMemo(() => [
    {
      title: 'Two-Factor Authentication',
      description: 'Add extra security to your account',
      leftIcon: 'lock',
      value: twoFactorEnabled,
      onValueChange: setTwoFactorEnabled,
    },
    {
      title: 'Biometric Login',
      description: biometricDescription,
      leftIcon: 'touch.fill',
      value: biometricsEnabled,
      onValueChange: handleBiometricToggle,
      disabled: isBiometricDisabled,
    },
    {
      title: 'Login Alerts',
      description: 'Get notified of new logins',
      leftIcon: 'bell',
      value: loginAlerts,
      onValueChange: setLoginAlerts,
    },
  ], [twoFactorEnabled, biometricDescription, biometricsEnabled, handleBiometricToggle, isBiometricDisabled, loginAlerts])

  /** Security action settings (non-toggle, memoized since these are static) */
  const securityActions: PrivacySettingItem[] = useMemo(() => [
    {
      title: 'Change Password',
      description: 'Update your password regularly',
      leftIcon: 'key',
      onPress: handleChangePassword,
    },
    {
      title: 'Login Activity',
      description: 'View recent login sessions',
      leftIcon: 'location',
      onPress: handleViewLoginActivity,
    },
  ], [])

  /** Data management actions (memoized since these are static) */
  const dataActions: PrivacySettingItem[] = useMemo(() => [
    {
      title: 'Download Your Data',
      description: 'Get a copy of all your information',
      leftIcon: 'download.alt.fill',
      onPress: handleDownloadData,
    },
    {
      title: 'Delete Account',
      description: 'Permanently delete your account',
      leftIcon: 'trash.fill',
      onPress: handleDeleteAccount,
    },
  ], [])

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Privacy & Security" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Security Settings" iconName="lock" />

        {/* Security Section */}
        <Section>
          <SectionTitle value="Security" />
          <View style={styles.card}>
            {securitySettings.map((item) => (
              <ActionRow
                key={item.title}
                title={item.title}
                description={item.description}
                leftIcon={item.leftIcon}
                rightIcon={
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    disabled={item.disabled}
                  />
                }
              />
            ))}
            {securityActions.map((item) => (
              <ActionRow
                key={item.title}
                title={item.title}
                description={item.description}
                leftIcon={item.leftIcon}
                onPress={item.onPress}
              />
            ))}
          </View>
        </Section>

        {/* Data Management Section */}
        <Section>
          <SectionTitle value="Data Management" />
          <View style={styles.card}>
            {dataActions.map((item) => (
              <ActionRow
                key={item.title}
                title={item.title}
                description={item.description}
                leftIcon={item.leftIcon}
                onPress={item.onPress}
              />
            ))}
          </View>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
