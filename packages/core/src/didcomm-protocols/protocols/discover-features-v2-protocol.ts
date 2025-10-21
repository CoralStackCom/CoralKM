import { IAgentContext } from '@veramo/core-types'
import type { IDIDComm, IDIDCommMessage } from '@veramo/did-comm'
import type { Message } from '@veramo/message-handler'
import Debug from 'debug'
import { v4 } from 'uuid'

import { DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE } from '../dicomm-protocols-message-handler'
import type {
  IDIDCommMessageType,
  IDIDCommProtocolHandler,
  IDIDCommProtocols,
  IProtocolMessageArgs,
} from '../didcomm-protocols-interface'
import { assertMessageFieldDefined, throwUnsupportedMessageType } from '../didcomm-utils'

const debug = Debug('veramo:did-comm:discover-features-protocol-handler')

type IContext = IAgentContext<IDIDCommProtocols & IDIDComm>

/**
 * Feature query structure for Discovery protocol
 */
export interface DiscoveryFeatureQuery {
  /**
   * The type of feature to query:
   *
   * - 'protocol': Query for supported protocols by their Protocol Identifier URI (PIURI).
   * - 'goal-code': Query for supported goal codes (https://identity.foundation/didcomm-messaging/spec/#goal-codes).
   * - 'header': Query for supported message headers.
   */
  featureType: 'protocol' | 'goal-code' | 'header'
  /**
   * Filter on specific value to match for the given feature type. Use wilcards as needed.
   */
  match: string
}

/**
 * Feature disclosure structure for Discovery protocol
 */
export interface DiscoveryFeatureDisclosure {
  /**
   * The type of feature being disclosed:
   *
   * - 'protocol': Disclose supported protocols by their Protocol Identifier URI (PIURI).
   * - 'goal-code': Disclose supported goal codes (https://identity.foundation/didcomm-messaging/spec/#goal-codes).
   * - 'header': Disclose supported message headers.
   */
  featureType: 'protocol' | 'goal-code' | 'header'
  /**
   * The ID of the supported feature.
   * @example 'https://didcomm.org/discover-features/2.0'
   */
  id: string
  /**
   * Optional list of roles the agent supports for the given feature.
   */
  roles?: string[]
}

/**
 * Discover Features V2 Protocol Message Types
 */
export enum DiscoverFeaturesV2MessageTypes {
  QUERIES_REQUEST = 'https://didcomm.org/discover-features/2.0/queries',
  DISCLOSURE_RESPONSE = 'https://didcomm.org/discover-features/2.0/disclose',
}

/**
 * Arguments to create a Discover Features Query Request message
 */
export interface DiscoverFeaturesArgs {
  type: DiscoverFeaturesV2MessageTypes.QUERIES_REQUEST
  from: string
  to: string
  queries?: DiscoveryFeatureQuery[]
}

/**
 * Arguments to create a Discover Features Disclosure Response message
 */
export interface DiscoverFeaturesDisclosureResponseArgs {
  type: DiscoverFeaturesV2MessageTypes.DISCLOSURE_RESPONSE
  from: string
  to: string
  queryId: string
  disclosures: DiscoveryFeatureDisclosure[]
}

/**
 * Add Message Types to the Protocol Message Registry
 */
declare module '../didcomm-protocols-interface' {
  interface ProtocolMessageRegistry {
    [DiscoverFeaturesV2MessageTypes.QUERIES_REQUEST]: DiscoverFeaturesArgs
    [DiscoverFeaturesV2MessageTypes.DISCLOSURE_RESPONSE]: DiscoverFeaturesDisclosureResponseArgs
  }
}

/**
 * Implementation of the Discover Features V2.0 Protocol Handler
 * Reference: https://didcomm.org/discover-features/2.0
 */
export class DCDiscoveryProtocolV2 implements IDIDCommProtocolHandler {
  name = 'Feature Discovery'
  version = '2.0'
  piuri = 'https://didcomm.org/discover-features'
  description =
    'Enables the sender and recipient to engage in an exchange of feature discovery messages.'

  /** {@inheritdoc IDIDCommProtocolHandler.createMessage} */
  createMessage(args: IProtocolMessageArgs): IDIDCommMessage {
    switch (args.type) {
      case DiscoverFeaturesV2MessageTypes.QUERIES_REQUEST:
        return {
          type: DiscoverFeaturesV2MessageTypes.QUERIES_REQUEST,
          from: args.from,
          to: [args.to],
          id: v4(),
          body: {
            queries: args.queries || [{ featureType: 'protocol', match: '*' }],
          },
        }
      case DiscoverFeaturesV2MessageTypes.DISCLOSURE_RESPONSE:
        return {
          type: DiscoverFeaturesV2MessageTypes.DISCLOSURE_RESPONSE,
          from: args.from,
          to: [args.to],
          id: `${args.queryId}-response`,
          thid: args.queryId,
          body: {
            disclosures: args.disclosures,
          },
        }
      default:
        debug(`unsupported_message_type is not supported by Discover Features v2.0:`, args)
        throw new Error('unsupported_message_type is not supported by Discover Features v2.0')
    }
  }

  /** {@inheritdoc IDIDCommProtocolHandler.handle} */
  async handle(
    messageType: IDIDCommMessageType,
    message: Message,
    context: IContext
  ): Promise<IDIDCommMessage | null> {
    switch (messageType.type) {
      case 'queries':
        debug('Handling Discover Features Queries message:', message)
        const { from, to, id } = message
        assertMessageFieldDefined(from, 'from', messageType)
        assertMessageFieldDefined(to, 'to', messageType)

        // Create disclosures based on registered protocols
        const protocols = await context.agent.listDIDCommProtocols()
        const disclosures: DiscoveryFeatureDisclosure[] = protocols.map(p => {
          const disclouser: DiscoveryFeatureDisclosure = {
            featureType: 'protocol',
            id: p.piuri + '/' + p.version,
          }
          if (p.roles) {
            disclouser.roles = p.roles
          }
          return disclouser
        })
        // Return disclosure response message
        return this.createMessage({
          type: DiscoverFeaturesV2MessageTypes.DISCLOSURE_RESPONSE,
          from: to!,
          to: from!,
          queryId: id,
          disclosures,
        })
      case 'disclose':
        debug('Handling Discover Features Disclosure message:', message)
        // Add decoded Disclosure metadata to the message
        message.addMetaData({
          type: DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
          value: JSON.stringify(message.data.disclosures),
        })
        return null
      default:
        debug('Unknown Discover Features message type:', messageType.type, message)
        throwUnsupportedMessageType(messageType)
    }
  }
}
