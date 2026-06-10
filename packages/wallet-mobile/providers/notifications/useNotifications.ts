import { useCallback, useEffect, useState } from 'react'
import { NotificationService } from './notification-service'
import type { AppNotification } from './notification-types'

/**
 * Hook to access notification state.
 * Re-renders when notifications change.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    NotificationService.getAll()
  )

  useEffect(() => {
    return NotificationService.subscribe(setNotifications)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = useCallback((id: string) => {
    NotificationService.markAsRead(id)
  }, [])

  const markAllAsRead = useCallback(() => {
    NotificationService.markAllAsRead()
  }, [])

  const clear = useCallback(() => {
    NotificationService.clear()
  }, [])

  return { notifications, unreadCount, markAsRead, markAllAsRead, clear }
}
