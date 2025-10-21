import { IAgentContext, IDIDManager } from '@veramo/core-types'
import type { IDIDComm, IDIDCommMessage } from '@veramo/did-comm'
import { RecipientDid, RequesterDid } from '@veramo/mediation-manager'
import type { Message } from '@veramo/message-handler'
import Debug from 'debug'
import { v4 } from 'uuid'

import { DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE } from '../../dicomm-protocols-message-handler'
import type {
  IDIDCommMessageType,
  IDIDCommProtocolHandler,
  IDIDCommProtocols,
  IProtocolMessageArgs,
} from '../../didcomm-protocols-interface'
import {
  assertMessageFieldDefined,
  assertRole,
  throwUnsupportedMessageType,
} from '../../didcomm-utils'
import { IMediationStore, PreMediationRequestPolicy } from './types'

const debug = Debug('veramo:did-comm:coordinate-mediation-protocol-handler')

type IContext = IAgentContext<IDIDManager & IDIDCommProtocols & IDIDComm>

export const DIDCOMM_MEDIATION_NEW_ROUTING_DID_METADATA_TYPE = 'NewRoutingDID'

/**
 * Roles supported in the Coordinate Mediation V3 Protocol
 */
export type MediatorRoles = 'mediator' | 'recipient'

/**
 * Function type to determine if mediation requests are allowed
 *
 * @param requesterDid The DID of the requester
 * @returns            A promise that resolves to true if the request is allowed, false otherwise
 */
export type IsMediationAllowedFunction = (
  requesterDid: string
) => Promise<PreMediationRequestPolicy>

/**
 * Coordinate Mediation V3 Protocol Message Types
 */
export enum CoordinateMediationV3MessageTypes {
  MEDIATE_REQUEST = 'https://didcomm.org/coordinate-mediation/3.0/mediate-request',
  MEDIATE_GRANT = 'https://didcomm.org/coordinate-mediation/3.0/mediate-grant',
  MEDIATE_DENY = 'https://didcomm.org/coordinate-mediation/3.0/mediate-deny',
  RECIPIENT_UPDATE = 'https://didcomm.org/coordinate-mediation/3.0/recipient-update',
  RECIPIENT_UPDATE_RESPONSE = 'https://didcomm.org/coordinate-mediation/3.0/recipient-update-response',
  RECIPIENT_QUERY = 'https://didcomm.org/coordinate-mediation/3.0/recipient-query',
  RECIPIENT_QUERY_RESPONSE = 'https://didcomm.org/coordinate-mediation/3.0/recipient',
}

/**
 * Represents the actions (add or remove) that can be taken on a recipient did
 */
export enum UpdateAction {
  ADD = 'add',
  REMOVE = 'remove',
}

/**
 * Represents the result of an update action
 */
export enum RecipientUpdateResult {
  SUCCESS = 'success',
  NO_CHANGE = 'no_change',
  CLIENT_ERROR = 'client_error',
  SERVER_ERROR = 'server_error',
}

/**
 * Represents the structure of a specific update on RECIPIENT_UPDATE
 */
export interface Update {
  recipient_did: RecipientDid
  action: UpdateAction
}

/**
 * Represents an update response on RECIPIENT_UPDATE_RESPONSE
 */
export interface UpdateResult extends Update {
  result: RecipientUpdateResult
}

/**
 * Arguments for creating a Mediate Request message
 */
export interface MediateRequestArgs {
  type: CoordinateMediationV3MessageTypes.MEDIATE_REQUEST
  from: string
  to: string
}

/**
 * Arguments for creating a Mediate Deny Response message
 */
export interface MediateDenyArgs {
  type: CoordinateMediationV3MessageTypes.MEDIATE_DENY
  from: string
  to: string
  thid: string
}

/**
 * Arguments for creating a Mediate Grant Response message
 */
export interface MediateGrantArgs {
  type: CoordinateMediationV3MessageTypes.MEDIATE_GRANT
  from: string
  to: string
  thid: string
  routing_did: string[]
}

/**
 * Arguments for creating a Recipient Update Request message
 */
export interface RecipientUpdateArgs {
  type: CoordinateMediationV3MessageTypes.RECIPIENT_UPDATE
  from: string
  to: string
  updates: Update[]
}

/**
 * Arguments for creating a Recipient Update Response message
 */
