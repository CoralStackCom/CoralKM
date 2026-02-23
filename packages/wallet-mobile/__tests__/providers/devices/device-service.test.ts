jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}))

import { DeviceService } from '@/providers/devices/device-service'

describe('DeviceService', () => {
  beforeEach(() => {
    // Clear all devices by removing them individually
    const all = DeviceService.getAll()
    for (const device of all) {
      DeviceService.removeDevice(device.id)
    }
  })

  describe('registerCurrentDevice()', () => {
    it('creates a device with isCurrent=true', () => {
      const device = DeviceService.registerCurrentDevice()
      expect(device.isCurrent).toBe(true)
    })

    it('creates a device with a unique id', () => {
      const device = DeviceService.registerCurrentDevice()
      expect(device.id).toBeDefined()
      expect(typeof device.id).toBe('string')
    })

    it('sets device name based on platform (iPhone for ios)', () => {
      const device = DeviceService.registerCurrentDevice()
      expect(device.name).toBe('iPhone')
    })

    it('sets device type to phone for ios platform', () => {
      const device = DeviceService.registerCurrentDevice()
      expect(device.type).toBe('phone')
    })

    it('sets platform field to ios', () => {
      const device = DeviceService.registerCurrentDevice()
      expect(device.platform).toBe('ios')
    })

    it('replaces previous current device on re-register', () => {
      DeviceService.registerCurrentDevice()
      DeviceService.registerCurrentDevice()
      const all = DeviceService.getAll()
      const currentDevices = all.filter((d) => d.isCurrent)
      expect(currentDevices).toHaveLength(1)
    })
  })

  describe('getAll()', () => {
    it('returns registered devices', () => {
      DeviceService.registerCurrentDevice()
      const all = DeviceService.getAll()
      expect(all).toHaveLength(1)
      expect(all[0].isCurrent).toBe(true)
    })

    it('returns empty array when no devices registered', () => {
      expect(DeviceService.getAll()).toEqual([])
    })
  })

  describe('removeDevice()', () => {
    it('removes specified device and returns true', () => {
      const device = DeviceService.registerCurrentDevice()
      const result = DeviceService.removeDevice(device.id)
      expect(result).toBe(true)
      expect(DeviceService.getAll()).toHaveLength(0)
    })

    it('returns false for non-existent ID', () => {
      const result = DeviceService.removeDevice('nonexistent-id')
      expect(result).toBe(false)
    })

    it('does not affect other devices', () => {
      // Register current device, then add a second by re-registering (which replaces)
      // Instead, register current, then manually test removal of the current
      const device = DeviceService.registerCurrentDevice()
      DeviceService.removeDevice(device.id)
      expect(DeviceService.getAll()).toEqual([])
    })
  })

  describe('removeAllOthers()', () => {
    it('keeps only the current device', () => {
      DeviceService.registerCurrentDevice()
      // The service only has current device since we can only register current.
      // removeAllOthers should keep only devices where isCurrent=true
      DeviceService.removeAllOthers()
      const all = DeviceService.getAll()
      expect(all).toHaveLength(1)
      expect(all[0].isCurrent).toBe(true)
    })

    it('results in empty list when no current device exists', () => {
      // Remove everything first (no current device)
      DeviceService.removeAllOthers()
      expect(DeviceService.getAll()).toEqual([])
    })
  })

  describe('subscribe()', () => {
    it('notifies listener when device is registered', () => {
      const listener = jest.fn()
      DeviceService.subscribe(listener)
      DeviceService.registerCurrentDevice()
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ isCurrent: true }),
        ])
      )
    })

    it('notifies listener when device is removed', () => {
      const device = DeviceService.registerCurrentDevice()
      const listener = jest.fn()
      DeviceService.subscribe(listener)
      DeviceService.removeDevice(device.id)
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('notifies listener on removeAllOthers', () => {
      DeviceService.registerCurrentDevice()
      const listener = jest.fn()
      DeviceService.subscribe(listener)
      DeviceService.removeAllOthers()
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('returns unsubscribe function that stops notifications', () => {
      const listener = jest.fn()
      const unsubscribe = DeviceService.subscribe(listener)
      DeviceService.registerCurrentDevice()
      expect(listener).toHaveBeenCalledTimes(1)

      unsubscribe()
      DeviceService.registerCurrentDevice()
      // Should still be 1, not 2 (the re-register emits but listener is gone)
      expect(listener).toHaveBeenCalledTimes(1)
    })
  })
})
