import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled'
const BIOMETRIC_TIMEOUT_KEY = 'biometric_timeout'
const DEFAULT_TIMEOUT = 30 // seconds

/** Describes the biometric capabilities of the current device */
export interface BiometricCapability {
  /** Whether biometric hardware is present on the device */
  isAvailable: boolean
  /** List of supported biometric authentication types */
  biometricTypes: LocalAuthentication.AuthenticationType[]
  /** Whether the user has enrolled at least one biometric credential */
  hasEnrolledBiometrics: boolean
}

/**
 * BiometricService provides a unified API for biometric authentication,
 * device capability detection, and user preference persistence via SecureStore.
 */
export const BiometricService = {
  /** Check device biometric capability */
  async getCapability(): Promise<BiometricCapability> {
    const isAvailable = await LocalAuthentication.hasHardwareAsync()
    const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
    const hasEnrolledBiometrics = await LocalAuthentication.isEnrolledAsync()
    return { isAvailable, biometricTypes, hasEnrolledBiometrics }
  },

  /** Prompt user for biometric authentication */
  async authenticate(promptMessage = 'Authenticate to continue'): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use passcode',
      disableDeviceFallback: false,
    })
    return result.success
  },

  /** Check if biometric lock is enabled by user preference */
  async isEnabled(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY)
    return value === 'true'
  },

  /** Enable/disable biometric lock */
  async setEnabled(enabled: boolean): Promise<void> {
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled ? 'true' : 'false')
  },

  /** Get the lock timeout in seconds */
  async getTimeout(): Promise<number> {
    const value = await SecureStore.getItemAsync(BIOMETRIC_TIMEOUT_KEY)
    return value ? parseInt(value, 10) : DEFAULT_TIMEOUT
  },

  /** Set the lock timeout in seconds */
  async setTimeout(seconds: number): Promise<void> {
    await SecureStore.setItemAsync(BIOMETRIC_TIMEOUT_KEY, seconds.toString())
  },

  /** Get a human-readable label for the biometric type */
  getBiometricLabel(types: LocalAuthentication.AuthenticationType[]): string {
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID'
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Fingerprint'
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris'
    }
    return 'Biometric'
  },
}
