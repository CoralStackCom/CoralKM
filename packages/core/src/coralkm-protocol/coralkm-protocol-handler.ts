import { IAgentContext, IDIDManager } from '@veramo/core-types'
import type { IDIDComm, IDIDCommMessage } from '@veramo/did-comm'
import type { Message } from '@veramo/message-handler'
import { v4 } from 'uuid'

import type {
  IDIDCommMessageType,
  IDIDCommProtocolHandler,
  IDIDCommProtocols,
  IProtocolMessageArgs,
} from '../didcomm-protocols'
import {
  assertMessageFieldDefined,
  assertRole,
  DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
  DIDCommProtocolError,
  throwUnsupportedMessageType,
} from '../didcomm-protocols'
import { CORALKM_PROTOCOL_URI, CORALKM_PROTOCOL_VERSION } from './coralkm-constants'
import type { ICoralKMGuardianStore, ICoralKMNamespaceStore } from './stores'
import type { CoralKMOptions, CoralKMRoles, PreRequestPolicy } from './types'
import { CoralKMV01MessageTypes } from './types'

type IContext = IAgentContext<IDIDManager & IDIDCommProtocols & IDIDComm>

/**
 * Implementation of the CoralKM V0.1 Protocol Handler
 * Reference: https://coralstack.com/coralkm/0.1
 */
export class DCCoralKMProtocolV01 implements IDIDCommProtocolHandler {
  name = 'CoralKM'
  version = CORALKM_PROTOCOL_VERSION
  piuri = CORALKM_PROTOCOL_URI
  description = 'User Friendly Decentralised Key Management Protocol.'
  roles: CoralKMRoles[]

  // Stores for namespace and guardian data
  private namespaceStore?: ICoralKMNamespaceStore
  private guardianStore?: ICoralKMGuardianStore

  // Hold reference to guardian DID if in guardian role
  // so we can use it later during recovery
  // TODO: HACK for demo purposes only, proper implementation needed
  private _guardian_did?: string

  /**
   * Constructor for the CoralKM Protocol Handler. You must specify the role(s)
   * of the agent in the protocol when initializing.
   *
   * @param roles The role(s) of the agent in the CoralKM protocol.
   */
  constructor(options: CoralKMOptions) {
    this.roles = options.roles
    if (this.roles.includes('gateway') && !options.namespaceStore) {
      throw new Error(
        "CoralKM Protocol 'gateway' role requires a 'namespaceStore' implementation in constructor options."
      )
    }
    if (options.namespaceStore) {
      this.namespaceStore = options.namespaceStore
    }
    if (this.roles.includes('guardian') && !options.guardianStore) {
      throw new Error(
        "CoralKM Protocol 'guardian' role requires a 'guardianStore' implementation in constructor options."
      )
    }
    if (options.guardianStore) {
      this.guardianStore = options.guardianStore
    }
  }

