import { IAgentContext } from '@veramo/core-types'
import type { IDIDComm, IDIDCommMessage } from '@veramo/did-comm'
import { DIDCommMessageMediaType } from '@veramo/did-comm'
import type { Message } from '@veramo/message-handler'
import Debug from 'debug'
import { v4 } from 'uuid'

import type {
  IDIDCommMessageType,
  IDIDCommProtocolHandler,
  IDIDCommProtocols,
  IProtocolMessageArgs,
} from '../didcomm-protocols-interface'
import { DIDCommProtocolError } from '../didcomm-protocols-interface'
import { assertMessageFieldDefined, throwUnsupportedMessageType } from '../didcomm-utils'
import type { IMediationStore } from './coordinate-mediation-v3'

const debug = Debug('veramo:did-comm:routing-v2-protocol-handler')

/**
 * Metadata type used to forward messages to be routed by an agent
 */
export const DIDCOMM_ROUTING_V2_METADATA_TYPE = 'ForwardRouteMessages'

/**
 * Metadata value type used to forward messages to be routed by an agent
 */
export type RouteMessagesMetaData = {
  /**
   * An array of packed DIDComm messages to be routed
   */
  messages: string[]
  /**
   * The recipient DID that the messages should be routed to
   */
  requester_did: string
}

type IContext = IAgentContext<IDIDCommProtocols & IDIDComm>

/**
 * Routing V2 Protocol Message Types
 */
export enum RoutingV2MessageTypes {
  FORWARD = 'https://didcomm.org/routing/2.0/forward',
}

/**
 * Arguments to create a Forward message
 */
export interface ForwardArgs {
  type: RoutingV2MessageTypes.FORWARD
  from: string
  to: string
  next: string
  packedMessages: string[]
}

/**
 * Add Message Types to the Protocol Message Registry
 */
declare module '../didcomm-protocols-interface' {
  interface ProtocolMessageRegistry {
    [RoutingV2MessageTypes.FORWARD]: ForwardArgs
  }
}

/**
 * Implementation of the Routing V2.0 Protocol Handler
 * Reference: https://didcomm.org/routing/2.0
 */
export class DCRoutingProtocolV2 implements IDIDCommProtocolHandler {
  name = 'Routing'
  version = '2.0'
  piuri = 'https://didcomm.org/routing'
  description = 'Enables the sender and recipient to engage in an exchange of trust pings.'

  // Mediation store instance
  private mediationStore?: IMediationStore

  /**
   * Constructor to create a new DCRoutingProtocolV2 instance. If a mediation store is provided,
   * it will be used to look up mediation relationships when handling messages for routing.
   *
   * @param mediationStore The mediation store instance to use for looking up mediation relationships.
   */
  constructor(mediationStore?: IMediationStore) {
    if (mediationStore) {
      this.mediationStore = mediationStore
    }
  }

  /** {@inheritdoc IDIDCommProtocolHandler.createMessage} */
  createMessage(args: IProtocolMessageArgs): IDIDCommMessage {
    switch (args.type) {
      case RoutingV2MessageTypes.FORWARD:
        return {
          type: RoutingV2MessageTypes.FORWARD,
          from: args.from,
          to: [args.to],
          id: v4(),
          body: {
            next: args.next,
          },
          attachments: args.packedMessages.map(m => ({
            id: v4(),
            mime_type: DIDCommMessageMediaType.ENCRYPTED,
            data: {
              json: JSON.parse(m),
            },
          })),
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
      case 'forward':
        debug('Handling Forward message:', message)
        assertMessageFieldDefined(message.data.next, 'body.next', messageType)
        assertMessageFieldDefined(message.attachments, 'attachments', messageType)

        // If there's a mediation store, look up the mediation relationship
        if (this.mediationStore) {
          const mediationPolicy = await this.mediationStore.getMediation(message.data.next)
          if (!mediationPolicy || mediationPolicy.status !== 'GRANTED') {
            throw new DIDCommProtocolError(
              `No mediation policy found for DID: {1}`,
              'e.no_mediation_policy',
              messageType,
              [`${message.data.next}`]
            )
          }

          const messages: string[] =
            message.attachments
              ?.map(att => {
                if (att.data.json) {
                  return JSON.stringify(att.data.json)
                }
                return undefined
              })
              .filter((m): m is string => !!m) || []

          debug('Mediation policy found for DID:', message.data.next, `${messages.length} messages`)
          message.addMetaData({
            type: DIDCOMM_ROUTING_V2_METADATA_TYPE,
            value: JSON.stringify({
              messages,
              requester_did: mediationPolicy.requesterDid,
            } as RouteMessagesMetaData),
          })
        }

        // No response needed for Forward messages
        return null
      default:
        debug('Unknown Routing message type:', messageType.type, message)
        throwUnsupportedMessageType(messageType)
    }
  }
}