export interface RecipientUpdateResponseArgs {
  type: CoordinateMediationV3MessageTypes.RECIPIENT_UPDATE_RESPONSE
  from: string
  to: string
  thid: string
  updates: UpdateResult[]
}

/**
 * Arguments for creating a Recipient Query message
 */
export interface RecipientQueryArgs {
  type: CoordinateMediationV3MessageTypes.RECIPIENT_QUERY
  from: string
  to: string
  paginate?: {
    limit: number
    offset: number
  }
}

/**
 * Arguments for creating a Recipient Query Response message
 */
export interface RecipientQueryResponseArgs {
  type: CoordinateMediationV3MessageTypes.RECIPIENT_QUERY_RESPONSE
  from: string
  to: string
  thid: string
  dids: Record<'recipient_did', RecipientDid>[]
}

/**
 * Add Message Types to the Protocol Message Registry
 */
declare module '../../didcomm-protocols-interface' {
  interface ProtocolMessageRegistry {
    [CoordinateMediationV3MessageTypes.MEDIATE_REQUEST]: MediateRequestArgs
    [CoordinateMediationV3MessageTypes.MEDIATE_GRANT]: MediateGrantArgs
    [CoordinateMediationV3MessageTypes.MEDIATE_DENY]: MediateDenyArgs
    [CoordinateMediationV3MessageTypes.RECIPIENT_UPDATE]: RecipientUpdateArgs
    [CoordinateMediationV3MessageTypes.RECIPIENT_UPDATE_RESPONSE]: RecipientUpdateResponseArgs
    [CoordinateMediationV3MessageTypes.RECIPIENT_QUERY]: RecipientQueryArgs
    [CoordinateMediationV3MessageTypes.RECIPIENT_QUERY_RESPONSE]: RecipientQueryResponseArgs
  }
}

/**
 * Constructor argument types for the Coordinate Mediation V3 Protocol Handler
 */

interface ConstructorMediatorArgs {
  store: IMediationStore
  role: 'mediator'
  isAllowed?: IsMediationAllowedFunction
}
interface ConstructorRecipientArgs {
  role: 'recipient'
}
export type DCMediationProtocolV3ConstructorArgs =
  | ConstructorMediatorArgs
  | ConstructorRecipientArgs

/**
 * Implementation of the DIDComm Mediator V3.0 Protocol Handler
 * Reference: https://didcomm.org/coordinate-mediation/3.0
 *
 * This protocol enables an agent to coordinate mediation services with a mediator or act
 * as a mediator itself. It supports the roles 'mediator' and 'recipient'.
 */
export class DCMediationProtocolV3 implements IDIDCommProtocolHandler {
  name = 'CoordinateMediation'
  version = '3.0'
  piuri = 'https://didcomm.org/coordinate-mediation'
  description = 'DIDComm Mediator Protocol for coordinating mediation services.'
  roles: MediatorRoles[]

  private mediationStore!: IMediationStore
  private isAllowed?: IsMediationAllowedFunction

  /**
   * Constructor for the Coordinate Mediation Protocol Handler. You must specify the role
   * of the agent in the protocol when initializing.
   *
   * @param mediationStore The mediation store instance.
   * @param role            The role of the agent in the Coordinate Mediation protocol.
   * @param isAllowed       Optional function to determine if mediation requests are granted or denied. If not provided,
   *                        the default behavior is to allow all requests.
   */
  constructor(args: DCMediationProtocolV3ConstructorArgs) {
    if (args.role === 'mediator') {
      this.roles = ['mediator']
      this.mediationStore = args.store
      if (args.isAllowed) {
        this.isAllowed = args.isAllowed
      }
    } else {
      this.roles = ['recipient']
    }
  }

