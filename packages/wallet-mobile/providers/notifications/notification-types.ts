/**
 * Notification type definitions for DIDComm events.
 */

export type NotificationType =
  | 'new_message'
  | 'recovery_request'
  | 'credential_offer'
  | 'guardian_approval'
  | 'connection_request'
  | 'system'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  timestamp: string
  read: boolean
  data?: Record<string, unknown>
}
