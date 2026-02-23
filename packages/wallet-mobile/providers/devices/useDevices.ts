import { useCallback, useEffect, useState } from 'react'
import { DeviceService } from './device-service'
import type { LinkedDevice } from './device-types'

/**
 * Hook to access device management state.
 */
export function useDevices() {
  const [devices, setDevices] = useState<LinkedDevice[]>(DeviceService.getAll())

  useEffect(() => {
    return DeviceService.subscribe(setDevices)
  }, [])

  const removeDevice = useCallback((id: string) => {
    DeviceService.removeDevice(id)
  }, [])

  const removeAllOthers = useCallback(() => {
    DeviceService.removeAllOthers()
  }, [])

  return { devices, removeDevice, removeAllOthers }
}