  /** {@inheritdoc IDIDCommProtocolHandler.createMessage} */
  createMessage(args: IProtocolMessageArgs): IDIDCommMessage {
    switch (args.type) {
      case CoordinateMediationV3MessageTypes.MEDIATE_REQUEST:
        return {
          type: CoordinateMediationV3MessageTypes.MEDIATE_REQUEST,
          from: args.from,
          to: [args.to],
          id: v4(),
          body: {},
        }
      case CoordinateMediationV3MessageTypes.MEDIATE_GRANT:
        return {
          type: CoordinateMediationV3MessageTypes.MEDIATE_GRANT,
          from: args.from,
          to: [args.to],
          id: `${args.thid}-response`,
          thid: args.thid,
          body: {
            routing_did: args.routing_did,
          },
        }
      case CoordinateMediationV3MessageTypes.MEDIATE_DENY:
        return {
          type: CoordinateMediationV3MessageTypes.MEDIATE_DENY,
          from: args.from,
          to: [args.to],
          id: `${args.thid}-response`,
          thid: args.thid,
          body: {},
        }
      case CoordinateMediationV3MessageTypes.RECIPIENT_UPDATE:
        return {
          type: CoordinateMediationV3MessageTypes.RECIPIENT_UPDATE,
          from: args.from,
          to: [args.to],
          id: v4(),
          body: {
            updates: args.updates,
          },
          return_route: 'all',
        }
      case CoordinateMediationV3MessageTypes.RECIPIENT_UPDATE_RESPONSE:
        return {
          type: CoordinateMediationV3MessageTypes.RECIPIENT_UPDATE_RESPONSE,
          from: args.from,
          to: [args.to],
          id: v4(),
          thid: args.thid,
          body: { updated: args.updates },
        }
      case CoordinateMediationV3MessageTypes.RECIPIENT_QUERY:
        return {
          type: CoordinateMediationV3MessageTypes.RECIPIENT_QUERY,
          from: args.from,
          to: [args.to],
          id: v4(),
          body: {},
        }
      case CoordinateMediationV3MessageTypes.RECIPIENT_QUERY_RESPONSE:
        return {
          type: CoordinateMediationV3MessageTypes.RECIPIENT_QUERY_RESPONSE,
          from: args.from,
          to: [args.to],
          id: v4(),
          thid: args.thid,
          body: {
            dids: args.dids,
          },
        }
      default:
        debug(`unsupported_message_type is not supported by Coordinate Mediation v3.0:`, args)
        throw new Error('unsupported_message_type is not supported by Coordinate Mediation v3.0')
    }
  }

