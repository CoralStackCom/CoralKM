import Section from '@/components/contianers/Section'
import SectionTitle from '@/components/contianers/Section/components/SectionTitle'
import ActionRow from '@/components/Ui/ActionRow'
import Header from '@/components/Ui/Header'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, ScrollView, Switch, View } from 'react-native'
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
      <Header title="Notifications" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Push Notifications Section */}
        <Section>
          <SectionTitle value="Push Notifications" />
          <View style={styles.card}>
            <ActionRow
              title="Push Notifications"
              description="Enable all push notifications"
              leftIcon="bell"
              rightIcon={<Switch value={pushEnabled} onValueChange={setPushEnabled} />}
            />
          </View>
        </Section>

        {/* Activity Alerts Section */}
        <Section>
          <SectionTitle value="Activity Alerts" />
          <View style={styles.card}>
            <ActionRow
              title="Activity Alerts"
              description="Get notified about important activity"
              leftIcon="notifications"
              rightIcon={<Switch value={pushEnabled} onValueChange={setPushEnabled} />}
            />
            <ActionRow
              title="budget Alerts"
              description="Warnings when nearing budget limits"
              leftIcon="chart.fill"
              rightIcon={
                <Switch
                  value={budgetAlerts}
                  onValueChange={setBudgetAlerts}
                  disabled={!pushEnabled}
                />
              }
            />
            <ActionRow
              title="HouseHold Updates"
              description="Activity from household members"
              leftIcon="house"
              rightIcon={
                <Switch
                  value={householdUpdates}
                  onValueChange={setHouseholdUpdates}
                  disabled={!pushEnabled}
                />
              }
            />
            <ActionRow
              title="Security Alerts"
              description="Important security notifications"
              leftIcon="lock"
              rightIcon={
                <Switch
                  value={securityAlerts}
                  onValueChange={setSecurityAlerts}
                  disabled={!pushEnabled}
                />
              }
            />
          </View>
        </Section>

        {/* Reports Section */}
        <Section>
          <SectionTitle value="Reports" />
          <View style={styles.card}>
            <ActionRow
              title="Weekly Reports"
              description="Summary of your account activity"
              leftIcon="calendar"
              rightIcon={
                <Switch
                  value={weeklyReports}
                  onValueChange={setWeeklyReports}
                  disabled={!pushEnabled}
                />
              }
            />
            <ActionRow
              title="Monthly Reports"
              description="Detailed monthly summary"
              leftIcon="calendar.fill"
              rightIcon={
                <Switch
                  value={monthlyReports}
                  onValueChange={setMonthlyReports}
                  disabled={!pushEnabled}
                />
              }
            />
          </View>
        </Section>

        {/* Email Section */}
        <Section>
          <SectionTitle value="Email Notifications" />
          <View style={styles.card}>
            <ActionRow
              title="Email Notifications"
              description="Manage your email notification "
              leftIcon="mail"
              rightIcon={<Switch value={emailEnabled} onValueChange={setEmailEnabled} />}
            />
            <ActionRow
              title="Marketing Emails"
              description="Tips, offers, and updates"
              leftIcon="megaphone"
              rightIcon={
                <Switch
                  value={marketingEmails}
                  onValueChange={setMarketingEmails}
                  disabled={!emailEnabled}
                />
              }
            />
          </View>
        </Section>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
