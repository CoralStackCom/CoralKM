/**
 * Preference shapes for the Profile menu (Notifications + Privacy toggles).
 */

/** Push / email notification preferences. */
export interface NotificationPreferences {
  pushEnabled: boolean
  emailEnabled: boolean
  budgetAlerts: boolean
  weeklyReports: boolean
  monthlyReports: boolean
  householdUpdates: boolean
  securityAlerts: boolean
  marketingEmails: boolean
}

/** Privacy / security preferences (excluding biometric, which BiometricService owns). */
export interface PrivacyPreferences {
  twoFactorEnabled: boolean
  loginAlerts: boolean
}

/** All persisted preferences. */
export interface Preferences {
  notifications: NotificationPreferences
  privacy: PrivacyPreferences
}

/** Sensible defaults used before anything is persisted. */
export const DEFAULT_PREFERENCES: Preferences = {
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    budgetAlerts: true,
    weeklyReports: false,
    monthlyReports: true,
    householdUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
  },
  privacy: {
    twoFactorEnabled: false,
    loginAlerts: true,
  },
}
