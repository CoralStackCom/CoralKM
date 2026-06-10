import { getJSON, StorageKeys } from '@/lib/storage'
import * as SecureStore from 'expo-secure-store'
import type React from 'react'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

import { createLogger } from '@/utils/logger'

import { NotificationService } from './notifications/notification-service'
import { BiometricService } from './auth/biometric-service'
import { SessionService } from './auth/session-service'

const log = createLogger('Auth')

interface AuthContextType {
  /** Whether the app is currently locked and requires authentication */
  isLocked: boolean
  /** Whether the biometric app lock (two-factor) is enabled */
  isAuthEnabled: boolean
  /** Whether the device can authenticate (biometrics enrolled or device passcode) */
  isBiometricAvailable: boolean
  /** Human-readable biometric type label (e.g. "Face ID", "Fingerprint") or null */
  biometricType: string | null
  /** Enable the biometric app lock; prompts to confirm. Returns true on success. */
  enableAuth: () => Promise<boolean>
  /** Disable the biometric app lock; prompts to confirm. Returns true on success. */
  disableAuth: () => Promise<boolean>
  /** Attempt to unlock the app via biometrics; records the session on success. */
  unlock: () => Promise<boolean>
  /** Manually lock the app (only effective when the lock is enabled) */
  lockApp: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_ENABLED_KEY = 'auth_enabled'

/** Read the persisted "login alerts" preference (defaults to on). */
const loginAlertsEnabled = async (): Promise<boolean> => {
  const prefs = await getJSON<{ privacy?: { loginAlerts?: boolean } }>(StorageKeys.preferences)
  return prefs?.privacy?.loginAlerts ?? true
}

/**
 * AuthProvider manages the biometric app lock (the wallet's second factor):
 * enabling/disabling it behind a biometric prompt, locking after a background
 * timeout, recording login sessions, and firing login-alert notifications.
 * No app PIN is stored — the device's biometrics/passcode are the secret.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false)
  const [isAuthEnabled, setIsAuthEnabled] = useState(false)
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false)
  const [biometricType, setBiometricType] = useState<string | null>(null)

  const appState = useRef(AppState.currentState)
  const isAuthEnabledRef = useRef(false)
  const lastActiveTime = useRef<number>(Date.now())

  useEffect(() => {
    checkAuthStatus()
    checkBiometricSupport()

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    isAuthEnabledRef.current = isAuthEnabled
  }, [isAuthEnabled])

  /** Handle app state transitions for timeout-based locking */
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current === 'active' &&
      (nextAppState === 'background' || nextAppState === 'inactive')
    ) {
      lastActiveTime.current = Date.now()
    }

    if (
      (appState.current === 'background' || appState.current === 'inactive') &&
      nextAppState === 'active'
    ) {
      if (isAuthEnabledRef.current) {
        const timeout = await BiometricService.getTimeout()
        const elapsed = (Date.now() - lastActiveTime.current) / 1000
        if (elapsed >= timeout) {
          setIsLocked(true)
        }
      }
    }

    appState.current = nextAppState
  }

  /** Load the persisted auth-enabled flag from SecureStore */
  const checkAuthStatus = async () => {
    const enabled = (await SecureStore.getItemAsync(AUTH_ENABLED_KEY)) === 'true'
    setIsAuthEnabled(enabled)
    isAuthEnabledRef.current = enabled
    // If the lock is on, start locked until the user authenticates.
    if (enabled) setIsLocked(true)
  }

  /** Detect biometric hardware and determine the type label */
  const checkBiometricSupport = async () => {
    const capability = await BiometricService.getCapability()
    const available = capability.isAvailable && capability.hasEnrolledBiometrics
    setIsBiometricAvailable(available)
    setBiometricType(available ? BiometricService.getBiometricLabel(capability.biometricTypes) : null)
  }

  /** Record a login session and fire a login alert if enabled. */
  const recordSession = async () => {
    try {
      const session = await SessionService.record('biometric')
      if (await loginAlertsEnabled()) {
        const time = new Date(session.timestamp).toLocaleString()
        NotificationService.push('system', 'New sign-in', `${session.device} · ${time}`)
      }
    } catch (error) {
      log.error('Failed to record session', error instanceof Error ? error : new Error(String(error)))
    }
  }

  /** Attempt biometric unlock via system prompt */
  const unlock = async (): Promise<boolean> => {
    try {
      const success = await BiometricService.authenticate('Unlock CoralKM')
      if (success) {
        setIsLocked(false)
        void recordSession()
        return true
      }
      return false
    } catch (error) {
      log.error('Authentication error', error instanceof Error ? error : new Error(String(error)))
      return false
    }
  }

  /** Enable the biometric app lock (gated by a successful prompt). */
  const enableAuth = async (): Promise<boolean> => {
    const success = await BiometricService.authenticate('Confirm to enable app lock')
    if (!success) return false
    await SecureStore.setItemAsync(AUTH_ENABLED_KEY, 'true')
    await BiometricService.setEnabled(true)
    setIsAuthEnabled(true)
    isAuthEnabledRef.current = true
    return true
  }

  /** Disable the biometric app lock (gated by a successful prompt). */
  const disableAuth = async (): Promise<boolean> => {
    const success = await BiometricService.authenticate('Confirm to disable app lock')
    if (!success) return false
    await SecureStore.deleteItemAsync(AUTH_ENABLED_KEY)
    await BiometricService.setEnabled(false)
    setIsAuthEnabled(false)
    setIsLocked(false)
    isAuthEnabledRef.current = false
    return true
  }

  /** Manually lock the app if the lock is enabled */
  const lockApp = () => {
    if (isAuthEnabledRef.current) setIsLocked(true)
  }

  return (
    <AuthContext.Provider
      value={{
        isLocked,
        isAuthEnabled,
        isBiometricAvailable,
        biometricType,
        enableAuth,
        disableAuth,
        unlock,
        lockApp,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access the authentication context.
 * Must be used within an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
