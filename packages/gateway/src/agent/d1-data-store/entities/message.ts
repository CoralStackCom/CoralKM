import type { IMessage } from '@veramo/core'

/**
 * Table schema for storing messages in D1
 */
export interface Message {
  /**
   * Message ID (UUID)
   */
  id: string
  /**
   * Date when the record was created (ISO 8601 string)
   */
  saveDate: string
  /**
   * Date when the record was last updated (ISO 8601 string)
   * */
  updateDate: string
  /**
   * Date when the message was originally created (ISO 8601 string)
   */
  createdAt?: string | null
  /**
   * Date when the message expires (ISO 8601 string) - null if it does not expire
   */
  expiresAt?: string | null
  /**
   * Thread ID for correlating messages (if applicable)
   */
  threadId: string | null
  /**
   * Message type (DIDComm message type)
   * e.g. 'https://didcomm.org/messagepickup/1.0/pickup'
   */
  type: string
  /**
   * Raw message as JSON string (if applicable)
   * This is the original message before any processing
   */
  raw?: string | null
  /**
   * Any additional message data as JSON string
   */
  data?: string | null
  /**
   * Reply to DID(s) (if applicable)
   * Stored as comma-separated string in the database
   * e.g. "did:example:123, did:example:456"
   */
  replyTo?: string | null
  /**
   * Reply URL (if applicable)
   */
  replyUrl?: string | null
  /**
   * Sender DID (if applicable), must map to an identifier in the DID store
   * e.g. "did:example:123"
   */
  from_id?: string | null
  /**
   * Recipient DID (if applicable), must map to an identifier in the DID store
   * e.g. "did:example:123"
   */
  to_id?: string | null
  /**
   * Message metadata (stored as JSON string Array)
   */
  metaData?: string | null
}

/**
 * Type for updating a message in the database (excludes saveDate and updateDate)
 */
export type MessageUpdate = Omit<Message, 'saveDate' | 'updateDate'>

/**
 * Convert an IMessage object to a database row
 *
 * @param message The IMessage object to convert
 * @returns       The corresponding database row
 */
export function convertToRowFromMessage(message: IMessage): MessageUpdate {
  return {
    id: message.id,
    createdAt: message.createdAt || null,
    expiresAt: message.expiresAt || null,
    threadId: message.threadId || null,
    type: message.type,
    raw: message.raw ? JSON.stringify(message.raw) : null,
    data: message.data ? JSON.stringify(message.data) : null,
    replyTo: message.replyTo ? message.replyTo.join(', ') : null,
    replyUrl: message.replyUrl || null,
    from_id: message.from || null,
    to_id: message.to || null,
    metaData: message.metaData ? JSON.stringify(message.metaData) : null,
  }
}

/**
 * Convert a database row to an IMessage object
 *
 * @param row     A database row representing a message
 * @returns       The corresponding IMessage object
 */
export function convertToMessageFromRow(row: Message): IMessage {
  const message: IMessage = {
    id: row.id,
    type: row.type,
  }
  if (row.createdAt) {
    message.createdAt = row.createdAt
  }
  if (row.expiresAt) {
    message.expiresAt = row.expiresAt
  }
  if (row.threadId) {
    message.threadId = row.threadId
  }
  if (row.raw) {
    try {
      message.raw = JSON.parse(row.raw)
    } catch (e) {
      console.error('Error parsing raw message JSON from database:', e)
    }
  }
  if (row.data) {
    try {
      message.data = JSON.parse(row.data)
    } catch (e) {
      console.error('Error parsing data JSON from database:', e)
    }
  }
  if (row.replyTo) {
    message.replyTo = row.replyTo.split(',').map(s => s.trim())
  }
  if (row.replyUrl) {
    message.replyUrl = row.replyUrl
  }
  if (row.from_id) {
    message.from = row.from_id
  }
  if (row.to_id) {
    message.to = row.to_id
  }
  if (row.metaData) {
    try {
      message.metaData = JSON.parse(row.metaData)
    } catch (e) {
      console.error('Error parsing metaData JSON from database:', e)
    }
  }
  return message
}