  /** {@inheritdoc IDIDCommProtocolHandler.createMessage} */
  createMessage(args: IProtocolMessageArgs): IDIDCommMessage {
    switch (args.type) {
      case CoralKMV01MessageTypes.NAMESPACE_REQUEST:
        return {
          id: v4(),
          type: CoralKMV01MessageTypes.NAMESPACE_REQUEST,
          from: args.from,
          to: [args.to],
        }
      case CoralKMV01MessageTypes.NAMESPACE_GRANT:
        return {
          id: v4(),
          type: CoralKMV01MessageTypes.NAMESPACE_GRANT,
          from: args.from,
          to: [args.to],
          thid: args.thid,
          body: {
            namespace: args.namespace,
          },
        }
      case CoralKMV01MessageTypes.NAMESPACE_DENY: {
        const msg = {
          id: v4(),
          type: CoralKMV01MessageTypes.NAMESPACE_DENY,
          from: args.from,
          to: [args.to],
          thid: args.thid,
        } as IDIDCommMessage
        if (args.reason) {
          msg.body = { reason: args.reason }
        }
        return msg
      }
      case CoralKMV01MessageTypes.NAMESPACE_SYNC: {
        if ('request' in args && args.request === 'GET') {
          const msg: IDIDCommMessage = {
            id: v4(),
            type: CoralKMV01MessageTypes.NAMESPACE_SYNC,
            from: args.from,
            to: [args.to],
            body: {
              request: 'GET',
            },
          }
          if ('recovery_id' in args && args.recovery_id) {
            msg.body.recovery_id = args.recovery_id
          }
          return msg
        }
        return {
          id: v4(),
          type: CoralKMV01MessageTypes.NAMESPACE_SYNC,
          from: args.from,
          to: [args.to],
          body: {
            request: 'PUT',
            data: args.data,
          },
        }
      }
      case CoralKMV01MessageTypes.NAMESPACE_SYNC_RESPONSE: {
        const msg: IDIDCommMessage = {
          id: v4(),
          type: args.type,
          from: args.from,
          to: [args.to],
          thid: args.thid,
          body: {
            request: args.request,
          },
        }
        if ('hash' in args) {
          msg.body.hash = args.hash
        }
        if ('data' in args) {
          msg.body.data = args.data
        }
        return msg
      }
      case CoralKMV01MessageTypes.NAMESPACE_RECOVERY_REQUEST: {
        const expires_at = args.expires_at ?? new Date(Date.now() + 24 * 60 * 60 * 1000)
        return {
          id: args.request_id ?? v4(),
          type: CoralKMV01MessageTypes.NAMESPACE_RECOVERY_REQUEST,
          from: args.from,
          to: [args.to],
          body: {
            device_did: args.device_did,
            namespace: args.namespace,
            expires_at: expires_at.toISOString(),
          },
        }
      }
      case CoralKMV01MessageTypes.GUARDIAN_REQUEST:
        return {
          id: v4(),
          type: CoralKMV01MessageTypes.GUARDIAN_REQUEST,
          from: args.from,
          to: [args.to],
        }
      case CoralKMV01MessageTypes.GUARDIAN_GRANT:
        return {
          id: v4(),
          type: CoralKMV01MessageTypes.GUARDIAN_GRANT,
          from: args.from,
          to: [args.to],
          thid: args.thid,
        }
      case CoralKMV01MessageTypes.GUARDIAN_DENY: {
        const msg: IDIDCommMessage = {
          id: v4(),
          type: CoralKMV01MessageTypes.GUARDIAN_DENY,
          from: args.from,
          to: [args.to],
          thid: args.thid,
        }
        if (args.reason) {
          msg.body = { reason: args.reason }
        }
        return msg
      }
      case CoralKMV01MessageTypes.GUARDIAN_REMOVE:
        return {
          id: v4(),
          type: CoralKMV01MessageTypes.GUARDIAN_REMOVE,
          from: args.from,
          to: [args.to],
        }
      case CoralKMV01MessageTypes.GUARDIAN_REMOVE_CONFIRM:
        return {
          id: v4(),
          type: args.type,
          from: args.from,
          to: [args.to],
          thid: args.thid,
        }
      case CoralKMV01MessageTypes.GUARDIAN_SHARE_UPDATE:
        return {
          id: v4(),
          type: args.type,
          from: args.from,
          to: [args.to],
          body: {
            namespace: args.namespace,
            threshold: args.threshold,
            share: args.share,
            delay: args.delay ?? 0,
          },
        }
      case CoralKMV01MessageTypes.GUARDIAN_SHARE_UPDATE_CONFIRM:
        return {
          id: v4(),
          type: args.type,
          from: args.from,
          to: [args.to],
          thid: args.thid,
        }
      case CoralKMV01MessageTypes.GUARDIAN_VERIFICATION_CHALLENGE:
        return {
          id: v4(),
          type: args.type,
          from: args.from,
          to: [args.to],
          pthid: args.pthid,
          body: {
            challenge: args.challenge,
            // Added as bug in Veramo DIDComm message handler ignoring pthid in header
            pthid: args.pthid,
          },
        }
      case CoralKMV01MessageTypes.GUARDIAN_VERIFICATION_CHALLENGE_RESPONSE:
        return {
          id: v4(),
          type: args.type,
          from: args.from,
          to: [args.to],
          pthid: args.pthid,
          thid: args.thid,
          body: {
            challenge_id: args.challenge_id,
            response: args.response,
            // Added as bug in Veramo DIDComm message handler ignoring pthid in header
            pthid: args.pthid,
          },
        }
      case CoralKMV01MessageTypes.GUARDIAN_RELEASE_SHARE:
        return {
          id: v4(),
          type: args.type,
          from: args.from,
          pthid: args.pthid,
          to: [args.to],
          body: {
            share: args.share,
            threshold: args.threshold,
            // Added as bug in Veramo DIDComm message handler ignoring pthid in header
            pthid: args.pthid,
          },
        }
      default:
        throw new Error(`Unsupported ${this.name} V${this.version} message type: ${args.type}`)
    }
  }

