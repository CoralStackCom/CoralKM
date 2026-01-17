import '@/app/shim'

import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import type React from 'react'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

interface AuthContextType {
  isLocked: boolean
  isAuthEnabled: boolean
  biometricType: string | null
  unlock: () => Promise<boolean>
  enableAuth: (passcode: string) => Promise<void>
  disableAuth: () => Promise<void>
  verifyPasscode: (passcode: string) => Promise<boolean>
  lockApp: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PASSCODE_KEY = 'app_passcode'
const AUTH_ENABLED_KEY = 'auth_enabled'

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false)
  const [isAuthEnabled, setIsAuthEnabled] = useState(false)
  const [biometricType, setBiometricType] = useState<string | null>(null)
  const appState = useRef(AppState.currentState)
  const isAuthEnabledRef = useRef(false)

  useEffect(() => {
    checkAuthStatus()
    checkBiometricSupport()

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    isAuthEnabledRef.current = isAuthEnabled
  }, [isAuthEnabled])

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current === 'active' &&
      (nextAppState === 'background' || nextAppState === 'inactive')
    ) {
      if (isAuthEnabledRef.current) {
        setIsLocked(true)
      }
    }

    appState.current = nextAppState
  }

  const checkAuthStatus = async () => {
    const enabled = await SecureStore.getItemAsync(AUTH_ENABLED_KEY)
    const isEnabled = enabled === 'true'
    setIsAuthEnabled(isEnabled)
    isAuthEnabledRef.current = isEnabled
  }

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    if (compatible) {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID')
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Fingerprint')
      }
    }
  }

  const unlock = async (): Promise<boolean> => {
    try {
      const hasEnrolled = await LocalAuthentication.isEnrolledAsync()
      if (hasEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Unlock App',
          fallbackLabel: 'Use Passcode',
          disableDeviceFallback: false,
        })

        if (result.success) {
          setIsLocked(false)
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Authentication error:', error)
      return false
    }
  }

  const verifyPasscode = async (passcode: string): Promise<boolean> => {
    const storedPasscode = await SecureStore.getItemAsync(PASSCODE_KEY)
    if (storedPasscode === passcode) {
      setIsLocked(false)
      return true
    }
    return false
  }

  const enableAuth = async (passcode: string) => {
    await SecureStore.setItemAsync(PASSCODE_KEY, passcode)
    await SecureStore.setItemAsync(AUTH_ENABLED_KEY, 'true')
    setIsAuthEnabled(true)
    isAuthEnabledRef.current = true
  }

  const disableAuth = async () => {
    await SecureStore.deleteItemAsync(PASSCODE_KEY)
    await SecureStore.deleteItemAsync(AUTH_ENABLED_KEY)
    setIsAuthEnabled(false)
    setIsLocked(false)
    isAuthEnabledRef.current = false
  }

  const lockApp = () => {
    if (isAuthEnabledRef.current) {
      setIsLocked(true)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLocked,
        isAuthEnabled,
        biometricType,
        unlock,
        enableAuth,
        disableAuth,
        verifyPasscode,
        lockApp,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
