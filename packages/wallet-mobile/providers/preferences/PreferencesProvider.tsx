import { getJSON, setJSON, StorageKeys } from '@/lib/storage'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  DEFAULT_PREFERENCES,
  type NotificationPreferences,
  type Preferences,
  type PrivacyPreferences,
} from './preferences-types'

interface PreferencesContextValue {
  preferences: Preferences
  /** True until persisted preferences have been loaded from storage. */
  isLoading: boolean
  /** Update a single notification preference (persisted immediately). */
  setNotificationPref: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => void
  /** Update a single privacy preference (persisted immediately). */
  setPrivacyPref: <K extends keyof PrivacyPreferences>(key: K, value: PrivacyPreferences[K]) => void
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined)

/**
 * PreferencesProvider.
 *
 * Holds the user's notification and privacy preferences, hydrated from
 * SecureStore on mount and written through on every change so the Profile menu
 * toggles reflect real, persistent state instead of ephemeral component state.
 */
export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES)
  const [isLoading, setIsLoading] = useState(true)

  // Hydrate from storage on mount, merging over defaults so newly-added keys
  // are always present.
  useEffect(() => {
    let active = true
    ;(async () => {
      const stored = await getJSON<Partial<Preferences>>(StorageKeys.preferences)
      if (active && stored) {
        setPreferences({
          notifications: { ...DEFAULT_PREFERENCES.notifications, ...stored.notifications },
          privacy: { ...DEFAULT_PREFERENCES.privacy, ...stored.privacy },
        })
      }
      if (active) setIsLoading(false)
    })()
    return () => {
      active = false
    }
  }, [])

  const setNotificationPref = useCallback<PreferencesContextValue['setNotificationPref']>(
    (key, value) => {
      setPreferences((prev) => {
        const next = { ...prev, notifications: { ...prev.notifications, [key]: value } }
        void setJSON(StorageKeys.preferences, next)
        return next
      })
    },
    []
  )

  const setPrivacyPref = useCallback<PreferencesContextValue['setPrivacyPref']>((key, value) => {
    setPreferences((prev) => {
      const next = { ...prev, privacy: { ...prev.privacy, [key]: value } }
      void setJSON(StorageKeys.preferences, next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ preferences, isLoading, setNotificationPref, setPrivacyPref }),
    [preferences, isLoading, setNotificationPref, setPrivacyPref]
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

/**
 * Access notification/privacy preferences and their setters.
 */
export const usePreferences = (): PreferencesContextValue => {
  const ctx = useContext(PreferencesContext)
  if (!ctx) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return ctx
}
