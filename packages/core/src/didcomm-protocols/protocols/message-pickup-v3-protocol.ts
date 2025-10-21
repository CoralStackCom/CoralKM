import { IAgentContext, IDataStore } from '@veramo/core-types'
import type { IDIDComm, IDIDCommMessage } from '@veramo/did-comm'
import type { Message } from '@veramo/message-handler'
import Debug from 'debug'
import { v4 } from 'uuid'

import type {
  IDIDCommMessageType,
  IDIDCommProtocolHandler,
  IDIDCommProtocols,
  IProtocolMessageArgs,
} from '../didcomm-protocols-interface'
import {
  assertMessageFieldDefined,
  assertRole,
  throwUnsupportedMessageType,
} from '../didcomm-utils'

const debug = Debug('veramo:did-comm:message-pickup-protocol-handler')

type IContext = IAgentContext<IDataStore & IDIDCommProtocols & IDIDComm>

export type MessagePickupRoles = 'mediator' | 'recipient'

/**
 * Message Pickup V3 Protocol Message Types
 */
export enum MessagePickupV3MessageTypes {
  STATUS_REQUEST = 'https://didcomm.org/messagepickup/3.0/status-request',
  STATUS = 'https://didcomm.org/messagepickup/3.0/status',
  DELIVERY_REQUEST = 'https://didcomm.org/messagepickup/3.0/delivery-request',
  MESSAGE_DELIVERY = 'https://didcomm.org/messagepickup/3.0/delivery',
  MESSAGES_RECEIVED = 'https://didcomm.org/messagepickup/3.0/messages-received',
}

/**
 * Arguments to create a Status Request message
 */
export interface StatusRequestArgs {
  type: MessagePickupV3MessageTypes.STATUS_REQUEST
  from: string
  to: string
  recipient_did?: string
}

/**
 * Arguments to create a Status message
 */
export interface StatusArgs {
  type: MessagePickupV3MessageTypes.STATUS
  from: string
  to: string
  thid: string
  message_count: number
  recipient_did?: string
}

/**
 * Arguments to create a Delivery Request message
 */
export interface DeliveryRequestArgs {
  type: MessagePickupV3MessageTypes.DELIVERY_REQUEST
  from: string
  to: string
  limit: number
  recipient_did?: string
}

/**
 * Arguments to create a Message Delivery message
 */
export interface MessagesDeliveryArgs {
  type: MessagePickupV3MessageTypes.MESSAGE_DELIVERY
  from: string
  to: string
  thid: string
  messages: string[]
  recipient_did?: string
}

/**
 * Arguments to create a Messages Received message
 */
export interface MessagesReceivedArgs {
  type: MessagePickupV3MessageTypes.MESSAGES_RECEIVED
  from: string
  to: string
  thid: string
  message_id_list: string[]
  recipient_did?: string
}

/**
 * Add Message Types to the Protocol Message Registry
 */
declare module '../didcomm-protocols-interface' {
  interface ProtocolMessageRegistry {
    [MessagePickupV3MessageTypes.STATUS_REQUEST]: StatusRequestArgs
    [MessagePickupV3MessageTypes.STATUS]: StatusArgs
    [MessagePickupV3MessageTypes.DELIVERY_REQUEST]: DeliveryRequestArgs
    [MessagePickupV3MessageTypes.MESSAGE_DELIVERY]: MessagesDeliveryArgs
    [MessagePickupV3MessageTypes.MESSAGES_RECEIVED]: MessagesReceivedArgs
  }
}

/**
 * Implementation of the Message Pickup V3.0 Protocol Handler
 * Reference: https://didcomm.org/message-pickup/3.0
 */
export class DCMessagePickupProtocolV3 implements IDIDCommProtocolHandler {
  name = 'Message Pickup'
  version = '3.0'
  piuri = 'https://didcomm.org/messagepickup'
  description = 'A protocol to facilitate an agent picking up messages held at a mediator.'
  roles: MessagePickupRoles[]

  /**
   * Constructor for the Message Pickup Protocol Handler. You must specify the role
   * of the agent in the protocol when initializing.
   *
   * @param role The role of the agent in the Message Pickup protocol.
   */
  constructor(role: MessagePickupRoles) {
    this.roles = [role]
  }

