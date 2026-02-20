import Section from '@/components/containers/Section'
import { SectionHeader } from '@/components/containers/Section/components/SectionHeader/SectionHeader'
import { SectionTitle } from '@/components/containers/Section/components/SectionTitle/SectionTitle'
import ActionRow from '@/components/ui/ActionRow'
import Header from '@/components/ui/Header'
import React, { useState } from 'react'
import { SafeAreaView, ScrollView, Switch, View } from 'react-native'

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
 * using config-driven rendering.
 */
export const PrivacySecurityScreen: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricsEnabled, setBiometricsEnabled] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)

  /** Security toggle settings */
  const securitySettings: PrivacySettingItem[] = [
    {
      title: 'Two-Factor Authentication',
      description: 'Add extra security to your account',
      leftIcon: 'lock',
      value: twoFactorEnabled,
      onValueChange: setTwoFactorEnabled,
    },
    {
      title: 'Biometric Login',
      description: 'Use Face ID or fingerprint to log in',
      leftIcon: 'touch.fill',
      value: biometricsEnabled,
      onValueChange: setBiometricsEnabled,
    },
    {
      title: 'Login Alerts',
      description: 'Get notified of new logins',
      leftIcon: 'bell',
      value: loginAlerts,
      onValueChange: setLoginAlerts,
    },
  ]

  /** Security action settings (non-toggle) */
  const securityActions: PrivacySettingItem[] = [
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
  ]

  /** Data management actions */
  const dataActions: PrivacySettingItem[] = [
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
  ]

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
