import { AppNotification, NotificationType } from './notification-types'

type NotificationListener = (notifications: AppNotification[]) => void

/**
 * In-memory notification service.
 * Manages local notification state and provides subscription for UI updates.
 */
class NotificationServiceImpl {
  private notifications: AppNotification[] = []
  private listeners: Set<NotificationListener> = new Set()

  /** Add a new notification */
  push(type: NotificationType, title: string, body: string, data?: Record<string, unknown>): void {
    const notification: AppNotification = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      title,
      body,
      timestamp: new Date().toISOString(),
      read: false,
      data,
    }
    this.notifications = [notification, ...this.notifications]
    this.emit()
  }

  /** Mark a notification as read */
  markAsRead(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
    this.emit()
  }

  /** Mark all as read */
  markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }))
    this.emit()
  }

  /** Get unread count */
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length
  }

  /** Get all notifications */
  getAll(): AppNotification[] {
    return this.notifications
  }

  /** Clear all notifications */
  clear(): void {
    this.notifications = []
    this.emit()
  }

  /** Subscribe to notification changes */
  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener(this.notifications))
  }
}

export const NotificationService = new NotificationServiceImpl()
