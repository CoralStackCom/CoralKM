import * as SecureStore from 'expo-secure-store'
import type React from 'react'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

import { createLogger } from '@/utils/logger'

import { BiometricService } from './auth/biometric-service'

const log = createLogger('Auth')

interface AuthContextType {
  /** Whether the app is currently locked and requires authentication */
  isLocked: boolean
  /** Whether passcode-based authentication is enabled */
  isAuthEnabled: boolean
  /** Whether biometric lock is enabled by user preference */
  isBiometricEnabled: boolean
  /** Human-readable biometric type label (e.g. "Face ID", "Fingerprint") or null */
  biometricType: string | null
  /** Attempt biometric unlock; returns true on success */
  unlock: () => Promise<boolean>
  /** Enable passcode authentication and store the passcode */
  enableAuth: (passcode: string) => Promise<void>
  /** Disable passcode authentication and clear stored credentials */
  disableAuth: () => Promise<void>
  /** Verify the given passcode against the stored one */
  verifyPasscode: (passcode: string) => Promise<boolean>
  /** Manually lock the app (requires authentication to unlock) */
  lockApp: () => void
  /** Unlock the app via biometric authentication */
  unlockApp: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PASSCODE_KEY = 'app_passcode'
const AUTH_ENABLED_KEY = 'auth_enabled'

/**
 * AuthProvider manages application authentication state including
 * passcode verification, biometric lock, and automatic locking
 * when the app goes to background beyond the configured timeout.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false)
  const [isAuthEnabled, setIsAuthEnabled] = useState(false)
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false)
  const [biometricType, setBiometricType] = useState<string | null>(null)

  const appState = useRef(AppState.currentState)
  const isAuthEnabledRef = useRef(false)
  const isBiometricEnabledRef = useRef(false)
  const lastActiveTime = useRef<number>(Date.now())

  useEffect(() => {
    checkAuthStatus()
    checkBiometricSupport()
    loadBiometricPreference()

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    isAuthEnabledRef.current = isAuthEnabled
  }, [isAuthEnabled])

  useEffect(() => {
    isBiometricEnabledRef.current = isBiometricEnabled
  }, [isBiometricEnabled])

  /** Handle app state transitions for timeout-based locking */
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current === 'active' &&
      (nextAppState === 'background' || nextAppState === 'inactive')
    ) {
      // Record timestamp when app leaves foreground
      lastActiveTime.current = Date.now()
    }

    if (
      (appState.current === 'background' || appState.current === 'inactive') &&
      nextAppState === 'active'
    ) {
      // App is returning to foreground -- check if we should lock
      if (isBiometricEnabledRef.current || isAuthEnabledRef.current) {
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
    const enabled = await SecureStore.getItemAsync(AUTH_ENABLED_KEY)
    const isEnabled = enabled === 'true'
    setIsAuthEnabled(isEnabled)
    isAuthEnabledRef.current = isEnabled
  }

  /** Detect biometric hardware and determine the type label */
  const checkBiometricSupport = async () => {
    const capability = await BiometricService.getCapability()
    if (capability.isAvailable && capability.hasEnrolledBiometrics) {
      const label = BiometricService.getBiometricLabel(capability.biometricTypes)
      setBiometricType(label)
    } else {
      setBiometricType(null)
    }
  }

  /** Load saved biometric preference from SecureStore */
  const loadBiometricPreference = async () => {
    const enabled = await BiometricService.isEnabled()
    setIsBiometricEnabled(enabled)
    isBiometricEnabledRef.current = enabled
  }

  /** Attempt biometric unlock via system prompt */
  const unlock = async (): Promise<boolean> => {
    try {
      const capability = await BiometricService.getCapability()
      if (capability.hasEnrolledBiometrics) {
        const success = await BiometricService.authenticate('Unlock App')
        if (success) {
          setIsLocked(false)
          return true
        }
      }
      return false
    } catch (error) {
      log.error('Authentication error', error instanceof Error ? error : new Error(String(error)))
      return false
    }
  }

  /** Attempt to unlock the app using biometric authentication */
  const unlockApp = async (): Promise<boolean> => {
    try {
      const success = await BiometricService.authenticate('Unlock App')
      if (success) {
        setIsLocked(false)
        return true
      }
      return false
    } catch (error) {
      log.error('Biometric unlock error', error instanceof Error ? error : new Error(String(error)))
      return false
    }
  }

  /** Verify the given passcode and unlock if it matches */
  const verifyPasscode = async (passcode: string): Promise<boolean> => {
    const storedPasscode = await SecureStore.getItemAsync(PASSCODE_KEY)
    if (storedPasscode === passcode) {
      setIsLocked(false)
      return true
    }
    return false
  }

  /** Enable passcode auth and persist the passcode */
  const enableAuth = async (passcode: string) => {
    await SecureStore.setItemAsync(PASSCODE_KEY, passcode)
    await SecureStore.setItemAsync(AUTH_ENABLED_KEY, 'true')
    setIsAuthEnabled(true)
    isAuthEnabledRef.current = true
  }

  /** Disable passcode auth and clear all stored credentials */
  const disableAuth = async () => {
    await SecureStore.deleteItemAsync(PASSCODE_KEY)
    await SecureStore.deleteItemAsync(AUTH_ENABLED_KEY)
    setIsAuthEnabled(false)
    setIsLocked(false)
    isAuthEnabledRef.current = false
  }

  /** Manually lock the app if auth or biometric lock is enabled */
  const lockApp = () => {
    if (isAuthEnabledRef.current || isBiometricEnabledRef.current) {
      setIsLocked(true)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLocked,
        isAuthEnabled,
        isBiometricEnabled,
        biometricType,
        unlock,
        enableAuth,
        disableAuth,
        verifyPasscode,
        lockApp,
        unlockApp,
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
