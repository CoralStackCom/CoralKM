import { IAgentContext } from '@veramo/core-types'
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
import { assertMessageFieldDefined, throwUnsupportedMessageType } from '../didcomm-utils'

const debug = Debug('veramo:did-comm:trust-ping-protocol-handler')

type IContext = IAgentContext<IDIDCommProtocols & IDIDComm>

/**
 * Trust Ping V2 Protocol Message Types
 */
export enum TrustPingV2MessageTypes {
  PING = 'https://didcomm.org/trust-ping/2.0/ping',
  PING_RESPONSE = 'https://didcomm.org/trust-ping/2.0/ping-response',
}

/**
 * Arguments to create a Trust Ping Request message
 */
export interface TrustPingArgs {
  type: TrustPingV2MessageTypes.PING
  from: string
  to: string
  responseRequested?: boolean
}

/**
 * Arguments to create a Trust Ping Request Response message
 */
export interface TrustPingResponseArgs {
  type: TrustPingV2MessageTypes.PING_RESPONSE
  from: string
  to: string
  thid: string
}

/**
 * Add Message Types to the Protocol Message Registry
 */
declare module '../didcomm-protocols-interface' {
  interface ProtocolMessageRegistry {
    [TrustPingV2MessageTypes.PING]: TrustPingArgs
    [TrustPingV2MessageTypes.PING_RESPONSE]: TrustPingResponseArgs
  }
}

/**
 * Implementation of the Trust Ping V2.0 Protocol Handler
 * Reference: https://didcomm.org/trust-ping/2.0
 */
export class DCTrustPingProtocolV2 implements IDIDCommProtocolHandler {
  name = 'Trust Ping'
  version = '2.0'
  piuri = 'https://didcomm.org/trust-ping'
  description = 'Enables the sender and recipient to engage in an exchange of trust pings.'

  /** {@inheritdoc IDIDCommProtocolHandler.createMessage} */
  createMessage(args: IProtocolMessageArgs): IDIDCommMessage {
    switch (args.type) {
      case TrustPingV2MessageTypes.PING:
        return {
          type: TrustPingV2MessageTypes.PING,
          from: args.from,
          to: [args.to],
          id: v4(),
          body: {
            responseRequested: true,
          },
        }
      case TrustPingV2MessageTypes.PING_RESPONSE:
        return {
          type: TrustPingV2MessageTypes.PING_RESPONSE,
          from: args.from,
          to: [args.to],
          id: `${args.thid}-response`,
          thid: args.thid,
          body: {},
        }
      default:
        debug(`unsupported_message_type is not supported by Trust Ping v2.0:`, args)
        throw new Error('unsupported_message_type is not supported by Trust Ping v2.0')
    }
  }

  /** {@inheritdoc IDIDCommProtocolHandler.handle} */
  async handle(
    messageType: IDIDCommMessageType,
    message: Message,
    _context: IContext
  ): Promise<IDIDCommMessage | null> {
    switch (messageType.type) {
      case 'ping':
        debug('Handling Trust Ping message:', message)
        const { from, to, id } = message
        assertMessageFieldDefined(from, 'from', messageType)
        assertMessageFieldDefined(to, 'to', messageType)
        return this.createMessage({
          type: TrustPingV2MessageTypes.PING_RESPONSE,
          from: to,
          to: from,
          thid: id,
        })
      case 'ping-response':
        debug('Handling Trust Ping response message:', message)
        message.addMetaData({ type: 'TrustPingResponseReceived', value: 'true' })
        return null
      default:
        debug('Unknown Trust Ping message type:', messageType.type, message)
        throwUnsupportedMessageType(messageType)
    }
  }
}
