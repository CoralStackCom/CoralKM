export interface Device {
  /// Unique identifier for the device
  id: string
  /// Name of the device
  name: string
  /// Type of the device
  type: 'phone' | 'tablet' | 'desktop'
  /// Last known location of the device
  location: string
  /// Last active time of the device
  lastActive: string
  /// Whether this device is the current device
  isCurrent: boolean
}
