import { Device } from './DevicesScreen.interfaces'

export const devices: Device[] = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    type: 'phone',
    location: 'San Francisco, CA',
    lastActive: 'Now',
    isCurrent: true,
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'desktop',
    location: 'San Francisco, CA',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'tablet',
    location: 'San Francisco, CA',
    lastActive: 'Yesterday',
    isCurrent: false,
  },
  {
    id: '4',
    name: 'Windows PC',
    type: 'desktop',
    location: 'New York, NY',
    lastActive: '3 days ago',
    isCurrent: false,
  },
]
