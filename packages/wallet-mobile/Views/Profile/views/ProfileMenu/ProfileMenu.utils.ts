import { router } from 'expo-router'
import type { MenuSection } from './ProfileMenu.interfaces'

/**
 * Grouped profile menu definition. Each item carries its own accent color so
 * the icon chips read as a coherent, scannable set.
 */
export const menuSections: MenuSection[] = [
  {
    title: 'Account',
    items: [
      {
        icon: 'lock',
        label: 'Security',
        description: 'App lock, login alerts & your data',
        color: '#1B5678',
        onPress: () => router.push('/ProfileMenu/Privacy'),
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        icon: 'notifications.fill',
        label: 'Notifications',
        description: 'Alerts, reports & emails',
        color: '#F2A93B',
        onPress: () => router.push('/ProfileMenu/Notifications'),
      },
      {
        icon: 'moon',
        label: 'Appearance',
        description: 'Theme & app icon',
        color: '#6C5CE7',
        onPress: () => router.push('/ProfileMenu/Appearance'),
      },
      {
        icon: 'smartphone',
        label: 'Devices',
        description: 'Manage linked devices',
        color: '#2BB3A3',
        onPress: () => router.push('/ProfileMenu/Devices'),
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        icon: 'help.fill',
        label: 'Help & Support',
        description: 'FAQs, contact & resources',
        color: '#3B82F6',
        onPress: () => router.push('/ProfileMenu/Help'),
      },
    ],
  },
]
