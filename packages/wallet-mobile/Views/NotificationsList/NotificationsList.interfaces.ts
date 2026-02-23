import type { AppNotification } from '@/providers/notifications'

/**
 * Interfaces for the NotificationsList screen.
 *
 * Defines props for the notification list view and individual
 * notification item rows.
 */

export interface NotificationItemProps {
  /** The notification data to render */
  notification: AppNotification
  /** Callback when the notification row is pressed */
  onPress: (notification: AppNotification) => void
}

export interface NotificationsListProps {}
