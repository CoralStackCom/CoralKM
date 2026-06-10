import Section from '@/components/containers/Section'
import SectionTitle from '@/components/containers/Section/components/SectionTitle'
import ActionRow from '@/components/ui/ActionRow'
import Header from '@/components/ui/Header'
import { usePreferences } from '@/providers/preferences'
import React, { useCallback, useMemo } from 'react'
import { SafeAreaView, ScrollView, Switch, View } from 'react-native'

import type { NotificationSettingItem } from './Notifications.interfaces'
import { styles } from './Notifications.styles'

/**
 * NotificationsScreen component.
 *
 * Manages push notification, activity alert, report, and email notification
 * preferences. Backed by PreferencesProvider so toggles persist across reloads.
 */
export const NotificationsScreen: React.FC = () => {
  const { preferences, setNotificationPref } = usePreferences()
  const {
    pushEnabled,
    emailEnabled,
    budgetAlerts,
    weeklyReports,
    monthlyReports,
    householdUpdates,
    securityAlerts,
    marketingEmails,
  } = preferences.notifications

  const setPushEnabled = (v: boolean) => setNotificationPref('pushEnabled', v)
  const setEmailEnabled = (v: boolean) => setNotificationPref('emailEnabled', v)
  const setBudgetAlerts = (v: boolean) => setNotificationPref('budgetAlerts', v)
  const setWeeklyReports = (v: boolean) => setNotificationPref('weeklyReports', v)
  const setMonthlyReports = (v: boolean) => setNotificationPref('monthlyReports', v)
  const setHouseholdUpdates = (v: boolean) => setNotificationPref('householdUpdates', v)
  const setSecurityAlerts = (v: boolean) => setNotificationPref('securityAlerts', v)
  const setMarketingEmails = (v: boolean) => setNotificationPref('marketingEmails', v)

  /** Activity alert settings config (memoized to avoid re-creating on every render) */
  const activityAlerts: NotificationSettingItem[] = useMemo(() => [
    {
      title: 'Activity Alerts',
      description: 'Get notified about important activity',
      leftIcon: 'help.support.fill',
      color: '#F2A93B',
      value: pushEnabled,
      onValueChange: setPushEnabled,
    },
    {
      title: 'Budget Alerts',
      description: 'Warnings when nearing budget limits',
      leftIcon: 'chart.fill',
      color: '#2BB3A3',
      value: budgetAlerts,
      onValueChange: setBudgetAlerts,
      disabled: !pushEnabled,
    },
    {
      title: 'Household Updates',
      description: 'Activity from household members',
      leftIcon: 'house',
      color: '#2B86B8',
      value: householdUpdates,
      onValueChange: setHouseholdUpdates,
      disabled: !pushEnabled,
    },
    {
      title: 'Security Alerts',
      description: 'Important security notifications',
      leftIcon: 'lock',
      color: '#E0533D',
      value: securityAlerts,
      onValueChange: setSecurityAlerts,
      disabled: !pushEnabled,
    },
  ], [pushEnabled, budgetAlerts, householdUpdates, securityAlerts])

  /** Report settings config (memoized to avoid re-creating on every render) */
  const reportSettings: NotificationSettingItem[] = useMemo(() => [
    {
      title: 'Weekly Reports',
      description: 'Summary of your account activity',
      leftIcon: 'calendar',
      color: '#6C5CE7',
      value: weeklyReports,
      onValueChange: setWeeklyReports,
      disabled: !pushEnabled,
    },
    {
      title: 'Monthly Reports',
      description: 'Detailed monthly summary',
      leftIcon: 'calendar.fill',
      color: '#3B82F6',
      value: monthlyReports,
      onValueChange: setMonthlyReports,
      disabled: !pushEnabled,
    },
  ], [weeklyReports, monthlyReports, pushEnabled])

  /** Email notification settings config (memoized to avoid re-creating on every render) */
  const emailSettings: NotificationSettingItem[] = useMemo(() => [
    {
      title: 'Email Notifications',
      description: 'Manage your email notifications',
      leftIcon: 'mail',
      color: '#2B86B8',
      value: emailEnabled,
      onValueChange: setEmailEnabled,
    },
    {
      title: 'Marketing Emails',
      description: 'Tips, offers, and updates',
      leftIcon: 'megaphone',
      color: '#F2A93B',
      value: marketingEmails,
      onValueChange: setMarketingEmails,
      disabled: !emailEnabled,
    },
  ], [emailEnabled, marketingEmails])

  /** Renders a section of notification settings (memoized to maintain stable reference) */
  const renderSettingsSection = useCallback((
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
            chipColor={item.color}
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
  ), [])

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
              chipColor="#1B5678"
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
