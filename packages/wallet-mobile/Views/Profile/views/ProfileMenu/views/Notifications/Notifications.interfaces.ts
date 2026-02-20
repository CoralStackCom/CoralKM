/**
 * Interfaces for NotificationsScreen component.
 *
 * Defines the notification setting item structure for
 * config-driven rendering.
 */
export interface NotificationSettingItem {
  /** Display title for the setting */
  title: string
  /** Description text shown below the title */
  description: string
  /** Icon name from the icon set */
  leftIcon: string
  /** Current toggle state */
  value: boolean
  /** Callback when toggle changes */
  onValueChange: (value: boolean) => void
  /** Whether the toggle is disabled */
  disabled?: boolean
}

export interface NotificationsScreenProps {}
