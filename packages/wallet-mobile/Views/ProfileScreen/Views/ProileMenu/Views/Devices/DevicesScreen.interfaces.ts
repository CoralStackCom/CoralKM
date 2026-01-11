export interface Device {
  id: string
  name: string
  type: 'phone' | 'tablet' | 'desktop'
  location: string
  lastActive: string
  isCurrent: boolean
}
