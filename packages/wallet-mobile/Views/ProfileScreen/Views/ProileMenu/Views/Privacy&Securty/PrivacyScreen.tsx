import Section from '@/components/contianers/Section'
import { SectionHeader } from '@/components/contianers/Section/components/SectionHeader/SectionHeader'
import { SectionTitle } from '@/components/contianers/Section/components/SectionTitle/SectionTitle'
import ActionRow from '@/components/Ui/ActionRow'
import Header from '@/components/Ui/Header'
import { useState } from 'react'
import { SafeAreaView, ScrollView, Switch, View } from 'react-native'
import { styles } from './Privacy.styles'
import {
  handleChangePassword,
  handleDeleteAccount,
  handleDownloadData,
  handleViewLoginActivity,
} from './PrivacyScreen.utils'

/*
 * PrivacySecurityScreen component to manage privacy and security settings
 */

export const PrivacySecurityScreen: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricsEnabled, setBiometricsEnabled] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)

  // To Do: create arrays and map through them to reduce repetition

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Privacy & Security" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Security Settings" iconName="lock" />

        {/* Security Section */}
        <Section>
          <SectionTitle value="Security" />
          <View style={styles.card}>
            <ActionRow
              title="Two-Factor Authentication"
              description="Add extra security to your account"
              leftIcon="lock"
              rightIcon={<Switch value={twoFactorEnabled} onValueChange={setTwoFactorEnabled} />}
            />
            <ActionRow
              title="Biometric Login"
              description="Use Face ID or fingerprint to log in"
              leftIcon="touch.fill"
              rightIcon={<Switch value={biometricsEnabled} onValueChange={setBiometricsEnabled} />}
            />
            <ActionRow
              title="Login Alerts"
              description="Get notified of new logins"
              leftIcon="bell"
              rightIcon={<Switch value={loginAlerts} onValueChange={setLoginAlerts} />}
            />
            <ActionRow
              title="Change Password"
              description="Update your password regularly"
              leftIcon="key"
              onPress={handleChangePassword}
            />
            <ActionRow
              title="Login Activity"
              description="View recent login sessions"
              leftIcon="location"
              onPress={handleViewLoginActivity}
            />
          </View>
        </Section>

        {/* Data Section */}
        <Section>
          <SectionTitle value="Data Management" />
          <View style={styles.card}>
            <ActionRow
              title="Download Your Data"
              description="Get a copy of all your information"
              leftIcon="download.alt.fill"
              onPress={handleDownloadData}
            />
            <ActionRow
              title="Delete Account"
              description="Permanently delete your account"
              leftIcon="trash.fill"
              onPress={handleDeleteAccount}
            />
          </View>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
