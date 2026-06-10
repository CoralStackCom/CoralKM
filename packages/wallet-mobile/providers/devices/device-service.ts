import { getJSON, setJSON, StorageKeys } from '@/lib/storage'
import * as Crypto from 'expo-crypto'
import { Platform } from 'react-native'
import type { LinkedDevice } from './device-types'

type DeviceListener = (devices: LinkedDevice[]) => void

/**
 * Device management service.
 *
 * Tracks the devices linked to this account. The current device is registered
 * with a stable id (persisted in SecureStore) and real platform/name, and the
 * whole list is persisted so removals survive reloads. Cross-device sync via the
 * gateway is a documented follow-up; today this reflects real on-device state.
 *
 * Public mutators are synchronous (returning immediately) and persist in the
 * background; `init()` is async and loads persisted state on app start.
 */
class DeviceServiceImpl {
  private devices: LinkedDevice[] = []
  private listeners: Set<DeviceListener> = new Set()
  private currentDeviceId: string | null = null
  private initialized = false

  /**
   * Load persisted devices and ensure the current device is registered.
   * Idempotent — safe to call from every hook mount.
   */
  async init(): Promise<void> {
    if (this.initialized) return
    this.initialized = true

    const [storedDevices, storedId] = await Promise.all([
      getJSON<LinkedDevice[]>(StorageKeys.devices),
      getJSON<string>(StorageKeys.currentDeviceId),
    ])
    if (storedDevices) this.devices = storedDevices
    if (storedId) this.currentDeviceId = storedId

    this.registerCurrentDevice()
  }

  /** Register (or refresh) the current device, persisting a stable id. */
  registerCurrentDevice(): LinkedDevice {
    if (!this.currentDeviceId) {
      this.currentDeviceId = Crypto.randomUUID()
      void setJSON(StorageKeys.currentDeviceId, this.currentDeviceId)
    }

    const platformOS = Platform.OS
    const current: LinkedDevice = {
      id: this.currentDeviceId,
      name:
        platformOS === 'ios'
          ? 'iPhone'
          : platformOS === 'android'
            ? 'Android device'
            : 'Web browser',
      type: platformOS === 'web' ? 'desktop' : 'phone',
      platform: platformOS === 'ios' ? 'ios' : platformOS === 'android' ? 'android' : 'web',
      location: '',
      lastActive: 'Now',
      isCurrent: true,
    }

    // Mark any previously-current device as not current, then upsert this one.
    const others = this.devices
      .filter((d) => d.id !== current.id)
      .map((d) => ({ ...d, isCurrent: false }))
    this.devices = [current, ...others]
    this.persist()
    return current
  }

  /** Get all linked devices. */
  getAll(): LinkedDevice[] {
    return this.devices
  }

  /** Remove a device by id. The current device cannot be removed. */
  removeDevice(id: string): boolean {
    if (id === this.currentDeviceId) return false
    const before = this.devices.length
    this.devices = this.devices.filter((d) => d.id !== id)
    if (this.devices.length !== before) {
      this.persist()
      return true
    }
    return false
  }

  /** Remove all devices except the current one. */
  removeAllOthers(): void {
    this.devices = this.devices.filter((d) => d.isCurrent)
    this.persist()
  }

  /** Subscribe to device list changes. */
  subscribe(listener: DeviceListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private persist(): void {
    void setJSON(StorageKeys.devices, this.devices)
    this.emit()
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener([...this.devices]))
  }
}

export const DeviceService = new DeviceServiceImpl()
