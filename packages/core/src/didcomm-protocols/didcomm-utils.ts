import type { IMessage } from '@veramo/core'
import type { IDIDCommMessage } from '@veramo/did-comm'

import {
  DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
  DIDCOMM_PROTOCOL_RETURN_ROUTE_METADATA_TYPE,
} from './dicomm-protocols-message-handler'
import { DIDCommProtocolError, type IDIDCommMessageType } from './didcomm-protocols-interface'
import {
  DIDCOMM_ROUTING_V2_METADATA_TYPE,
  RouteMessagesMetaData,
} from './protocols/routing-v2-protocol'

/**
 * Extracts and returns the type of a DIDComm message as object.
 *
 * @param messageType The DIDComm message type string (e.g., "https://didcomm.org/messaging/2.0/text").
 * @returns           The type of the DIDComm message.
 *                      - piuri: The Protocol Identifier URI without version suffix or trailing slash.
 *                      - version: The version of the protocol.
 *                      - type: The specific message type within the protocol.
 */
export function getMessageType(messageType: string): IDIDCommMessageType {
  // Regex explanation:
  //  ^(?<piuri>https?:\/\/[^\/]+(?:\/(?!\d+(?:\.\d+)*\/)[^\/]+)+)
  //    - piuri: scheme + host + one or more path segments
  //      that are NOT a pure version segment (e.g., "2.0"),
  //      ensured via a negative lookahead (?!\d+(\.\d+)*\/)
  //  \/(?<version>\d+(?:\.\d+)*)
  //    - version: "1.0", "2.0", "3.0.1", etc.
  //  \/(?<messageType>[^\/?#]+)$
  //    - messageType: last path segment (no slashes, ? or #)
  const re =
    /^(?<piuri>https?:\/\/[^/]+(?:\/(?!\d+(?:\.\d+)*\/)[^/]+)+)\/(?<version>\d+(?:\.\d+)*)\/(?<messageURIType>[^/?#]+)$/i

  const m = messageType.match(re)
  if (!m || !m.groups) throw new Error(`Invalid DIDComm message type: ${messageType}`)

  const { piuri, version, messageURIType } = m.groups
  return { piuri, version, type: messageURIType }
}

/**
 * Constructs the full DIDComm message type string from its components.
 *
 * @param messageType   The DIDComm message type object.
 * @returns             The full DIDComm message type string.
 */
export function getFullMessageType(messageType: IDIDCommMessageType): string {
  return `${messageType.piuri}/${messageType.version}/${messageType.type}`
}

/**
 * Helper function to throw a DIDCommProtocolError if a required field is missing
 * in a DIDComm message.
 *
 * @param condition    Whether the error condition is met (true if the field is missing).
 * @param messageType The type of the DIDComm message.
 * @param field       The field that is required but missing.
 */
export function assertMessageFieldDefined<T>(
  value: T | null | undefined,
  name: string,
  messageType: IDIDCommMessageType
): asserts value is T {
  if (!value) {
    throw new DIDCommProtocolError(
      'invalid_argument:  Protocol Message {1} received without {2} set',
      'invalid_argument',
      messageType,
      [getFullMessageType(messageType), name]
    )
  }
}

/**
 * Asserts that the agent has the required role to perform an action.
 *
 * @param requiredRole  The Protocol role required to perform an action.
 * @param agentRoles    The Protocol roles assigned to the agent.
 * @param messageType   The type of the DIDComm message.
 */
export function assertRole(
  requiredRole: string,
  agentRoles: string[],
  messageType: IDIDCommMessageType
): void {
  if (!agentRoles.includes(requiredRole)) {
    throw new DIDCommProtocolError(
      'invalid_role:  Protocol Message {1} received by agent without required role {2}',
      'invalid_role',
      messageType,
      [getFullMessageType(messageType), requiredRole]
    )
  }
}

/**
 * Helper function to throw a DIDCommProtocolError for unsupported message types.
 *
 * @param messageType The type of the DIDComm message.
 * @throws DIDCommProtocolError indicating that the message type is unsupported.
 */
export function throwUnsupportedMessageType(messageType: IDIDCommMessageType): never {
  throw new DIDCommProtocolError(
    'unsupported_message_type: Protocol Message {1} of type {2} is not supported',
    'unsupported_message_type',
    messageType,
    [getFullMessageType(messageType), messageType.type]
  )
}

/**
 * The metadata value for a DIDComm Return Route message
 */
export interface DIDCommReturnRouteMetadataValue {
  id: string
  message: IDIDCommMessage
  contentType: string
}

/**
 * Get's the DIDComm Return Route message after it's been handled by
 * agent.handleMessage if present otherwise returns null
 *
 * @param message   The handled message
 * @returns         The Return Route message or null if not present
 */
export function getDIDCommReturnRouteMessage(
  message: IMessage
): DIDCommReturnRouteMetadataValue | null {
  const returnRouteResponse = message?.metaData?.find(
    v => v.type === DIDCOMM_PROTOCOL_RETURN_ROUTE_METADATA_TYPE
  )
  if (returnRouteResponse && returnRouteResponse.value) {
    const returnMessage = JSON.parse(returnRouteResponse.value)
    return returnMessage
  }
  return null
}

/**
 * Get's the decoded DIDComm message after it's been handled by
 * agent.handleMessage if present otherwise returns null
 *
 * @param message   The handled message
 * @returns         The decoded message or null if not present
 */
export function getDIDCommDecodedMessage(message: IMessage): any | null {
  const decodedMessage = message?.metaData?.find(
    v => v.type === DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE
  )
  if (decodedMessage && decodedMessage.value) {
    const decoded = JSON.parse(decodedMessage.value)
    return decoded
  }
  return null
}

/**
 * Gets an array of any packed messages that need to be forwarded from a DIDComm Forward message
 *
 * @param message   The handled message
 * @returns         An array of packed messages or null if not present
 */
export function getDIDCommForwardMessages(message: IMessage): RouteMessagesMetaData | null {
  const decodedMessage = message?.metaData?.find(v => v.type === DIDCOMM_ROUTING_V2_METADATA_TYPE)
  if (decodedMessage && decodedMessage.value) {
    const decoded = JSON.parse(decodedMessage.value)
    return decoded as RouteMessagesMetaData
  }
  return null
}
