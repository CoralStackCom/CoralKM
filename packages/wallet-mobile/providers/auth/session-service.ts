import { getJSON, setJSON, StorageKeys } from '@/lib/storage'
import * as Crypto from 'expo-crypto'
import { Platform } from 'react-native'

/** How a session was authenticated. */
export type LoginMethod = 'biometric' | 'device' | 'login'

/** A recorded sign-in / unlock event. */
export interface LoginSession {
  id: string
  /** ISO timestamp of the event. */
  timestamp: string
  /** Human-friendly device name. */
  device: string
  /** Platform the event occurred on. */
  platform: string
  /** How the session was authenticated. */
  method: LoginMethod
}

/** Keep at most this many recent sessions. */
const MAX_SESSIONS = 20

/**
 * Records and retrieves real login/unlock sessions, persisted in SecureStore.
 * Powers the Login Activity screen and login-alert notifications.
 */
export const SessionService = {
  /** Append a session for the current device and return the created record. */
  async record(method: LoginMethod, deviceName?: string): Promise<LoginSession> {
    const session: LoginSession = {
      id: Crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      device:
        deviceName ??
        (Platform.OS === 'ios' ? 'iPhone' : Platform.OS === 'android' ? 'Android device' : 'Web'),
      platform: Platform.OS,
      method,
    }
    const existing = (await getJSON<LoginSession[]>(StorageKeys.loginSessions)) ?? []
    const next = [session, ...existing].slice(0, MAX_SESSIONS)
    await setJSON(StorageKeys.loginSessions, next)
    return session
  },

  /** Return recorded sessions, most recent first. */
  async getAll(): Promise<LoginSession[]> {
    return (await getJSON<LoginSession[]>(StorageKeys.loginSessions)) ?? []
  },

  /** Remove all recorded sessions. */
  async clear(): Promise<void> {
    await setJSON(StorageKeys.loginSessions, [])
  },
}
