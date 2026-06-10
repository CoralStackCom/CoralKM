import { useCallback, useEffect, useState } from 'react'
import { DeviceService } from './device-service'
import type { LinkedDevice } from './device-types'

/**
 * Hook to access device management state.
 *
 * Initializes the persisted device service on mount (loading saved devices and
 * registering the current device), then stays subscribed to changes.
 */
export function useDevices() {
  const [devices, setDevices] = useState<LinkedDevice[]>(DeviceService.getAll())

  useEffect(() => {
    const unsubscribe = DeviceService.subscribe(setDevices)
    void DeviceService.init().then(() => setDevices(DeviceService.getAll()))
    return unsubscribe
  }, [])

  const removeDevice = useCallback((id: string) => {
    void DeviceService.removeDevice(id)
  }, [])

  const removeAllOthers = useCallback(() => {
    void DeviceService.removeAllOthers()
  }, [])

  return { devices, removeDevice, removeAllOthers }
}
