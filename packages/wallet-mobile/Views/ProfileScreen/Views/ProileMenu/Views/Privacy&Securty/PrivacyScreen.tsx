import Section from '@/components/contianers/Section'
import { SectionTitle } from '@/components/contianers/Section/components/SectionTitle/SectionTitle'
import ActionRow from '@/components/Ui/ActionRow'
import Header from '@/components/Ui/Header'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, SafeAreaView, ScrollView, Switch, View } from 'react-native'
import { styles } from './Privacy.styles'

export default function PrivacySecurityScreen() {
  const router = useRouter()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricsEnabled, setBiometricsEnabled] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'You will receive an email to reset your password.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send Email',
        onPress: () =>
          Alert.alert('Email Sent', 'Check your inbox for password reset instructions.'),
      },
    ])
  }

  const handleViewLoginActivity = () => {
    Alert.alert(
      'Login Activity',
      'Recent logins:\n\n• iPhone 14 Pro - San Francisco, CA\n  Today at 10:30 AM\n\n• MacBook Pro - San Francisco, CA\n  Yesterday at 3:45 PM\n\n• iPad Air - San Francisco, CA\n  2 days ago'
    )
  }

  const handleDownloadData = () => {
    Alert.alert(
      'Download Your Data',
      "We'll prepare a file with all your data. This may take up to 48 hours.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Data',
          onPress: () =>
            Alert.alert('Request Submitted', "You'll receive an email when your data is ready."),
        },
      ]
    )
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              'Account Scheduled for Deletion',
              'Your account will be deleted in 30 days. Log in again to cancel.'
            ),
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Privacy & Security" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Section */}
        <Section style={styles.section}>
          <SectionTitle value="Security" />
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
