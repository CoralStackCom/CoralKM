jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}))

import { DeviceService } from '@/providers/devices/device-service'

/**
 * DeviceService now protects the current device (it cannot be removed) and
 * persists a stable current-device id, so the current device is always present
 * once registered. Tests assert this real behavior rather than an empty state.
 */
describe('DeviceService', () => {
  describe('registerCurrentDevice()', () => {
    it('creates a device with isCurrent=true', () => {
      const device = DeviceService.registerCurrentDevice()
      expect(device.isCurrent).toBe(true)
    })

    it('creates a device with a defined string id', () => {
      const device = DeviceService.registerCurrentDevice()
      expect(typeof device.id).toBe('string')
      expect(device.id.length).toBeGreaterThan(0)
    })

    it('sets device name based on platform (iPhone for ios)', () => {
      expect(DeviceService.registerCurrentDevice().name).toBe('iPhone')
    })

    it('sets device type to phone for ios platform', () => {
      expect(DeviceService.registerCurrentDevice().type).toBe('phone')
    })

    it('sets platform field to ios', () => {
      expect(DeviceService.registerCurrentDevice().platform).toBe('ios')
    })

    it('keeps a stable id and exactly one current device on re-register', () => {
      const first = DeviceService.registerCurrentDevice()
      const second = DeviceService.registerCurrentDevice()
      expect(second.id).toBe(first.id)
      const currentDevices = DeviceService.getAll().filter((d) => d.isCurrent)
      expect(currentDevices).toHaveLength(1)
    })
  })

  describe('getAll()', () => {
    it('includes the registered current device', () => {
      DeviceService.registerCurrentDevice()
      const all = DeviceService.getAll()
      expect(all.some((d) => d.isCurrent)).toBe(true)
    })
  })

  describe('removeDevice()', () => {
    it('refuses to remove the current device', () => {
      const device = DeviceService.registerCurrentDevice()
      expect(DeviceService.removeDevice(device.id)).toBe(false)
      expect(DeviceService.getAll().some((d) => d.id === device.id)).toBe(true)
    })

    it('returns false for a non-existent id', () => {
      expect(DeviceService.removeDevice('nonexistent-id')).toBe(false)
    })
  })

  describe('removeAllOthers()', () => {
    it('keeps only the current device', () => {
      DeviceService.registerCurrentDevice()
      DeviceService.removeAllOthers()
      const all = DeviceService.getAll()
      expect(all).toHaveLength(1)
      expect(all[0].isCurrent).toBe(true)
    })
  })

  describe('subscribe()', () => {
    it('notifies listener when a device is registered', () => {
      const listener = jest.fn()
      const unsubscribe = DeviceService.subscribe(listener)
      DeviceService.registerCurrentDevice()
      expect(listener).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ isCurrent: true })])
      )
      unsubscribe()
    })

    it('returns an unsubscribe function that stops notifications', () => {
      const listener = jest.fn()
      const unsubscribe = DeviceService.subscribe(listener)
      DeviceService.registerCurrentDevice()
      const callCount = listener.mock.calls.length
      unsubscribe()
      DeviceService.registerCurrentDevice()
      expect(listener.mock.calls.length).toBe(callCount)
    })
  })
})
