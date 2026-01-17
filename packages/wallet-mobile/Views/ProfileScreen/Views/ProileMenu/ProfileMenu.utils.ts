import { router } from 'expo-router'
import { MenuItem } from './Profilemenu.interfaces'

export const menuItems: MenuItem[] = [
  {
    icon: 'gear',
    label: 'Settings',
    onPress: () => router.push('/ProfileMenu/Settings'),
  },
  {
    icon: 'lock',
    label: 'Privacy & Security',
    onPress: () => router.push('/ProfileMenu/Privacy'),
  },
  {
    icon: 'notifications.fill',
    label: 'Notifications',
    onPress: () => router.push('/ProfileMenu/Notifications'),
  },
  {
    icon: 'moon',
    label: 'Appearance',
    onPress: () => router.push('/ProfileMenu/Appearance'),
  },
  {
    icon: 'smartphone',
    label: 'Devices',
    onPress: () => router.push('/ProfileMenu/Devices'),
  },
  {
    icon: 'help.fill',
    label: 'Help & Support',
    onPress: () => router.push('/ProfileMenu/Help'),
  },
]
