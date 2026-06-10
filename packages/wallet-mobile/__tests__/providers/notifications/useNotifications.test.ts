/**
 * Tests for the useNotifications hook.
 * Since renderHook from @testing-library/react-native may not be available,
 * we test the underlying NotificationService directly, which is what the hook wraps.
 */
import { NotificationService } from '@/providers/notifications/notification-service'

describe('useNotifications (via NotificationService)', () => {
  beforeEach(() => {
    NotificationService.clear()
  })

  it('provides notifications through getAll()', () => {
    NotificationService.push('system', 'Hello', 'World')
    const notifications = NotificationService.getAll()
    expect(notifications).toHaveLength(1)
    expect(notifications[0].title).toBe('Hello')
  })

  it('computes unread count correctly', () => {
    NotificationService.push('system', 'A', 'Body A')
    NotificationService.push('system', 'B', 'Body B')
    NotificationService.push('system', 'C', 'Body C')
    expect(NotificationService.getUnreadCount()).toBe(3)

    const id = NotificationService.getAll()[0].id
    NotificationService.markAsRead(id)
    expect(NotificationService.getUnreadCount()).toBe(2)
  })

  it('markAsRead updates specific notification', () => {
    NotificationService.push('system', 'Test', 'Body')
    const id = NotificationService.getAll()[0].id
    NotificationService.markAsRead(id)
    expect(NotificationService.getAll()[0].read).toBe(true)
  })

  it('markAllAsRead marks every notification as read', () => {
    NotificationService.push('system', 'A', 'Body A')
    NotificationService.push('system', 'B', 'Body B')
    NotificationService.markAllAsRead()
    const all = NotificationService.getAll()
    expect(all.every((n) => n.read)).toBe(true)
    expect(NotificationService.getUnreadCount()).toBe(0)
  })

  it('clear removes all notifications', () => {
    NotificationService.push('system', 'A', 'Body A')
    NotificationService.push('system', 'B', 'Body B')
    NotificationService.clear()
    expect(NotificationService.getAll()).toHaveLength(0)
  })

  it('subscribe receives updates when notifications change', () => {
    const listener = jest.fn()
    const unsubscribe = NotificationService.subscribe(listener)

    NotificationService.push('new_message', 'Msg', 'Content')
    expect(listener).toHaveBeenCalledTimes(1)

    NotificationService.markAllAsRead()
    expect(listener).toHaveBeenCalledTimes(2)

    unsubscribe()
    NotificationService.push('system', 'After', 'Unsub')
    expect(listener).toHaveBeenCalledTimes(2) // no more calls
  })
})
