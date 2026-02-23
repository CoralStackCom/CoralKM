import { Platform } from 'react-native'
import type { LinkedDevice } from './device-types'

type DeviceListener = (devices: LinkedDevice[]) => void

/**
 * Device management service.
 * Tracks linked devices with local state (to be backed by DIDComm sync later).
 */
class DeviceServiceImpl {
  private devices: LinkedDevice[] = []
  private listeners: Set<DeviceListener> = new Set()
  private currentDeviceId: string | null = null

  /** Register the current device */
  registerCurrentDevice(): LinkedDevice {
    const id = `device-${Date.now()}`
    this.currentDeviceId = id

    const platformOS = Platform.OS
    const deviceType = platformOS === 'web' ? 'desktop' : 'phone'
    const deviceName =
      platformOS === 'ios'
        ? 'iPhone'
        : platformOS === 'android'
          ? 'Android device'
          : 'Web browser'

    const current: LinkedDevice = {
      id,
      name: deviceName,
      type: deviceType,
      platform: platformOS === 'ios' ? 'ios' : platformOS === 'android' ? 'android' : 'web',
      location: '',
      lastActive: 'Now',
      isCurrent: true,
    }

    // Replace or add current device
    this.devices = [current, ...this.devices.filter((d) => !d.isCurrent)]
    this.emit()
    return current
  }

  /** Get all linked devices */
  getAll(): LinkedDevice[] {
    return this.devices
  }

  /** Remove a device by ID */
  removeDevice(id: string): boolean {
    const before = this.devices.length
    this.devices = this.devices.filter((d) => d.id !== id)
    if (this.devices.length !== before) {
      this.emit()
      return true
    }
    return false
  }

  /** Remove all devices except current */
  removeAllOthers(): void {
    this.devices = this.devices.filter((d) => d.isCurrent)
    this.emit()
  }

  /** Subscribe to device list changes */
  subscribe(listener: DeviceListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener([...this.devices]))
  }
}

export const DeviceService = new DeviceServiceImpl()
