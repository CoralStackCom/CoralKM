/**
 * Device type definitions for device management.
 */

export interface LinkedDevice {
  id: string
  name: string
  type: 'phone' | 'tablet' | 'desktop'
  platform: 'ios' | 'android' | 'web'
  location: string
  lastActive: string
  isCurrent: boolean
}