  /** {@inheritdoc IDIDCommProtocolHandler.handle} */
  async handle(
    messageType: IDIDCommMessageType,
    message: Message,
    context: IContext
  ): Promise<IDIDCommMessage | null> {
    switch (messageType.type) {
      case 'mediate-request': {
        debug('MediateRequest Message Received')
        // Check Message and Role are Valid
        assertRole('mediator', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)

        // Respond with Grant or Deny based on Mediation Policy
        const status = this.isAllowed ? await this.isAllowed(message.from) : 'ALLOW'
        if (status === 'ALLOW') {
          await this.mediationStore.setMediationPolicy(message.from as string, 'GRANTED')
          // TODO generate a routing DID for the requester
          return this.createMessage({
            type: CoordinateMediationV3MessageTypes.MEDIATE_GRANT,
            from: message.to,
            to: message.from,
            thid: message.id,
            routing_did: [message.to],
          })
        } else {
          await this.mediationStore.setMediationPolicy(message.from as string, 'DENIED')
          return this.createMessage({
            type: CoordinateMediationV3MessageTypes.MEDIATE_DENY,
            from: message.to,
            to: message.from,
            thid: message.id,
          })
        }
      }
      case 'recipient-update': {
        debug('RecipientUpdate Message Received')
        // Check Message and Role are Valid
        assertRole('mediator', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        assertMessageFieldDefined(message.data, 'data', messageType)
        assertMessageFieldDefined(message.data.updates, 'data.updates', messageType)

        // Process each update action and collect results
        const updates: Update[] = message.data.updates
        const applyUpdate = async (requesterDid: RequesterDid, update: Update) => {
          const { recipient_did: recipientDid } = update
          try {
            if (update.action === UpdateAction.ADD) {
              const result = await this.mediationStore.addMediation(recipientDid, requesterDid)
              if (result) return { ...update, result: RecipientUpdateResult.SUCCESS }
              return { ...update, result: RecipientUpdateResult.NO_CHANGE }
            } else if (update.action === UpdateAction.REMOVE) {
              const result = await this.mediationStore.removeMediation(recipientDid)
              if (result) return { ...update, result: RecipientUpdateResult.SUCCESS }
              return { ...update, result: RecipientUpdateResult.NO_CHANGE }
            }
            return { ...update, result: RecipientUpdateResult.CLIENT_ERROR }
          } catch (ex) {
            debug(ex)
            return { ...update, result: RecipientUpdateResult.SERVER_ERROR }
          }
        }
        const updated = await Promise.all(
          updates.map(async u => await applyUpdate(message.from as string, u))
        )
        return this.createMessage({
          type: CoordinateMediationV3MessageTypes.RECIPIENT_UPDATE_RESPONSE,
          to: message.from,
          from: message.to,
          thid: message.id,
          updates: updated,
        })
      }
      case 'recipient-query': {
        debug('RecipientQuery Message Received')
        // Check Message and Role are Valid
        assertRole('mediator', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)

        // Retrieve and return the list of recipient DIDs associated with the requester DID
        // TODO implement pagination
        const policy = await this.mediationStore.getMediationPolicy(message.from as string)
        return this.createMessage({
          type: CoordinateMediationV3MessageTypes.RECIPIENT_QUERY_RESPONSE,
          from: message.to,
          to: message.from,
          thid: message.id,
          dids: policy?.recipientDids?.map(did => ({ recipient_did: did })) || [],
        })
      }
      case 'mediate-grant': {
        debug('MediateGrant Message Received')
        // Check Message and Role are Valid
        assertRole('recipient', this.roles, messageType)
        const { from, to, data, threadId } = message
        assertMessageFieldDefined(from, 'from', messageType)
        assertMessageFieldDefined(to, 'to', messageType)
        assertMessageFieldDefined(threadId, 'thid', messageType)
        assertMessageFieldDefined(data.routing_did, 'data.routing_did', messageType)

        // If mediate request was previously sent, add service to DID document
        const service = {
          id: 'didcomm-mediator',
          type: 'DIDCommMessaging',
          serviceEndpoint: [
            {
              uri: data.routing_did[0],
            },
          ],
        }
        // If peer DID we need to re-create the DID with the new service
        // And update the mediator to add it to their routing list
        if (to.startsWith('did:peer:')) {
          const updatedDid = await context.agent.didManagerCreate({
            provider: 'did:peer',
            options: { num_algo: 2, service: service },
          })
          debug('Updated Peer DID with Mediation Service', updatedDid)
          // Add new DID Document to message metadata so it can be used by the client
          message.addMetaData({
            type: DIDCOMM_MEDIATION_NEW_ROUTING_DID_METADATA_TYPE,
            value: updatedDid.did,
          })
          // Notify mediator of new DID to add to their routing list
          return this.createMessage({
            type: CoordinateMediationV3MessageTypes.RECIPIENT_UPDATE,
            from: to,
            to: from,
            updates: [
              {
                recipient_did: updatedDid.did,
                action: UpdateAction.ADD,
              },
            ],
          })
        } else {
          // For other DIDs just add the service
          await context.agent.didManagerAddService({
            did: to,
            service: service,
          })
        }

        return null
      }
      case 'mediate-deny': {
        debug('MediateDeny Message Received')
        // Check Message and Role are Valid
        assertRole('recipient', this.roles, messageType)
        const { from, to } = message
        assertMessageFieldDefined(from, 'from', messageType)
        assertMessageFieldDefined(to, 'to', messageType)

        // Delete service if it exists
        const did = await context.agent.didManagerGet({
          did: to,
        })
        const existingService = did.services.find(
          s =>
            s.serviceEndpoint === from ||
            (Array.isArray(s.serviceEndpoint) && s.serviceEndpoint.includes(from))
        )
        if (existingService) {
          await context.agent.didManagerRemoveService({ did: to, id: existingService.id })
        }
        return null
      }
      case 'recipient-update-response': {
        debug('RecipientUpdateResponse Message Received')
        // Check Message and Role are Valid
        assertRole('recipient', this.roles, messageType)
        // Decode response and return null
        message.addMetaData({
          type: DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
          value: JSON.stringify(message.data.updated),
        })
        return null
      }
      case 'recipient': {
        debug('Recipient Message Received')
        // Check Message and Role are Valid
        assertRole('recipient', this.roles, messageType)
        // Decode response and return null
        message.addMetaData({
          type: DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
          value: JSON.stringify(message.data.dids),
        })
        return null
      }
      default:
        debug(`Unknown ${this.piuri}/${this.version} message type: ${messageType.type}`, message)
        throwUnsupportedMessageType(messageType)
    }
  }
}
