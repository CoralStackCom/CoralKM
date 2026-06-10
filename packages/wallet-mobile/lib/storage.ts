import * as SecureStore from 'expo-secure-store'

/**
 * Typed JSON persistence over `expo-secure-store`.
 *
 * SecureStore is the app's secure key/value store (Keychain on iOS, Keystore on
 * Android). Keys must match `[A-Za-z0-9._-]`; use dotted namespaces like
 * `coralkm.preferences`. Values are small JSON documents.
 */

/** All SecureStore keys the app persists, kept in one place. */
export const StorageKeys = {
  user: 'coralkm.user',
  household: 'coralkm.household',
  encryptionSeed: 'coralkm.encryptionSeed',
  preferences: 'coralkm.preferences',
  themeMode: 'coralkm.themeMode',
  devices: 'coralkm.devices',
  currentDeviceId: 'coralkm.currentDeviceId',
  lastActiveAt: 'coralkm.lastActiveAt',
  loginSessions: 'coralkm.loginSessions',
} as const

/**
 * Read and parse a JSON value.
 *
 * @param key Storage key.
 * @returns The parsed value, or `null` if absent or unparseable.
 */
export async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await SecureStore.getItemAsync(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

/**
 * Serialize and store a JSON value.
 *
 * @param key   Storage key.
 * @param value The value to persist.
 */
export async function setJSON(key: string, value: unknown): Promise<void> {
  await SecureStore.setItemAsync(key, JSON.stringify(value))
}

/**
 * Remove a single key.
 */
export async function removeItem(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key)
}

/**
 * Remove every app-managed key (used on logout / account deletion).
 * Auth/biometric keys are intentionally excluded — those are owned by
 * `AuthContext` / `BiometricService`.
 */
export async function clearAppData(): Promise<void> {
  await Promise.all(Object.values(StorageKeys).map(removeItem))
}
