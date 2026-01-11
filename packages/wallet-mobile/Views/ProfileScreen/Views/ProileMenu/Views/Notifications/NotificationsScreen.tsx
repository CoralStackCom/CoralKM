import { IconSymbol } from '@/components/Ui/icon-symbol'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native'
import { styles } from './Notifications.styles'

export default function NotificationsScreen() {
  const router = useRouter()
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [transactionAlerts, setTransactionAlerts] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)
  const [monthlyReports, setMonthlyReports] = useState(true)
  const [householdUpdates, setHouseholdUpdates] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Push Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="bell" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Enable all push notifications</Text>
                </View>
              </View>
              <Switch value={pushEnabled} onValueChange={setPushEnabled} />
            </View>
          </View>
        </View>

        {/* Activity Alerts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Alerts</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="card" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Transaction Alerts</Text>
                  <Text style={styles.settingDescription}>Get notified of new transactions</Text>
                </View>
              </View>
              <Switch
                value={transactionAlerts}
                onValueChange={setTransactionAlerts}
                disabled={!pushEnabled}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="chart.fill" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Budget Alerts</Text>
                  <Text style={styles.settingDescription}>Warnings when nearing budget limits</Text>
                </View>
              </View>
              <Switch
                value={budgetAlerts}
                onValueChange={setBudgetAlerts}
                disabled={!pushEnabled}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="house" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Household Updates</Text>
                  <Text style={styles.settingDescription}>Activity from household members</Text>
                </View>
              </View>
              <Switch
                value={householdUpdates}
                onValueChange={setHouseholdUpdates}
                disabled={!pushEnabled}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="lock" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Security Alerts</Text>
                  <Text style={styles.settingDescription}>Important security notifications</Text>
                </View>
              </View>
              <Switch
                value={securityAlerts}
                onValueChange={setSecurityAlerts}
                disabled={!pushEnabled}
              />
            </View>
          </View>
        </View>

        {/* Reports Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="calendar" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Weekly Reports</Text>
                  <Text style={styles.settingDescription}>Summary every Sunday</Text>
                </View>
              </View>
              <Switch value={weeklyReports} onValueChange={setWeeklyReports} />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="calendar.fill" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Monthly Reports</Text>
                  <Text style={styles.settingDescription}>Detailed monthly summary</Text>
                </View>
              </View>
              <Switch value={monthlyReports} onValueChange={setMonthlyReports} />
            </View>
          </View>
        </View>

        {/* Email Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="mail" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>Receive important emails</Text>
                </View>
              </View>
              <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="megaphone" size={24} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Marketing Emails</Text>
                  <Text style={styles.settingDescription}>Tips, offers, and updates</Text>
                </View>
              </View>
              <Switch
                value={marketingEmails}
                onValueChange={setMarketingEmails}
                disabled={!emailEnabled}
              />
            </View>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
