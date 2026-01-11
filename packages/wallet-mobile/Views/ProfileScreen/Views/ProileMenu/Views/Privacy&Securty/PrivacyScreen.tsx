import { IconSymbol } from '@/components/Ui/icon-symbol'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native'
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="lock" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                  <Text style={styles.settingDescription}>Add extra security to your account</Text>
                </View>
              </View>
              <Switch value={twoFactorEnabled} onValueChange={setTwoFactorEnabled} />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="touch.fill" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Biometric Login</Text>
                  <Text style={styles.settingDescription}>Use Face ID or fingerprint</Text>
                </View>
              </View>
              <Switch value={biometricsEnabled} onValueChange={setBiometricsEnabled} />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="bell" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Login Alerts</Text>
                  <Text style={styles.settingDescription}>Get notified of new logins</Text>
                </View>
              </View>
              <Switch value={loginAlerts} onValueChange={setLoginAlerts} />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleChangePassword}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <IconSymbol name="key" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Change Password</Text>
                  <Text style={styles.settingDescription}>Update your password</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleViewLoginActivity}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <IconSymbol name="location" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Login Activity</Text>
                  <Text style={styles.settingDescription}>View recent login sessions</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Data</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleDownloadData}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <IconSymbol name="download.alt.fill" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Download Your Data</Text>
                  <Text style={styles.settingDescription}>Get a copy of all your information</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <IconSymbol name="warning.fill" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, styles.dangerText]}>Delete Account</Text>
                  <Text style={styles.settingDescription}>Permanently delete your account</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