  /** {@inheritdoc IDIDCommProtocolHandler.createMessage} */
  createMessage(args: IProtocolMessageArgs): IDIDCommMessage {
    switch (args.type) {
      case MessagePickupV3MessageTypes.STATUS_REQUEST:
        return {
          type: MessagePickupV3MessageTypes.STATUS_REQUEST,
          from: args.from,
          to: [args.to],
          id: v4(),
          body: {
            ...(args.recipient_did && { recipient_did: args.recipient_did }),
          },
          return_route: 'all',
        }
      case MessagePickupV3MessageTypes.STATUS:
        return {
          type: MessagePickupV3MessageTypes.STATUS,
          from: args.from,
          to: [args.to],
          id: `${args.thid}-response`,
          thid: args.thid,
          body: {
            message_count: args.message_count,
            ...(args.recipient_did && { recipient_did: args.recipient_did }),
          },
        }
      case MessagePickupV3MessageTypes.DELIVERY_REQUEST:
        return {
          type: MessagePickupV3MessageTypes.DELIVERY_REQUEST,
          from: args.from,
          to: [args.to],
          id: v4(),
          body: {
            limit: args.limit,
            ...(args.recipient_did && { recipient_did: args.recipient_did }),
          },
          return_route: 'all',
        }
      case MessagePickupV3MessageTypes.MESSAGE_DELIVERY:
        return {
          type: MessagePickupV3MessageTypes.MESSAGE_DELIVERY,
          from: args.from,
          to: [args.to],
          id: v4(),
          thid: args.thid,
          body: {
            ...(args.recipient_did && { recipient_did: args.recipient_did }),
          },
          attachments: args.messages.map(msg => ({
            id: msg,
            data: {
              json: JSON.parse(msg),
            },
          })),
        }
      case MessagePickupV3MessageTypes.MESSAGES_RECEIVED:
        return {
          type: MessagePickupV3MessageTypes.MESSAGES_RECEIVED,
          from: args.from,
          to: [args.to],
          id: v4(),
          thid: args.thid,
          body: {
            message_id_list: args.message_id_list,
          },
          return_route: 'all',
        }
      default:
        debug(`unsupported_message_type is not supported by Message Pickup v3.0:`, args)
        throw new Error('unsupported_message_type is not supported by Message Pickup v3.0')
    }
  }

  /** {@inheritdoc IDIDCommProtocolHandler.handle} */
  async handle(
    messageType: IDIDCommMessageType,
    message: Message,
    context: IContext
  ): Promise<IDIDCommMessage | null> {
    switch (messageType.type) {
      case 'status-request': {
        debug('Message Status Request Received')
        // Check Message and Role are Valid
        assertRole('mediator', this.roles, messageType)
        // TODO
        return null
      }
      case 'delivery-request': {
        debug('Message Delivery Request Received')
        // Check Message and Role are Valid
        assertRole('mediator', this.roles, messageType)
        // TODO
        return null
      }
      case 'status': {
        debug('Message Status Received')
        // Check Message and Role are Valid
        assertRole('recipient', this.roles, messageType)
        // TODO
        return null
      }
      case 'delivery': {
        debug('Message Delivery batch Received')
        // Check Message and Role are Valid
        assertRole('recipient', this.roles, messageType)
        const { attachments, to, from } = message
        assertMessageFieldDefined(to, 'to', messageType)
        assertMessageFieldDefined(from, 'from', messageType)
        assertMessageFieldDefined(attachments, 'attachments', messageType)

        // 1. Handle batch of messages
        const messageIds = (await Promise.all(
          attachments.map(async attachment => {
            await context.agent.handleMessage({
              raw: JSON.stringify(attachment.data.json),
              metaData: [{ type: 'didCommMsgFromMediator', value: attachment.id }],
            })
            return attachment.id
          })
        )) as string[]

        // 2. Reply with messages-received
        return this.createMessage({
          type: MessagePickupV3MessageTypes.MESSAGES_RECEIVED,
          from: to,
          to: from,
          thid: message.threadId ?? message.id,
          message_id_list: messageIds,
        })
      }
      default:
        debug(`Unknown ${this.piuri}/${this.version} message type: ${messageType.type}`, message)
        throwUnsupportedMessageType(messageType)
    }
  }
}
