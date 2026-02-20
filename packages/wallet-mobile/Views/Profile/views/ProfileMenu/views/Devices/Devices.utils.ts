import { Alert } from 'react-native'
import { Device } from './DevicesScreen.interfaces'

// Sample devices data
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

// Function to get device icon based on type
export const getDeviceIcon = (type: Device['type']) => {
  switch (type) {
    case 'phone':
      return 'phone.fill'
    case 'tablet':
      return 'tablet.fill'
    case 'desktop':
      return 'desktop.fill'
  }
}

// Function to handle device removal
export const handleRemoveDevice = (device: Device) => {
  Alert.alert(
    'Remove Device',
    `Are you sure you want to remove "${device.name}"? You'll need to log in again on that device.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => Alert.alert('Device Removed', `${device.name} has been removed.`),
      },
    ]
  )
}

export const handleLogoutAll = () => {
  Alert.alert(
    'Log Out All Devices',
    "You will be logged out of all devices except this one. You'll need to log in again on other devices.",
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out All',
        style: 'destructive',
        onPress: () => Alert.alert('Logged Out', 'All other devices have been logged out.'),
      },
    ]
  )
}
