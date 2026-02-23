import { Alert } from 'react-native'
import { Device } from './DevicesScreen.interfaces'

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

// Function to handle device removal with confirmation
export const handleRemoveDevice = (device: Device, onConfirm: (id: string) => void) => {
  Alert.alert(
    'Remove Device',
    `Are you sure you want to remove "${device.name}"? You'll need to log in again on that device.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => onConfirm(device.id),
      },
    ]
  )
}

// Function to handle logging out all other devices with confirmation
export const handleLogoutAll = (onConfirm: () => void) => {
  Alert.alert(
    'Log Out All Devices',
    "You will be logged out of all devices except this one. You'll need to log in again on other devices.",
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out All',
        style: 'destructive',
        onPress: () => onConfirm(),
      },
    ]
  )
}
