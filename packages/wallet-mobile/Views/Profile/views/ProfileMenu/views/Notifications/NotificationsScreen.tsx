import Section from '@/components/containers/Section'
import SectionTitle from '@/components/containers/Section/components/SectionTitle'
import ActionRow from '@/components/ui/ActionRow'
import Header from '@/components/ui/Header'
import React, { useState } from 'react'
import { SafeAreaView, ScrollView, Switch, View } from 'react-native'

import type { NotificationSettingItem } from './Notifications.interfaces'
import { styles } from './Notifications.styles'

/**
 * NotificationsScreen component.
 *
 * Manages push notification, activity alert, report,
 * and email notification preferences using config-driven rendering.
 */
export const NotificationsScreen: React.FC = () => {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)
  const [monthlyReports, setMonthlyReports] = useState(true)
  const [householdUpdates, setHouseholdUpdates] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  /** Activity alert settings config */
  const activityAlerts: NotificationSettingItem[] = [
    {
      title: 'Activity Alerts',
      description: 'Get notified about important activity',
      leftIcon: 'help.support.fill',
      value: pushEnabled,
      onValueChange: setPushEnabled,
    },
    {
      title: 'Budget Alerts',
      description: 'Warnings when nearing budget limits',
      leftIcon: 'chart.fill',
      value: budgetAlerts,
      onValueChange: setBudgetAlerts,
      disabled: !pushEnabled,
    },
    {
      title: 'Household Updates',
      description: 'Activity from household members',
      leftIcon: 'house',
      value: householdUpdates,
      onValueChange: setHouseholdUpdates,
      disabled: !pushEnabled,
    },
    {
      title: 'Security Alerts',
      description: 'Important security notifications',
      leftIcon: 'lock',
      value: securityAlerts,
      onValueChange: setSecurityAlerts,
      disabled: !pushEnabled,
    },
  ]

  /** Report settings config */
  const reportSettings: NotificationSettingItem[] = [
    {
      title: 'Weekly Reports',
      description: 'Summary of your account activity',
      leftIcon: 'calendar',
      value: weeklyReports,
      onValueChange: setWeeklyReports,
      disabled: !pushEnabled,
    },
    {
      title: 'Monthly Reports',
      description: 'Detailed monthly summary',
      leftIcon: 'calendar.fill',
      value: monthlyReports,
      onValueChange: setMonthlyReports,
      disabled: !pushEnabled,
    },
  ]

  /** Email notification settings config */
  const emailSettings: NotificationSettingItem[] = [
    {
      title: 'Email Notifications',
      description: 'Manage your email notifications',
      leftIcon: 'mail',
      value: emailEnabled,
      onValueChange: setEmailEnabled,
    },
    {
      title: 'Marketing Emails',
      description: 'Tips, offers, and updates',
      leftIcon: 'megaphone',
      value: marketingEmails,
      onValueChange: setMarketingEmails,
      disabled: !emailEnabled,
    },
  ]

  /** Renders a section of notification settings */
  const renderSettingsSection = (
    title: string,
    items: NotificationSettingItem[]
  ) => (
    <Section>
      <SectionTitle value={title} />
      <View style={styles.card}>
        {items.map((item) => (
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
      </View>
    </Section>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Push Notifications Toggle */}
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

        {renderSettingsSection('Activity Alerts', activityAlerts)}
        {renderSettingsSection('Reports', reportSettings)}
        {renderSettingsSection('Email Notifications', emailSettings)}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
