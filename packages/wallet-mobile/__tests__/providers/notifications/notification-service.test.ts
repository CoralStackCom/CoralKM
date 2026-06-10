import { NotificationService } from '@/providers/notifications/notification-service'

describe('NotificationService', () => {
  beforeEach(() => {
    NotificationService.clear()
  })

  describe('push()', () => {
    it('adds a notification with correct type, title, and body', () => {
      NotificationService.push('new_message', 'New Message', 'You have a new message')
      const all = NotificationService.getAll()
      expect(all).toHaveLength(1)
      expect(all[0].type).toBe('new_message')
      expect(all[0].title).toBe('New Message')
      expect(all[0].body).toBe('You have a new message')
    })

    it('creates notification with unique id', () => {
      NotificationService.push('system', 'Alert 1', 'Body 1')
      NotificationService.push('system', 'Alert 2', 'Body 2')
      const all = NotificationService.getAll()
      expect(all[0].id).not.toBe(all[1].id)
    })

    it('creates notification with read=false', () => {
      NotificationService.push('credential_offer', 'Offer', 'New credential')
      const all = NotificationService.getAll()
      expect(all[0].read).toBe(false)
    })

    it('creates notification with a timestamp', () => {
      NotificationService.push('system', 'Test', 'Body')
      const all = NotificationService.getAll()
      expect(all[0].timestamp).toBeDefined()
      expect(typeof all[0].timestamp).toBe('string')
    })

    it('stores optional data', () => {
      const data = { senderId: 'abc123' }
      NotificationService.push('new_message', 'Msg', 'Hello', data)
      const all = NotificationService.getAll()
      expect(all[0].data).toEqual(data)
    })
  })

  describe('getAll()', () => {
    it('returns notifications in reverse chronological order (newest first)', () => {
      NotificationService.push('system', 'First', 'First body')
      NotificationService.push('system', 'Second', 'Second body')
      NotificationService.push('system', 'Third', 'Third body')
      const all = NotificationService.getAll()
      expect(all).toHaveLength(3)
      expect(all[0].title).toBe('Third')
      expect(all[1].title).toBe('Second')
      expect(all[2].title).toBe('First')
    })

    it('returns empty array when no notifications', () => {
      expect(NotificationService.getAll()).toEqual([])
    })
  })

  describe('markAsRead()', () => {
    it('marks a specific notification as read', () => {
      NotificationService.push('system', 'Test', 'Body')
      const id = NotificationService.getAll()[0].id
      NotificationService.markAsRead(id)
      const updated = NotificationService.getAll()
      expect(updated[0].read).toBe(true)
    })

    it('does not affect other notifications', () => {
      NotificationService.push('system', 'First', 'Body 1')
      NotificationService.push('system', 'Second', 'Body 2')
      const all = NotificationService.getAll()
      NotificationService.markAsRead(all[0].id)
      const updated = NotificationService.getAll()
      expect(updated[0].read).toBe(true)
      expect(updated[1].read).toBe(false)
    })
  })

  describe('markAllAsRead()', () => {
    it('marks all notifications as read', () => {
      NotificationService.push('system', 'A', 'Body A')
      NotificationService.push('system', 'B', 'Body B')
      NotificationService.push('system', 'C', 'Body C')
      NotificationService.markAllAsRead()
      const all = NotificationService.getAll()
      expect(all.every((n) => n.read)).toBe(true)
    })
  })

  describe('getUnreadCount()', () => {
    it('returns correct count of unread notifications', () => {
      NotificationService.push('system', 'A', 'Body A')
      NotificationService.push('system', 'B', 'Body B')
      NotificationService.push('system', 'C', 'Body C')
      expect(NotificationService.getUnreadCount()).toBe(3)
    })

    it('decreases when notifications are marked as read', () => {
      NotificationService.push('system', 'A', 'Body A')
      NotificationService.push('system', 'B', 'Body B')
      const id = NotificationService.getAll()[0].id
      NotificationService.markAsRead(id)
      expect(NotificationService.getUnreadCount()).toBe(1)
    })

    it('returns 0 after markAllAsRead', () => {
      NotificationService.push('system', 'A', 'Body A')
      NotificationService.push('system', 'B', 'Body B')
      NotificationService.markAllAsRead()
      expect(NotificationService.getUnreadCount()).toBe(0)
    })

    it('returns 0 when no notifications exist', () => {
      expect(NotificationService.getUnreadCount()).toBe(0)
    })
  })

  describe('clear()', () => {
    it('removes all notifications', () => {
      NotificationService.push('system', 'A', 'Body A')
      NotificationService.push('system', 'B', 'Body B')
      NotificationService.clear()
      expect(NotificationService.getAll()).toEqual([])
      expect(NotificationService.getUnreadCount()).toBe(0)
    })
  })

  describe('subscribe()', () => {
    it('calls listener when notifications change via push', () => {
      const listener = jest.fn()
      NotificationService.subscribe(listener)
      NotificationService.push('system', 'Test', 'Body')
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ title: 'Test' }),
        ])
      )
    })

    it('calls listener on markAsRead', () => {
      NotificationService.push('system', 'Test', 'Body')
      const id = NotificationService.getAll()[0].id
      const listener = jest.fn()
      NotificationService.subscribe(listener)
      NotificationService.markAsRead(id)
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('calls listener on markAllAsRead', () => {
      NotificationService.push('system', 'A', 'Body')
      const listener = jest.fn()
      NotificationService.subscribe(listener)
      NotificationService.markAllAsRead()
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('calls listener on clear', () => {
      NotificationService.push('system', 'A', 'Body')
      const listener = jest.fn()
      NotificationService.subscribe(listener)
      NotificationService.clear()
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith([])
    })

    it('returns unsubscribe function that stops notifications', () => {
      const listener = jest.fn()
      const unsubscribe = NotificationService.subscribe(listener)
      NotificationService.push('system', 'Before', 'Body')
      expect(listener).toHaveBeenCalledTimes(1)

      unsubscribe()
      NotificationService.push('system', 'After', 'Body')
      expect(listener).toHaveBeenCalledTimes(1) // not called again
    })
  })
})