  /** {@inheritdoc IDIDCommProtocolHandler.handle} */
  async handle(
    messageType: IDIDCommMessageType,
    message: Message,
    _context: IContext
  ): Promise<IDIDCommMessage | null> {
    switch (messageType.type) {
      case 'namespace-request': {
        // Check Message and Role are Valid
        assertRole('gateway', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)

        if (!this.namespaceStore) {
          throw new DIDCommProtocolError(
            'Gateway role requires a NamespaceStore implementation',
            'e.gateway_not_configured',
            messageType,
            []
          )
        }
        // TODO: Implement Namespace Request/Deny Logic, for now just auto-grant
        const policy = await this.namespaceStore.getNamespacePolicy(message.from)
        const status: PreRequestPolicy = policy
          ? policy.status === 'GRANTED'
            ? 'ALLOW'
            : 'DENY'
          : 'ALLOW'
        if (status === 'ALLOW') {
          await this.namespaceStore.setNamespacePolicy(message.from, 'GRANTED')
          const namespace = await this.namespaceStore.createNamespace(message.from)
          return this.createMessage({
            type: CoralKMV01MessageTypes.NAMESPACE_GRANT,
            from: message.to,
            to: message.from,
            thid: message.id,
            namespace: {
              id: namespace.id,
              gateway_did: namespace.gatewayDid,
            },
          })
        } else {
          return this.createMessage({
            type: CoralKMV01MessageTypes.NAMESPACE_DENY,
            from: message.to,
            to: message.from,
            thid: message.id,
            reason: 'Auto-deny for demonstration purposes.',
          })
        }
      }
      case 'namespace-grant': {
        // Check Message and Role are Valid
        assertRole('wallet', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        // Add decoded Namespace Grant metadata to the message
        message.addMetaData({
          type: DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
          value: JSON.stringify(message.data.namespace),
        })
        return null
      }
      case 'namespace-deny': {
        // Check Message and Role are Valid
        assertRole('wallet', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        // TODO: Notify user of denial reason if provided
        return null
      }
      case 'namespace-sync': {
        // Check Message and Role are Valid
        assertRole('gateway', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        assertMessageFieldDefined(message.data.request, 'body.request', messageType)

        if (!this.namespaceStore) {
          throw new DIDCommProtocolError(
            'Gateway role requires a NamespaceStore implementation',
            'e.gateway_not_configured',
            messageType,
            []
          )
        }

        let query: { id: string } | { owner_did: string } = { owner_did: message.from }
        if (
          message.data.request === 'GET' &&
          'recovery_id' in message.data &&
          message.data.recovery_id
        ) {
          // If recovery_id provided, use that to lookup namespace
          // TODO: Demo purpose only, proper implementation needed to make sure only authorized wallets can access after recovery
          query = { id: message.data.recovery_id }
        }
        const namespace = await this.namespaceStore.getNamespace(query)
        if (!namespace) {
          throw new DIDCommProtocolError(
            'Namespace {1} not found',
            'e.namespace_not_found',
            messageType,
            [message.data.namespaceId]
          )
        }

        // 'GET' request to retrieve data
        if (message.data.request === 'GET') {
          // Save the data to the namespace and get MD5 hash
          // Return Sync Response with data and hash
          return this.createMessage({
            type: CoralKMV01MessageTypes.NAMESPACE_SYNC_RESPONSE,
            from: message.to,
            to: message.from,
            thid: message.id,
            request: 'GET',
            data: namespace.data ?? '',
          })
        }

        // 'PUT' request to save data
        assertMessageFieldDefined(message.data.data, 'body.data', messageType)

        // Save the data to the namespace and get MD5 hash
        const hash = await this.namespaceStore.saveNamespaceData(message.from, message.data.data)
        // Return Sync Confirm with hash of saved data
        return this.createMessage({
          type: CoralKMV01MessageTypes.NAMESPACE_SYNC_RESPONSE,
          from: message.to,
          to: message.from,
          thid: message.id,
          request: 'PUT',
          hash,
        })
      }
      case 'namespace-sync-response': {
        // Check Message and Role are Valid
        assertRole('wallet', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        assertMessageFieldDefined(message.data.request, 'body.request', messageType)
        if (message.data.request === 'PUT') {
          assertMessageFieldDefined(message.data.hash, 'body.hash', messageType)
          // Add decoded Namespace Sync Confirm metadata to the message
          message.addMetaData({
            type: DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
            value: JSON.stringify({ request: 'PUT', hash: message.data.hash }),
          })
          return null
        }
        assertMessageFieldDefined(message.data.data, 'body.data', messageType)
        // Add decoded Namespace Sync Response metadata to the message
        message.addMetaData({
          type: DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
          value: JSON.stringify({ request: 'GET', data: message.data.data }),
        })
        return null
      }
      case 'namespace-recovery-request': {
        // Check Message and Role are Valid
        assertRole('guardian', this.roles, messageType)
        assertMessageFieldDefined(message.data.device_did, 'body.device_did', messageType)
        assertMessageFieldDefined(message.data.namespace, 'body.namespace', messageType)
        assertMessageFieldDefined(message.data.expires_at, 'body.expires_at', messageType)

        if (!this.guardianStore) {
          throw new DIDCommProtocolError(
            'Guardian role requires a GuardianStore implementation',
            'e.guardian_not_configured',
            messageType,
            []
          )
        }

        // Check guardian store to see if this is a namespace we are guardian for
        const isGuardian = await this.guardianStore.isGuardian(
          message.data.namespace.gateway_did,
          message.data.namespace.id
        )
        if (isGuardian) {
          // Start recovery process (out of scope for this example)
          console.log(
            `Starting recovery process for namespace ${message.data.namespace.id} for device DID ${message.data.device_did}`
          )
          await this.guardianStore.saveRecoveryRequest(
            message.data.device_did,
            message.data.namespace,
            message.id,
            message.data.expires_at
          )

          // For now, just send a DIDComm challenge message back to the device_did to show the basic process
          return this.createMessage({
            type: CoralKMV01MessageTypes.GUARDIAN_VERIFICATION_CHALLENGE,
            from: this._guardian_did!,
            to: message.data.device_did,
            pthid: message.id,
            challenge: {
              id: v4(),
              type: 'code',
              instructions: 'Please enter your verification code provided by your guardian.',
            },
          })
        }

        // If not a guardian for this namespace, ignore the request
        return null
      }
      case 'guardian-request': {
        // Check Message and Role are Valid
        assertRole('guardian', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)

        // TODO: Hack to store guardian DID for later use during recovery
        this._guardian_did = message.to as string

        if (!this.guardianStore) {
          throw new DIDCommProtocolError(
            'Guardian role requires a GuardianStore implementation',
            'e.guardian_not_configured',
            messageType,
            []
          )
        }

        // TODO: Implement Namespace Request/Deny Logic, for now just auto-grant
        const policy = await this.guardianStore.getGuardianPolicy(message.from)
        let status: PreRequestPolicy = policy
          ? policy.status === 'GRANTED'
            ? 'ALLOW'
            : 'DENY'
          : 'ALLOW'
        if (status === 'ALLOW') {
          await this.guardianStore.setGuardianPolicy(message.from, 'GRANTED')
          return this.createMessage({
            type: CoralKMV01MessageTypes.GUARDIAN_GRANT,
            from: message.to,
            to: message.from,
            thid: message.id,
          })
        } else {
          await this.guardianStore.setGuardianPolicy(message.from, 'DENIED')
          return this.createMessage({
            type: CoralKMV01MessageTypes.GUARDIAN_DENY,
            from: message.to,
            to: message.from,
            thid: message.id,
            reason: 'Auto-deny for demonstration purposes.',
          })
        }
      }
      case 'guardian-grant': {
        // Check Message and Role are Valid
        assertRole('wallet', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        return null
      }
      case 'guardian-deny': {
        // Check Message and Role are Valid
        assertRole('wallet', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        return null
      }
      case 'guardian-remove': {
        // Check Message and Role are Valid
        assertRole('guardian', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)

        if (!this.guardianStore) {
          throw new DIDCommProtocolError(
            'Guardian role requires a GuardianStore implementation',
            'e.guardian_not_configured',
            messageType,
            []
          )
        }

        // Remove guardian policy and data
        await this.guardianStore.removeGuardianPolicy(message.from)

        // Return Remove Confirm message
        return this.createMessage({
          type: CoralKMV01MessageTypes.GUARDIAN_REMOVE_CONFIRM,
          from: message.to,
          to: message.from,
          thid: message.id,
        })
      }
      case 'guardian-remove-confirm': {
        // Check Message and Role are Valid
        assertRole('wallet', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        return null
      }
      case 'guardian-share-update': {
        // Check Message and Role are Valid
        assertRole('guardian', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        assertMessageFieldDefined(message.data.share, 'body.share', messageType)
        assertMessageFieldDefined(message.data.namespace, 'body.namespace', messageType)

        if (!this.guardianStore) {
          throw new DIDCommProtocolError(
            'Guardian role requires a GuardianStore implementation',
            'e.guardian_not_configured',
            messageType,
            []
          )
        }

        const policy = await this.guardianStore.getGuardianPolicy(message.from)
        if (!policy || policy.status !== 'GRANTED') {
          throw new DIDCommProtocolError(
            'No active guardianship for {1}',
            'e.no_active_guardianship',
            messageType,
            [message.from]
          )
        }

        // Update the stored share
        await this.guardianStore.saveShare(
          message.from,
          message.data.namespace.gateway_did,
          message.data.namespace.id,
          message.data.threshold,
          message.data.share
        )

        // Return Share Update Confirm message
        return this.createMessage({
          type: CoralKMV01MessageTypes.GUARDIAN_SHARE_UPDATE_CONFIRM,
          from: message.to,
          to: message.from,
          thid: message.id,
        })
      }
      case 'guardian-share-update-confirm': {
        // Check Message and Role are Valid
        assertRole('wallet', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        return null
      }
      case 'guardian-verification-challenge': {
        // Check Message and Role are Valid
        assertRole('wallet', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        assertMessageFieldDefined(message.data.challenge, 'body.challenge', messageType)
        assertMessageFieldDefined(message.data.pthid, 'body.pthid', messageType)

        // Send dummy response for demo purposes
        return this.createMessage({
          type: CoralKMV01MessageTypes.GUARDIAN_VERIFICATION_CHALLENGE_RESPONSE,
          from: message.to,
          to: message.from,
          pthid: message.data.pthid,
          thid: message.id,
          response: '123456',
          challenge_id: message.data.challenge.id,
        })
      }
      case 'guardian-verification-challenge-response': {
        // Check Message and Role are Valid
        assertRole('guardian', this.roles, messageType)
        assertMessageFieldDefined(message.from, 'from', messageType)
        assertMessageFieldDefined(message.to, 'to', messageType)
        assertMessageFieldDefined(message.data.response, 'body.response', messageType)
        assertMessageFieldDefined(message.data.challenge_id, 'body.challenge_id', messageType)
        assertMessageFieldDefined(message.data.pthid, 'body.pthid', messageType)

        if (!this.guardianStore) {
          throw new DIDCommProtocolError(
            'Guardian role requires a GuardianStore implementation',
            'e.guardian_not_configured',
            messageType,
            []
          )
        }

        // Retrieve the recovery request to get namespace info
        const recoveryRequest = await this.guardianStore.getRecoveryRequest(message.data.pthid)
        if (!recoveryRequest) {
          console.warn(
            `No recovery request found for ID ${message.data.pthid}, cannot process verification response.`
          )
          return null
        }

        // Very simple validation for demo purposes using the code '123456'
        const response = message.data.response as string
        if (response === '123456') {
          console.log('Guardian verification challenge passed.')
          const share = await this.guardianStore?.getShare(
            recoveryRequest.namespace.gateway_did,
            recoveryRequest.namespace.id
          )
          if (!share) {
            console.warn(
              `No share found for namespace ${recoveryRequest.namespace.id}, cannot release share.`
            )
            return null
          }
          return this.createMessage({
            type: CoralKMV01MessageTypes.GUARDIAN_RELEASE_SHARE,
            from: message.to,
            to: recoveryRequest.deviceDid,
            pthid: message.data.pthid,
            share: share.share,
            threshold: share.threshold,
          })
        } else {
          console.warn('Guardian verification challenge failed.')
        }

        // Remove the recovery request as it has been processed
        await this.guardianStore.deleteRecoveryRequest(message.data.pthid)
        return null
      }
      case 'guardian-release-share': {
        // Check Message and Role are Valid
        assertRole('wallet', this.roles, messageType)
        assertMessageFieldDefined(message.data.share, 'body.share', messageType)
        assertMessageFieldDefined(message.data.threshold, 'body.threshold', messageType)

        // Add decoded Released Share metadata to the message
        message.addMetaData({
          type: DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
          value: JSON.stringify({
            share: message.data.share,
            threshold: message.data.threshold,
            request_id: message.data.pthid,
          }),
        })
        return null
      }
      default:
        throwUnsupportedMessageType(messageType)
    }
  }
}
