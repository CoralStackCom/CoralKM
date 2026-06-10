import Section from '@/components/containers/Section'
import { SectionHeader } from '@/components/containers/Section/components/SectionHeader/SectionHeader'
import { SectionTitle } from '@/components/containers/Section/components/SectionTitle/SectionTitle'
import ActionRow from '@/components/ui/ActionRow'
import Header from '@/components/ui/Header'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { palette } from '@/constants/design'
import { useAuth } from '@/providers/AuthContext'
import { DeviceService } from '@/providers/devices'
import { SessionService } from '@/providers/auth/session-service'
import { usePreferences } from '@/providers/preferences'
import { useUserContext } from '@/providers/UserContext'
import { useRouter, type Href } from 'expo-router'
import React, { useCallback } from 'react'
import { Alert, SafeAreaView, ScrollView, Share, Switch, Text, TouchableOpacity, View } from 'react-native'

import { styles } from './Privacy.styles'

/**
 * Security screen (merged Settings + Privacy).
 *
 * - Two-Factor Authentication = biometric app lock (the wallet's second factor).
 * - Login alerts, login activity, data export, and account deletion are all real,
 *   device-integrated actions.
 */
export const PrivacySecurityScreen: React.FC = () => {
  const router = useRouter()
  const { isAuthEnabled, isBiometricAvailable, biometricType, enableAuth, disableAuth, lockApp } =
    useAuth()
  const { preferences, setPrivacyPref } = usePreferences()
  const { loginAlerts } = preferences.privacy
  const { user, household, encryptionSeed, logout } = useUserContext()

  /** Toggle the biometric app lock (two-factor). Each change is biometric-gated. */
  const handleToggle2FA = useCallback(
    async (next: boolean) => {
      const ok = next ? await enableAuth() : await disableAuth()
      if (!ok) {
        Alert.alert(
          'Authentication needed',
          'We couldn’t confirm it’s you, so the app lock was not changed.'
        )
      }
    },
    [enableAuth, disableAuth]
  )

  /** Export all on-device data via the share sheet. */
  const handleDownloadData = useCallback(async () => {
    const [sessions] = await Promise.all([SessionService.getAll()])
    const payload = {
      exportedAt: new Date().toISOString(),
      user,
      household,
      hasEncryptionSeed: !!encryptionSeed,
      preferences,
      devices: DeviceService.getAll(),
      loginSessions: sessions,
    }
    try {
      await Share.share({ title: 'CoralKM data export', message: JSON.stringify(payload, null, 2) })
    } catch {
      Alert.alert('Export failed', 'Could not export your data. Please try again.')
    }
  }, [user, household, encryptionSeed, preferences])

  /** Permanently clear all local account data, then sign out. */
  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account Data',
      'This permanently removes your profile, settings, keys and history from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await SessionService.clear()
            await logout()
            router.replace('/')
          },
        },
      ]
    )
  }, [logout, router])

  const twoFactorDescription = !isBiometricAvailable
    ? 'Set up Face ID / fingerprint in your device settings to enable'
    : isAuthEnabled
      ? `On · unlock with ${biometricType}`
      : `Require ${biometricType} to open the wallet`

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Security" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Security Settings" iconName="lock" />

        {/* Two-Factor / App Lock */}
        <Section>
          <SectionTitle value="App Lock" />
          <View style={styles.card}>
            <ActionRow
              title="Two-Factor Authentication"
              description={twoFactorDescription}
              leftIcon="touch.fill"
              chipColor={palette.teal}
              rightIcon={
                <Switch
                  value={isAuthEnabled}
                  onValueChange={handleToggle2FA}
                  disabled={!isBiometricAvailable}
                />
              }
            />
          </View>
          {isAuthEnabled && (
            <TouchableOpacity style={styles.lockNowButton} onPress={lockApp}>
              <IconSymbol name="lock.fill" size={18} color="#fff" />
              <Text style={styles.lockNowText}>Lock Now</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.note}>
            Your device’s biometrics (or passcode) are used to open the wallet — no separate PIN is
            stored by the app.
          </Text>
        </Section>

        {/* Activity */}
        <Section>
          <SectionTitle value="Activity" />
          <View style={styles.card}>
            <ActionRow
              title="Login Alerts"
              description="Get notified about new sign-ins"
              leftIcon="bell"
              chipColor={palette.amber}
              rightIcon={
                <Switch value={loginAlerts} onValueChange={(v) => setPrivacyPref('loginAlerts', v)} />
              }
            />
            <ActionRow
              title="Login Activity"
              description="View recent sign-in sessions"
              leftIcon="location"
              chipColor={palette.purple}
              // Valid route; cast satisfies typed-routes until Expo regenerates them.
              onPress={() => router.push('/ProfileMenu/LoginActivity' as Href)}
            />
          </View>
        </Section>

        {/* Data management */}
        <Section>
          <SectionTitle value="Data Management" />
          <View style={styles.card}>
            <ActionRow
              title="Download Your Data"
              description="Export a copy of all your information"
              leftIcon="download.alt.fill"
              chipColor={palette.blue}
              onPress={handleDownloadData}
            />
            <ActionRow
              title="Delete Account"
              description="Permanently delete your data on this device"
              leftIcon="trash.fill"
              chipColor={palette.coral}
              onPress={handleDeleteAccount}
            />
          </View>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
